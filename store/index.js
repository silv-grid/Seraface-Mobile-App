import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import rootReducer from "./rootReducer";
import { skincareApi } from "./api/skincareApi";
import { API_URL } from "../util/config";
import { validateResponse } from "../util/model.mjs";
const initial = rootReducer(undefined, { type: "@@init" });
export const store = configureStore({
  reducer: (state, action) =>
    action.type === "workspace/restore"
      ? { ...initial, ...action.payload }
      : rootReducer(state, action),
  middleware: (getDefault) => getDefault().concat(skincareApi.middleware),
});
const key = `seraface:v1:${API_URL || "sample"}`;
let status = { ready: false, error: null };
const listeners = new Set();
export const storageSubscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const storageSnapshot = () => status;
function report(next) {
  status = next;
  listeners.forEach((listener) => listener());
}
let writeChain = Promise.resolve();
let last = "";
function snapshot() {
  const { auth, skincare } = store.getState();
  return JSON.stringify({
    version: 1,
    auth,
    skincare: {
      ...skincare,
      imageData: null,
      errors: initial.skincare.errors,
      recommendations: {
        ...skincare.recommendations,
        isLoading: false,
        error: null,
      },
      routines: { ...skincare.routines, isLoading: false, error: null },
    },
  });
}
function check(data) {
  if (data?.version !== 1 || !data.auth || !data.skincare) throw new Error();
  const { auth, skincare: skin } = data;
  if (
    auth.sessionId !== null &&
    (typeof auth.sessionId !== "string" || auth.sessionId.length > 256)
  )
    throw new Error();
  const form = skin.formData;
  if (
    !form ||
    typeof form.budget !== "string" ||
    typeof form.custom_goal !== "string" ||
    !["skin_type", "skin_conditions", "allergies", "goals"].every(
      (key) =>
        Array.isArray(form[key]) &&
        form[key].length <= 20 &&
        form[key].every(
          (item) => typeof item === "string" && item.length <= 120,
        ),
    ) ||
    !Array.isArray(form.product_experiences) ||
    form.product_experiences.some(
      (item) =>
        !item ||
        typeof item.product !== "string" ||
        typeof item.experience !== "string" ||
        (item.reason != null && typeof item.reason !== "string"),
    )
  )
    throw new Error();
  validateResponse("getProductRecommendations", skin.recommendations);
  validateResponse("getRoutineCreation", skin.routines);
  if (skin.analysisResults)
    validateResponse("submitImageAnalysis", skin.analysisResults);
  if (
    !Array.isArray(skin.selectedProducts) ||
    skin.selectedProducts.some((item) => typeof item !== "string") ||
    !skin.completedSteps ||
    typeof skin.completedSteps !== "object" ||
    Object.values(skin.completedSteps).some(
      (items) =>
        !Array.isArray(items) || items.some((item) => typeof item !== "string"),
    )
  )
    throw new Error();
  return {
    auth: { ...initial.auth, ...auth },
    skincare: {
      ...initial.skincare,
      ...skin,
      imageData: null,
      errors: initial.skincare.errors,
      recommendations: {
        ...skin.recommendations,
        isLoading: false,
        error: null,
      },
      routines: { ...skin.routines, isLoading: false, error: null },
    },
  };
}
export async function loadSavedState() {
  report({ ready: false, error: null });
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved)
      store.dispatch({
        type: "workspace/restore",
        payload: check(JSON.parse(saved)),
      });
    last = snapshot();
    report({ ready: true, error: null });
  } catch {
    report({
      ready: false,
      error:
        "Saved data could not be opened. Retry, or discard it to start again.",
    });
  }
}
export async function retrySave() {
  const value = snapshot();
  writeChain = writeChain.then(async () => {
    try {
      await AsyncStorage.setItem(key, value);
      last = value;
      report({ ready: true, error: null });
    } catch {
      report({
        ready: true,
        error:
          "Changes are only in memory because local storage could not be written. Keep this window open and retry saving.",
      });
    }
  });
  return writeChain;
}
export async function clearSavedState() {
  await writeChain;
  try {
    await AsyncStorage.multiRemove([key, "persist:root"]);
    report({ ready: false, error: null });
    store.dispatch({ type: "workspace/restore", payload: {} });
    last = snapshot();
    report({ ready: true, error: null });
  } catch {
    report({
      ...status,
      error: "Local data could not be cleared. Please try again.",
    });
  }
}
store.subscribe(() => {
  if (status.ready && snapshot() !== last) retrySave();
});
loadSavedState();
