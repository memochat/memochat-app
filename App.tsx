/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Dimensions,
  StatusBar,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';

const screen = Dimensions.get('screen');

/**
 * @todo .env 파일 추가
 * dev인 경우 localhost, production인 경우 호스팅된 url로 변경 */
const BASE_WEBVIEW_URL = 'http://localhost:3000/home';

const MESSAGES = {
  NAVIGATION_STATE_CHANGE: 'navigationStateChange',
};

const App = () => {
  const webViewRef = useRef<WebView>(null);
  const [navState, setNavState] = useState<WebViewNavigation>();

  useEffect(() => {
    const backAction = (): boolean => {
      if (navState?.canGoBack) {
        webViewRef.current?.goBack();
        // 시스템 기본 뒤로가기 미동작
        return true;
      }

      // 시스템 기본 뒤로가기 동작 실행
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [navState?.canGoBack]);

  /**
   * history api인 경우 : postMessage('navigationStateChange')
   * pushState(), replaceState()도 놓치지 않고 안드로이드 백버튼으로 제어 가능 */
  const HANDLE_HISTORY_API_INJECTED_CODE = `
      (function() {
        function wrap(fn) {
          return function wrapper() {
            var res = fn.apply(this, arguments);
            window.ReactNativeWebView.postMessage('${MESSAGES.NAVIGATION_STATE_CHANGE}');
            return res;
          }
        }
    
        history.pushState = wrap(history.pushState);
        history.replaceState = wrap(history.replaceState);
        window.addEventListener('popstate', function() {
          window.ReactNativeWebView.postMessage('${MESSAGES.NAVIGATION_STATE_CHANGE}');
        });
      })();
    
      true;
    `;

  const handleLoadStart = () => {
    webViewRef.current?.injectJavaScript(HANDLE_HISTORY_API_INJECTED_CODE);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const {nativeEvent} = event;

    /** history api로 변경되는 stack 반영 */
    if (nativeEvent.data === MESSAGES.NAVIGATION_STATE_CHANGE) {
      setNavState(nativeEvent as unknown as WebViewNavigation);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WebView
        ref={webViewRef}
        source={{uri: BASE_WEBVIEW_URL}}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onNavigationStateChange={setNavState}
        onMessage={handleMessage}
      />
    </SafeAreaView>
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
