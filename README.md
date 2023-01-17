# Bradan-Feasa-Discord-Bot
To Run Bot: node ./app.js

Beta Invite Link
https://discord.com/api/oauth2/authorize?client_id=1063480478507728947&permissions=10942539888&scope=bot%20applications.commands

Permissions: View Channels, Send Messages, Manage Messages, Manage Nicknames, Change Nicknames, Manage Events, Embed Links, Attach Files, Read Message History, Connect and Speak, Bot and Application commands



Discord Bot Steps:
1. Go to https://discord.com/developers/applications
2. Create new Application
3. Click Bot in left sidebar
4. Click "Add a bot"
5. Copy Token
6. Under Privileged Gateway Intents, ensure PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGE CONTENT INTENT are all on
7. Open OAuth2 is left sidebar and scope auth link to Bot and whatever permissions are needed, URL Generator
8. Use URL to invite bot to your server


Bot Code Setup
1. Create new folder and add files. .evn with Discord token. Add .env to gitignore
2. npm install --save discord.js dotenv
3. npm init -y

Database setup:
https://www.mongodb.com/try/download/community

Database Structure

Database Name: BradanFeasaBot
Collection: DiscordGuilds: [
  {
    guildId: "GUILD ID",
    movies: [
      
    ]
  }
]


VSCode Extension Setup:
