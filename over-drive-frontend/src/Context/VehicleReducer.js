import { VEHICLE_ACTIONS } from "./VehicleActions";

const VehicleReducer = (state, action) => {
  switch (action.type) {
    case VEHICLE_ACTIONS.VALUATION_START:
      return { ...state, valuationLoading: true, valuationError: null };

    case VEHICLE_ACTIONS.VALUATION_SUCCESS:
      return { ...state, valuationLoading: false, currentValuation: action.payload, valuationError: null };

    case VEHICLE_ACTIONS.VALUATION_FAILURE:
      return { ...state, valuationLoading: false, valuationError: action.payload };

    case VEHICLE_ACTIONS.FETCH_HISTORY_START:
      return { ...state, historyLoading: true, historyError: null };

    case VEHICLE_ACTIONS.FETCH_HISTORY_SUCCESS:
      return { ...state, historyLoading: false, valuationHistory: action.payload, historyError: null };

    case VEHICLE_ACTIONS.FETCH_HISTORY_FAILURE:
      return { ...state, historyLoading: false, historyError: action.payload };

    case VEHICLE_ACTIONS.SET_SELECTED_VEHICLE:
      return { ...state, selectedVehicle: action.payload };

    case VEHICLE_ACTIONS.CLEAR_VALUATION:
      return { ...state, currentValuation: null, valuationError: null };

    case VEHICLE_ACTIONS.CLEAR_ERROR:
      return { ...state, valuationError: null, historyError: null };

    default:
      return state;
  }
};

export default VehicleReducer;
