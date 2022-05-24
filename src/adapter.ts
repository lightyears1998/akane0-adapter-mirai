import { randomUUID } from "crypto";
import { EventEmitter } from "stream";

import debug from "debug";
import { WebSocket } from "ws";
import { AkaneAdapter } from "@lightyears1998/akane0-core";

import {
  MIRAI_ADAPTER_QQ, MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_VERIFY_KEY, MIRAI_WS_PORT, MIRAI_WS_PROTOCOL
} from "./config";
import {
  WebsocketOutgoingMessage, WebsocketIncomingMessage, MiraiMessageCallback, MiraiCommand
} from "./upstream";
import { MiraiAboutMessage } from "./upstream-data";

const debugPrint = debug("akane0-adapter-mirai");

function printDebugInfo() {
  const parameters = {
    MIRAI_HOST, MIRAI_HTTP_BASIC_AUTH, MIRAI_VERIFY_KEY
  };
  debugPrint("parameters", parameters);
}

export class AkaneAdapterMirai implements AkaneAdapter {
  id: string;
  version = "20220518";

  uri: string;
  upstream?: WebSocket;

  messageEmitter = new EventEmitter();

  constructor() {
    this.id = randomUUID();
    this.uri = `${MIRAI_WS_PROTOCOL}://${MIRAI_HOST}:${MIRAI_WS_PORT}/all`;

    printDebugInfo();
  }

  get httpHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "verifyKey": String(MIRAI_VERIFY_KEY),
      "qq": String(MIRAI_ADAPTER_QQ)
    };
    if (MIRAI_HTTP_BASIC_AUTH) {
      headers.authorization = MIRAI_HTTP_BASIC_AUTH;
    }

    return headers;
  }

  sendMessage(command: MiraiCommand, callback?: MiraiMessageCallback) {
    const message = new WebsocketOutgoingMessage(command);
    this.sendWebsocketMessage(message, callback);
  }

  sendWebsocketMessage(message: WebsocketOutgoingMessage, callback?: MiraiMessageCallback) {
    if (!this.upstream) {
      throw new Error("Websocket upstream is not initialized.");
    }

    console.log(JSON.stringify(message));

    this.upstream.send(JSON.stringify(message));
    if (callback) {
      this.messageEmitter.once(message.syncId, (message: WebsocketIncomingMessage) => {
        callback(message.data);
      });
    }
  }

  async initWebsocketUpstream() {
    await new Promise<void>((resolve) => {
      this.upstream = new WebSocket(this.uri, { headers: this.httpHeaders });

      this.upstream.on("open", () => {
        debugPrint("websocket established.");
        this.sendMessage({ command: "about" }, (message) => {
          const { data } = message as MiraiAboutMessage;
          console.log(`Remote Mirai server version: ${data.version}`);
          resolve();
        });
      });

      this.upstream.on("message", messageBuffer => {
        const message = JSON.parse(messageBuffer.toString()) as WebsocketIncomingMessage;
        const { syncId } = message;

        if (syncId) {
          this.messageEmitter.emit(syncId, message);
          return;
        }

        // If we received a message without syncId,
        // which probably is sent by upstream proactively
        // or we forget to set a syncId when sending our message.
        //
        // reference:
        // <https://docs.mirai.mamoe.net/mirai-api-http/misc/Migration2.html#syncid>
        debugPrint("receiving", message);
      });
    });
  }

  async testHttpUpstream() {
    await new Promise<void>((resolve) => {
      resolve();
    });
  }

  async start(): Promise<void> {
    debugPrint("starting.");
    await this.initWebsocketUpstream();
    debugPrint("started.");
  }

  stop(): void {
    if (this.upstream) {
      debugPrint("closing upstream connection.");
      this.upstream.close();
      delete this.upstream;
    }

    this.messageEmitter.removeAllListeners();

    debugPrint("stopped.");
  }
}
