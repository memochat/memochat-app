/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import {
  BackHandler,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

import WebViewMessageSender from './modules/WebViewMessageSender';
import WebViewMessageReceiver from './modules/WebViewMessageReceiver';
import {WebToNativeCallbackMessage, WebToNativeMessage} from './modules/types';

const screen = Dimensions.get('screen');

/**
 * @todo .env 파일 추가
 * dev인 경우 localhost, production인 경우 호스팅된 url로 변경 */
const BASE_WEBVIEW_URL = `http://${
  Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
}:3000`;

// const BASE_WEBVIEW_URL = 'http://192.168.31.35:3000/test';

const App = () => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const backAction = (): boolean => {
      const bridge = new WebViewMessageSender(webViewRef.current);

      bridge.back();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const handleMessage = async (event: WebViewMessageEvent) => {
    const {nativeEvent} = event;
    const message = JSON.parse(nativeEvent.data) as
      | WebToNativeMessage
      | WebToNativeCallbackMessage;

    const webViewMessageReceiver = new WebViewMessageReceiver();
    const webViewMessageSender = new WebViewMessageSender(webViewRef.current);

    switch (message.action) {
      case 'test': {
        webViewMessageReceiver.test(message);
        return;
      }
      case 'callback-test': {
        webViewMessageReceiver.callbackTest(message);
        setTimeout(() => {
          webViewMessageSender.callbackTestCallback({
            callbackId: message.callbackId,
          });
        }, 1000);
        return;
      }
      case 'upload-image': {
        const formData = await webViewMessageReceiver.uploadImage(message);
        webViewMessageSender.uploadImageCallback({
          formData,
          callbackId: message.callbackId,
        });
        return;
      }
      default: {
        console.log(message);
      }
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <WebView
          ref={webViewRef}
          source={{uri: BASE_WEBVIEW_URL}}
          style={styles.webview}
          onMessage={handleMessage}
          injectedJavaScript={'console.log(window.MemochatWebview)'}
        />
      </SafeAreaView>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    height: screen.height,
  },
});

export default App;