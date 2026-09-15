import { ScrollView, View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateProfile } from "../../../util/model.mjs";
import { SAMPLE_MODE } from "../../../util/config";
import { Notice } from "../../../components/Workspace";
import TitleContainer from "../../../components/UI_Common/Commons/TitleContainer";
import SkinTypeList from "../../../components/Home_Screen/Phase1_SkinProfile/SkinTypeList";
import NextButton from "../../../components/UI_Common/Buttons/NextButton";
import SkinInput from "../../../components/Home_Screen/Phase1_SkinProfile/SkinInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../../constants/colors";
import ProductExperienceInput from "../../../components/Home_Screen/Phase1_SkinProfile/ProductExperienceInput";

// Redux imports
import {
  setSkinType,
  addSkinCondition,
  removeSkinCondition,
  addAllergy,
  removeAllergy,
  addGoal,
  removeGoal,
  addProductExperience,
  removeProductExperience,
  setBudget,
  setCustomGoal,
  clearError,
} from "../../../store/slices/skincareSlice";
import {
  setSessionId,
  setCurrentPhase,
  setFormIndex,
} from "../../../store/slices/authSlice";
import { useSubmitFormAnalysisMutation } from "../../../store/api/skincareApi";

const SkinProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  // Redux state
  const formData = useSelector((state) => state.skincare.formData);
  const formError = useSelector((state) => state.skincare.errors.form);
  const [validationError, setValidationError] = useState(null);

  // RTK Query mutation
  const [submitFormAnalysis, { isLoading, error: mutationError }] =
    useSubmitFormAnalysisMutation();

  // Destructure form data for easier access
  const {
    skin_type,
    skin_conditions,
    budget,
    allergies,
    product_experiences,
    goals,
    custom_goal,
  } = formData;

  // Event handlers
  const handleSkinTypeChange = (type) => {
    dispatch(setSkinType([type])); // Backend expects array
  };

  const handleAddSkinCondition = (condition) => {
    dispatch(addSkinCondition(condition.toLowerCase()));
  };

  const handleRemoveSkinCondition = (condition) => {
    dispatch(removeSkinCondition(condition));
  };

  const handleAddAllergy = (allergy) => {
    dispatch(addAllergy(allergy.toLowerCase()));
  };

  const handleRemoveAllergy = (allergy) => {
    dispatch(removeAllergy(allergy));
  };

  const handleAddGoal = (goal) => {
    dispatch(addGoal(goal.toLowerCase()));
  };

  const handleRemoveGoal = (goal) => {
    dispatch(removeGoal(goal));
  };

  const handleAddProductExperience = (experience) => {
    // Transform to match backend structure
    const formattedExperience = {
      product: experience.product,
      experience: experience.experience,
      reason: experience.reason || null,
    };
    dispatch(addProductExperience(formattedExperience));
  };

  const handleRemoveProductExperience = (index) => {
    dispatch(removeProductExperience(index));
  };

  const handleBudgetChange = (value) => {
    // Only allow numeric input
    if (/^\d*\.?\d*$/.test(value)) {
      dispatch(setBudget(value));
    }
  };

  const handleCustomGoalChange = (goal) => {
    dispatch(setCustomGoal(goal));
  };

  const handleSubmit = async () => {
    // Clear any previous errors
    dispatch(clearError("form"));

    // Validate form
    const invalid = validateProfile(formData);
    setValidationError(invalid);
    if (invalid) return;

    // Prepare data for submission
    const submissionData = {
      skin_type,
      skin_conditions,
      budget,
      allergies,
      product_experiences,
      goals,
      custom_goal,
    };

    try {
      const response = await submitFormAnalysis(submissionData).unwrap();
      dispatch(setSessionId(response.session_id));
      dispatch(setFormIndex(response.form_index ?? null));
      dispatch(setCurrentPhase("scan"));
      navigation.navigate("ScanFace");
    } catch {
      /* The mutation error is rendered below; keep the draft. */
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingBottom: Math.max(insets.bottom + 40, 60),
      }}
    >
      <View className="px-8 py-6">
        <TitleContainer title={"Tell us about your skin"} />
        <Notice>
          {SAMPLE_MODE
            ? "Sample mode: your profile stays on this device. Submitting starts a new sample plan."
            : "Submitting sends this profile to your configured service and starts a new plan."}
        </Notice>

        <SkinTypeList
          selectedSkinType={skin_type[0] || ""} // Pass first item or empty string
          onSkinTypeChange={handleSkinTypeChange}
        />

        {/* Budget Input */}
        <View className="my-4">
          <Text className="text-[#444] font-medium mb-2">
            What's your budget (₱)?
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="gap-3">
              <Text className="text-textSecondary">
                Monthly skincare budget
              </Text>
              <View className="flex-row items-center">
                <Text className="font-bold text-success-500 mr-1">₱</Text>
                <TextInput
                  className="border border-gray-200 bg-white rounded-lg py-1 px-3 min-w-[80px] text-right font-bold text-success-500"
                  accessibilityLabel="Budget in PHP"
                  maxLength={9}
                  style={{ minHeight: 48 }}
                  keyboardType="decimal-pad"
                  value={budget}
                  onChangeText={handleBudgetChange}
                  placeholder="800"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>
          </View>
        </View>

        <SkinInput
          title="Skin Conditions"
          placeholder="e.g., Acne, Rosacea, Hyperpigmentation"
          items={skin_conditions}
          onAddItem={handleAddSkinCondition}
          onRemoveItem={handleRemoveSkinCondition}
        />

        <SkinInput
          title="Allergies"
          placeholder="e.g., Fragrance, Alcohol, Sulfates"
          items={allergies}
          onAddItem={handleAddAllergy}
          onRemoveItem={handleRemoveAllergy}
        />

        <SkinInput
          title="Skincare Goals"
          placeholder="e.g., Clear skin, Hydration, Anti-aging"
          items={goals}
          onAddItem={handleAddGoal}
          onRemoveItem={handleRemoveGoal}
        />

        {/* Custom Goal Input */}
        <View className="my-4">
          <Text className="text-[#444] font-medium mb-2">Custom Goal</Text>
          <TextInput
            className="border border-gray-200 bg-white rounded-xl py-3 px-4"
            placeholder="Describe your main skincare goal"
            value={custom_goal}
            onChangeText={handleCustomGoalChange}
            accessibilityLabel="Custom goal"
            maxLength={500}
            multiline
          />
        </View>

        {/* Product Experiences */}
        <View className="my-4">
          <Text className="text-[#444] font-medium mb-2">
            Product Experiences
          </Text>

          {product_experiences.map((experience, index) => (
            <View
              key={index}
              className="bg-white rounded-xl p-3 mb-3 border border-gray-200"
            >
              <View className="flex-row justify-between">
                <Text className="font-bold">{experience.product}</Text>
                <Text
                  className={
                    experience.experience === "good"
                      ? "text-success-500"
                      : experience.experience === "bad"
                        ? "text-error-500"
                        : "text-primary-500"
                  }
                >
                  {experience.experience}
                </Text>
              </View>
              {experience.reason && (
                <Text className="text-textSecondary mt-1">
                  {experience.reason}
                </Text>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove experience ${experience.product}`}
                style={{ minHeight: 48, justifyContent: "center" }}
                onPress={() => handleRemoveProductExperience(index)}
              >
                <Text style={{ color: "#7423c7" }}>Remove</Text>
              </Pressable>
            </View>
          ))}

          <ProductExperienceInput
            onAddExperience={handleAddProductExperience}
          />
        </View>

        <Notice error>{validationError}</Notice>
        {/* Error Display */}
        {(formError || mutationError) && (
          <View className="bg-error-100 border border-error-300 rounded-xl p-4 mb-4">
            <Text className="text-error-700 text-center">
              {formError || mutationError?.message}
            </Text>
          </View>
        )}

        {/* Submit Button */}
        <View className="mb-5">
          <NextButton
            text={
              isLoading
                ? "Submitting..."
                : SAMPLE_MODE
                  ? "Continue sample walkthrough"
                  : "Next: Choose photo"
            }
            icon={isLoading ? "hourglass-outline" : "arrow-forward-outline"}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SkinProfileScreen;
