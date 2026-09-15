import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import SkinInputList from "./SkinInputList";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GradientView } from "../../../components/UI_Common/Gradients/GradientView";
import Colors from "../../../constants/colors";

export default function SkinInput({
  title,
  placeholder,
  items,
  onAddItem,
  onRemoveItem,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const handleAddItem = () => {
    if (inputValue.trim() !== "" && items.length < 20) {
      // Call the parent's add function
      onAddItem(inputValue.trim());
      // Clear input value immediately
      setInputValue("");
      // Focus back on input for better UX
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  };

  return (
    <View className="flex-col mb-4">
      <Text className="text-[#444] font-medium mb-2">{title}</Text>
      <View className="flex-row items-center">
        <TextInput
          accessibilityLabel={title}
          maxLength={120}
          ref={inputRef}
          className="flex-1 border border-gray-200 bg-white rounded-xl py-3 px-4 mr-2"
          placeholder={placeholder}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddItem}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Add ${title}`}
          accessibilityState={{
            disabled: !inputValue.trim() || items.length >= 20,
          }}
          disabled={!inputValue.trim() || items.length >= 20}
          activeOpacity={0.7}
          onPress={handleAddItem}
          className="overflow-hidden rounded-xl h-[48px] w-[48px]"
        >
          <GradientView
            preset="purpleToPink3"
            className="rounded-xl h-full w-full items-center justify-center"
          >
            <View className="items-center justify-center w-full h-full">
              <Ionicons name="add" size={24} color={Colors.textLight} />
            </View>
          </GradientView>
        </TouchableOpacity>
      </View>
      <SkinInputList items={items} onRemove={onRemoveItem} />
    </View>
  );
}
