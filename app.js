import fs from 'node:fs'
import { join } from 'path';
import { pathToFileURL } from 'url';

import dotenv from 'dotenv'
dotenv.config()

import { Client, Collection, Events, GatewayIntentBits } from "discord.js"
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

/*********** Commands Loader ************/
client.commands = new Collection();

const commandsPath = join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(pathToFileURL(filePath));

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


/*********** Events Loader ************/
const eventsPath = join(process.cwd(), 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = await import(pathToFileURL(filePath));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

/* Client Login */

client.login(process.env.BETA_DISCORD_TOKEN);
// client.login(process.env.DISCORD_TOKEN);