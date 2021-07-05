import fetch from 'node-fetch';
import { EventEmitter } from 'events';

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
  avatar: string;

  /**
   * Is the author a bot ?
   */
  bot: boolean;
}

/**
 * Class symbolizing a `Message`
 * @class
 */
export class Message {
  /**
   * The message ID
   */
  public id: string;

  /**
   * The message type
   */
  public type: number;

  /**
   * The messahe timestamp
   */
  public timestamp: string;

  /**
   * The message mentions
   */
  public mentions: string[];

  /**
   * The message embed
   */
  public embeds!: any;

  /**
   * The message content
   */
  public content: string;

  /**
   * Message components
   */
  public components: object | any;

  /**
   * The message channel ID
   */
  public channelID: string;

  /**
   * The message author
   */
  public author: AuthorOptions;

  private _token: string;
  private emitter: EventEmitter;

  /**
   * Create a new Message
   * @param {any} data
   * @param {string} token
   * @constructor
   */
  constructor(data: any, token: string, emitter: any) {
    this.emitter = emitter;
    this._token = token;
    this.id = data.id;
    this.type = data.type;
    this.timestamp = data.timestamp;
    this.mentions = data.mentions;
    this.embeds = data.embeds || undefined;
    this.content = data.content;
    this.components = data.components;
    this.channelID = data.channel_id;
    this.author = {
      username: data.author.username,
      discriminator: data.author.discriminator,
      avatar: data.author.avatar,
      id: data.author.id,
      bot: data.author.bot,
      tag: `${data.author.username}#${data.author.discriminator}`,
    };
  }

  /**
   * Delete the message
   * @returns {Promise<void>}
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
}
