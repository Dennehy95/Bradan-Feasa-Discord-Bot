require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", message => {
    if (message.author.bot) return
    console.log(message.content)
    if (message.content === "ping") {
        message.reply("pong");
    }
})

client.login(process.env.BETA_DISCORD_TOKEN);
// client.login(process.env.DISCORD_TOKEN);