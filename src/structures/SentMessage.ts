import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

import { ButtonBuilder } from './ButtonBuilder';
import { MenuBuilder } from './MenuBuilder';

interface MessageOptions {
  /**
   * Button or button array
   */
  buttons?: ButtonBuilder | ButtonBuilder[];

  /**
   * Message menu (don't add a menu if the message already contains one)
   */
  menu?: MenuBuilder;
}

interface AuthorOptions {
  /**
   * Author ID
   */
  id: string;

  /**
   * Author username
   */
  username: string;

  /**
   * Author discriminator
   */
  discriminator: string;

  /**
   * Author tag
   */
  tag: string;

  /**
   * Author avatar
   */
  avatar: string | null;

  /**
   * Is the author a bot ?
   */
  bot?: boolean;
}

/**
 * Class symbolizing a `SentMessage`
 * @class
 */
export class SentMessage {
  /**
   * The message ID
   */
  public id: string;

  /**
   * The message type
   */
  public type: string;

  /**
   * The message content
   */
  public content: string;

  /**
   * The message author
   */
  public author: AuthorOptions;

  /**
   * The message channel ID
   */
  public channelID: string;

  /**
   * The message timestamp
   */
  public timestamp: string;

  /**
   * The message components?
   */
  public components?: any;

  /**
   * The message embeds?
   */
  public embeds?: any;

  private _token: string;
  private emitter: EventEmitter;

  /**
   * Create a new SentMessage
   * @param {any} data
   * @constructor
   */
  constructor(data: any, token: string, emitter: any) {
    this._token = token;
    this.emitter = emitter;
    this.id = data.id;
    this.type = data.type;
    this.content = data.content;
    this.author = {
      username: data.author.username,
      id: data.author.id,
      discriminator: data.author.discriminator,
      avatar: data.author.avatar,
      bot: data.author.bot,
      tag: `${data.author.username}#${data.author.discriminator}`,
    };
    this.channelID = data.channel_id;
    this.timestamp = data.timestamp;
    this.components = data.components;
  }

  /**
   * Delete the sent message
   * @returns {Promise<void>}
   * @example message.delete();
   */
  async delete(): Promise<void> {
    await fetch(`https://discord.com/api/v9/channels/${this.channelID}/messages/${this.id}`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'DELETE',
    }).then((res) => {
      if (res.status !== 204) {
        this.emitter.emit('ERROR', 'DELETE_ERROR');
      }
      return;
    });
    return;
  }

  /**
   * Edit the sent message
   * @param {string|MessageEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   * @example messahe.edit('some edit');
   */
  public async edit(message: string | MessageEmbed, options?: MessageOptions): Promise<void> {
    if (!message) throw new SyntaxError('INVALID_MESSAGE');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
    };
    switch (typeof message) {
      case 'string':
        payload.content = message;
        break;
      default:
        try {
          payload.embeds = [message.toJSON()];
        } catch (err) {
          throw new Error('INVALID_MESSAGE ' + err);
        }
        break;
    }
    if (options?.buttons && options.menu) throw new SyntaxError('BUTTON_AND_MENU_PROVIDED');
    if (options?.buttons) {
      payload.components = [
        {
          type: 1,
          components: Array.isArray(options.buttons)
            ? options.buttons.map((btn) => btn.getJSON())
            : [options.buttons.getJSON()],
        },
      ];
    }
    if (options?.menu) {
      payload.components = [
        {
          type: 1,
          components: [options.menu.getJSON()],
        },
      ];
    }
    await fetch(`https://discord.com/api/v9/channels/${this.channelID}/messages/${this.id}`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status !== 200) {
        this.emitter.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }
}
