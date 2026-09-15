import { useState } from "react";
import { View, Text } from "react-native";
import { Sparkles } from "lucide-react-native";
import { GradientView } from "../../components/UI_Common/Gradients/GradientView";
import { Page, Action, Notice, styles } from "../../components/Workspace";
import { SAMPLE_MODE, API_URL } from "../../util/config";
import { clearSavedState } from "../../store";
export default function HomeScreen({ navigation }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Page
      title="Your skincare workspace"
      description="Keep your profile, product shortlist and routine together."
    >
      <GradientView
        preset="logoGradient"
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Sparkles color="white" size={40} />
      </GradientView>
      <Notice>
        {SAMPLE_MODE
          ? "Try the client with fictional products and routine entries. No photo is needed, no AI runs, and nothing is sent to a server."
          : `Profile submissions and selected photos go to ${API_URL}. Service output is shown as received; this client does not verify clinical claims.`}
      </Notice>
      <View style={styles.row}>
        <Text style={styles.heading}>01 / Describe your preferences</Text>
        <Text style={styles.body}>
          Choose a skin type, a budget in PHP and the goals you want to keep
          track of.
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.heading}>02 / Review products</Text>
        <Text style={styles.body}>
          Select items for a local purchase plan and see the total against your
          budget.
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.heading}>03 / Track your routine</Text>
        <Text style={styles.body}>
          Review the available steps and mark today's entries complete.
        </Text>
      </View>
      <Action onPress={() => navigation.navigate("SkinProfile")}>
        Open skin profile
      </Action>
      <Text style={styles.body}>
        Your draft, results and plan are stored on this device, without
        encryption. Photos are kept only in memory. There is no account sync or
        checkout.
      </Text>
      {confirm ? (
        <>
          <Notice>
            Clear your profile, saved results, plan and checklist on this
            device? This cannot be undone.
          </Notice>
          <Action
            onPress={async () => {
              await clearSavedState();
              setConfirm(false);
            }}
          >
            Confirm clear local data
          </Action>
          <Action secondary onPress={() => setConfirm(false)}>
            Keep my data
          </Action>
        </>
      ) : (
        <Action secondary onPress={() => setConfirm(true)}>
          Clear local data
        </Action>
      )}
    </Page>
  );
}
