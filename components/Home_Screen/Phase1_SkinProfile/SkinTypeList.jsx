import { View, Text } from "react-native";
import React from "react";
import ButtonSkinChoice from "./ButtonSkinChoice";

export default function SkinTypeList({ selectedSkinType, onSkinTypeChange }) {
  const handleSetSkinType = (skinType) => {
    onSkinTypeChange(skinType);
  };

  const skinTypes = [
    { text: "Oily", value: "oily" },
    { text: "Dry", value: "dry" },
    { text: "Combination", value: "combination" },
    { text: "Normal", value: "normal" },
    { text: "Sensitive", value: "sensitive" },
    { text: "Acne-Prone", value: "acne-prone" },
  ];

  return (
    <View className="my-4">
      <Text className="text-[#444] font-medium mb-2">
        What's your skin type?
      </Text>
      <View className="flex-row justify-between">
        <View className="w-[48%] gap-3">
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[0].text}
            value={skinTypes[0].value}
            isSelected={selectedSkinType === skinTypes[0].value}
          />
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[2].text}
            value={skinTypes[2].value}
            isSelected={selectedSkinType === skinTypes[2].value}
          />
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[4].text}
            value={skinTypes[4].value}
            isSelected={selectedSkinType === skinTypes[4].value}
          />
        </View>
        <View className="w-[48%] gap-3">
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[1].text}
            value={skinTypes[1].value}
            isSelected={selectedSkinType === skinTypes[1].value}
          />
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[3].text}
            value={skinTypes[3].value}
            isSelected={selectedSkinType === skinTypes[3].value}
          />
          <ButtonSkinChoice
            onSelectedValue={handleSetSkinType}
            text={skinTypes[5].text}
            value={skinTypes[5].value}
            isSelected={selectedSkinType === skinTypes[5].value}
          />
        </View>
      </View>
    </View>
  );
}
