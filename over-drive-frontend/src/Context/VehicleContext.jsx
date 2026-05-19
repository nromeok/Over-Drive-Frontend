import { createContext, useReducer, useContext, useCallback } from "react";
import VehicleReducer from "./VehicleReducer";
import {
  valuationStart, valuationSuccess, valuationFailure,
  fetchHistoryStart, fetchHistorySuccess, fetchHistoryFailure,
  setSelectedVehicle,
  clearValuation as clearValuationAction,
  clearVehicleError as clearVehicleErrorAction,
} from "./VehicleActions";
import { vehicleService } from "../api/vehicleService";

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  currentValuation: null,
  valuationHistory: [],
  selectedVehicle: null,
  valuationLoading: false,
  historyLoading: false,
  valuationError: null,
  historyError: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const VehicleContext = createContext(initialState);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(VehicleReducer, initialState);

  // Submit vehicle details for AI valuation
  const getValuation = useCallback(async (vehicleData, token) => {
    dispatch(valuationStart());
    try {
      const data = await vehicleService.getValuation(vehicleData, token);
      dispatch(valuationSuccess(data));
      return { success: true, data };
    } catch (err) {
      dispatch(valuationFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // Load the user's past valuations
  const fetchValuationHistory = useCallback(async (token) => {
    dispatch(fetchHistoryStart());
    try {
      const data = await vehicleService.getHistory(token);
      dispatch(fetchHistorySuccess(data));
    } catch (err) {
      dispatch(fetchHistoryFailure(err.message));
    }
  }, []);

  // Set which vehicle the user is currently viewing
  const selectVehicle = useCallback((vehicle) => {
    dispatch(setSelectedVehicle(vehicle));
  }, []);

  const clearValuation = useCallback(() => dispatch(clearValuationAction()), []);
  const clearVehicleError = useCallback(() => dispatch(clearVehicleErrorAction()), []);

  return (
    <VehicleContext.Provider
      value={{
        currentValuation: state.currentValuation,
        valuationHistory: state.valuationHistory,
        selectedVehicle: state.selectedVehicle,
        valuationLoading: state.valuationLoading,
        historyLoading: state.historyLoading,
        valuationError: state.valuationError,
        historyError: state.historyError,
        getValuation,
        fetchValuationHistory,
        selectVehicle,
        clearValuation,
        clearVehicleError,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

// ─── Custom hook ──────────────────────────────────────────────────────────────

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) throw new Error("useVehicle must be used within a VehicleProvider");
  return context;
};
