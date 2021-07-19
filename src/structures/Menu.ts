import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
import { EventEmitter } from 'events';

import { ButtonBuilder } from './ButtonBuilder';
import { Message } from './Message';

interface MessageOptions {
  /**
   * Button or button array
   */
  buttons?: ButtonBuilder | ButtonBuilder[];

  /**
   * Ephemeral?
   */
  ephemeral?: boolean;
}

interface MemberOptions {
  /**
   * Member ID
   */
  id: string;

  /**
   * Member username
   */
  username: string;

  /**
   * Member discriminator
   */
  discriminator: string;

  /**
   * Member tag
   */
  tag: string;

  /**
   * Member avatar
   */
  avatar: string;
}

/**
 * Class symbolizing a `Menu`
 * @class
 */
export class Menu {
  /**
   * The menu channel ID
   */
  public channelID: string;
  /**
   * The menu ID
   */
  public id: string;

  /**
   * The menu guild ID
   */
  public guildID: string;

  /**
   * The menu application ID
   */
  public applicationID: string;

  /**
   * The menu custom ID
   */
  public customID: string;

  /**
   * The menu selected values
   */
  public values: string[];

  /**
   * The interaction token
   */
  public token: string;

  /**
   * The interaction member
   */
  public member: MemberOptions;

  /**
   * The interaction message
   */
  public message: Message;

  private _token: string;
  private emitter: EventEmitter;

  /**
   * Create a new Menu
   * @param {any} data
   * @param {string} token
   * @param {any} emitter
   * @constructor
   */
  constructor(data: any, token: string, emitter: any) {
    this.emitter = emitter;
    if (!data) throw new Error('INVALID_MENU_DATA');
    this.channelID = data.channel_id;
    this.id = data.id;
    this.guildID = data.guild_id;
    this.applicationID = data.application_id;
    this.customID = data.data.custom_id;
    this.values = data.data.values;
    this.token = data.token;
    this.member = {
      avatar: data.member.user.avatar,
      id: data.member.user.id,
      username: data.member.user.username,
      discriminator: data.member.user.discriminator,
      tag: `${data.member.user.username}#${data.member.user.discriminator}`,
    };
    this._token = token;
    this.message = new Message(data.message, this._token, this);
  }

  /**
   * Reply to the interaction
   * @param {string|MessageEmbed} message
   * @param {MessageOptions} options
   * @returns {Promise<void>}
   * @example menu.reply('some reply');
   */
  public async reply(message: string | MessageEmbed, options?: MessageOptions): Promise<void> {
    if (!message) throw new SyntaxError('INVALID_MESSAGE');
    const payload = {
      content: '' as any,
      embeds: [] as any,
      components: [] as any,
      flags: options?.ephemeral ? 64 : null,
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
    await fetch(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'POST',
      body: JSON.stringify({
        type: 4,
        data: payload,
      }),
    }).then((res) => {
      if (res.status !== 200) {
        this.emitter.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }

  /**
   * Edit the message button
   * @param {string|MessageEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   * @example menu.edit('some edit');
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
    await fetch(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'POST',
      body: JSON.stringify({
        type: 7,
        data: payload,
      }),
    }).then((res) => {
      if (res.status !== 200) {
        this.emitter.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }

  /**
   * Thinking reply
   * @param {boolean} ephemeral
   * @returns {Promise<void>}
   * @example menu.think();
   */
  public async think(ephemeral?: boolean): Promise<void> {
    await fetch(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'POST',
      body: JSON.stringify({
        data: {
          flags: ephemeral ? 64 : null,
        },
        type: 5,
      }),
    }).then((res) => {
      if (res.status !== 200) {
        this.emitter.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }

  /**
   * Defer the interaction
   * @returns {Promise<void>}
   * @example menu.defer();
   */
  public async defer(): Promise<void> {
    await fetch(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'POST',
      body: JSON.stringify({
        type: 6,
      }),
    }).then((res) => {
      if (res.status !== 200) {
        this.emitter.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }
}
