const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const fs = require('node:fs');
const { join } = require('path');

const commands = [];
const commandsPath = join(__dirname, 'src/Commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
  try {
    console.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.TEST_GUILD_ID
      ),
      { body: commands }
    );

    console.info(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
