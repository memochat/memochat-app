import Toast from 'react-native-toast-message';
import {
  TestWebToNativeMessage,
  CallbackTestWebToNativeCallbackMessage,
} from './types';

class WebViewMessageReceiver {
  static instance: WebViewMessageReceiver;

  constructor() {
    if (!WebViewMessageReceiver.instance) {
      WebViewMessageReceiver.instance = this;
      return WebViewMessageReceiver.instance;
    }
    return WebViewMessageReceiver.instance;
  }

  test(message: TestWebToNativeMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
    console.log(message);
  }

  callbackTest(message: CallbackTestWebToNativeCallbackMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
  }
}

export default WebViewMessageReceiver;
