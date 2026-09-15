import test from "node:test";
import assert from "node:assert/strict";
import {
  cents,
  validateProfile,
  productList,
  planTotal,
  validateResponse,
  safeLink,
} from "../util/model.mjs";
import { sampleResponse } from "../util/sample.mjs";
test("money uses cents and rejects ambiguous or invalid prices", () => {
  assert.equal(cents("PHP 240.50"), 24050);
  for (const value of [
    "",
    ".",
    "0",
    "-1",
    "1.234",
    "$20",
    "1000000",
    "1e3",
    Infinity,
  ])
    assert.equal(cents(value), null);
  const products = productList(
    sampleResponse("getProductRecommendations").products,
  );
  assert.deepEqual(
    planTotal(
      products,
      products.map((item) => item.id),
    ),
    { known: 42050, unknown: 1, count: 3 },
  );
});
test("profile validates before submission without requiring a condition", () => {
  const form = {
    skin_type: ["normal"],
    budget: "500",
    skin_conditions: [],
    allergies: [],
    goals: [],
    custom_goal: "Try planner",
    product_experiences: [],
  };
  assert.equal(validateProfile(form), null);
  assert.ok(validateProfile({ ...form, budget: "." }));
  assert.ok(validateProfile({ ...form, skin_type: [] }));
  assert.ok(
    validateProfile({
      ...form,
      product_experiences: [{ product: "X", experience: "made up" }],
    }),
  );
});
test("service response boundaries reject malformed data and preserve all products", () => {
  for (const endpoint of [
    "submitFormAnalysis",
    "submitImageAnalysis",
    "getProductRecommendations",
    "getRoutineCreation",
  ]) {
    assert.throws(() => validateResponse(endpoint, {}));
    assert.equal(
      validateResponse(endpoint, sampleResponse(endpoint)).sample,
      true,
    );
  }
  assert.equal(
    productList(sampleResponse("getProductRecommendations").products).length,
    3,
  );
  assert.equal(safeLink("javascript:alert(1)"), null);
  assert.equal(safeLink("https://user:pass@example.com"), null);
  assert.equal(
    safeLink("https://example.com/product"),
    "https://example.com/product",
  );
});
