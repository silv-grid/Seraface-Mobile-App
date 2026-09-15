import { createSlice } from "@reduxjs/toolkit";
import { skincareApi } from "../api/skincareApi";

const initialState = {
  // Form data matching backend structure (EXISTING - DON'T CHANGE)
  formData: {
    skin_type: [],
    skin_conditions: [],
    budget: "",
    allergies: [],
    product_experiences: [],
    goals: [],
    custom_goal: "",
  },

  // Image data (EXISTING - DON'T CHANGE)
  imageData: null,
  selectedProducts: [],
  completedSteps: {},

  // Analysis results (EXISTING - DON'T CHANGE)
  analysisResults: null,

  // Product Recommendations (UPDATED - LIMIT TO LATEST)
  recommendations: {
    allocation: {},
    products: {},
    total_budget: null,
    future_recommendations: [],
    isLoading: false,
    error: null,
    lastFetchTime: null,
    // Add flag to track if recommendations are fresh
    isFresh: false,
  },

  // Routine Creation (NEW)
  routines: {
    product_type: null,
    routine: [],
    isLoading: false,
    error: null,
    lastFetchTime: null,
  },

  // Form submission state (EXISTING - DON'T CHANGE)
  isFormSubmitted: false,
  lastSubmissionTime: null,

  // Image submission state (EXISTING - DON'T CHANGE)
  isImageSubmitted: false,
  lastImageSubmissionTime: null,

  // Errors (EXISTING - DON'T CHANGE)
  errors: {
    form: null,
    image: null,
    general: null,
  },
};

const skincareSlice = createSlice({
  name: "skincare",
  initialState,
  reducers: {
    toggleProduct: (state, action) => {
      const id = action.payload;
      state.selectedProducts = state.selectedProducts.includes(id)
        ? state.selectedProducts.filter((item) => item !== id)
        : [...state.selectedProducts, id];
    },
    toggleStep: (state, action) => {
      const { day, id } = action.payload;
      const steps = state.completedSteps[day] || [];
      state.completedSteps = {
        [day]: steps.includes(id)
          ? steps.filter((item) => item !== id)
          : [...steps, id],
      };
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setSkinType: (state, action) => {
      state.formData.skin_type = action.payload;
    },

    addSkinCondition: (state, action) => {
      if (!state.formData.skin_conditions.includes(action.payload)) {
        state.formData.skin_conditions.push(action.payload);
      }
    },

    removeSkinCondition: (state, action) => {
      state.formData.skin_conditions = state.formData.skin_conditions.filter(
        (condition) => condition !== action.payload,
      );
    },

    addAllergy: (state, action) => {
      if (!state.formData.allergies.includes(action.payload)) {
        state.formData.allergies.push(action.payload);
      }
    },

    removeAllergy: (state, action) => {
      state.formData.allergies = state.formData.allergies.filter(
        (allergy) => allergy !== action.payload,
      );
    },

    addGoal: (state, action) => {
      if (!state.formData.goals.includes(action.payload)) {
        state.formData.goals.push(action.payload);
      }
    },

    removeGoal: (state, action) => {
      state.formData.goals = state.formData.goals.filter(
        (goal) => goal !== action.payload,
      );
    },

    addProductExperience: (state, action) => {
      if (
        !state.formData.product_experiences.some(
          (item) =>
            item.product === action.payload.product &&
            item.experience === action.payload.experience &&
            item.reason === action.payload.reason,
        )
      ) {
        state.formData.product_experiences.push(action.payload);
      }
    },

    removeProductExperience: (state, action) => {
      state.formData.product_experiences =
        state.formData.product_experiences.filter(
          (_, index) => index !== action.payload,
        );
    },

    setBudget: (state, action) => {
      state.formData.budget = action.payload;
    },

    setCustomGoal: (state, action) => {
      state.formData.custom_goal = action.payload;
    },

    setImageData: (state, action) => {
      state.imageData = action.payload;
      state.errors.image = null;
    },

    clearFormData: (state) => {
      state.formData = initialState.formData;
      state.isFormSubmitted = false;
      state.errors.form = null;
    },

    clearImageData: (state) => {
      state.imageData = null;
      state.errors.image = null;
      state.isImageSubmitted = false;
    },

    clearAnalysisResults: (state) => {
      state.analysisResults = null;
    },

    // UPDATED: Recommendation management actions - Clear old data completely
    clearRecommendations: (state) => {
      state.recommendations = {
        allocation: {},
        products: {},
        total_budget: null,
        future_recommendations: [],
        isLoading: false,
        error: null,
        lastFetchTime: null,
        isFresh: false,
      };
    },

    setRecommendationsLoading: (state, action) => {
      state.recommendations.isLoading = action.payload;
      if (action.payload) {
        // When starting to load, mark as not fresh
        state.recommendations.isFresh = false;
      }
    },

    setRecommendationsError: (state, action) => {
      state.recommendations.error = action.payload;
      state.recommendations.isLoading = false;
      state.recommendations.isFresh = false;
    },

    // NEW: Force refresh recommendations
    forceRefreshRecommendations: (state) => {
      // Clear existing data and mark for refresh
      state.recommendations.products = {};
      state.recommendations.allocation = {};
      state.recommendations.future_recommendations = [];
      state.recommendations.isFresh = false;
      state.recommendations.lastFetchTime = null;
    },

    // Routine management actions (FIXED)
    clearRoutines: (state) => {
      state.routines = {
        product_type: null,
        routine: [],
        isLoading: false,
        error: null,
        lastFetchTime: null,
      };
    },

    setRoutinesLoading: (state, action) => {
      if (!state.routines) {
        state.routines = { ...initialState.routines };
      }
      state.routines.isLoading = action.payload;
    },

    setRoutinesError: (state, action) => {
      if (!state.routines) {
        state.routines = { ...initialState.routines };
      }
      state.routines.error = action.payload;
      state.routines.isLoading = false;
    },

    // General actions (EXISTING - DON'T CHANGE)
    clearAllData: () => {
      return initialState;
    },

    setError: (state, action) => {
      const { type, message } = action.payload;
      state.errors[type] = message;
    },

    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },

    clearAllErrors: (state) => {
      state.errors = initialState.errors;
    },
  },

  extraReducers: (builder) => {
    // Handle form analysis results (EXISTING - DON'T CHANGE)
    builder.addMatcher(
      skincareApi.endpoints.submitFormAnalysis.matchFulfilled,
      (state) => {
        state.recommendations = initialState.recommendations;
        state.routines = initialState.routines;
        state.selectedProducts = [];
        state.completedSteps = {};
        state.analysisResults = null;
        state.imageData = null;
        state.isImageSubmitted = false;
        state.isFormSubmitted = true;
        state.lastSubmissionTime = Date.now();
        state.errors.form = null;
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.submitFormAnalysis.matchRejected,
      (state, action) => {
        state.errors.form = action.payload?.message || "Form submission failed";
        state.isFormSubmitted = false;
      },
    );

    // Handle image analysis results (EXISTING - DON'T CHANGE)
    builder.addMatcher(
      skincareApi.endpoints.submitImageAnalysis.matchFulfilled,
      (state, action) => {
        state.isImageSubmitted = true;
        state.lastImageSubmissionTime = Date.now();
        state.errors.image = null;
        state.analysisResults = action.payload;
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.submitImageAnalysis.matchRejected,
      (state, action) => {
        state.errors.image = action.payload?.message || "Image analysis failed";
        state.isImageSubmitted = false;
      },
    );

    // UPDATED: Handle product recommendations - Limit to latest only
    builder.addMatcher(
      skincareApi.endpoints.getProductRecommendations.matchPending,
      (state) => {
        state.recommendations.isLoading = true;
        state.recommendations.error = null;
        state.recommendations.isFresh = false;
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.getProductRecommendations.matchFulfilled,
      (state, action) => {
        state.recommendations.isLoading = false;
        state.recommendations.error = null;
        state.recommendations.lastFetchTime = Date.now();
        state.recommendations.isFresh = true;

        const payload = action.payload;

        state.recommendations.products = payload.products || {};
        state.recommendations.allocation = payload.allocation || {};
        state.recommendations.total_budget = payload.total_budget ?? null;
        state.recommendations.future_recommendations =
          payload.future_recommendations || [];
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.getProductRecommendations.matchRejected,
      (state, action) => {
        state.recommendations.isLoading = false;
        state.recommendations.error =
          action.payload?.message || "Failed to get recommendations";
        state.recommendations.isFresh = false;
      },
    );

    // Handle routine creation (EXISTING)
    builder.addMatcher(
      skincareApi.endpoints.getRoutineCreation.matchPending,
      (state) => {
        if (!state.routines) {
          state.routines = { ...initialState.routines };
        }
        state.routines.isLoading = true;
        state.routines.error = null;
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.getRoutineCreation.matchFulfilled,
      (state, action) => {
        if (!state.routines) {
          state.routines = { ...initialState.routines };
        }

        state.routines.isLoading = false;
        state.routines.error = null;
        state.routines.lastFetchTime = Date.now();

        const payload = action.payload;

        state.routines.product_type = payload.product_type || null;
        state.routines.routine = payload.routine
          ? JSON.parse(JSON.stringify(payload.routine))
          : [];
      },
    );

    builder.addMatcher(
      skincareApi.endpoints.getRoutineCreation.matchRejected,
      (state, action) => {
        if (!state.routines) {
          state.routines = { ...initialState.routines };
        }

        state.routines.isLoading = false;
        state.routines.error =
          action.payload?.message || "Failed to create routine";
      },
    );
  },
});

export const {
  toggleProduct,
  toggleStep,
  updateFormData,
  setSkinType,
  addSkinCondition,
  removeSkinCondition,
  addAllergy,
  removeAllergy,
  addGoal,
  removeGoal,
  addProductExperience,
  removeProductExperience,
  setBudget,
  setCustomGoal,
  setImageData,
  clearFormData,
  clearImageData,
  clearAnalysisResults,
  clearRecommendations,
  setRecommendationsLoading,
  setRecommendationsError,
  forceRefreshRecommendations,
  clearRoutines,
  setRoutinesLoading,
  setRoutinesError,
  clearAllData,
  setError,
  clearError,
  clearAllErrors,
} = skincareSlice.actions;

export default skincareSlice.reducer;
