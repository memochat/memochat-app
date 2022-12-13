import WebView from 'react-native-webview';
import {
  MemochatNativeToWebCallbackResponseMessage,
  MemochatNativeToWebMessage,
  MemochatWebToNativeMessage,
} from './types';

/**
 * webview로 메시지 보내는 브릿지
 */
class WebViewMessageSender {
  static instance: WebViewMessageSender;
  static webViewRef: WebView;

  constructor(webViewRef?: WebView | null) {
    if (!WebViewMessageSender.instance) {
      if (!webViewRef) {
        throw new Error('WebView ref is not set');
      }
      WebViewMessageSender.webViewRef = webViewRef;
      WebViewMessageSender.instance = this;
      return WebViewMessageSender.instance;
    }
    return WebViewMessageSender.instance;
  }

  private buildNativeToWebCallbackMessage(
    params: MemochatNativeToWebCallbackResponseMessage,
  ) {
    const message = `window.MemochatWebview.postNativeToWebCallbackMessage(${JSON.stringify(
      params,
    )})`;
    return message;
  }

  private buildNativeToWebMessage(params: MemochatNativeToWebMessage) {
    /*
      action: MemochatNativeToWebActions;
      data?: Record<string, unknown>;
      callbackId?: string;
    */
    const message = `window.MemochatWebview.postNativeToWebMessage(${JSON.stringify(
      params,
    )})`;
    return message;
  }

  back() {
    const message = this.buildNativeToWebMessage({action: 'back'});
    WebViewMessageSender.webViewRef.injectJavaScript(message);
  }

  callbackTest(params: MemochatWebToNativeMessage) {
    const message = this.buildNativeToWebCallbackMessage({
      action: params.action,
      data: {
        message: 'hello',
      },
      callbackId: params.callbackId,
    });
    WebViewMessageSender.webViewRef.injectJavaScript(message);
  }
}

export default WebViewMessageSender;
