// const EASTER_EVENT_END_DATE = new Date('2023-04-07T23:59:59');
// const EASTER_EVENT_START_DATE = new Date('2023-04-01T00:00:00');

const { doEasterEggHuntEvent } = require('./EasterEggHunt/easterEggHunt');
const {
  doEasterEvilBunnyHunt,
} = require('./EasterEvilBunny/easterEvilBunnyHunt');
const { easterEventTimingDetails } = require('./easterTimingUtils');

const easterEvent = (client, server) => {
  const { msUntilNextStartOrEnd, isEventOver, isEventUpcoming } =
    easterEventTimingDetails();

  if (!isEventOver && !isEventUpcoming) {
    //doEasterEventStuff...
    //doEasterEggHuntEvent(client)
    doEasterEvilBunnyHunt({ client, server });
  }
  console.log(
    'Easter event is waiting ' +
      msUntilNextStartOrEnd +
      ' milliseconds before calling again'
  );

  setTimeout(easterEvent.bind(null, client), msUntilNextStartOrEnd);
};

module.exports = {
  activateEasterEvent(client) {
    easterEvent(client);
  },
};
