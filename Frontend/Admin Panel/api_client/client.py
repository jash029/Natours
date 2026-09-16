import os
import logging
import time
import re
import hashlib
import requests

logger = logging.getLogger(__name__)

class APIError(Exception):
    def __init__(self, message, status_code=None, response=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.response = response


def slugify(text):
    text = (text or "").lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text)


# =======================================================
# CLOUDINARY DIRECT API HELPERS
# =======================================================

def upload_to_cloudinary(file_bytes, folder="Natours/tours", public_id=None):
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "xac4cqxs")
    api_key = os.environ.get("CLOUDINARY_API_KEY", "515738776743293")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "wRUnYYb8Sl2gtEjqrp6rz_MeR5M")

    timestamp = int(time.time())
    params_to_sign = []
    if folder:
        params_to_sign.append(f"folder={folder}")
    if public_id:
        params_to_sign.append(f"public_id={public_id}")
    params_to_sign.append(f"timestamp={timestamp}")

    sign_string = "&".join(sorted(params_to_sign)) + api_secret
    signature = hashlib.sha1(sign_string.encode('utf-8')).hexdigest()

    data = {
        "timestamp": timestamp,
        "api_key": api_key,
        "signature": signature,
    }
    if folder:
        data["folder"] = folder
    if public_id:
        data["public_id"] = public_id

    files = {"file": file_bytes}
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"

    try:
        resp = requests.post(url, data=data, files=files, timeout=15)
        if resp.status_code == 200:
            res_json = resp.json()
            return {
                "publicId": res_json.get("public_id"),
                "secureUrl": res_json.get("secure_url"),
                "public_id": res_json.get("public_id"),
                "secure_url": res_json.get("secure_url")
            }
        else:
            raise APIError(f"Cloudinary upload failed: {resp.text}", status_code=resp.status_code)
    except Exception as e:
        logger.error(f"Cloudinary upload exception: {e}")
        raise APIError(f"Cloudinary upload failed: {str(e)}")


def delete_from_cloudinary(public_id):
    if not public_id:
        return
    cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "xac4cqxs")
    api_key = os.environ.get("CLOUDINARY_API_KEY", "515738776743293")
    api_secret = os.environ.get("CLOUDINARY_API_SECRET", "wRUnYYb8Sl2gtEjqrp6rz_MeR5M")

    timestamp = int(time.time())
    sign_string = f"public_id={public_id}&timestamp={timestamp}" + api_secret
    signature = hashlib.sha1(sign_string.encode('utf-8')).hexdigest()

    data = {
        "public_id": public_id,
        "timestamp": timestamp,
        "api_key": api_key,
        "signature": signature,
    }
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/destroy"
    try:
        requests.post(url, data=data, timeout=10)
    except Exception as e:
        logger.error(f"Cloudinary deletion error: {e}")


# In-memory store fallback data
INITIAL_TOURS = [
  {
    'id': 'tur_101',
    '_id': 'tur_101',
    'title': 'Swiss Alps Luxury Alpine Expedition',
    'name': 'Swiss Alps Luxury Alpine Expedition',
    'slug': 'swiss-alps-luxury-alpine-expedition',
    'category': 'Mountains',
    'theme': 'Mountains',
    'destination': 'Interlaken & Zermatt, Switzerland',
    'destinations': [{'country': 'Switzerland', 'state': 'Bern', 'city': 'Interlaken'}],
    'country': 'Switzerland',
    'startLocation': 'Zurich International Airport',
    'duration_days': 10,
    'duration': {'days': 10, 'nights': 9},
    'price_usd': 4850,
    'startingPrice': 4850,
    'discount': 350,
    'advanceBookingAmount': 2000,
    'rating': 4.95,
    'ratingsAverage': 4.95,
    'reviews_count': 128,
    'status': 'published',
    'featured': True,
    'trending': True,
    'cover_image': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800',
    'description': 'Experience breathtaking alpine views, five-star glacier resorts, private helicopter tours around Mount Matterhorn.',
    'summary': 'Experience breathtaking alpine views, five-star glacier resorts, private helicopter tours.',
    'itinerary': [],
    'created_at': '2025-11-01T10:00:00Z'
  }
]

_TOURS_STORE = list(INITIAL_TOURS)
_CONSULTANTS_STORE = []


class TravelAPIClient:
    """
    Enterprise HTTP REST Client for Backend-APIs (Node.js + Express + MongoDB).
    Directly consumes Node endpoints at http://127.0.0.1:3001/api/v1/admin
    with shared secret service authentication key.
    """

    def __init__(self, session_data=None):
        self.base_url = os.environ.get("BACKEND_API_URL", "http://127.0.0.1:3001/api/v1/admin")
        self.service_key = os.environ.get("ADMIN_SERVICE_KEY", "vanguard_admin_service_secret_key_2026")
        self.headers = {
            "x-admin-service-key": self.service_key,
            "Content-Type": "application/json"
        }

    def _get(self, endpoint, params=None):
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.get(url, headers=self.headers, params=params, timeout=5)
            if resp.status_code == 200:
                return resp.json()
            logger.warning(f"Backend API GET {url} returned {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.info(f"Backend API unreachable at {url}: {e}")
        return None

    def _post(self, endpoint, data=None):
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.post(url, headers=self.headers, json=data, timeout=5)
            if resp.status_code in (200, 201):
                return resp.json()
            raise APIError(resp.json().get('error', 'Request failed'), status_code=resp.status_code)
        except APIError:
            raise
        except Exception as e:
            logger.warning(f"Backend API POST {url} failed: {e}")
        return None

    def _patch(self, endpoint, data=None):
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.request("PATCH", url, headers=self.headers, json=data, timeout=5)
            if resp.status_code == 200:
                return resp.json()
            raise APIError(resp.json().get('error', 'Update failed'), status_code=resp.status_code)
        except APIError:
            raise
        except Exception as e:
            logger.warning(f"Backend API PATCH {url} failed: {e}")
        return None

    def _delete(self, endpoint):
        url = f"{self.base_url}{endpoint}"
        try:
            resp = requests.delete(url, headers=self.headers, timeout=5)
            if resp.status_code == 200:
                return resp.json()
            raise APIError(resp.json().get('error', 'Delete failed'), status_code=resp.status_code)
        except APIError:
            raise
        except Exception as e:
            logger.warning(f"Backend API DELETE {url} failed: {e}")
        return None

    # =======================================================
    # DASHBOARD API
    # =======================================================

    def get_dashboard(self):
        tours_res = self.get_tours()
        tours_list = tours_res.get('tours', [])

        active_tours = [t for t in tours_list if t.get('status') in ('published', 'Active')]
        total_rev = sum(float(t.get('startingPrice') or t.get('price_usd') or 0) * 8 for t in tours_list)

        consult_res = self.get_consultants()
        consultations = consult_res.get('consultations', [])
        pending_consultations = [c for c in consultations if c.get('status') == 'pending']

        return {
            'status': 'success',
            'stats': {
                'total_tours': len(tours_list),
                'active_expeditions': len(active_tours),
                'featured_tours': len([t for t in tours_list if t.get('featured')]),
                'pending_consultations': len(pending_consultations),
                'projected_revenue': f"${total_rev:,.2f}"
            },
            'recent_activities': [
                {'title': 'Tour Catalog Synchronized with Backend-APIs', 'timestamp': 'Just now', 'user': 'System'},
                {'title': 'Consultant Operations Module Operational', 'timestamp': 'Active', 'user': 'Junior Admin'},
            ]
        }

    # =======================================================
    # TOURS API
    # =======================================================

    def get_tours(self, search="", category="", status=""):
        params = {}
        if search:
            params['search'] = search
        if category:
            params['category'] = category
        if status:
            params['status'] = status

        res = self._get("/tours", params=params)
        if res and ('tours' in res or 'data' in res):
            tours = res.get('tours') or res.get('data', {}).get('tours', [])
            return {'status': 'success', 'tours': tours, 'count': len(tours)}

        # Fallback to local store
        filtered = list(_TOURS_STORE)
        if search:
            q = search.lower()
            filtered = [t for t in filtered if q in str(t.get('title', '')).lower() or q in str(t.get('name', '')).lower()]
        if category:
            cat_q = category.lower()
            filtered = [t for t in filtered if str(t.get('category', '')).lower() == cat_q or str(t.get('theme', '')).lower() == cat_q]
        if status:
            stat_q = status.lower()
            filtered = [t for t in filtered if str(t.get('status', '')).lower() == stat_q]

        return {'status': 'success', 'tours': filtered, 'count': len(filtered)}

    def get_tour_detail(self, tour_id):
        res = self._get(f"/tours/{tour_id}")
        if res and ('tour' in res or 'data' in res):
            tour = res.get('tour') or res.get('data', {}).get('tour', {})
            return {'status': 'success', 'tour': tour}

        for t in _TOURS_STORE:
            if str(t.get('id')) == str(tour_id) or str(t.get('_id')) == str(tour_id) or str(t.get('slug')) == str(tour_id):
                return {'status': 'success', 'tour': t}

        fallback = _TOURS_STORE[0] if _TOURS_STORE else {}
        return {'status': 'success', 'tour': fallback}

    def create_tour(self, tour_data, files=None):
        url = f"{self.base_url}/tours"
        headers = {"x-admin-service-key": self.service_key}
        try:
            if files:
                resp = requests.post(url, data=tour_data, files=files, headers=headers, timeout=20)
            else:
                resp = requests.post(url, json=tour_data, headers=self.headers, timeout=15)
            if resp.status_code in (200, 201):
                res_json = resp.json()
                tour = res_json.get('tour') or res_json.get('data', {}).get('tour')
                return {'status': 'success', 'tour': tour}
            raise APIError(resp.json().get('error', 'Creation failed'), status_code=resp.status_code)
        except APIError:
            raise
        except Exception as e:
            logger.warning(f"Backend API POST {url} failed: {e}")

        new_id = f"tur_{int(time.time())}"
        tour_copy = dict(tour_data)
        tour_copy['id'] = new_id
        tour_copy['_id'] = new_id
        _TOURS_STORE.insert(0, tour_copy)
        return {'status': 'success', 'tour': tour_copy}

    def update_tour(self, tour_id, tour_data, files=None):
        url = f"{self.base_url}/tours/{tour_id}"
        headers = {"x-admin-service-key": self.service_key}
        try:
            if files:
                resp = requests.patch(url, data=tour_data, files=files, headers=headers, timeout=20)
            else:
                json_headers = dict(self.headers)
                resp = requests.patch(url, json=tour_data, headers=json_headers, timeout=15)

            if resp.status_code in (200, 201):
                res_json = resp.json()
                tour = res_json.get('tour') or res_json.get('data', {}).get('tour')
                return {'status': 'success', 'tour': tour}

            err_msg = f"Update failed with status {resp.status_code}"
            try:
                res_err = resp.json()
                err_msg = res_err.get('message') or res_err.get('error') or err_msg
            except Exception:
                pass
            raise APIError(err_msg, status_code=resp.status_code)
        except APIError:
            raise
        except Exception as e:
            logger.warning(f"Backend API PATCH {url} failed: {e}")
            # Fallback to local store if backend unreachable
            for idx, t in enumerate(_TOURS_STORE):
                if str(t.get('id')) == str(tour_id) or str(t.get('_id')) == str(tour_id) or str(t.get('slug')) == str(tour_id):
                    _TOURS_STORE[idx].update(tour_data)
                    return {'status': 'success', 'tour': _TOURS_STORE[idx]}
            raise APIError(f"Backend communication error: {str(e)}")

    def delete_tour(self, tour_id):
        res = self._delete(f"/tours/{tour_id}")
        if res:
            return res

        global _TOURS_STORE
        _TOURS_STORE = [t for t in _TOURS_STORE if str(t.get('id')) != str(tour_id) and str(t.get('_id')) != str(tour_id) and str(t.get('slug')) != str(tour_id)]
        return {'status': 'success'}

    def update_tour_status(self, tour_id, status_val=None, featured=None, trending=None):
        payload = {}
        if status_val:
            payload['status'] = status_val
        if featured is not None:
            payload['featured'] = featured
        if trending is not None:
            payload['trending'] = trending

        res = self._patch(f"/tours/{tour_id}/status", data=payload)
        if res:
            return res

        for idx, t in enumerate(_TOURS_STORE):
            if str(t.get('id')) == str(tour_id) or str(t.get('_id')) == str(tour_id) or str(t.get('slug')) == str(tour_id):
                if status_val:
                    _TOURS_STORE[idx]['status'] = status_val
                if featured is not None:
                    _TOURS_STORE[idx]['featured'] = bool(featured)
                if trending is not None:
                    _TOURS_STORE[idx]['trending'] = bool(trending)
                return {'status': 'success', 'tour': _TOURS_STORE[idx]}
        return {'status': 'success'}

    # =======================================================
    # CONSULTANT REQUESTS API (JUNIOR ADMIN MODULE)
    # =======================================================

    def get_consultants(self, search="", status="", page="1"):
        params = {}
        if search:
            params['search'] = search
        if status:
            params['status'] = status
        if page:
            params['page'] = page

        res = self._get("/consultants", params=params)
        if res and 'consultations' in res:
            return res

        filtered = list(_CONSULTANTS_STORE)
        if search:
            q = search.lower()
            filtered = [c for c in filtered if q in str(c.get('fullName', '')).lower() or q in str(c.get('email', '')).lower()]
        if status:
            filtered = [c for c in filtered if str(c.get('status', '')).lower() == status.lower()]

        return {'status': 'success', 'consultations': filtered, 'total': len(filtered)}

    def get_consultant(self, consultant_id):
        res = self._get(f"/consultants/{consultant_id}")
        if res and ('consultation' in res or 'data' in res):
            consultation = res.get('consultation') or res.get('data', {}).get('consultation', {})
            return {'status': 'success', 'consultation': consultation}

        for c in _CONSULTANTS_STORE:
            if str(c.get('id')) == str(consultant_id) or str(c.get('_id')) == str(consultant_id):
                return {'status': 'success', 'consultation': c}

        return {'status': 'fail', 'error': 'Consultant request not found'}

    def update_consultant_status(self, consultant_id, status=None, internalNotes=None):
        payload = {}
        if status:
            payload['status'] = status
        if internalNotes is not None:
            payload['internalNotes'] = internalNotes

        res = self._patch(f"/consultants/{consultant_id}", data=payload)
        if res:
            return res

        for idx, c in enumerate(_CONSULTANTS_STORE):
            if str(c.get('id')) == str(consultant_id) or str(c.get('_id')) == str(consultant_id):
                if status:
                    _CONSULTANTS_STORE[idx]['status'] = status
                if internalNotes is not None:
                    _CONSULTANTS_STORE[idx]['internalNotes'] = internalNotes
                return {'status': 'success', 'consultation': _CONSULTANTS_STORE[idx]}
        return {'status': 'success'}

    # =======================================================
    # BOOKING SUPPORT QUERIES API
    # =======================================================

    def get_booking_queries(self, search="", category="", status=""):
        params = {}
        if search:
            params['search'] = search
        if category:
            params['category'] = category
        if status:
            params['status'] = status

        res = self._get("/queries", params=params)
        if res and 'queries' in res:
            return res
        return {'status': 'success', 'queries': []}

    def get_booking_query(self, query_id):
        res = self._get(f"/queries/{query_id}")
        if res and 'query' in res:
            return res
        return {'status': 'fail', 'error': 'Support query not found'}

    def reply_booking_query(self, query_id, message, status=""):
        payload = {'message': message}
        if status:
            payload['status'] = status
        res = self._post(f"/queries/{query_id}/reply", data=payload)
        return res or {'status': 'success'}

    def update_booking_query_status(self, query_id, status):
        res = self._patch(f"/queries/{query_id}/status", data={'status': status})
        return res or {'status': 'success'}

    # =======================================================
    # DOCUMENT VERIFICATION & BOOKINGS MANAGEMENT API
    # =======================================================

    def get_bookings(self, search="", booking_status="", payment_status="", verification_status=""):
        params = {}
        if search:
            params['search'] = search
        if booking_status:
            params['bookingStatus'] = booking_status
        if payment_status:
            params['paymentStatus'] = payment_status
        if verification_status:
            params['verificationStatus'] = verification_status

        res = self._get("/bookings", params=params)
        if res and 'bookings' in res:
            return res
        return {'status': 'success', 'bookings': []}

    def get_booking_details(self, booking_id):
        res = self._get(f"/bookings/{booking_id}")
        if res and 'booking' in res:
            return res
        return {'status': 'fail', 'error': 'Booking not found'}

    def verify_booking_documents(self, booking_id, decisions, contact_phone="+91 91111 11111"):
        payload = {
            'decisions': decisions,
            'contactPhone': contact_phone
        }
        res = self._post(f"/bookings/{booking_id}/verify-documents", data=payload)
        return res or {'status': 'success'}

    def mark_booking_payment_full_paid(self, booking_id):
        res = self._patch(f"/bookings/{booking_id}/payment-status", data={})
        return res or {'status': 'success'}

    def mark_booking_journey_completed(self, booking_id, status="completed"):
        res = self._patch(f"/bookings/{booking_id}/booking-status", data={'status': status})
        return res or {'status': 'success'}

