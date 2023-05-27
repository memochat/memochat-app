import { useEffect } from "react";
import { BackHandler } from "react-native";
import WebView from "react-native-webview";

import WebViewMessageSender from "@src/webviewBridge/WebViewMessageSender";

const useHardwareBackPressEvent = (webView: WebView | null) => {
  useEffect(() => {
    const backAction = (): boolean => {
      const bridge = new WebViewMessageSender(webView);
      bridge.back();

      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);
};

export default useHardwareBackPressEvent;
