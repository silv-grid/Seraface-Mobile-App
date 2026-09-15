import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Page, Action, Notice, styles } from "../../components/Workspace";
import { useGetRoutineCreationMutation } from "../../store/api/skincareApi";
import { toggleStep } from "../../store/slices/skincareSlice";
export default function RoutinesScreen() {
  const { routines, completedSteps } = useSelector((state) => state.skincare);
  const session = useSelector((state) => state.auth.sessionId);
  const dispatch = useDispatch();
  const [load, { isLoading, error }] = useGetRoutineCreationMutation();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const day = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  return (
    <Page
      title="A routine you can follow"
      description="Review the available entries. Completion marks are saved for the current local calendar day."
    >
      <Notice error>{error?.message}</Notice>
      {!routines.routine.length && (
        <Notice>
          No routine yet. Complete your profile, then load the available
          entries.
        </Notice>
      )}
      {routines.routine.map((item, index) => {
        const id = `${index}:${item.name}`;
        const done = (completedSteps[day] || []).includes(id);
        return (
          <View key={id} style={styles.row}>
            <Text style={styles.mode}>
              {item.time.join(" / ").toUpperCase()}
            </Text>
            <Text style={styles.heading}>{item.name}</Text>
            {typeof item.description === "string" && (
              <Text style={styles.body}>{item.description}</Text>
            )}
            {item.instructions.map((instruction, i) => (
              <Text key={i} style={styles.body}>
                {i + 1}. {instruction}
              </Text>
            ))}
            <Action
              secondary
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              onPress={() => dispatch(toggleStep({ day, id }))}
            >
              {done ? "Completed today - undo" : `Mark ${item.name} complete`}
            </Action>
          </View>
        );
      })}
      {!!session && (
        <Action disabled={isLoading} onPress={() => load(session)}>
          {isLoading ? "Loading routine..." : "Load routine"}
        </Action>
      )}
    </Page>
  );
}
