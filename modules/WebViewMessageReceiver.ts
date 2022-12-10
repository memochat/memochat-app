import Toast from 'react-native-toast-message';

/**
 NOTE: WebView Message 구조
 {
   action: string;
   data?: Record<string, unknown>;
   callbackId?: string;
 }
 */

type TestWebViewMessage = {
  action: 'test';
};

export type WebViewMessage = TestWebViewMessage | UploadImageWebViewMessage;

class WebViewMessageReceiver {
  static execute(message: WebViewMessage) {
    switch (message.action) {
      case 'test':
        this.test(message);
        return;

      default:
        console.log(message);
    }
  }

  static test(message: TestWebViewMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
    console.log(message);
  }
}

export default WebViewMessageReceiver;
