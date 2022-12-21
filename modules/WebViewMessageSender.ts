import WebView from 'react-native-webview';
import {NativeToWebCallbackMessage, NativeToWebMessage} from './types';

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

  private postNativeToWebCallbackMessage(message: NativeToWebCallbackMessage) {
    WebViewMessageSender.webViewRef.injectJavaScript(
      `window.MemochatWebview.postNativeToWebCallbackMessage(${JSON.stringify(
        message,
      )})`,
    );
  }

  private postNativeToWebMessage(message: NativeToWebMessage) {
    /*
      action: MemochatNativeToWebActions;
      data?: Record<string, unknown>;
      callbackId?: string;
    */
    WebViewMessageSender.webViewRef.injectJavaScript(
      `window.MemochatWebview.postNativeToWebMessage(${JSON.stringify(
        message,
      )})`,
    );
  }

  back() {
    this.postNativeToWebMessage({action: 'back'});
  }

  callbackTest({callbackId}: {callbackId: string}) {
    this.postNativeToWebCallbackMessage({
      action: 'callback-test',
      data: {
        message: 'hello',
      },
      callbackId,
    });
  }
}

export default WebViewMessageSender;
