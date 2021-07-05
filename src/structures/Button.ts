import fetch from 'node-fetch';
import { EventEmitter } from 'events';
import { MessageEmbed } from 'discord.js';

import { Message } from './Message';
import { ButtonBuilder } from './ButtonBuilder';

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

interface MessageOptions {
  /**
   * Button or button array
   */
  buttons: ButtonBuilder | ButtonBuilder[];
}

/**
 * Class symbolizing a `Button`
 * @class
 */
export class Button {
  /**
   * The guild ID
   */
  public guildID: string;

  /**
   * The button ID
   */
  public id: string;

  /**
   * Thz button custom ID
   */
  public customID: string;

  /**
   * The button token
   */
  public token: string;

  /**
   * The application ID
   */
  public applicationID: string;

  /**
   * The message
   */
  public message: Message;

  /**
   * The member
   */
  public member: MemberOptions;

  /**
   * The channel ID
   */
  public channelID: string;

  private _token: string;
  private emitter: EventEmitter;

  /**
   * Create a new Button
   * @param {any} data
   * @param {string} token
   * @param {any} emitter
   */
  constructor(data: any, token: string, emitter: any) {
    console.log(data);
    this._token = token;
    this.emitter = emitter;
    this.message = new Message(data.message, this._token, this);
    this.guildID = data.guild_id;
    this.id = data.id;
    this.customID = data.data.custom_id;
    this.token = data.token;
    this.applicationID = data.application_id;
    this.channelID = data.channel_id;
    this.member = {
      username: data.member.user.username,
      id: data.member.user.id,
      discriminator: data.member.user.discriminator,
      avatar: data.member.user.avatar,
      tag: `${data.member.user.username}#${data.member.user.discriminator}`,
    };
  }

  /**
   * Reply to the interaction
   * @param {string|MessageEmbed} message
   * @param {MessageOptions} options
   * @returns {Promise<void>}
   */
  public async reply(message: string | MessageEmbed, options?: MessageOptions): Promise<void> {
    if (!message) throw new SyntaxError('INVALID_MESSAGE');
    const payload = {
      content: '' as any,
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
   * @param {string|number|DiscordEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
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
   * @returns {Promise<void>}
   */
  public async think(): Promise<void> {
    await fetch(`https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`, {
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bot ' + this._token,
      },
      method: 'POST',
      body: JSON.stringify({
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
