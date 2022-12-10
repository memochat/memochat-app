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

import WebViewBridge from './modules/WebViewBridge';
import WebViewMessageReceiver, {
  WebViewMessage,
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
    if (!webViewRef.current) {
      return;
    }

    WebViewBridge.setWebViewRef(webViewRef.current);

    const handleHardwareBackPress = (): boolean => {
      WebViewBridge.back();
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleHardwareBackPress,
      );
    };
  }, []);

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data) as WebViewMessage;

    WebViewMessageReceiver.execute(message);
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
