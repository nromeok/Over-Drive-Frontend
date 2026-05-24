# OverDrive Frontend

OverDrive Frontend is the client-side application for the AI-powered vehicle valuation and inspection platform built for the Kenyan automotive market.

The platform enables users to upload vehicle images and receive intelligent AI-generated analysis including:

* Vehicle condition assessment
* Estimated market value
* Damage detection
* Vehicle insights and recommendations

The frontend focuses on delivering a fast, responsive, and modern user experience for vehicle valuation, inspection, and management.

---

# Features

* Secure JWT Authentication
* AI-powered vehicle image analysis
* Vehicle market price estimation
* Vehicle condition reporting
* Dashboard and valuation history
* Responsive modern UI
* Protected authenticated routes
* Global state management using Context API

---

# How the Platform Works

## 1. User Authentication

Users can:

* Register an account
* Log in securely
* Access protected dashboard features

Authentication is handled using JWT tokens.

---

## 2. Vehicle Upload

Users upload:

* Exterior vehicle photos
* Interior photos
* Damage or inspection images

The frontend sends uploaded images to the backend API for processing.

---

## 3. AI Vehicle Analysis

The backend AI services analyze uploaded images to determine:

* Vehicle condition
* Visible damage
* Wear and tear
* Modifications
* Vehicle details and specifications

---

## 4. Vehicle Valuation

After analysis, the system generates:

* Estimated Kenyan market price
* Vehicle inspection summaries
* AI-generated insights
* Repair and resale recommendations

---

## 5. Dashboard Management

Users can manage:

* Previous valuations
* Uploaded vehicles
* Vehicle reports
* Profile settings
* Account information

---

# Target Users

* Vehicle owners
* Used-car buyers
* Car dealerships
* Vehicle inspectors
* Automotive marketplaces
* Administrators managing the platform

---

# Project Goals

* Build a scalable React frontend application
* Create a professional AI-powered valuation experience
* Improve transparency in used vehicle transactions
* Reduce dependency on manual inspections
* Provide intelligent market-based vehicle pricing
* Deliver a responsive and modern UI

---

# Technologies Used

## Frontend

* React.js
* JavaScript
* Vite
* React Router DOM
* Context API
* CSS3

## Backend Integration

The frontend connects to:

* Flask backend APIs
* PostgreSQL database services
* AI image analysis services
* Cloudinary image storage

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone git@github.com:maryonyango-prog/Over-Drive-Frontend.git

cd Over-Drive-Frontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Development Server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Update the URL depending on your backend configuration.

---

# Application Structure

```bash
src/
├── api/
│   ├── authService.js
│   ├── client.js
│   └── vehicleService.js
│
├── components/
│   ├── navigation/
│   │   └── Sidebar.jsx
│   │
│   └── ProtectedRoute.jsx
│
├── Context/
│   ├── AuthActions.js
│   ├── AuthContext.jsx
│   ├── AuthReducer.js
│   ├── ThemeContext.jsx
│   ├── ToastContext.jsx
│   ├── VehicleActions.js
│   ├── VehicleContext.jsx
│   └── VehicleReducer.js
│
├── hooks/
│   ├── useAuth.js
│   └── useVehicles.js
│
├── layouts/
│   ├── DashboardLayout.jsx
│   └── MainLayout.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Home.jsx
│   ├── ImageUpload.jsx
│   ├── Login.jsx
│   ├── NetworkError.jsx
│   ├── NewValuation.jsx
│   ├── NotFound.jsx
│   ├── OAuthCallback.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── Settings.jsx
│   ├── Splash.jsx
│   ├── ValuationHistory.jsx
│   └── ValuationResult.jsx
│
├── router/
│   └── AppRouter.jsx
│
├── index.css
└── main.jsx
```

---

# Core Hooks & Contexts

## `useAuth`

Handles authentication state and actions across the application.

### Responsibilities

* Login & logout
* Authentication state tracking
* Route protection
* Token management

---

## `useVehicles`

Handles vehicle-related state and operations.

### Responsibilities

* Vehicle uploads
* Fetching valuation results
* Managing valuation history
* Storing vehicle analysis data

---

## `AuthContext`

Provides global authentication state.

### Responsibilities

* Current user management
* Authentication actions
* Shared auth state across components

---

## `VehicleContext`

Provides global vehicle-related state management.

### Responsibilities

* Vehicle valuation storage
* Vehicle state updates
* Shared vehicle data access

---

## `ProtectedRoute`

Protects routes requiring authentication.

### Responsibilities

* Restrict unauthorized access
* Redirect unauthenticated users
* Validate user sessions

---

# User Features

Users can:

* Register and log in
* Upload vehicle images
* Receive AI vehicle analysis
* View valuation reports
* Access valuation history
* Manage their profile and settings

---

# Administrator Features

Administrators can:

* Access admin dashboards
* Monitor platform activity
* Manage users and vehicle records
* Access backend-connected services
* Supervise valuation operations

---

# Future Improvements

Planned features include:

* Live Kenyan market integrations
* AI damage severity scoring
* Vehicle fraud detection
* PDF vehicle inspection reports
* Advanced analytics dashboards
* Real-time valuation tracking
* Mobile application support

---

# Contributors

This project was developed by:

1. Mary Onyango
2. Nelson Romeo
3. Noah Kemboi
4. Jelagat Asumpta
5. Angella Musamali

---

# License

This project is licensed under the MIT License.
