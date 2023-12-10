const { PermissionsBitField } = require('discord.js');

module.exports = {
  doEasterEggHuntEvent: async (client) => {
    /*
    0: a text channel
    1: a DM channel
    2: a voice channel
    3: a group DM channel
    4: a category channel
    */
    // Algorithm:
    // Get all Id's of servers with events activated (or all for now)
    // When starting event, get one random accessible channel (open to all members) from each server
    // Post the thing into each channel
    const eggEmojis = ['🥚', '🍳', '🐣', '🐥', '🐰'];

    const channels = client.channels.cache.filter(channel => {
      return (
        channel.type === 0 &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ReadMessageHistory) &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages) &&
        channel.permissionsFor(client.user).has(PermissionsBitField.Flags.ViewChannel)
      )
    });

    // const minMilliseconds = 60 * 60 * 1000; // 1 hour in milliseconds
    // // const minMilliseconds = 60 * 60; // 1 min in milliseconds
    // const maxMilliseconds = 4 * minMilliseconds; // 4 hours in milliseconds
    // const randomMilliseconds = Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) + minMilliseconds;
    // console.log('New hourly interval = ' + randomMilliseconds)
    // activateIntervalCheck = randomMilliseconds

    // Post start message
    const startMessage = `An Easter Egg Hunt Has Begun!`;
    const randomChannel = channels.random();
    const startMsg = await randomChannel.send(startMessage);

    const eggCount = {};
    let eggNum = 1;
    let eventEnd = false;
    // Post eggs messages every 30 seconds
    const interval = setInterval(async () => {
      if (!eventEnd) {
        const eggChannel = eggChannels[Math.floor(Math.random() * eggChannels.length)];
        const { message, emoji } = await eggChannel(randomChannel);
        const filter = (interaction) => interaction.customId === 'collect-egg' && !interaction.user.bot;
        const collector = message.createMessageComponentCollector({ filter, time: 25000 });

        collector.on('collect', async interaction => {
          const user = interaction.user;
          eggCount[user.username] = eggCount[user.username] ? eggCount[user.username] + 1 : 1;
          await interaction.update(`${user.username} has collected ${emoji}`);
          collector.stop();
        });

        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await message.delete();
          }
        });

        eggNum++;
        if (eggNum > 8) {
          eventEnd = true;
          clearInterval(interval);

          // Post summary message
          const summaryMessage = 'The Easter Egg Hunt has ended! Here are the results:\n\n';
          const eggStats = Object.entries(eggCount).map(([user, eggs]) => `${user}: ${eggs} egg${eggs > 1 ? 's' : ''}`);
          const statsMessage = eggStats.join('\n');
          const totalEggs = Object.values(eggCount).reduce((total, eggs) => total + eggs, 0);
          const totalMessage = `A total of ${totalEggs} eggs were collected!`;
          const endMessage = summaryMessage + statsMessage + '\n\n' + totalMessage;
          await startMsg.edit(endMessage);
        }
      }
    }, 30000);
  }
}







// const eggCount = Math.floor(Math.random() * 10) + 1; // between 1 and 10 eggs
// const eggLocations = new Set();
// for (let i = 0; i < eggCount; i++) {
//   let eggLocation;
//   do {
//     eggLocation = channels.random();
//   } while (eggLocations.has(eggLocation));
//   eggLocations.add(eggLocation);
//   const eggEmoji = eggEmojis[Math.floor(Math.random() * eggEmojis.length)];
//   eggLocation.send(`${eggEmoji} Easter egg hidden in this channel!`);
// }
// const endTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
// const participants = new Map();

// const eggCollector = setInterval(() => {
//   if (Date.now() >= endTime.getTime()) {
//     clearInterval(eggCollector);
//     const leaderboard = Array.from(participants.entries()).sort((a, b) => b[1] - a[1]).map(([userId, count]) => `<@${userId}>: ${count} eggs`).join('\n');
//     const resultMessage = `:tada: The Easter egg hunt is over! Congratulations to our top collectors:\n${leaderboard}`;
//     eggChannel.send(resultMessage);
//     return;
//   }
//   eggChannel.messages.fetch({ limit: 100 }).then(messages => {
//     messages.filter(message => eggLocations.has(message.channel) && eggEmojis.includes(message.content)).forEach(message => {
//       const userId = message.author.id;
//       participants.set(userId, (participants.get(userId) || 0) + 1);
//       message.delete();
//     });
//   });
// }, 10000); // check every 10 seconds
