const configured = process.env.EXPO_PUBLIC_SERAFACE_API_URL?.trim() || "";
export const API_URL = configured.replace(/\/$/, "");
export const SAMPLE_MODE = !API_URL;
export function configurationError() {
  if (SAMPLE_MODE) return null;
  try {
    const url = new URL(API_URL);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error();
    if (
      url.protocol === "http:" &&
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
      return "Use HTTPS for a remote service; HTTP is only supported on localhost.";
    return null;
  } catch {
    return "Set EXPO_PUBLIC_SERAFACE_API_URL to a valid service URL.";
  }
}
