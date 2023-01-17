const fs = require('node:fs');
const path = require('node:path');

const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

/* Mongo DB Database Open */
const { DATABASE_TOKEN } = process.env
const { connect, set } = require('mongoose')


const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandsArray = [];

const functionsPath = path.join(__dirname, 'src/Functions/handlers');
const functionsFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));
for (const file of functionsFiles) {
    const filePath = `./src/Functions/handlers/${file}`.toString();
    require(filePath)(client);
}
client.handleEvents();
client.handleCommands();
// client.handleComponents();

/* Client Login */
client.login(process.env.DISCORD_TOKEN);

/* Database Connect */
(async () => {
    set('strictQuery', false);
    await connect(DATABASE_TOKEN)
        .catch(console.error)
})()