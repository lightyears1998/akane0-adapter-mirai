import { randomSyncId } from "./util";

export type MiraiData = Record<string, unknown>

export interface MiraiMessage
{
  code: number
  message: string
  data: MiraiData
}

export type MiraiCommandContent = Record<string, unknown>

export interface MiraiCommand {
  command: string
  subCommand?: string
  content?: MiraiCommandContent
}

/**
 * Message sent to akane0 adapter to Mirai upstream server
 */
export class WebsocketOutgoingMessage {
  syncId: string;
  command: string;
  subCommand?: string;
  content?: MiraiCommandContent;

  constructor({
    command, subCommand, content
  }: MiraiCommand) {
    this.syncId = randomSyncId(command);
    this.command = command;
    this.subCommand = subCommand;
    this.content = content;
  }
}

/**
 * Message sent from Mirai upstream to akane0 adapter
 */
export interface WebsocketIncomingMessage {
  syncId: string
  data: MiraiMessage
}

export type MiraiMessageCallback = (message: MiraiMessage) => void
