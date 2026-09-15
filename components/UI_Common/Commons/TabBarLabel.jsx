import { Text } from "react-native";
export default function TabBarLabel({ text, focused }) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: focused ? "700" : "400",
        color: focused ? "#7423c7" : "#555555",
      }}
    >
      {text}
    </Text>
  );
}
