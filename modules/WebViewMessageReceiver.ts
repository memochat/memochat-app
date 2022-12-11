import Toast from 'react-native-toast-message';

export interface MemochatWebViewMessage {
  action: 'test' | 'callback-test'; //TODO: union으로 정의
  args?: Record<string, unknown>;
  callbackId?: string;
}

class WebViewMessageReceiver {
  static instance: WebViewMessageReceiver;

  constructor() {
    if (!WebViewMessageReceiver.instance) {
      WebViewMessageReceiver.instance = this;
      return WebViewMessageReceiver.instance;
    }
    return WebViewMessageReceiver.instance;
  }

  test(message: MemochatWebViewMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
    console.log(message);
  }

  callbackTest(message: MemochatWebViewMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
  }
}

export default WebViewMessageReceiver;
