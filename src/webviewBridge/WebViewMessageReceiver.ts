import Toast from "react-native-toast-message";
import { openCamera, openGallery, parseFormData } from "../utils/imagePicker";
import {
  TestWebToNativeMessage,
  CallbackTestWebToNativeCallbackMessage,
  UploadImageWebToNativeCallbackMessage,
} from "./types";

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
      type: "info", //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
    console.log(message);
  }

  callbackTest(message: CallbackTestWebToNativeCallbackMessage) {
    Toast.show({
      type: "info", //success, error, info
      text1: message.action,
      text2: JSON.stringify(message),
    });
  }

  async uploadImage(
    message: UploadImageWebToNativeCallbackMessage
  ): Promise<FormData | undefined> {
    try {
      switch (message.args.type) {
        case "camera": {
          const asset = await openCamera();
          if (!asset) {
            return;
          }
          const formData = parseFormData(asset);
          return formData;
        }
        case "gallery": {
          const asset = await openGallery();
          if (!asset) {
            return;
          }
          const formData = parseFormData(asset);
          return formData;
        }
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
}

export default WebViewMessageReceiver;
