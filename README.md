<center> <h1><strong>discord-menus</strong></h1> </center>
<br>
<center> <a href="https://nodei.co/npm/discord-menus/"><img src="https://nodei.co/npm/discord-menus.png?downloads=true&downloadRank=true&stars=true"></a> </center>
<br>
<center>

[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)

[![Open Source Love png2](https://badges.frapsoft.com/os/v2/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)

</center>

# 🔩 Installation
```
npm install discord-menus@latest
```
<br>
<br>

# 🌌 Setup
```typescript
const { DiscordMenus } = require('discord-menus');
// Or typescript
import { DiscordMenus } from 'discord-menus';
```
<br>
<br>

# 💻 Code example

All the code examples are available in the `tests` folder of the project, available on **[Github](https://github.com/RemyK888/discord-menus)**, the documentation is coming soon, for more information, join the **[RemyK Discord server](https://discord.gg/ZCzxymB)**

```javascript
const { DiscordMenus, ButtonBuilder, MenuBuilder } = require('discord-menus');
const { Client, MessageEmbed }  = require('discord.js');

const client = new Client();
const MenusManager = new DiscordMenus(client);

const myCoolMenu = new MenuBuilder()
    .addLabel('Value 1', { description: 'This the value 1 description', value: 'value-1' })
    .addLabel('Value 2', { description: 'This is the value 2 description', value: 'value-2' })
    .addLabel('Value 3', {
        description: 'This is the value 3 description (with an emoji)', value: 'value-3', emoji: {
            name: '🌌'
        }
    })
    .setCustomID('cool-custom-id')
    .setPlaceHolder('Select an option');

client.on('message', async (message) => {
    if (message.content === 'menu') {
        await MenusManager.sendMenu(message, new MessageEmbed().setDescription('Hello world!'), { menu: myCoolMenu }).catch(err => console.error(err))
    }
});

MenusManager.on('MENU_CLICKED', (menu) => {
    menu.reply('some reply')
    console.log(menu.values);
});

client.login('');
```
<br>
<br>

# 📷 Image
![Image 1](https://media.discordapp.net/attachments/859466472237957142/861637984716718080/2021-07-05_18h01_29.png)

<br>

![Image 2](https://cdn.discordapp.com/attachments/859466472237957142/861637986243444776/2021-07-05_18h01_40.png)

<br>
<br>

# 👥 Contact
![Discord Banner 1](https://discordapp.com/api/guilds/713699044811341895/widget.png?style=banner1)

**You can join the RemyK Dev Discord server using [this link](https://discord.gg/NBU6jzUMzR)**

<br>
<br>

# 🚀 Others

**This package is under Apache-2.0 license**

**[Github repository](https://github.com/RemyK888/discord-menus)**

## Made with ❤ by RemyK
