# RentTrack - Property Rental Management System

RentTrack is a full-stack web application designed to streamline property rentals. It accommodates two types of users: **Administrators** (who manage properties, users, and bookings) and **Renters** (who can browse, favorite, and book properties).

## 🚀 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Styling:** Bootstrap 5, Custom CSS (`index.css`)
*   **Routing:** React Router DOM
*   **State Management:** Context API (AuthContext)
*   **HTTP Client:** Axios (Interceptors for JWT Auth)

### Backend
*   **Framework:** Django REST Framework (DRF)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Database:** SQLite (Dev), configurable for MySQL/PostgreSQL
*   **Media:** Local filesystem handling for property images

---

## 🛠️ Quick Start Guide

### Prerequisites
*   Node.js & npm
*   Python 3.8+

### 1. Backend Setup (Django)
```bash
cd backend
# Create virtual environment
python -m venv rent

# Activate virtual environment
# Windows:
rent\Scripts\activate
# Mac/Linux:
# source rent/bin/activate

# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow

# Run Migrations
python manage.py migrate

# Create Superuser (Admin)
python manage.py createsuperuser

# Run Server
python manage.py runserver
```
*Backend runs on: `http://127.0.0.1:8000`*

### 2. Frontend Setup (React)
```bash
cd frontend
# Install dependencies
npm install

# Run Development Server
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🔑 Key Features

### User Features (Renter)
*   **Browse Properties:** View all listed rentals with images and pricing.
*   **Favorites:** Save properties to a personalized "Favorites" list.
*   **Booking:** Request to book a property for specific dates.
*   **Dashboard:** Manage bookings, favorites, and profile.

### Admin Features (Owner/Manager)
*   **Dashboard:** Overview of system stats.
*   **Property Management:** CRUD operations (Create, Read, Update, Delete) for properties.
*   **User Management:** detailed view of registered users.
*   **Booking Management:** Approve or Reject booking requests.

## 📁 Project Structure

```
RentTrack/
├── backend/            # Django API Server
│   ├── myapp/          # Main App (Models, Views, Serializers)
│   ├── rent/           # Project Settings
│   └── media/          # Uploaded Property Images
│
└── frontend/           # React Client
    ├── src/
    │   ├── components/ # Reusable UI Components
    │   ├── pages/      # Page Views (Admin, User, Common)
    │   ├── context/    # Auth Context
    │   └── utils/      # Axios Helper
    └── public/
```

## 🔐 Credentials
*   **Default Admin:** (Use the credentials you created with `createsuperuser`)
*   **Test User:** Register a new account via the frontend.
