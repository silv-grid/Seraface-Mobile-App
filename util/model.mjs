export function cents(value) {
  const text = String(value ?? "")
    .trim()
    .replace(/^(?:₱|PHP)\s*/i, "");
  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(text)) return null;
  const amount = Math.round(Number(text) * 100);
  return amount > 0 && amount <= 99999999 ? amount : null;
}
export const money = (value) =>
  value === null ? "Price unavailable" : `₱${(value / 100).toFixed(2)}`;
export function validateProfile(profile) {
  if (!Array.isArray(profile?.skin_type) || profile.skin_type.length !== 1)
    return "Choose one skin type.";
  if (cents(profile.budget) === null)
    return "Enter a budget from ₱0.01 to ₱999,999.99 with at most two decimal places.";
  if (!profile.goals?.length && !profile.custom_goal?.trim())
    return "Add a goal or describe your own.";
  for (const key of ["skin_type", "skin_conditions", "allergies", "goals"]) {
    if (
      !Array.isArray(profile[key]) ||
      profile[key].length > 20 ||
      profile[key].some(
        (item) => typeof item !== "string" || !item.trim() || item.length > 120,
      )
    )
      return "Use up to 20 short entries per field (120 characters each).";
  }
  if (
    typeof profile.custom_goal !== "string" ||
    profile.custom_goal.length > 500
  )
    return "Keep your custom goal within 500 characters.";
  if (
    !Array.isArray(profile.product_experiences) ||
    profile.product_experiences.length > 20 ||
    profile.product_experiences.some(
      (item) =>
        !item ||
        typeof item.product !== "string" ||
        !item.product.trim() ||
        item.product.length > 120 ||
        !["good", "bad", "neutral"].includes(item.experience) ||
        (item.reason != null &&
          (typeof item.reason !== "string" || item.reason.length > 500)),
    )
  )
    return "Check product experiences: up to 20 entries, with short names and notes.";
  return null;
}
export function safeLink(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function productList(products) {
  if (!products || typeof products !== "object" || Array.isArray(products))
    throw new Error("The service returned an invalid product list.");
  const list = [];
  for (const [category, items] of Object.entries(products)) {
    if (!Array.isArray(items))
      throw new Error("The service returned an invalid product category.");
    for (const [index, item] of items.entries()) {
      if (!item || typeof item.name !== "string" || !item.name.trim())
        throw new Error("A product is missing its name.");
      list.push({
        id: `${category}:${index}:${item.name}`,
        name: item.name,
        category,
        price: cents(item.price),
        description:
          typeof item.description === "string" ? item.description : "",
        link: safeLink(item.product_link),
      });
    }
  }
  if (list.length > 200)
    throw new Error("The service returned too many products.");
  return list;
}
export function validateResponse(endpoint, data) {
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new Error("The service returned an invalid response.");
  if (
    endpoint === "submitFormAnalysis" &&
    (typeof data.session_id !== "string" ||
      !data.session_id.trim() ||
      data.session_id.length > 256)
  )
    throw new Error("The service did not return a session ID.");
  if (
    endpoint === "submitImageAnalysis" &&
    (!data.ai_output ||
      typeof data.ai_output !== "object" ||
      Array.isArray(data.ai_output))
  )
    throw new Error("The service did not return an analysis report.");
  if (
    ["getProductRecommendations", "getRecommendationsQuery"].includes(endpoint)
  )
    productList(data.products);
  if (
    ["getRoutineCreation", "getRoutineQuery"].includes(endpoint) &&
    (!Array.isArray(data.routine) ||
      data.routine.length > 100 ||
      data.routine.some(
        (item) =>
          !item ||
          typeof item.name !== "string" ||
          !Array.isArray(item.time) ||
          item.time.some((t) => typeof t !== "string") ||
          !Array.isArray(item.instructions) ||
          item.instructions.some((i) => typeof i !== "string"),
      ))
  )
    throw new Error("The service returned an invalid routine.");
  return data;
}
export function planTotal(products, selected) {
  const chosen = products.filter((item) => selected.includes(item.id));
  return {
    known: chosen.reduce((sum, item) => sum + (item.price ?? 0), 0),
    unknown: chosen.filter((item) => item.price === null).length,
    count: chosen.length,
  };
}
