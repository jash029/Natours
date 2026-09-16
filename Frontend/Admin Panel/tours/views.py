from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
import json

from accounts.rbac import permission_required
from tours.forms import (
    BasicTourInformationForm,
    TourMediaForm,
    TourContentForm,
    TourPackageForm,
    TourAdvancedSettingsForm,
    TourForm
)
from api_client.client import APIError


def prepare_tour_for_template(tour):
    if not isinstance(tour, dict):
        return tour

    t = dict(tour)

    tour_id_val = str(t.get('id') or t.get('_id') or '')
    t['id'] = tour_id_val
    t['_id'] = tour_id_val

    t['name'] = t.get('name') or t.get('title') or 'Untitled Tour'
    t['title'] = t.get('title') or t.get('name') or 'Untitled Tour'
    t['slug'] = t.get('slug', '')

    cover_url = ''
    if t.get('cover_image'):
        cover_url = t['cover_image']
    elif isinstance(t.get('imageCover'), dict):
        cover_url = t['imageCover'].get('secureUrl', '')
    elif isinstance(t.get('imageCover'), str):
        cover_url = t['imageCover']

    t['cover_image'] = cover_url

    t['theme'] = t.get('theme') or t.get('category') or 'Cities'
    t['category'] = t.get('category') or t.get('theme') or 'Cities'

    dests = t.get('destinations', [])
    if isinstance(dests, str):
        try:
            dests = json.loads(dests)
        except Exception:
            dests = []
    if not isinstance(dests, list):
        dests = []

    norm_dests = []
    for d in dests:
        if isinstance(d, dict):
            norm_dests.append({
                'country': d.get('country', ''),
                'state': d.get('state', ''),
                'city': d.get('city') or d.get('destination', '')
            })
    t['destinations'] = norm_dests

    dest_str = t.get('destination', '')
    country_str = t.get('country', '')
    state_str = t.get('state', '')

    if len(norm_dests) > 0:
        first_d = norm_dests[0]
        if not dest_str:
            dest_str = first_d.get('city', '')
        if not country_str:
            country_str = first_d.get('country', '')
        if not state_str:
            state_str = first_d.get('state', '')

    t['destination'] = dest_str
    t['country'] = country_str
    t['state'] = state_str

    dur_days = t.get('duration_days')
    if not dur_days and isinstance(t.get('duration'), dict):
        dur_days = t['duration'].get('days')
    t['duration_days'] = dur_days or 1

    if not isinstance(t.get('duration'), dict):
        t['duration'] = {'days': t['duration_days'], 'nights': max(0, t['duration_days'] - 1)}

    raw_images = t.get('images', [])
    if isinstance(raw_images, str):
        try:
            raw_images = json.loads(raw_images)
        except Exception:
            raw_images = []

    norm_images = []
    if isinstance(raw_images, list):
        for img in raw_images:
            if isinstance(img, dict):
                norm_images.append({
                    'secureUrl': img.get('secureUrl') or img.get('secure_url') or img.get('url', ''),
                    'publicId': img.get('publicId') or img.get('public_id') or img.get('secureUrl', ''),
                    'alt': img.get('alt', t['name'])
                })
            elif isinstance(img, str):
                norm_images.append({
                    'secureUrl': img,
                    'publicId': img,
                    'alt': t['name']
                })
    t['images'] = norm_images

    t['startingPrice'] = t.get('startingPrice') if t.get('startingPrice') is not None else (t.get('price_usd') or 0)
    t['price_usd'] = t['startingPrice']
    t['discount'] = t.get('discount') or 0
    t['effectivePrice'] = max(0, t['startingPrice'] - t['discount'])
    t['advanceBookingAmount'] = t.get('advanceBookingAmount') if t.get('advanceBookingAmount') is not None else 2000

    pkgs = t.get('packages', [])
    if isinstance(pkgs, str):
        try:
            pkgs = json.loads(pkgs)
        except Exception:
            pkgs = []
    if not isinstance(pkgs, list):
        pkgs = []

    norm_pkgs = []
    for pkg in pkgs:
        if isinstance(pkg, dict):
            pkg_copy = dict(pkg)
            hotels = pkg_copy.get('hotels', [])
            if isinstance(hotels, str):
                try:
                    hotels = json.loads(hotels)
                except Exception:
                    hotels = []
            norm_hotels = []
            if isinstance(hotels, list):
                for h in hotels:
                    if isinstance(h, dict):
                        norm_hotels.append({
                            'name': h.get('name', 'Luxury Hotel'),
                            'rating': h.get('rating', 4),
                            'website': h.get('website', ''),
                            'roomType': h.get('roomType', 'Standard')
                        })
                    else:
                        norm_hotels.append({'name': str(h), 'rating': 4, 'website': '', 'roomType': 'Standard'})
            pkg_copy['hotels'] = norm_hotels
            if not isinstance(pkg_copy.get('meals'), list):
                pkg_copy['meals'] = [m.strip() for m in str(pkg_copy.get('meals', '')).split(',') if m.strip()]
            if not isinstance(pkg_copy.get('extraFacilities'), list):
                pkg_copy['extraFacilities'] = [f.strip() for f in str(pkg_copy.get('extraFacilities', '')).split(',') if f.strip()]
            norm_pkgs.append(pkg_copy)
    t['packages'] = norm_pkgs

    it_items = t.get('itinerary', [])
    if isinstance(it_items, str):
        try:
            it_items = json.loads(it_items)
        except Exception:
            it_items = []
    if not isinstance(it_items, list):
        it_items = []

    norm_itinerary = []
    for idx, item in enumerate(it_items, 1):
        if isinstance(item, dict):
            loc = item.get('location', {})
            if not isinstance(loc, dict):
                loc = {}
            norm_itinerary.append({
                'day': item.get('day', idx),
                'title': item.get('title', f'Day {idx}'),
                'description': item.get('description') or item.get('details', ''),
                'location': {
                    'country': loc.get('country', country_str),
                    'state': loc.get('state', state_str),
                    'city': loc.get('city', dest_str),
                    'lat': loc.get('lat', ''),
                    'lng': loc.get('lng', '')
                }
            })
    t['itinerary'] = norm_itinerary

    seo_obj = t.get('seo', {})
    if isinstance(seo_obj, str):
        try:
            seo_obj = json.loads(seo_obj)
        except Exception:
            seo_obj = {}
    if not isinstance(seo_obj, dict):
        seo_obj = {}

    kw_list = seo_obj.get('keywords', [])
    if isinstance(kw_list, str):
        kw_list = [k.strip() for k in kw_list.split(',') if k.strip()]
    elif not isinstance(kw_list, list):
        kw_list = []

    t['seo'] = {
        'metaTitle': seo_obj.get('metaTitle', ''),
        'metaDescription': seo_obj.get('metaDescription', ''),
        'keywords': kw_list
    }

    first_pkg = norm_pkgs[0] if len(norm_pkgs) > 0 else {}
    first_hotel = first_pkg.get('hotels', [{}])[0] if len(first_pkg.get('hotels', [])) > 0 else {}
    meals_val = ", ".join(first_pkg.get('meals', []))
    extras_val = ", ".join(first_pkg.get('extraFacilities', []))

    t['package_name'] = first_pkg.get('name', 'Standard Expedition Package')
    t['hotel_rating'] = first_hotel.get('rating', 4)
    t['meals_included'] = meals_val or 'Breakfast & Dinner Included'
    t['transport_type'] = first_pkg.get('transportation', 'Private AC Coach / Safari Jeep')
    t['extra_facilities'] = extras_val

    t['max_group_size'] = t.get('maxGroupSize') or t.get('max_group_size') or 15
    t['difficulty_level'] = t.get('difficultyLevel') or t.get('difficulty_level') or 'Moderate'
    t['meta_title'] = seo_obj.get('metaTitle', '')
    t['meta_keywords'] = ", ".join(kw_list)

    # Audit fields
    created_by = t.get('createdBy')
    if isinstance(created_by, dict):
        t['createdByFormatted'] = created_by.get('name') or created_by.get('email') or str(created_by)
    else:
        t['createdByFormatted'] = str(created_by) if created_by else 'Admin System'

    updated_by = t.get('updatedBy')
    if isinstance(updated_by, dict):
        t['updatedByFormatted'] = updated_by.get('name') or updated_by.get('email') or str(updated_by)
    else:
        t['updatedByFormatted'] = str(updated_by) if updated_by else 'Admin System'

    t['createdAtFormatted'] = str(t.get('createdAt') or t.get('created_at') or 'N/A')
    t['updatedAtFormatted'] = str(t.get('updatedAt') or t.get('updated_at') or 'N/A')

    return t


@permission_required('view_tours')
def tour_list_view(request):
    search = request.GET.get('search', '')
    category = request.GET.get('category', '')
    status = request.GET.get('status', '')

    try:
        res = request.api_client.get_tours(search=search, category=category, status=status)
        tours = res.get('tours', [])
        tours = [prepare_tour_for_template(t) for t in tours]
    except APIError as e:
        messages.error(request, str(e.message))
        tours = []

    return render(request, 'tours/list.html', {
        'tours': tours,
        'search': search,
        'category': category,
        'status': status,
        'total_count': len(tours)
    })


@permission_required('view_tours')
def tour_detail_view(request, tour_id):
    try:
        res = request.api_client.get_tour_detail(tour_id)
        tour = prepare_tour_for_template(res.get('tour', {}))
    except APIError as e:
        messages.error(request, str(e.message))
        return redirect('tours:list')

    return render(request, 'tours/detail.html', {'tour': tour})


@permission_required('add_tour')
def tour_create_view(request):
    if request.method == 'POST':
        basic_form = BasicTourInformationForm(request.POST)
        media_form = TourMediaForm(request.POST, request.FILES)
        content_form = TourContentForm(request.POST)
        package_form = TourPackageForm(request.POST)
        advanced_form = TourAdvancedSettingsForm(request.POST)

        if (basic_form.is_valid() and media_form.is_valid() and content_form.is_valid() and
            package_form.is_valid() and advanced_form.is_valid()):
            
            b_data = basic_form.cleaned_data
            m_data = media_form.cleaned_data
            c_data = content_form.cleaned_data
            p_data = package_form.cleaned_data
            a_data = advanced_form.cleaned_data

            # 1. DESTINATIONS JSON
            destinations_json = request.POST.get('destinations') or request.POST.get('destinations_json')
            if destinations_json:
                try:
                    json.loads(destinations_json)
                except Exception:
                    destinations_json = None
            if not destinations_json:
                destinations_json = json.dumps([{
                    'country': b_data.get('country', ''),
                    'state': b_data.get('state', ''),
                    'city': b_data.get('destination', '')
                }])

            # 2. PACKAGES JSON
            packages_json = request.POST.get('packages') or request.POST.get('packages_json')
            if packages_json:
                try:
                    json.loads(packages_json)
                except Exception:
                    packages_json = None
            if not packages_json:
                pkg_name = p_data.get('package_name') or 'Standard'
                extra_facs = [f.strip() for f in p_data.get('extra_facilities', '').split(',') if f.strip()]
                meals_list = [m.strip() for m in p_data.get('meals_included', '').split(',') if m.strip()]
                packages_json = json.dumps([{
                    'name': pkg_name,
                    'price': b_data.get('startingPrice', 0),
                    'hotels': [{'name': f"{p_data.get('hotel_rating', 4)}-Star Lodging", 'rating': p_data.get('hotel_rating', 4), 'roomType': 'Standard', 'website': ''}],
                    'transportation': p_data.get('transport_type') or 'Private AC Coach',
                    'assistance': '24/7 Dedicated Concierge',
                    'meals': meals_list if meals_list else ['Breakfast Included'],
                    'extraFacilities': extra_facs
                }])

            # 3. ITINERARY JSON
            itinerary_json = request.POST.get('itinerary') or request.POST.get('itinerary_json')
            if itinerary_json:
                try:
                    json.loads(itinerary_json)
                except Exception:
                    itinerary_json = None
            if not itinerary_json:
                itinerary_list = []
                it_text = c_data.get('itinerary_text', '')
                if it_text:
                    lines = [l.strip() for l in it_text.split('\n') if l.strip()]
                    for idx, line in enumerate(lines, 1):
                        if '|' in line:
                            parts = line.split('|', 1)
                            itinerary_list.append({'day': idx, 'title': parts[0].strip(), 'description': parts[1].strip()})
                        else:
                            itinerary_list.append({'day': idx, 'title': f"Day {idx}", 'description': line})
                itinerary_json = json.dumps(itinerary_list) if itinerary_list else json.dumps([])

            # 4. SEO JSON
            seo_json = request.POST.get('seo') or request.POST.get('seo_json')
            if seo_json:
                try:
                    json.loads(seo_json)
                except Exception:
                    seo_json = None
            if not seo_json:
                seo_json = json.dumps({
                    'metaTitle': a_data.get('meta_title') or b_data.get('title', ''),
                    'metaDescription': b_data.get('summary') or c_data.get('description', '')[:150],
                    'keywords': [k.strip() for k in a_data.get('meta_keywords', '').split(',') if k.strip()]
                })

            tour_payload = {
                'title': b_data['title'],
                'name': b_data['title'],
                'summary': b_data.get('summary') or c_data.get('description', '')[:150],
                'description': c_data.get('description', ''),
                'theme': b_data['theme'],
                'category': b_data['theme'],
                'destination': b_data.get('destination', ''),
                'country': b_data.get('country', ''),
                'state': b_data.get('state', ''),
                'startLocation': b_data.get('startLocation', ''),
                'duration_days': b_data.get('duration_days', 1),
                'startingPrice': b_data.get('startingPrice', 0),
                'price_usd': b_data.get('startingPrice', 0),
                'discount': b_data.get('discount', 0),
                'advanceBookingAmount': b_data.get('advanceBookingAmount', 2000),
                'status': b_data.get('status', 'published'),
                'featured': 'true' if b_data.get('featured') else 'false',
                'trending': 'true' if b_data.get('trending') else 'false',
                'destinations': destinations_json,
                'packages': packages_json,
                'itinerary': itinerary_json,
                'seo': seo_json,
                'maxGroupSize': a_data.get('max_group_size', 15),
                'difficultyLevel': a_data.get('difficulty_level', 'Moderate'),
            }

            files_list = []
            if 'cover_image' in request.FILES:
                cover_file = request.FILES['cover_image']
                files_list.append(('imageCover', (cover_file.name, cover_file.read(), cover_file.content_type)))

            if 'new_gallery_images' in request.FILES:
                gallery_files = request.FILES.getlist('new_gallery_images')
                for gfile in gallery_files:
                    files_list.append(('images', (gfile.name, gfile.read(), gfile.content_type)))

            try:
                res = request.api_client.create_tour(tour_payload, files=files_list if files_list else None)
                messages.success(request, f"New Expedition '{b_data['title']}' created successfully.")
                return redirect('tours:list')
            except APIError as e:
                err_msg = str(e.message)
                messages.error(request, err_msg)
                if "discount" in err_msg.lower():
                    basic_form.add_error('discount', err_msg)
                elif "starting price" in err_msg.lower():
                    basic_form.add_error('startingPrice', err_msg)
                elif "gallery" in err_msg.lower():
                    media_form.add_error('new_gallery_images', err_msg)
        else:
            messages.error(request, "Form validation failed. Please fix the highlighted error fields below.")
    else:
        basic_form = BasicTourInformationForm()
        media_form = TourMediaForm()
        content_form = TourContentForm()
        package_form = TourPackageForm()
        advanced_form = TourAdvancedSettingsForm()

    all_forms = [basic_form, media_form, content_form, package_form, advanced_form]
    return render(request, 'tours/form.html', {
        'basic_form': basic_form,
        'media_form': media_form,
        'content_form': content_form,
        'package_form': package_form,
        'advanced_form': advanced_form,
        'all_forms': all_forms,
        'title': 'Add New Tour Expedition'
    })


@permission_required('edit_tour')
def tour_edit_view(request, tour_id):
    try:
        res = request.api_client.get_tour_detail(tour_id)
        tour = prepare_tour_for_template(res.get('tour', {}))
    except APIError as e:
        messages.error(request, str(e.message))
        return redirect('tours:list')

    if request.method == 'POST':
        basic_form = BasicTourInformationForm(request.POST)
        media_form = TourMediaForm(request.POST, request.FILES)
        content_form = TourContentForm(request.POST)
        package_form = TourPackageForm(request.POST)
        advanced_form = TourAdvancedSettingsForm(request.POST)

        if (basic_form.is_valid() and media_form.is_valid() and content_form.is_valid() and
            package_form.is_valid() and advanced_form.is_valid()):

            b_data = basic_form.cleaned_data
            m_data = media_form.cleaned_data
            c_data = content_form.cleaned_data
            p_data = package_form.cleaned_data
            a_data = advanced_form.cleaned_data

            # 1. DESTINATIONS JSON
            destinations_json = request.POST.get('destinations') or request.POST.get('destinations_json')
            if destinations_json:
                try:
                    json.loads(destinations_json)
                except Exception:
                    destinations_json = None
            if not destinations_json:
                destinations_json = json.dumps([{
                    'country': b_data.get('country', ''),
                    'state': b_data.get('state', ''),
                    'city': b_data.get('destination', '')
                }])

            # 2. PACKAGES JSON
            packages_json = request.POST.get('packages') or request.POST.get('packages_json')
            if packages_json:
                try:
                    json.loads(packages_json)
                except Exception:
                    packages_json = None
            if not packages_json:
                pkg_name = p_data.get('package_name') or 'Standard'
                extra_facs = [f.strip() for f in p_data.get('extra_facilities', '').split(',') if f.strip()]
                meals_list = [m.strip() for m in p_data.get('meals_included', '').split(',') if m.strip()]
                packages_json = json.dumps([{
                    'name': pkg_name,
                    'price': b_data.get('startingPrice', 0),
                    'hotels': [{'name': f"{p_data.get('hotel_rating', 4)}-Star Lodging", 'rating': p_data.get('hotel_rating', 4), 'roomType': 'Standard', 'website': ''}],
                    'transportation': p_data.get('transport_type') or 'Private AC Coach',
                    'assistance': '24/7 Dedicated Concierge',
                    'meals': meals_list if meals_list else ['Breakfast Included'],
                    'extraFacilities': extra_facs
                }])

            # 3. ITINERARY JSON
            itinerary_json = request.POST.get('itinerary') or request.POST.get('itinerary_json')
            if itinerary_json:
                try:
                    json.loads(itinerary_json)
                except Exception:
                    itinerary_json = None
            if not itinerary_json:
                itinerary_list = []
                it_text = c_data.get('itinerary_text', '')
                if it_text:
                    lines = [l.strip() for l in it_text.split('\n') if l.strip()]
                    for idx, line in enumerate(lines, 1):
                        if '|' in line:
                            parts = line.split('|', 1)
                            itinerary_list.append({'day': idx, 'title': parts[0].strip(), 'description': parts[1].strip()})
                        else:
                            itinerary_list.append({'day': idx, 'title': f"Day {idx}", 'description': line})
                itinerary_json = json.dumps(itinerary_list) if itinerary_list else json.dumps([])

            # 4. SEO JSON
            seo_json = request.POST.get('seo') or request.POST.get('seo_json')
            if seo_json:
                try:
                    json.loads(seo_json)
                except Exception:
                    seo_json = None
            if not seo_json:
                seo_json = json.dumps({
                    'metaTitle': a_data.get('meta_title') or b_data.get('title', ''),
                    'metaDescription': b_data.get('summary') or c_data.get('description', '')[:150],
                    'keywords': [k.strip() for k in a_data.get('meta_keywords', '').split(',') if k.strip()]
                })

            update_payload = {
                'title': b_data['title'],
                'name': b_data['title'],
                'summary': b_data.get('summary') or c_data.get('description', '')[:150],
                'description': c_data.get('description', ''),
                'theme': b_data['theme'],
                'category': b_data['theme'],
                'destination': b_data.get('destination', ''),
                'country': b_data.get('country', ''),
                'state': b_data.get('state', ''),
                'startLocation': b_data.get('startLocation', ''),
                'duration_days': b_data.get('duration_days', 1),
                'startingPrice': b_data.get('startingPrice', 0),
                'price_usd': b_data.get('startingPrice', 0),
                'discount': b_data.get('discount', 0),
                'advanceBookingAmount': b_data.get('advanceBookingAmount', 2000),
                'status': b_data.get('status', 'published'),
                'featured': 'true' if b_data.get('featured') else 'false',
                'trending': 'true' if b_data.get('trending') else 'false',
                'delete_cover': 'true' if m_data.get('delete_cover') else 'false',
                'remove_gallery_images': m_data.get('remove_gallery_images', ''),
                'destinations': destinations_json,
                'packages': packages_json,
                'itinerary': itinerary_json,
                'seo': seo_json,
                'maxGroupSize': a_data.get('max_group_size', 15),
                'difficultyLevel': a_data.get('difficulty_level', 'Moderate'),
            }

            files_list = []
            if 'cover_image' in request.FILES:
                cover_file = request.FILES['cover_image']
                files_list.append(('imageCover', (cover_file.name, cover_file.read(), cover_file.content_type)))

            if 'new_gallery_images' in request.FILES:
                gallery_files = request.FILES.getlist('new_gallery_images')
                for gfile in gallery_files:
                    files_list.append(('images', (gfile.name, gfile.read(), gfile.content_type)))

            for fkey in request.FILES:
                if fkey.startswith('replace_gallery_'):
                    rfile = request.FILES[fkey]
                    files_list.append((fkey, (rfile.name, rfile.read(), rfile.content_type)))

            try:
                update_res = request.api_client.update_tour(tour_id, update_payload, files=files_list if files_list else None)
                updated_tour = update_res.get('tour') if update_res else tour
                messages.success(request, f"Tour '{b_data['title']}' updated successfully.")

                fresh_res = request.api_client.get_tour_detail(tour_id)
                fresh_tour = prepare_tour_for_template(fresh_res.get('tour') if (fresh_res and fresh_res.get('tour')) else updated_tour)

                it_items = fresh_tour.get('itinerary', [])
                it_text_initial = "\n".join([f"Day {item.get('day', i+1)}: {item.get('title', '')} | {item.get('description') or item.get('details', '')}" for i, item in enumerate(it_items)])

                basic_form = BasicTourInformationForm(initial={
                    'title': fresh_tour.get('title'),
                    'summary': fresh_tour.get('summary'),
                    'theme': fresh_tour.get('theme'),
                    'destination': fresh_tour.get('destination'),
                    'country': fresh_tour.get('country'),
                    'state': fresh_tour.get('state', ''),
                    'startLocation': fresh_tour.get('startLocation', ''),
                    'duration_days': fresh_tour.get('duration_days'),
                    'startingPrice': fresh_tour.get('startingPrice'),
                    'discount': fresh_tour.get('discount', 0),
                    'advanceBookingAmount': fresh_tour.get('advanceBookingAmount', 2000),
                    'status': fresh_tour.get('status', 'published'),
                    'featured': fresh_tour.get('featured', False),
                    'trending': fresh_tour.get('trending', False),
                })
                media_form = TourMediaForm()
                content_form = TourContentForm(initial={
                    'description': fresh_tour.get('description'),
                    'itinerary_text': it_text_initial,
                })
                package_form = TourPackageForm(initial={
                    'package_name': fresh_tour.get('package_name', 'Standard Expedition Package'),
                    'hotel_rating': fresh_tour.get('hotel_rating', 4),
                    'meals_included': fresh_tour.get('meals_included', 'Breakfast & Dinner Included'),
                    'transport_type': fresh_tour.get('transport_type', 'Private AC Coach / Safari Jeep'),
                    'extra_facilities': fresh_tour.get('extra_facilities', ''),
                })
                advanced_form = TourAdvancedSettingsForm(initial={
                    'max_group_size': fresh_tour.get('max_group_size', 15),
                    'difficulty_level': fresh_tour.get('difficulty_level', 'Moderate'),
                    'meta_title': fresh_tour.get('meta_title', ''),
                    'meta_keywords': fresh_tour.get('meta_keywords', ''),
                })

                all_forms = [basic_form, media_form, content_form, package_form, advanced_form]
                return render(request, 'tours/form.html', {
                    'basic_form': basic_form,
                    'media_form': media_form,
                    'content_form': content_form,
                    'package_form': package_form,
                    'advanced_form': advanced_form,
                    'all_forms': all_forms,
                    'tour': fresh_tour,
                    'tour_json': json.dumps(fresh_tour, default=str),
                    'title': f'Edit Tour: {fresh_tour.get("title")}'
                })
            except APIError as e:
                err_msg = str(e.message)
                messages.error(request, f"Update Error: {err_msg}")
                if "discount" in err_msg.lower():
                    basic_form.add_error('discount', err_msg)
                elif "starting price" in err_msg.lower():
                    basic_form.add_error('startingPrice', err_msg)
                elif "gallery" in err_msg.lower():
                    media_form.add_error('new_gallery_images', err_msg)
                elif "title" in err_msg.lower() or "name" in err_msg.lower():
                    basic_form.add_error('title', err_msg)
        else:
            messages.error(request, "Form validation failed. Please fix the highlighted error fields below.")
    else:
        it_items = tour.get('itinerary', [])
        it_text_initial = "\n".join([f"Day {item.get('day', i+1)}: {item.get('title', '')} | {item.get('description') or item.get('details', '')}" for i, item in enumerate(it_items)])

        basic_form = BasicTourInformationForm(initial={
            'title': tour.get('title'),
            'summary': tour.get('summary'),
            'theme': tour.get('theme'),
            'destination': tour.get('destination'),
            'country': tour.get('country'),
            'state': tour.get('state', ''),
            'startLocation': tour.get('startLocation', ''),
            'duration_days': tour.get('duration_days'),
            'startingPrice': tour.get('startingPrice'),
            'discount': tour.get('discount', 0),
            'advanceBookingAmount': tour.get('advanceBookingAmount', 2000),
            'status': tour.get('status', 'published'),
            'featured': tour.get('featured', False),
            'trending': tour.get('trending', False),
        })
        media_form = TourMediaForm()
        content_form = TourContentForm(initial={
            'description': tour.get('description'),
            'itinerary_text': it_text_initial,
        })
        package_form = TourPackageForm(initial={
            'package_name': tour.get('package_name', 'Standard Expedition Package'),
            'hotel_rating': tour.get('hotel_rating', 4),
            'meals_included': tour.get('meals_included', 'Breakfast & Dinner Included'),
            'transport_type': tour.get('transport_type', 'Private AC Coach / Safari Jeep'),
            'extra_facilities': tour.get('extra_facilities', ''),
        })
        advanced_form = TourAdvancedSettingsForm(initial={
            'max_group_size': tour.get('max_group_size', 15),
            'difficulty_level': tour.get('difficulty_level', 'Moderate'),
            'meta_title': tour.get('meta_title', ''),
            'meta_keywords': tour.get('meta_keywords', ''),
        })

    all_forms = [basic_form, media_form, content_form, package_form, advanced_form]
    return render(request, 'tours/form.html', {
        'basic_form': basic_form,
        'media_form': media_form,
        'content_form': content_form,
        'package_form': package_form,
        'advanced_form': advanced_form,
        'all_forms': all_forms,
        'tour': tour,
        'tour_json': json.dumps(tour, default=str),
        'title': f'Edit Tour: {tour.get("title")}'
    })


@permission_required('delete_tour')
@require_http_methods(["POST"])
def tour_delete_view(request, tour_id):
    try:
        request.api_client.delete_tour(tour_id)
        messages.success(request, "Tour expedition deleted successfully.")
    except APIError as e:
        messages.error(request, str(e.message))
    return redirect('tours:list')


@permission_required('edit_tour')
@require_http_methods(["POST"])
def tour_status_toggle_view(request, tour_id):
    status_val = request.POST.get('status')
    featured_val = request.POST.get('featured')
    trending_val = request.POST.get('trending')

    feat_bool = True if featured_val == 'true' else (False if featured_val == 'false' else None)
    trend_bool = True if trending_val == 'true' else (False if trending_val == 'false' else None)

    try:
        res = request.api_client.update_tour_status(tour_id, status_val=status_val, featured=feat_bool, trending=trend_bool)
        messages.success(request, "Tour status updated.")
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success'})
    except APIError as e:
        messages.error(request, str(e.message))

    return redirect('tours:list')


# =======================================================
# API ENDPOINTS FOR TOUR CONSUMPTION & MANAGEMENT
# =======================================================

def api_tours_list(request):
    """JSON API endpoint returning search/filtered tour list matching adminTourController."""
    search = request.GET.get('search', '')
    category = request.GET.get('category', '')
    status = request.GET.get('status', '')

    res = request.api_client.get_tours(search=search, category=category, status=status)
    return JsonResponse(res)


def api_tour_detail(request, tour_id):
    """JSON API endpoint for tour details."""
    if request.method == 'GET':
        res = request.api_client.get_tour_detail(tour_id)
        return JsonResponse(res)
    elif request.method in ('PUT', 'PATCH'):
        try:
            body = json.loads(request.body)
            res = request.api_client.update_tour(tour_id, body)
            return JsonResponse(res)
        except Exception as e:
            return JsonResponse({'status': 'error', 'error': str(e)}, status=400)
    elif request.method == 'DELETE':
        res = request.api_client.delete_tour(tour_id)
        return JsonResponse(res)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
