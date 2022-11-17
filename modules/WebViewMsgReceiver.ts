import Toast from 'react-native-toast-message';

export interface MemochatWebViewMessage {
  action: 'test'; //TODO: union으로 정의
  data?: Record<string, unknown>;
  callbackId?: string;
}

class WebViewMsgReceiver {
  static instance: WebViewMsgReceiver;

  constructor() {
    if (!WebViewMsgReceiver.instance) {
      WebViewMsgReceiver.instance = this;
      return WebViewMsgReceiver.instance;
    }
    return WebViewMsgReceiver.instance;
  }

  test(msg: MemochatWebViewMessage) {
    Toast.show({
      type: 'info', //success, error, info
      text1: msg.action,
      text2: JSON.stringify(msg),
    });
    console.log(msg);
  }
}

export default WebViewMsgReceiver;
