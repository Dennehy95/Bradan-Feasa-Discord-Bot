const { getAllowedChannels } = require('../../../Utils/discordGuildUtils');

const shuffleArray = (array) => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports = {
  dateDiffInMS(startDate, endDate) {
    // console.log(startDate)
    // console.log(endDate)
    // const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information. This is for fully accurate between timezones. We are only using UTC so should be fine
    // const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getTime);
    // const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    // return Math.floor((utc2 - utc1));

    return Math.floor(endDate - startDate);
  },

  generateMsWaitTimes({
    // minMilliseconds = 30000,
    // maxMilliseconds = 2 * minMilliseconds,
    minMilliseconds = 5000,
    maxMilliseconds = 2 * minMilliseconds,
  } = {}) {
    const msToEndOfCurrentEvent =
      Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) +
      minMilliseconds;
    const msToNextOccurrence = msToEndOfCurrentEvent * 2;

    return { msToEndOfCurrentEvent, msToNextOccurrence };
  },

  getEventChannel({ client, server }) {
    const channels = getAllowedChannels({
      client,
      server,
      channelTypes: ['text'],
    });
    let eventChannel = channels.find(
      (channel) => channel.name.toLowerCase() === 'events'
    );
    if (!eventChannel) {
      eventChannel = channels.find(
        (channel) => channel.name.toLowerCase() === 'general'
      );
    }
    if (!eventChannel) {
      eventChannel = channels.random();
    }
    return eventChannel;
  },

  getSelectedParticipants({ participants, minimum, maximum }) {
    const aliveParticipants = participants.filter(
      (participant) => participant.isAlive
    );
    const count = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return shuffleArray(aliveParticipants).slice(0, count);
  },

  rollD20(difficultyModifier = 0) {
    return Math.floor(Math.random() * 20) + 1 + difficultyModifier;
  },
};
