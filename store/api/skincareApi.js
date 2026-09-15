import { createApi } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";
import baseQuery from "./customBaseQuery";
import { SAMPLE_MODE } from "../../util/config";
const path = (phase, name, session) =>
  `/api/v1/skincare/phase${phase}/${name}${session ? `?session_id=${encodeURIComponent(session)}` : ""}`;
const error = (response) => ({
  status: response.status,
  message: response.data?.message || "Request failed. Please try again.",
});
export const skincareApi = createApi({
  reducerPath: "skincareApi",
  baseQuery,
  endpoints: (builder) => ({
    submitFormAnalysis: builder.mutation({
      query: (body) => ({
        url: path(1, "form-analysis"),
        method: "POST",
        body,
      }),
      transformErrorResponse: error,
    }),
    submitImageAnalysis: builder.mutation({
      async queryFn({ imageFile, sessionId }, api, extra, request) {
        try {
          if (!sessionId) throw new Error("Complete your profile first.");
          let body;
          if (!SAMPLE_MODE) {
            if (
              !imageFile?.uri ||
              !["image/jpeg", "image/png", "image/webp"].includes(
                imageFile.type,
              )
            )
              throw new Error("Choose a JPEG, PNG or WebP image.");
            if (imageFile.fileSize > 5 * 1024 * 1024)
              throw new Error("Choose a photo smaller than 5 MB.");
            body = new FormData();
            if (Platform.OS === "web") {
              const blob = await (await fetch(imageFile.uri)).blob();
              if (blob.size > 5 * 1024 * 1024)
                throw new Error("Choose a photo smaller than 5 MB.");
              body.append("file", blob, imageFile.name || "photo.jpg");
            } else
              body.append("file", {
                uri: imageFile.uri,
                type: imageFile.type,
                name: imageFile.name || "photo.jpg",
              });
          }
          const result = await request({
            url: path(2, "image-analysis", sessionId),
            method: "POST",
            body,
          });
          return result.error ? { error: error(result.error) } : result;
        } catch (failure) {
          return { error: { status: "IMAGE_ERROR", message: failure.message } };
        }
      },
    }),
    getProductRecommendations: builder.mutation({
      query: (id) => ({
        url: path(3, "product-recommendations", id),
        method: "POST",
      }),
      transformErrorResponse: error,
    }),
    getRecommendationsQuery: builder.query({
      query: (id) => path(3, "product-recommendations", id),
      transformErrorResponse: error,
    }),
    getRoutineCreation: builder.mutation({
      query: (id) => ({ url: path(4, "routine-creation", id), method: "POST" }),
      transformErrorResponse: error,
    }),
    getRoutineQuery: builder.query({
      query: (id) => path(4, "routine-creation", id),
      transformErrorResponse: error,
    }),
  }),
});
export const {
  useSubmitFormAnalysisMutation,
  useSubmitImageAnalysisMutation,
  useGetProductRecommendationsMutation,
  useGetRecommendationsQueryQuery,
  useGetRoutineCreationMutation,
  useGetRoutineQueryQuery,
} = skincareApi;
