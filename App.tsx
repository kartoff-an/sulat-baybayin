import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import i18n from "./src/i18n/config";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import AlphabetTableScreen from "./src/screens/AlphabetTableScreen";
import BaybayinToLatinScreen from "./src/screens/BaybayinToLatinScreen";
import LatinToBaybayinScreen from "./src/screens/LatinToBaybayinScreen";
import LearnScreen from "./src/screens/LearnScreen";
import PracticeWritingScreen from "./src/screens/PracticeWritingScreen";
import TransliterateScreen from "./src/screens/TransliterateScreen";
import { loadSounds, unloadSounds } from "./src/utils/sound";
import { initializeRecognizer } from "./src/utils/ndollar-recognition/ndollar-recognizer";
import { alphabetCharacters } from "./src/data/alphabetData";

import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";

type RootStackParamList = {
  Learn: undefined;
  AlphabetTable: undefined;
  PracticeWriting: undefined;
  BaybayinToLatin: undefined;
  LatinToBaybayin: undefined;
  Transliterate: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
    <StatusBar style="auto" />
  </View>
);

const AppContent: React.FC = () => {
  const { i18n: i18nInstance } = useTranslation();

  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (i18nInstance.isInitialized) {
      setIsReady(true);
      return;
    }

    const handleInitialized = () => {
      setIsReady(true);
    };

    i18nInstance.on("initialized", handleInitialized);

    return () => {
      i18nInstance.off("initialized", handleInitialized);
    };
  }, [i18nInstance]);

  useEffect(() => {
    loadSounds();
    initializeRecognizer(alphabetCharacters);

    return () => {
      unloadSounds();
    };
  }, []);

  if (!isReady || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaView
            style={styles.container}
            edges={["top", "left", "right"]}
          >
            <StatusBar style="auto" />

            <Stack.Navigator
              initialRouteName="Learn"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                },
                headerTintColor: "#3B82F6",
                headerShadowVisible: false,
                contentStyle: {
                  backgroundColor: "#F9FAFB",
                },
              }}
            >
              <Stack.Screen
                name="Learn"
                component={LearnScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="AlphabetTable"
                component={AlphabetTableScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="BaybayinToLatin"
                component={BaybayinToLatinScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="LatinToBaybayin"
                component={LatinToBaybayinScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="PracticeWriting"
                component={PracticeWritingScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Transliterate"
                component={TransliterateScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </GestureHandlerRootView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
});
