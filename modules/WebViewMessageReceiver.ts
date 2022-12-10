import Toast from 'react-native-toast-message';

import {openCamera, openGallery, parseFormData} from '../src/utils/imagePicker';

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

type UploadImageWebViewMessage = {
  action: 'uploadImage';
  data: {
    type: 'camera' | 'gallery';
  };
};

export type WebViewMessage = TestWebViewMessage | UploadImageWebViewMessage;

class WebViewMessageReceiver {
  static execute(message: WebViewMessage) {
    switch (message.action) {
      case 'test':
        this.test(message);
        return;
      case 'uploadImage':
        this.uploadImage(message);
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
  }

  // TODO : 이미지 업로드, 업로드 결과로 얻은 url webview로 전송
  static async uploadImage(message: UploadImageWebViewMessage) {
    try {
      switch (message.data.type) {
        case 'camera': {
          const asset = await openCamera();
          if (!asset) {
            return;
          }
          const formData = parseFormData(asset);
          console.log(formData);
          return;
        }
        case 'gallery': {
          const asset = await openGallery();
          if (!asset) {
            return;
          }
          const formData = parseFormData(asset);
          console.log(formData);
          return;
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
}

export default WebViewMessageReceiver;
