import Ionicons from "@expo/vector-icons/Ionicons";
export const GradientIcon = ({ name, size = 24, focused = false, style }) => (
  <Ionicons
    accessible={false}
    name={name}
    size={size}
    color={focused ? "#7423c7" : "#707070"}
    style={style}
  />
);
