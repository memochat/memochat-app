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
  BackHandler,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

import WebViewBridge from './modules/WebViewBridge';
import WebViewMessageReceiver, {
  MemochatWebViewMessage,
} from './modules/WebViewMessageReceiver';

const screen = Dimensions.get('screen');

/**
 * @todo .env 파일 추가
 * dev인 경우 localhost, production인 경우 호스팅된 url로 변경 */
const BASE_WEBVIEW_URL = `http://${
  Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
}:3000`;

const App = () => {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const backAction = (): boolean => {
      const bridge = new WebViewBridge(webViewRef.current);

      bridge.back();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const handleMessage = (event: WebViewMessageEvent) => {
    const {nativeEvent} = event;
    const message = JSON.parse(nativeEvent.data) as MemochatWebViewMessage;

    const webViewMessageReceiver = new WebViewMessageReceiver();

    switch (message.action) {
      case 'test': {
        webViewMessageReceiver.test(message);
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
