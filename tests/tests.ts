import { DiscordMenus, ButtonBuilder, MenuBuilder } from '../src/index';
import { Client, MessageEmbed, MessageFlags } from 'discord.js';

const client = new Client();
const MenusManager = new DiscordMenus(client);

client.on('ready', () => {
    console.log('Ready!');
})

const myCoolMenu = new MenuBuilder()
    .addLabel('Value 1', { description: 'This the value 1 description', value: 'value-1' })
    .addLabel('Value 2', { description: 'This is the value 2 description', value: 'value-2' })
    .addLabel('Value 3', {
        description: 'This is the value 3 description (with an emoji)', value: 'value-3', emoji: {
            name: '🌌'
        }
    })
    .setMaxValues(3)
    .setMinValues(1)
    .setCustomID('cool-custom-id')
    .setPlaceHolder('Select an option');

const coolButton1 = new ButtonBuilder()
    .setStyle('GREEN').setLabel('Button 1').setID('coolButton1')

const coolButton2 = new ButtonBuilder()
    .setStyle('BLURPLE').setLabel('Button 2').setID('coolButton2')

client.on('message', async (message) => {
    if (message.content === 'menu') {
        await MenusManager.sendMenu(message, 'Select an option', { menu: myCoolMenu }).catch(err => console.error(err));
    }
    if (message.content === 'button') {
        await MenusManager.sendButton(message, 'Click a button', { buttons: [coolButton1, coolButton2] }).then(async msg => {
            await msg.edit('Some edit')
        })
    }
})

MenusManager.on('BUTTON_CLICKED', (button) => {
    if (button.customID === 'coolButton2') {
        button.think()
    }
});

MenusManager.on('MENU_CLICKED', (menu) => {
    if (menu.customID === 'cool-custom-id') {
        if (menu.values[0].toLowerCase() === 'value-3') {
            return menu.reply('Value 3!');
        } else {
            return menu.defer();
        }
    }
})

client.login('');