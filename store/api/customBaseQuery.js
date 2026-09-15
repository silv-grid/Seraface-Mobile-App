import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL, SAMPLE_MODE, configurationError } from "../../util/config";
import { sampleResponse } from "../../util/sample.mjs";
import { validateResponse, validateProfile } from "../../util/model.mjs";
const request = fetchBaseQuery({
  baseUrl: API_URL,
  timeout: 30000,
  prepareHeaders(headers, { getState }) {
    const session = getState().auth.sessionId;
    if (session) headers.set("X-Session-ID", session);
    return headers;
  },
});
export default async function customBaseQuery(args, api, extraOptions) {
  const invalid =
    configurationError() ||
    (api.endpoint === "submitFormAnalysis" && validateProfile(args.body));
  if (invalid)
    return {
      error: { status: "VALIDATION_ERROR", data: { message: invalid } },
    };
  if (SAMPLE_MODE) return { data: sampleResponse(api.endpoint) };
  const result = await request(args, api, extraOptions);
  if (result.error)
    return {
      error: {
        status: result.error.status,
        data: {
          message:
            result.error.status === "TIMEOUT_ERROR"
              ? "The service timed out. Your draft is still here; try again."
              : "The service could not complete this request. Check its connection and try again.",
        },
      },
    };
  try {
    return { data: validateResponse(api.endpoint, result.data) };
  } catch (error) {
    return {
      error: { status: "INVALID_RESPONSE", data: { message: error.message } },
    };
  }
}
