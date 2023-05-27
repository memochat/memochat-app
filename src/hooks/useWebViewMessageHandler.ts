import { useCallback } from "react";
import WebView, { WebViewMessageEvent } from "react-native-webview";

import { WebToNativeCallbackMessage } from "@src/webviewBridge/types";
import { WebToNativeMessage } from "@src/webviewBridge/types";
import WebViewMessageReceiver from "@src/webviewBridge/WebViewMessageReceiver";
import WebViewMessageSender from "@src/webviewBridge/WebViewMessageSender";
import { kebabToPascal } from "@src/utils/caseConverter";

type WebViewMessage = WebToNativeMessage | WebToNativeCallbackMessage;

type GetWebViewMessage<Action extends WebViewMessage["action"]> = Extract<
  WebViewMessage,
  { action: Action }
>;

type ActionHandler<Action extends WebViewMessage["action"]> = (
  message: GetWebViewMessage<Action>,
  receiver: WebViewMessageReceiver,
  sender: WebViewMessageSender
) => void;

type ActionHandlers = {
  onTest: ActionHandler<"test">;
  onCallbackTest: ActionHandler<"callback-test">;
  onUploadImage: ActionHandler<"upload-image">;
};

const useWebViewMessageHandler = (
  webView: WebView | null,
  actionHandlers: ActionHandlers
) => {
  const onMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      const { nativeEvent } = event;
      const message = JSON.parse(nativeEvent.data) as WebViewMessage;
      const receiver = new WebViewMessageReceiver();
      const sender = new WebViewMessageSender(webView);

      const actionHandler =
        actionHandlers[
          `on${kebabToPascal(message.action)}` as keyof ActionHandlers
        ];

      if (!actionHandler) {
        console.log(message);
        return;
      }

      (actionHandler as ActionHandler<typeof message.action>)(
        message,
        receiver,
        sender
      );
    },
    [webView, actionHandlers]
  );

  return { onMessage };
};

export default useWebViewMessageHandler;
