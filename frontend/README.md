# RentTrack - Frontend (React)

This is the client-side application for RentTrack, built with **React** and **Vite**. It interacts with the Django backend via REST APIs.

## 📦 Dependencies

*   `react`: UI Library
*   `react-router-dom`: Client-side routing
*   `axios`: HTTP requests (custom instance in `src/utils/axios.js`)
*   `react-bootstrap` & `bootstrap`: Styling and UI components
*   `jwt-decode`: Decoding JWT tokens for role-based access

## 🚀 Running the App

1.  **Install node modules:**
    ```bash
    npm install
    ```
2.  **Start the dev server:**
    ```bash
    npm run dev
    ```

## 🏗️ Folder Structure

*   **`src/api/`**: API endpoint definitions (optional, currently using direct axios calls).
*   **`src/components/`**: Shared components like `Navbar`, `Slides`, `AdminSidebar`.
*   **`src/context/`**: Contains `AuthContext.jsx` for managing global user state (login/logout).
*   **`src/layouts/`**: `AdminLayout.jsx` for the admin dashboard structure.
*   **`src/pages/`**:
    *   **`auth/`**: Login, Register.
    *   **`admin/`**: Dashboard, Properties, Bookings, Users (Protected Routes).
    *   **`user/`**: Dashboard, My Bookings, Favorites (Protected Routes).
    *   **`common/`**: Public Property Listings.
*   **`src/routes/`**: Route protection components (`AdminRoute`, `UserRoute`).
*   **`src/utils/`**: `axios.js` (interceptors for passing Bearer tokens).

## 🎨 Styling

*   **Bootstrap 5** is used for the grid system and components.
*   **`src/index.css`** contains custom global overrides and premium design styles.

## 🔗 Connection

The frontend expects the backend to be running at:
`http://127.0.0.1:8000/api/`
