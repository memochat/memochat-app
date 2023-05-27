/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { StyleSheet, Platform } from "react-native";
import Toast from "react-native-toast-message";

import { KeyboardAvoidingView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MemochatWebView from "./src/components/MemochatWebView";

const App = () => {
  return (
    <>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="height"
          enabled
        >
          <MemochatWebView />
        </KeyboardAvoidingView>
      ) : (
        <SafeAreaProvider style={{ backgroundColor: "#fff" }}>
          <SafeAreaView style={styles.container}>
            <MemochatWebView />
          </SafeAreaView>
        </SafeAreaProvider>
      )}
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
