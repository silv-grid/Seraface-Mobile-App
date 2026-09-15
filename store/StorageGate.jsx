import { useSyncExternalStore } from "react";
import { View, Text } from "react-native";
import {
  storageSubscribe,
  storageSnapshot,
  loadSavedState,
  clearSavedState,
  retrySave,
} from "./index";
import { Action, Notice, styles } from "../components/Workspace";
export default function StorageGate({ children }) {
  const state = useSyncExternalStore(
    storageSubscribe,
    storageSnapshot,
    storageSnapshot,
  );
  if (!state.ready)
    return (
      <View style={styles.page}>
        <Text style={styles.heading}>Opening your local workspace…</Text>
        {state.error && (
          <>
            <Notice error>{state.error}</Notice>
            <Action onPress={loadSavedState}>Try loading again</Action>
            <Action secondary onPress={clearSavedState}>
              Discard unreadable local data
            </Action>
          </>
        )}
      </View>
    );
  return (
    <View style={{ flex: 1 }}>
      {state.error && (
        <View style={{ padding: 12 }}>
          <Notice error>{state.error}</Notice>
          <Action onPress={retrySave}>Retry saving</Action>
        </View>
      )}
      {children}
    </View>
  );
}
