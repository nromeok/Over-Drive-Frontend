import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router/AppRouter";

import { AuthProvider } from "./Context/AuthContext";
import { VehicleProvider } from "./Context/VehicleContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <VehicleProvider>
        <RouterProvider router={router} />
      </VehicleProvider>
    </AuthProvider>
  </React.StrictMode>
);
