import { MiraiCommand, MiraiMessage } from "./upstream";

export interface MiraiAboutMessage extends MiraiMessage {
  data: {
    version: string
  }
}

export interface SendFriendMessageCommand extends MiraiCommand {
  command: "sendFriendMessage"
  content: {
    target: number,
    messageChain: Array<MessageChainImageItem | MessageChainTextItem>
  }
}

export interface MessageChainTextItem {
  type: "Plain"
  text: string
}

export interface MessageChainImageItem {
  type: "Image"
  url: string
}
