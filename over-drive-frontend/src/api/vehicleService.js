import { apiClient } from "./client";
import { delay, MOCK_HISTORY } from "./mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// In-memory store so deletes + new valuations persist during the session
let mockStore = [...MOCK_HISTORY];

export const vehicleService = {
  getValuation: async (vehicleData, token) => {
    if (USE_MOCK) {
      await delay(1200); // slightly longer — simulates AI processing
      const newValuation = {
        id: `val_${Date.now()}`,
        ...vehicleData,
        estimatedValue: Math.floor(800000 + Math.random() * 3500000),
        confidence: Math.floor(70 + Math.random() * 28),
        createdAt: new Date().toISOString(),
        priceRange: {
          low:  Math.floor(vehicleData.mileage > 60000 ? 700000 : 900000),
          high: Math.floor(vehicleData.mileage > 60000 ? 2000000 : 4000000),
        },
        breakdown: [
          { factor: "Base market value",   impact: 2500000,  description: `Average market price for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}` },
          { factor: "Mileage adjustment",  impact: vehicleData.mileage > 50000 ? -150000 : 80000, description: `${Number(vehicleData.mileage).toLocaleString()} km` },
          { factor: "Condition",           impact: vehicleData.condition === "Excellent" ? 120000 : vehicleData.condition === "Good" ? 40000 : -80000, description: `${vehicleData.condition} condition` },
          { factor: "Market depreciation", impact: -100000,  description: "Annual depreciation applied" },
        ],
      };
      mockStore = [newValuation, ...mockStore];
      return newValuation;
    }
    return apiClient(
      "/api/vehicles/valuate",
      { method: "POST", body: JSON.stringify(vehicleData) },
      token
    );
  },

  getHistory: async (token) => {
    if (USE_MOCK) {
      await delay();
      return mockStore;
    }
    return apiClient("/api/vehicles/history", { method: "GET" }, token);
  },

  getValuationById: async (id, token) => {
    if (USE_MOCK) {
      await delay(400);
      const item = mockStore.find((v) => v.id === id);
      if (!item) throw new Error("Valuation not found.");
      return item;
    }
    return apiClient(`/api/vehicles/${id}`, { method: "GET" }, token);
  },

  deleteValuation: async (id, token) => {
    if (USE_MOCK) {
      await delay(400);
      mockStore = mockStore.filter((v) => v.id !== id);
      return { message: "Deleted successfully." };
    }
    return apiClient(`/api/vehicles/${id}`, { method: "DELETE" }, token);
  },
};
