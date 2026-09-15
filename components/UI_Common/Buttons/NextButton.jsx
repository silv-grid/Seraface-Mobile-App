import { View, Text, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GradientView } from "../Gradients/GradientView";
import Colors from "../../../constants/colors";

export default function NextButton({ text, icon, onPress, disabled = false }) {
  return (
    <View className="mt-4 overflow-hidden rounded-xl">
      <GradientView preset="purpleToPink3" style={{ borderRadius: 12 }}>
        <Pressable
          accessibilityLabel={text}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          style={{ minHeight: 48, opacity: disabled ? 0.6 : 1 }}
          onPress={onPress}
          android_ripple={{ color: Colors.primary500 }}
        >
          <View className="flex-row justify-center items-center gap-3 p-4 ">
            <Text className="font-semibold text-textLight text-base flex-shrink">
              {text}
            </Text>
            <Ionicons name={icon} color={"white"} size={20} />
          </View>
        </Pressable>
      </GradientView>
    </View>
  );
}
