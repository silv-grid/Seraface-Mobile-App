import { View, Text, Pressable } from "react-native";
import React from "react";
import { GradientView } from "../../../components/UI_Common/Gradients/GradientView";
import Colors from "../../../constants/colors";

export default function ButtonSkinChoice({
  onSelectedValue,
  text,
  value,
  isSelected,
}) {
  return (
    <View className="overflow-hidden rounded-xl">
      {isSelected ? (
        <GradientView preset="purpleToPink3" className="rounded-xl">
          <Pressable
            accessibilityRole="radio"
            accessibilityLabel={text}
            accessibilityState={{ checked: isSelected }}
            style={{ minHeight: 48, justifyContent: "center" }}
            onPress={() => onSelectedValue(value)}
            android_ripple={{ color: Colors.primary400 }}
            className="py-3 px-4 items-center"
          >
            <Text className="text-textLight font-medium">{text}</Text>
          </Pressable>
        </GradientView>
      ) : (
        <Pressable
          accessibilityRole="radio"
          accessibilityLabel={text}
          accessibilityState={{ checked: isSelected }}
          style={{ minHeight: 48, justifyContent: "center" }}
          onPress={() => onSelectedValue(value)}
          android_ripple={{ color: Colors.primary100 }}
          className="py-3 px-4 bg-white border border-gray-200 rounded-xl items-center"
        >
          <Text className="text-textPrimary">{text}</Text>
        </Pressable>
      )}
    </View>
  );
}
