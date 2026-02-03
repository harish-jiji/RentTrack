# RentTrack - Backend (Django)

This is the server-side application for RentTrack, built with **Django** and **Django REST Framework (DRF)**. It provides a JSON API for the React frontend.

## 🔧 Setup & Installation

1.  **Create Virtual Environment:**
    ```bash
    python -m venv rent
    ```
2.  **Activate Environment:**
    *   Windows: `rent\Scripts\activate`
    *   Mac/Linux: `source rent/bin/activate`
3.  **Install Dependencies:**
    ```bash
    pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
    ```
4.  **Database Migration:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

## 🏃‍♂️ Running the Server

```bash
python manage.py runserver
```

## 🔑 Authentication

The project uses **Simple JWT** for authentication.
*   **Login Endpoint:** `/api/token/` (Returns Access & Refresh tokens)
*   All protected endpoints require the header: `Authorization: Bearer <access_token>`

## 🗄️ Models (`myapp/models.py`)

1.  **UserProfile:** Extends basic User with `role` (ADMIN/USER), `phone`, `address`.
2.  **Property:** Rental units with `title`, `description`, `price`, `image`, `status`.
3.  **Booking:** Links User and Property with `start_date`, `end_date`, `status` (PENDING/CONFIRMED/REJECTED).
4.  **Favorite:** Links User and Property for saved lists.

## 📡 API Endpoints

### Auth
*   `POST /api/token/` - Login
*   `POST /api/register/` - Register
*   `GET /api/auth/profile/` - Get User Profile

### Properties
*   `GET /api/properties/` - List all available properties (Public)
*   `GET /api/properties/:id/` - Property Details (Public)

### User Actions
*   `GET /api/bookings/` - List user's bookings
*   `POST /api/bookings/` - Create a booking request
*   `GET /api/favorites/` - List favorites
*   `POST /api/favorites/` - Add to favorites

### Admin Actions (Requires Role=ADMIN)
*   `POST /api/admin/properties/` - Create Property
*   `PUT /api/admin/properties/:id/` - Update Property
*   `DELETE /api/admin/properties/:id/` - Delete Property
*   `GET /api/admin/users/` - List all users
*   `PATCH /api/admin/bookings/:id/update_status/` - Approve/Reject Booking

## ⚙️ Key Settings

*   **CORS:** Enabled for `localhost:5173` (Frontend).
*   **Media:** Configured to serve uploaded images from `media/` directory during development.
