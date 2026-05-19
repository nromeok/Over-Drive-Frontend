import { apiClient } from "./client";

/**
 * Vehicle API service
 * Adjust endpoint paths here if your backend uses different routes.
 */

export const vehicleService = {
  /**
   * POST /api/vehicles/valuate
   * Submit vehicle details for AI valuation.
   * @param {{ make, model, year, mileage, condition, ... }} vehicleData
   * @param {string} token
   * Expected response: { id, estimatedValue, confidence, breakdown, ... }
   */
  getValuation: (vehicleData, token) =>
    apiClient(
      "/api/vehicles/valuate",
      { method: "POST", body: JSON.stringify(vehicleData) },
      token
    ),

  /**
   * GET /api/vehicles/history
   * Fetch the authenticated user's past valuations.
   * @param {string} token
   * Expected response: [{ id, make, model, year, estimatedValue, createdAt }, ...]
   */
  getHistory: (token) =>
    apiClient("/api/vehicles/history", { method: "GET" }, token),

  /**
   * GET /api/vehicles/:id
   * Fetch a single valuation by ID.
   * @param {string} id
   * @param {string} token
   */
  getValuationById: (id, token) =>
    apiClient(`/api/vehicles/${id}`, { method: "GET" }, token),

  /**
   * DELETE /api/vehicles/:id
   * Delete a valuation from history.
   * @param {string} id
   * @param {string} token
   */
  deleteValuation: (id, token) =>
    apiClient(`/api/vehicles/${id}`, { method: "DELETE" }, token),
};
