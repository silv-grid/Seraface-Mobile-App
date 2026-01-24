export default {
  expo: {
    name: "SerafaceMobile",
    slug: "SerafaceMobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#f5d0f1",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.agersando.SerafaceMobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#f5d0f1",
      },
      edgeToEdgeEnabled: true,
      package: "com.agersando.SerafaceMobile",
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: "single",
    },
    plugins: ["expo-font"],
    extra: {
      eas: {
        projectId: "0ad10560-7096-478b-b186-536c54b4f8b8",
      },
    },
    scheme: "serafacemobile",
  },
};
