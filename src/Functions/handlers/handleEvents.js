const fs = require('node:fs')
const { connection } = require('mongoose')

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(`./src/Events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/Events/${folder}`)
        .filter((file) => file.endsWith('js'))

      switch (folder) {
        case 'Client':
          for (const file of eventFiles) {
            const event = require(`../../Events/${folder}/${file}`)
            if (event.once) {
              client.once(event.name, (...args) => event.execute(...args, client));
            } else {
              client.on(event.name, (...args) => event.execute(...args, client));
            }
          }
          break;

        case 'Mongo':
          for (const file of eventFiles) {
            const event = require(`../../Events/${folder}/${file}`)
            if (event.once) {
              connection.once(event.name, (...args) => event.execute(...args, client));
            } else {
              connection.on(event.name, (...args) => event.execute(...args, client));
            }
          }
          break;

        default:
          break;
      }
    }
  }
}

// export const client = () => {
//   /*********** Events Loader ************/
//   const eventsPath = join(process.cwd(), 'Events');
//   const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//   for (const file of eventFiles) {
//     const filePath = join(eventsPath, file);
//     const event = await import(pathToFileURL(filePath));
//     if (event.once) {
//       client.once(event.name, (...args) => event.execute(...args));
//     } else {
//       client.on(event.name, (...args) => event.execute(...args, database));
//     }
//   }
// }
