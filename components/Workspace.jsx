import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { SAMPLE_MODE } from "../util/config";
export function Action({
  children,
  onPress,
  disabled,
  secondary = false,
  ...props
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        (pressed || disabled) && { opacity: 0.6 },
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, secondary && { color: "#7423c7" }]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function Page({ title, description, children }) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.mode}>
        {SAMPLE_MODE ? "SAMPLE WALKTHROUGH · NO ANALYSIS" : "CONNECTED SERVICE"}
      </Text>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {description && <Text style={styles.body}>{description}</Text>}
      {children}
    </ScrollView>
  );
}
export function Notice({ children, error = false }) {
  return children ? (
    <Text
      accessibilityRole={error ? "alert" : undefined}
      accessibilityLiveRegion="polite"
      style={[
        styles.notice,
        error && { color: "#990000", backgroundColor: "#ffe6e6" },
      ]}
    >
      {children}
    </Text>
  ) : null;
}
export const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  mode: { fontSize: 11, fontWeight: "700", letterSpacing: 1, color: "#7423c7" },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "700", color: "#303030" },
  heading: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: "600",
    color: "#303030",
  },
  body: { fontSize: 16, lineHeight: 25, color: "#555555" },
  row: {
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e5d4ff",
  },
  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#7423c7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: "#f0e6ff",
    borderWidth: 1,
    borderColor: "#d4b8ff",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  notice: {
    padding: 16,
    backgroundColor: "#f0e6ff",
    color: "#505050",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 22,
  },
  figure: { color: "#7423c7", fontSize: 32, fontWeight: "700" },
});
