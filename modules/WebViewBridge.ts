import WebView from 'react-native-webview';

/**
 NOTE: Native Message 구조
 {
   action: string;
   data?: Record<string, unknown>;
   callbackId?: string;
 }
 */

type BackNativeMessage = {
  action: 'back';
};

export type NativeMessage = BackNativeMessage;

/**
 * webview로 메시지 보내는 브릿지
 */
class WebViewBridge {
  private static webViewRef?: WebView;

  static setWebViewRef(ref: WebView) {
    this.webViewRef = ref;
  }

  static postMessage(message: NativeMessage) {
    if (!this.webViewRef) {
      throw new Error(
        'WebView ref is not set. Use setWebViewRef() method to set webView ref.',
      );
    }

    this.webViewRef.postMessage(JSON.stringify(message));
  }

  static back() {
    this.postMessage({action: 'back'});
  }
}

export default WebViewBridge;
