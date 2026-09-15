// Fictional fixtures for exploring the client. No photo or profile is analyzed.
export function sampleResponse(endpoint) {
  if (endpoint === "submitFormAnalysis")
    return { sample: true, session_id: "local-sample", form_index: 0 };
  if (endpoint === "submitImageAnalysis")
    return {
      sample: true,
      ai_output: {
        notice:
          "Sample report only. No skin findings were generated and no photo was analyzed.",
      },
    };
  if (endpoint.includes("Routine"))
    return {
      sample: true,
      routine: [
        {
          name: "Sample morning entry",
          time: ["morning"],
          instructions: [
            "This placeholder shows where instructions from your connected service appear.",
          ],
          description: "An example of the routine layout, not skincare advice.",
        },
        {
          name: "Sample evening entry",
          time: ["night"],
          instructions: [
            "Use the completion control to try the daily checklist.",
          ],
          description: "Fictional demonstration entry.",
        },
      ],
    };
  return {
    sample: true,
    products: {
      examples: [
        {
          name: "Example product A",
          price: "PHP 180.00",
          description:
            "Fictional item for trying the purchase planner. Not a product recommendation.",
        },
        {
          name: "Example product B",
          price: "PHP 240.50",
          description:
            "Fictional item with a different price. Nothing is purchased or ordered.",
        },
        {
          name: "Example product C",
          price: null,
          description: "An example of an item whose price is unavailable.",
        },
      ],
    },
    allocation: {},
    future_recommendations: [],
  };
}
