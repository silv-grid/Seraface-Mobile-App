import { Text } from "react-native";
export const GradientText = ({
  text,
  style,
  focused = true,
  numberOfLines,
  centerText = false,
}) => (
  <Text
    numberOfLines={numberOfLines}
    style={[
      {
        fontSize: 18,
        fontWeight: "700",
        color: focused ? "#7423c7" : "#555555",
        textAlign: centerText ? "center" : "left",
      },
      style,
    ]}
  >
    {text}
  </Text>
);
