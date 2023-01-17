
const fs = require('node:fs')
const path = require('node:path');

module.exports = (client) => {
  client.handleCommands = async () => {
    // const commandFolders = fs.readdirSync(`./src/Commands`);
    // for (const folder of commandFolders) {
    //   const eventFiles = fs
    //     .readdirSync(`./src/Commands/${folder}`)
    //     .filter((file) => file.endsWith('js'))

    //   for (const file of commandFiles) {
    //     const filePath = join(commandsPath, file);
    //     const command = require(filePath);

    //     // Set a new item in the Collection with the key as the command name and the value as the exported module
    //     if ('data' in command && 'execute' in command) {
    //       client.commands.set(command.data.name, command);
    //     } else {
    //       console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    //     }
    //   }
    // }
    const commandsPath = path.join(__dirname, '../../Commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

// /*********** Commands Loader ************/
// const commandsPath = join(process.cwd(), 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
//   const filePath = join(commandsPath, file);
//   const command = await import(pathToFileURL(filePath));

//   // Set a new item in the Collection with the key as the command name and the value as the exported module
//   if ('data' in command && 'execute' in command) {
//     client.commands.set(command.data.name, command);
//   } else {
//     console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//   }
// }