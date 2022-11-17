import WebView from 'react-native-webview';

export interface MemochatNativeMessage {
  action: 'back';
  data?: Record<string, unknown>;
  callbackId?: string;
}

/**
 * webview로 메시지 보내는 브릿지
 */
class WebViewBridge {
  static instance: WebViewBridge;
  static webViewRef: WebView;

  constructor(webViewRef?: WebView) {
    if (!WebViewBridge.instance) {
      if (!webViewRef) {
        throw new Error('WebView ref is not set');
      }
      WebViewBridge.webViewRef = webViewRef;
      WebViewBridge.instance = this;
      return WebViewBridge.instance;
    }
    return WebViewBridge.instance;
  }

  back() {
    const msg: MemochatNativeMessage = {
      action: 'back',
    };
    WebViewBridge.webViewRef.postMessage(JSON.stringify(msg));
  }
}

export default WebViewBridge;
