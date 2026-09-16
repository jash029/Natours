# Natours — Full-Stack Travel & Tour Management Platform

Natours is a full-stack travel platform that combines a React customer application, a Node.js/Express REST API, MongoDB/Mongoose data storage, and a Python/Django administration portal. It supports tour discovery, bookings, reviews, user accounts, travel-document verification, consultant/support workflows, media management, interactive maps, email notifications, and role-based administration.

## ✨ Highlights

- 🌍 Tour discovery with search, filtering, sorting, pagination, themed/trending tours and destination-based browsing
- 🗺️ Interactive destination and itinerary maps using Leaflet and React Leaflet
- 🔐 JWT authentication with HTTP-only cookies, protected routes, OTP email verification and password reset
- 👤 User profiles, bookmarks, reviews, booking history and account management
- 🧳 Multi-step booking flow with traveler information, emergency contacts, payment status and travel documents
- 📄 Booking-document upload and verification workflows
- ☁️ Cloudinary-based image/document storage and image processing with Sharp
- 📧 Automated email workflows using Nodemailer and Pug templates for verification, booking invoices, support, consultation and document status updates
- 🛠️ Django administration portal with staff management, permissions, RBAC, audit tracking, tour management, booking management, consultants, customer queries and dashboards
- 🔌 Django admin communicates with the Node/Express backend through a dedicated REST API client and shared admin-service authentication
- 🛡️ Backend security middleware including Helmet, CORS, rate limiting, MongoDB sanitization, XSS protection and centralized error handling
- 📊 Dashboard/analytics endpoints and data-processing/ML-oriented examples for operational reporting and experimentation

## 🏗️ Architecture

```text
                         ┌─────────────────────────┐
                         │   React Customer App    │
                         │ React + Vite            │
                         │ React Query + Axios     │
                         └────────────┬────────────┘
                                      │ REST API
                                      │ HTTP + Cookies
                                      ▼
                         ┌─────────────────────────┐
                         │ Node.js + Express API   │
                         │ Auth / Tours / Booking  │
                         │ Reviews / Admin / Visa* │
                         └───────┬─────────┬───────┘
                                 │         │
                    MongoDB      │         │ Cloudinary
                                 │         │ Images/Documents
                                 ▼         ▼
                         ┌────────────┐  ┌─────────────┐
                         │ MongoDB    │  │ Cloudinary  │
                         │ Mongoose   │  │ Media Store │
                         └────────────┘  └─────────────┘
                                 ▲
                                 │ Admin REST API
                                 │
                         ┌───────┴───────────────┐
                         │ Django Admin Portal   │
                         │ Python + Django       │
                         │ SQLite                │
                         │ RBAC / Audit / Forms  │
                         └───────────────────────┘

* The repository contains a visa rules module, but its router is not currently mounted
  in the main Express app.
```

## 🔗 How the parts connect

### 1. React frontend → Node/Express backend

The customer-facing React application communicates with the backend through Axios REST calls under:

`/api/v1/user`  
`/api/v1/tours`  
`/api/v1/booking`  
`/api/v1/admin`

Authentication uses cookies with `withCredentials`, allowing the frontend to maintain the JWT session issued by the Express API.

React Query is used for server-state fetching/caching, while custom hooks separate authentication, tour, booking, review and assistance operations from UI components.

### 2. Node/Express → MongoDB

The Node backend uses Mongoose models for the main travel-domain data:

- Users
- Tours
- Bookings
- Reviews
- Consultants
- Assistance/support queries
- Visa-related data

The backend contains separate controllers, routers, services, middleware and utility modules to keep the application modular.

### 3. Node/Express → Cloudinary

Cloudinary is used for remotely storing media such as:

- Tour images
- User profile images
- Booking/travel documents

Multer handles incoming uploads, while Cloudinary services and Sharp support storage and image processing.

### 4. Node/Express → Email service

Nodemailer handles outgoing email delivery.

Pug templates are used to generate HTML emails for:

- Email/OTP verification
- Password reset
- Booking invoices
- Consultation requests and updates
- Booking support queries and replies
- Document rejection
- Document verification completion

### 5. Django Admin → Node/Express

The Django portal is not the primary database for the travel platform. Instead, it acts as an administration layer.

The `api_client` module communicates with the Node backend using HTTP requests and an admin service key.

The admin portal can interact with backend resources such as:

- Tours
- Bookings
- Consultants
- Customer queries
- Document verification
- Payment/booking status
- Dashboard data

This creates a multi-service architecture where:

```text
Django Admin
     │
     │ REST API
     ▼
Node / Express
     │
     ▼
MongoDB
```

### 6. Django Admin → SQLite

SQLite is used by the Django administration portal for administrative data such as:

- Staff profiles
- Roles and permissions
- Audit information
- Administrative sessions/account state
- Portal-specific records

This is separate from the MongoDB database used by the Node.js travel backend.

## 🧩 Main Modules

### Customer Application

- Home page and tour discovery
- Search and advanced filters
- Tour details
- Destination browsing
- Trending and discounted tours
- Themed tours
- Interactive maps
- User registration/login
- OTP email verification
- Password recovery
- Profile management
- Bookmarked tours
- Reviews and ratings
- Multi-step booking
- My bookings
- Booking details
- Travel-document submission
- Customer assistance/support queries

### Booking System

The booking domain contains structured information for travelers, emergency contacts, documents, payment status and booking status.

Admin operations include:

- Booking lookup
- Booking detail management
- Document verification/rejection
- Payment status updates
- Journey/booking completion
- Customer query handling

### Administration Portal

The Django portal contains separate modules for:

- Accounts
- Dashboard
- Tours
- Bookings
- Consultants
- API client

The accounts system includes:

- Staff profiles
- Employee IDs
- Departments
- Administrative roles
- Permission management
- RBAC
- Account locking/unlocking
- Soft deletion/restoration
- Login/logout tracking
- Audit logging

## 🛡️ Security & Reliability

The Express backend includes several security-focused components:

- JWT authentication
- HTTP-only authentication cookies
- Password hashing with bcrypt
- Password reset tokens
- OTP verification
- Protected routes
- Role-based authorization
- Helmet
- CORS
- Express rate limiting
- MongoDB sanitization
- XSS protection
- HPP protection
- Request validation
- Centralized error handling
- Secure file-upload handling

The Django portal also includes CSRF protection, session controls, staff authentication middleware, permission checks and account-locking mechanisms.

## 📁 Repository Structure

```text
Natours/
├── Backend-APIs/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── scripts/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── ...
│
└── Frontend/
    ├── Natours/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── features/
    │   │   ├── pages/
    │   │   ├── Services/
    │   │   ├── ui/
    │   │   └── utils/
    │   ├── public/
    │   └── package.json
    │
    └── Admin Panel/
        ├── accounts/
        ├── api_client/
        ├── booking/
        ├── consultants/
        ├── dashboard/
        ├── tours/
        ├── travel_admin_portal/
        ├── templates/
        ├── manage.py
        └── requirements.txt
```

## 🧰 Technology Stack

### Frontend
- React
- Vite
- React Router
- TanStack React Query
- Axios
- Styled Components
- Framer Motion
- React Hook Form
- Leaflet / React Leaflet
- Lucide React / React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Pug
- Multer
- Cloudinary
- Sharp
- Axios

### Administration
- Python
- Django
- SQLite
- Django Crispy Forms
- Bootstrap 5
- Requests
- RBAC
- Audit logging

## 🚀 Local Development

> The project currently uses local development URLs and environment variables. It is not configured as a one-command production deployment.

### Prerequisites

Install:

- Node.js and npm
- Python 3.x
- MongoDB Atlas account or a MongoDB instance
- Cloudinary account
- SMTP/email provider for development

### 1. Backend

```bash
cd Backend-APIs
npm install
```

Create a `config.env` file inside `Backend-APIs/`:

```env
DATABASE=mongodb+srv://<username>:<password>@<cluster>/<database>
DATABASE_PASSWORD=<your_database_password>

JWT_SECRET=<strong_random_secret>
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

NODE_ENV=development

CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

EMAIL_FROM=<your_sender_email>
EMAIL_HOST=<smtp_host>
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<smtp_username>
EMAIL_PASS=<smtp_password>

ADMIN_SERVICE_KEY=<strong_random_admin_service_key>
```

Start the API:

```bash
npm run dev
```

The current server is configured for:

```text
http://localhost:3001
```

### 2. React frontend

```bash
cd Frontend/Natours
npm install
npm run dev
```

The current frontend service files point to the backend at:

```text
http://localhost:3001
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

### 3. Django Admin Portal

```bash
cd "Frontend/Admin Panel"
python -m venv .venv
```

Activate the virtual environment.

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure environment variables using `.env.example`, especially:

```env
BACKEND_API_URL=http://127.0.0.1:3001/api/v1/admin
ADMIN_SERVICE_KEY=<same_key_used_by_backend>
```

Run migrations:

```bash
python manage.py migrate
```

Create an admin user if required:

```bash
python manage.py createsuperuser
```

Start Django:

```bash
python manage.py runserver
```

The admin portal normally runs at:

```text
http://127.0.0.1:8000
```

## ⚠️ Before Making This Repository Public

**Do not push the uploaded project to GitHub exactly as it is.**

The current codebase contains credential-like values and development artifacts that should be removed or replaced before publishing.

In particular:

1. `Frontend/Admin Panel/api_client/client.py` contains hardcoded Cloudinary API credentials as fallback values.
2. The same file contains a hardcoded admin service-key fallback.
3. `Backend-APIs/src/middlewares/protectAdminService.js` contains a default service-key fallback.
4. `Backend-APIs/src/data/store.js` contains a JWT secret-like value.
5. `Frontend/Admin Panel/.env.example` contains a default-looking admin service key.
6. `Frontend/Admin Panel/db.sqlite3` should generally not be committed if it contains local/admin data.
7. Remove `__pycache__/`, `.pyc` files and local error/debug HTML dumps before publishing.
8. Make sure no real MongoDB URI, SMTP password, Cloudinary secret, JWT secret or other credentials exist anywhere in the repository.

**If any real Cloudinary credential has ever been used in this code, rotate/revoke it before pushing the repository to GitHub.**

Use environment variables instead of hardcoded secrets.

## 📌 Project Status

This is a substantial full-stack/academic project demonstrating a multi-service travel platform architecture. Some modules, dashboard datasets and predictive/analytics examples are included for demonstration and experimentation rather than representing a production-grade ML deployment.

## 👨‍💻 Author

**Jash Mandani**

Computer Engineering Student

---

If you use this project in a portfolio or resume, highlight the architecture and the integration between **React → Node/Express → MongoDB** and **Django Admin → REST API → Node/Express**, rather than presenting it as only a travel website.
