# Over Drive Frontend

Over Drive Frontend is the user interface for the AI-powered second-hand vehicle analysis platform.

The application allows users to upload vehicle images and receive AI-generated vehicle analysis, estimated market prices, and detailed vehicle reports. The frontend focuses on creating a modern, user-friendly, and responsive experience for second-hand vehicle evaluation and management.

---

## How It Works

### 1. User Authentication
- Users register and log in securely using JWT authentication.

### 2. Vehicle Upload
- Users upload vehicle images through the image upload interface.

### 3. AI Vehicle Analysis
- The system sends uploaded images to the backend for AI-based analysis.

### 4. Vehicle Valuation
- Users receive:
  - Estimated market value
  - Vehicle specifications
  - Vehicle condition analysis

### 5. Dashboard Management
- Users can manage:
  - Valuation history
  - Profile information
  - Vehicle reports

---

## Users

- Vehicle owners looking to evaluate and sell their vehicles
- Buyers seeking transparent vehicle information
- Administrators managing system operations

---

## Benefits of the Project

- Simplifies vehicle valuation workflows
- Reduces dependency on manual inspections
- Improves transparency in vehicle transactions
- Provides AI-powered market price estimation
- Creates professional vehicle analysis reports

---

## Goals of the Project

- Build a scalable React frontend application
- Create an intuitive vehicle analysis interface
- Integrate AI-powered vehicle valuation workflows
- Demonstrate modern frontend architecture using React and Tailwind CSS

---

## Technologies Used for Frontend

- React.js
- Tailwind CSS
- JavaScript
- React Router
- Context API
- Vite

---

## Setup Instructions

### 1 Clone the Repository

```bash
git clone git@github.com:maryonyango-prog/Over-Drive-Frontend.git
cd over-drive-frontend
```

---

### 2 Install Dependencies

```bash
npm install
```

---

### 3 Install Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

---

### 4 Run the Development Server

```bash
npm run dev
```

---

## For Users

- Register or log in to the application
- Upload vehicle images
- View vehicle valuation reports
- Access valuation history and dashboard features

---

## For Administrators

- Access the admin dashboard
- Manage users and vehicle records
- Monitor valuation activities
- Manage backend-connected services

- (Administrators will have access to the connected PostgreSQL database and backend services)

---

## useAuth

**Purpose:**  
Manages authentication state across the application.

**Responsibilities:**
- Tracks authenticated users
- Handles login and logout
- Protects restricted routes
- Stores authentication tokens

---

## useVehicles

**Purpose:**  
Manages vehicle-related operations and state.

**Responsibilities:**
- Fetches vehicle data
- Stores valuation results
- Handles vehicle uploads
- Manages vehicle history

---

## AuthContext

**Purpose:**  
Provides global authentication state management.

**Responsibilities:**
- Stores current user data
- Handles authentication actions
- Shares authentication state across components

---

## VehicleContext

**Purpose:**  
Provides global vehicle data management.

**Responsibilities:**
- Stores vehicle valuation data
- Handles vehicle actions
- Shares vehicle state globally

---

## ProtectedRoute

**Purpose:**  
Protects authenticated application routes.

**Responsibilities:**
- Restricts unauthorized access
- Redirects unauthenticated users
- Validates authentication state

---

## Component Tree

```bash
src/
├── api
│   ├── authService.js
│   ├── client.js
│   └── vehicleService.js
│
├── components
│   ├── errors
│   │   ├── ErrorBoundary.jsx
│   │   └── ErrorMessage.jsx
│   │
│   ├── navigation
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   │
│   └── ProtectedRoute.jsx
│
├── Context
│   ├── AuthActions.js
│   ├── AuthContext.jsx
│   ├── AuthReducer.js
│   ├── ThemeContext.jsx
│   ├── ToastContext.jsx
│   ├── VehicleActions.js
│   ├── VehicleContext.jsx
│   └── VehicleReducer.js
│
├── hooks
│   ├── useAuth.js
│   └── useVehicles.js
│
├── layouts
│   ├── DashboardLayout.jsx
│   └── MainLayout.jsx
│
├── pages
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
├── router
│   └── AppRouter.jsx
│
├── index.css
└── main.jsx
```

---

## Author

This project was developed by:

1. Mary Onyango  
2. Nelson Romeo  
3. Noah Kemboi  
4. Jelagat Asumpta  
5. Angella Musamali

---

# License

This project is currently licensed under the MIT License.
