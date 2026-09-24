module.exports = {
  expo: {
    name: "udrive-mobile",
    slug: "udrive-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "udrive-mobile",
    userInterfaceStyle: "automatic",
    // newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.bahram101.udrive",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.udrive.mobile",
      // In EAS builds this comes from the GOOGLE_SERVICES_JSON file
      // environment variable, so the real credentials never touch git.
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      // edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: "AIzaSyBN5xBbrz168tz2hiSCYwPNtoLd4mnZ0Gw",
        },
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
      ],
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-secure-store",
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "uDrive использует ваше местоположение, чтобы водитель мог вас найти.",
        },
      ],
      "expo-font",
      "expo-image",
      "expo-status-bar",
      "expo-web-browser",
      "expo-notifications",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "6280ab0f-7914-45ae-ad29-4afbc7ca9048",
      },
    },
    owner: "udrive-team",
  },
};
