import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import { Client, MessageEmbed, Message } from 'discord.js';

import { Menu } from './Menu';
import { ButtonBuilder } from './ButtonBuilder';
import { MenuBuilder } from './MenuBuilder';
import { Button } from './Button';

type Errors = 'POST_ERROR' | 'DELETE_ERROR';

type Warns = 'NO_MENU_PROVIDED' | 'NO_BUTTON_PROVIDED';

interface DiscordMenusEvents {
  MENU_CLICKED: [menu: Menu];
  ERROR: [error: Errors];
  WARN: [warn: Warns];
  BUTTON_CLICKED: [button: Button];
}

export declare interface DiscordMenus extends EventEmitter {
  on<K extends keyof DiscordMenusEvents>(
    event: K,
    listener: (...args: DiscordMenusEvents[K]) => void | Promise<void>,
  ): this;
}

interface SendOptionsMenu {
  /**
   * The menu **(only one)**
   */
  menu?: MenuBuilder;
}

interface SendOptionsButton {
  /**
   * The button or button array
   */
  buttons?: ButtonBuilder | ButtonBuilder[];
}

/**
 * Class symbolizing a `DiscordMenus`
 * @class
 * @extends {EventEmitter}
 */
export class DiscordMenus extends EventEmitter {
  /**
   * Discord.JS client
   * @type {Client}
   */
  public client: any;

  /**
   * Create a new DiscordMenus
   * @param {Client} client
   * @constructor
   */
  constructor(client: Client) {
    super();
    if (!client) throw new SyntaxError('INVALID_DISCORD_CLIENT');
    this.client = client;
    this._awaitEvents();
  }

  /**
   * Send the menu
   * @param {Message} message
   * @param {string|MessageEmbed} content
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async sendMenu(message: Message, content: string | MessageEmbed, options?: SendOptionsMenu): Promise<void> {
    if (!content) throw new SyntaxError('INVALID_MESSAGE');
    const payload = {
      content: '' as any,
      embeds: [] as any,
      components: [] as any,
    };
    switch (typeof content) {
      case 'string':
        payload.content = content;
        break;
      default:
        try {
          payload.embeds = [content.toJSON()];
        } catch (err) {
          throw new Error('INVALID_CONTENT ' + err);
        }
        break;
    }
    if (options?.menu) {
      payload.components = [
        {
          type: 1,
          components: [options.menu.getJSON()],
        },
      ];
    } else {
      this.emit('WARN', 'NO_MENU_PROVIDED');
    }
    await fetch(`https://discord.com/api/v9/channels/${message.channel.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bot ' + this.client.token,
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status !== 200) {
        this.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }

  /**
   * Send the menu
   * @param {Message} message
   * @param {string|MessageEmbed} content
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async sendButton(
    message: Message,
    content: string | MessageEmbed,
    options?: SendOptionsButton,
  ): Promise<void> {
    if (!content) throw new SyntaxError('INVALID_MESSAGE');
    const payload = {
      content: '' as any,
      embeds: [] as any,
      components: [] as any,
    };
    switch (typeof content) {
      case 'string':
        payload.content = content;
        break;
      default:
        try {
          payload.embeds = [content.toJSON()];
        } catch (err) {
          throw new Error('INVALID_CONTENT ' + err);
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
    } else {
      this.emit('WARN', 'NO_BUTTON_PROVIDED');
    }
    await fetch(`https://discord.com/api/v9/channels/${message.channel.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bot ' + this.client.token,
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      if (res.status !== 200) {
        this.emit('ERROR', 'POST_ERROR');
      }
      return;
    });
    return;
  }

  private async _awaitEvents(): Promise<void> {
    this.client.ws.on('INTERACTION_CREATE', (interaction: any) => {
      if (interaction.data.component_type === 3) {
        this.emit('MENU_CLICKED', new Menu(interaction, this.client.token, this));
      } else if (interaction.data.component_type === 2) {
        this.emit('BUTTON_CLICKED', new Button(interaction, this.client.token, this));
      }
    });
  }
}
