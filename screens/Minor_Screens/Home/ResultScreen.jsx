import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Page, Action, Notice, styles } from "../../../components/Workspace";
import { SAMPLE_MODE } from "../../../util/config";
export default function ResultScreen({ navigation }) {
  const result = useSelector((state) => state.skincare.analysisResults);
  return (
    <Page
      title={SAMPLE_MODE ? "Sample report" : "Service report"}
      description={
        SAMPLE_MODE
          ? "This walkthrough does not inspect skin or generate findings."
          : "Output supplied by your configured service. This client does not validate medical accuracy."
      }
    >
      {!result ? (
        <Notice>
          No report is available. Return to your profile to begin.
        </Notice>
      ) : (
        Object.entries(result.ai_output).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.heading}>{key.replaceAll("_", " ")}</Text>
            <Text selectable style={styles.body}>
              {typeof value === "string"
                ? value
                : JSON.stringify(value, null, 2)}
            </Text>
          </View>
        ))
      )}
      <Action onPress={() => navigation.navigate("Products")}>
        Explore products
      </Action>
      <Action secondary onPress={() => navigation.popToTop()}>
        Return home
      </Action>
    </Page>
  );
}
