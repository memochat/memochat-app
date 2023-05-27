import { useEffect, useRef } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import WebViewMessageSender from "../modules/WebViewMessageSender";
import {
  WebToNativeCallbackMessage,
  WebToNativeMessage,
} from "../modules/types";
import WebViewMessageReceiver from "../modules/WebViewMessageReceiver";

/**
 * TODO: .env 파일 추가
 * dev인 경우 localhost, production인 경우 호스팅된 url로 변경 */
const BASE_WEBVIEW_URL = `http://${
  Platform.OS === "android" ? "10.0.2.2" : "localhost"
}:3000`;
// const BASE_WEBVIEW_URL = "https://memochat-client.vercel.app"; // process.env.APP_URL || "http://localhost:3000";

const MemochatWebView = () => {
  console.log(process.env.APP_URL);

  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const backAction = (): boolean => {
      const bridge = new WebViewMessageSender(webViewRef.current);

      bridge.back();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const { nativeEvent } = event;
    const message = JSON.parse(nativeEvent.data) as
      | WebToNativeMessage
      | WebToNativeCallbackMessage;

    const webViewMessageReceiver = new WebViewMessageReceiver();
    const webViewMessageSender = new WebViewMessageSender(webViewRef.current);

    switch (message.action) {
      case "test": {
        webViewMessageReceiver.test(message);
        return;
      }
      case "callback-test": {
        webViewMessageReceiver.callbackTest(message);
        setTimeout(() => {
          webViewMessageSender.callbackTestCallback({
            callbackId: message.callbackId,
          });
        }, 1000);
        return;
      }
      case "upload-image": {
        const formData = await webViewMessageReceiver.uploadImage(message);
        webViewMessageSender.uploadImageCallback({
          formData,
          callbackId: message.callbackId,
        });
        return;
      }
      default: {
        console.log(message);
      }
    }
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: BASE_WEBVIEW_URL }}
      originWhitelist={["*"]}
      scrollEnabled={false}
      cacheEnabled={false}
      style={styles.webview}
      onMessage={handleMessage}
      injectedJavaScript={"console.log(window.MemochatWebview)"}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "inherit",
  },
});

export default MemochatWebView;
