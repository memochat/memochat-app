import { useRef } from "react";
import { Platform, StyleSheet, Linking } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";
import { OnShouldStartLoadWithRequest } from "react-native-webview/lib/WebViewTypes";

import useHardwareBackPressEvent from "@src/hooks/useHardwareBackPressEvent";
import useWebViewMessageHandler from "@src/hooks/useWebViewMessageHandler";

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

  useHardwareBackPressEvent(webViewRef.current);

  const { onMessage } = useWebViewMessageHandler(webViewRef.current, {
    onTest: (message, receiver) => {
      receiver.test(message);
    },
    onCallbackTest: (message, receiver, sender) => {
      receiver.callbackTest(message);
      setTimeout(() => {
        sender.callbackTestCallback({
          callbackId: message.callbackId,
        });
      }, 1000);
    },
    onUploadImage: async (message, receiver, sender) => {
      const formData = await receiver.uploadImage(message);
      sender.uploadImageCallback({
        formData,
        callbackId: message.callbackId,
      });
    },
  });

  const handleOpenExternalURL = (url: string) => {
    if (!url.includes(BASE_WEBVIEW_URL)) {
      // 새 탭 열기
      Linking.openURL(url);
      return false;
    }
    return true;
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: BASE_WEBVIEW_URL }}
      originWhitelist={["*"]}
      scrollEnabled={false}
      cacheEnabled={false}
      style={styles.webview}
      onMessage={onMessage}
      injectedJavaScript={"console.log(window.MemochatWebview)"}
      onNavigationStateChange={({ url }) => handleOpenExternalURL(url)}
      onShouldStartLoadWithRequest={({ url }) => handleOpenExternalURL(url)}
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
