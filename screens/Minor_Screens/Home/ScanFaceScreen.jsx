import { useState } from "react";
import { Image, Platform } from "react-native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Page, Action, Notice } from "../../../components/Workspace";
import { SAMPLE_MODE, API_URL } from "../../../util/config";
import { useSubmitImageAnalysisMutation } from "../../../store/api/skincareApi";
export default function ScanFaceScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const sessionId = useSelector((state) => state.auth.sessionId);
  const [submit, { isLoading, error }] = useSubmitImageAnalysisMutation();
  async function choose() {
    setMessage("");
    try {
      if (
        Platform.OS !== "web" &&
        !(await ImagePicker.requestMediaLibraryPermissionsAsync()).granted
      ) {
        setMessage(
          "Photo access was not granted. You can allow it in device settings and try again.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const type = asset.mimeType || "image/jpeg";
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(type) ||
        asset.fileSize > 5 * 1024 * 1024
      ) {
        setMessage("Choose a JPEG, PNG or WebP photo smaller than 5 MB.");
        return;
      }
      setPhoto({
        uri: asset.uri,
        type,
        name: asset.fileName || "photo.jpg",
        fileSize: asset.fileSize,
      });
    } catch {
      setMessage("The photo picker could not open. Please try again.");
    }
  }
  async function send() {
    try {
      await submit({ imageFile: photo, sessionId }).unwrap();
      setPhoto(null);
      navigation.replace("Result");
    } catch {
      /* Mutation error stays visible and the selected photo remains available. */
    }
  }
  return (
    <Page
      title={SAMPLE_MODE ? "Try the sample report" : "Choose a photo"}
      description={
        SAMPLE_MODE
          ? "No photo is needed. Continue to see how a report, product list and routine fit together."
          : `Only the photo you select is sent to ${API_URL}, when you press Send photo. It is not saved in this client's local storage.`
      }
    >
      {!sessionId && (
        <Notice error>Complete your profile before continuing.</Notice>
      )}
      {!SAMPLE_MODE && (
        <>
          <Action secondary disabled={isLoading} onPress={choose}>
            {photo ? "Choose a different photo" : "Choose photo"}
          </Action>
          {photo && (
            <Image
              accessibilityLabel="Selected photo preview"
              source={{ uri: photo.uri }}
              style={{ width: "100%", height: 260, borderRadius: 16 }}
              resizeMode="contain"
            />
          )}
        </>
      )}
      <Notice error>{message || error?.message}</Notice>
      <Action
        disabled={isLoading || !sessionId || (!SAMPLE_MODE && !photo)}
        onPress={send}
      >
        {isLoading
          ? "Waiting for service..."
          : SAMPLE_MODE
            ? "View sample report"
            : "Send photo for analysis"}
      </Action>
    </Page>
  );
}
