export default {
  expo: {
    name: "SerafaceMobile",
    slug: "SerafaceMobile",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.agersando.SerafaceMobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#f5d0f1",
      },
      package: "com.agersando.SerafaceMobile",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: "single",
    },
    plugins: [
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: "./assets/splash-icon.png",
          imageWidth: 180,
          backgroundColor: "#f5d0f1",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Choose a photo to send to your configured skin analysis service.",
          cameraPermission: false,
          microphonePermission: false,
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "0ad10560-7096-478b-b186-536c54b4f8b8",
      },
    },
    scheme: "serafacemobile",
  },
};
