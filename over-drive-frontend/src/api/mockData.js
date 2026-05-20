/**
 * Mock data — used when VITE_USE_MOCK=true
 * Mirrors the exact shape your real backend will return.
 * Swap to false in .env when the backend is ready.
 */

// Simulates network delay so loading states are visible
export const delay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const MOCK_USER = {
  id: "usr_001",
  name: "Mary Onyango",
  email: "mary@overdrive.co.ke",
  phone: "+254 712 345 678",
  role: "user",
  provider: "local",
  createdAt: "2024-11-01T08:00:00.000Z",
};

export const MOCK_TOKEN = "mock_jwt_token_abc123";

// ─── Valuation history ────────────────────────────────────────────────────────

export const MOCK_HISTORY = [
  {
    id: "val_001",
    make: "Toyota",
    model: "Corolla",
    year: 2019,
    mileage: 42000,
    condition: "Good",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "Sedan",
    color: "Silver",
    engineSize: 1800,
    estimatedValue: 1850000,
    confidence: 87,
    createdAt: "2025-03-15T10:30:00.000Z",
    priceRange: { low: 1700000, high: 2000000 },
    breakdown: [
      { factor: "Base market value",   impact: 2000000, description: "Average market price for this make/model/year" },
      { factor: "Mileage adjustment",  impact: -80000,  description: "42,000 km — slightly above average" },
      { factor: "Condition premium",   impact: 50000,   description: "Good condition adds value" },
      { factor: "Transmission",        impact: 30000,   description: "Automatic commands a premium" },
      { factor: "Color desirability",  impact: -10000,  description: "Silver — neutral market demand" },
      { factor: "Market depreciation", impact: -140000, description: "Annual depreciation applied" },
    ],
  },
  {
    id: "val_002",
    make: "Mazda",
    model: "CX-5",
    year: 2020,
    mileage: 31000,
    condition: "Excellent",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    color: "White",
    engineSize: 2000,
    estimatedValue: 3200000,
    confidence: 92,
    createdAt: "2025-04-02T14:15:00.000Z",
    priceRange: { low: 3000000, high: 3450000 },
    breakdown: [
      { factor: "Base market value",   impact: 3100000, description: "Average market price for this make/model/year" },
      { factor: "Mileage adjustment",  impact: 50000,   description: "31,000 km — below average" },
      { factor: "Condition premium",   impact: 120000,  description: "Excellent condition adds significant value" },
      { factor: "Color desirability",  impact: 20000,   description: "White — high demand in local market" },
      { factor: "Market depreciation", impact: -90000,  description: "Annual depreciation applied" },
    ],
  },
  {
    id: "val_003",
    make: "Nissan",
    model: "X-Trail",
    year: 2017,
    mileage: 78000,
    condition: "Fair",
    fuelType: "Diesel",
    transmission: "Manual",
    bodyType: "SUV",
    color: "Black",
    engineSize: 2200,
    estimatedValue: 1450000,
    confidence: 74,
    createdAt: "2025-04-20T09:00:00.000Z",
    priceRange: { low: 1300000, high: 1600000 },
    breakdown: [
      { factor: "Base market value",   impact: 1800000, description: "Average market price for this make/model/year" },
      { factor: "Mileage adjustment",  impact: -180000, description: "78,000 km — above average" },
      { factor: "Condition penalty",   impact: -100000, description: "Fair condition reduces value" },
      { factor: "Market depreciation", impact: -70000,  description: "Annual depreciation applied" },
    ],
  },
  {
    id: "val_004",
    make: "Honda",
    model: "CR-V",
    year: 2021,
    mileage: 18000,
    condition: "Excellent",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    color: "Blue",
    engineSize: 1500,
    estimatedValue: 3750000,
    confidence: 95,
    createdAt: "2025-05-01T11:45:00.000Z",
    priceRange: { low: 3550000, high: 3950000 },
    breakdown: [
      { factor: "Base market value",   impact: 3600000, description: "Average market price for this make/model/year" },
      { factor: "Mileage adjustment",  impact: 120000,  description: "18,000 km — well below average" },
      { factor: "Condition premium",   impact: 150000,  description: "Excellent condition adds significant value" },
      { factor: "Market depreciation", impact: -120000, description: "Annual depreciation applied" },
    ],
  },
  {
    id: "val_005",
    make: "Subaru",
    model: "Forester",
    year: 2018,
    mileage: 55000,
    condition: "Good",
    fuelType: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    color: "Grey",
    engineSize: 2000,
    estimatedValue: 2100000,
    confidence: 81,
    createdAt: "2025-05-10T16:20:00.000Z",
    priceRange: { low: 1950000, high: 2250000 },
    breakdown: [
      { factor: "Base market value",   impact: 2300000, description: "Average market price for this make/model/year" },
      { factor: "Mileage adjustment",  impact: -60000,  description: "55,000 km — slightly above average" },
      { factor: "Condition premium",   impact: 40000,   description: "Good condition adds value" },
      { factor: "Market depreciation", impact: -180000, description: "Annual depreciation applied" },
    ],
  },
];
