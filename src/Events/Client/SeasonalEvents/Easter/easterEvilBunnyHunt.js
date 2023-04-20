const { defaultEasterHuntData } = require('../../../../Schemas/easterHuntSchema');
const Guild = require('../../../../Schemas/guild');
const {
  getEasterHuntEventOutcomePage,
} = require('../../../../SeasonalEvents/getEasterHuntEventOutcomePage');
const { getEasterHuntStartedPage } = require('../../../../SeasonalEvents/easterHuntStartedPage');
const { getEasterHuntOccurrencePage } = require('../../../../SeasonalEvents/getEasterHuntOccurrencePage');
const { dateDiffInMS, getEventChannel, getSelectedParticipants } = require('../utils');
const { easterEvilBunnyHuntOccurrenceOutcomes } = require('./evilBunnyOccurrences/easterEvilBunnyHuntOccurrenceOutcomes');
const { DEFAULT_OCCURRENCES } = require('./evilBunnyOccurrences/easterEvilBunnyOccurrencesConstants');

const generateMsWaitTimes = () => {
  // const minMilliseconds = 60 * 60 * 2000; // 2 hour in milliseconds
  const minMilliseconds = 30000; // 1/2 min in milliseconds
  const maxMilliseconds = 2 * minMilliseconds; // 4 hours in milliseconds

  const msToEndOfCurrentEvent =
    Math.floor(Math.random() * (maxMilliseconds - minMilliseconds + 1)) +
    minMilliseconds;
  const msToNextOccurrence = msToEndOfCurrentEvent * 2

  console.log('End of current event in ' + msToEndOfCurrentEvent + ' milliseconds');
  console.log('Next occurrence in ' + msToNextOccurrence + ' milliseconds');

  return { msToEndOfCurrentEvent, msToNextOccurrence }
}

const noParticipantsEventStart = async ({ eventChannel, guildId, guildProfileId }) => {
  const occurrenceDescription = 'No one enlisted to fight the Bunny, the town is unprotected and is destroyed\n'
  const { embeddedMessage } = await getEasterHuntEventOutcomePage({ guildId, occurrenceDescription })
  await Guild.updateOne(
    { _id: guildProfileId },
    { $set: { easterHunt: defaultEasterHuntData } }
  )
  return await eventChannel.send({
    embeds: embeddedMessage,
    ephemeral: false,
  })
}

const getActiveEventServers = async (client) => {
  try {
    const activeEventServers = await Guild.find(
      { 'easterHunt.eventState': { $in: ['inProgress', 'preEvent'] } },
      { guildId: 1 }
    );
    const clientServers = client.guilds.cache;
    let clientActiveServers = [];
    activeEventServers.forEach((activeEventServer) => {
      const matchingServer = clientServers.find(
        (server) => server.id === activeEventServer.guildId
      );
      if (matchingServer) clientActiveServers.push(matchingServer);
    });
    return clientActiveServers;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const doEasterEventForServer = async ({ client, server }) => {
  const guildId = server.id;
  let guildProfile = await Guild.findOne({ guildId: guildId });
  let updatedEventData = guildProfile.easterHunt;
  const eventChannel = getEventChannel({ client, server })
  const currentDate = new Date();

  if (updatedEventData.isEventOver) {
    // TODO
    // Show end screen
    return await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { easterHunt: defaultEasterHuntData } }
    )
  }

  if (
    !(
      updatedEventData.eventState === 'preEvent' ||
      updatedEventData.eventState === 'inProgress'
    )
  )
    return;

  // Event is ongoing
  // - If notStarted, set to preEvent, post initial message and schedule a call for 48 hours from then
  // - if preEvent, check we are before created start time (the 24 hours) if no wait until then, if yes, set to in progress
  // - If eventState is inProgress, trigger an event occurrence
  else {
    const aliveParticipants = updatedEventData.participants.filter(participant => participant.isAlive)
    if (updatedEventData.eventState === 'preEvent') {
      const timeToEventStart = dateDiffInMS(
        currentDate,
        updatedEventData.eventStartTime
      );
      console.log('WE ARE IN PRE-EVENT')
      console.log('timeToEventStart = ' + timeToEventStart)
      if (timeToEventStart > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToEventStart + 1000));
        return await doEasterEventForServer({ client, server });
      }
      console.log('SETTING IN PROGRESS If has participants')
      if (aliveParticipants.length === 0) {
        return noParticipantsEventStart({ eventChannel, guildId, guildProfileId: guildProfile._id })
      }

      updatedEventData.eventState = 'inProgress';

      const { msToEndOfCurrentEvent, msToNextOccurrence } = generateMsWaitTimes()
      updatedEventData.currentOccurrenceEndDate = Math.floor(currentDate) + msToEndOfCurrentEvent;
      updatedEventData.nextOccurrenceDate = Math.floor(currentDate) + msToNextOccurrence;

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      );

      const { components, embeddedMessage } = await getEasterHuntStartedPage({
        guildId: server.id,
      });
      await eventChannel.send({
        components,
        ephemeral: false,
        embeds: embeddedMessage,
      });

      await new Promise(resolve => setTimeout(resolve, msToEndOfCurrentEvent + 1000));
      return await doEasterEventForServer({ client, server });
    }


    else if (updatedEventData.eventState === 'inProgress') {
      if (updatedEventData.currentOccurrenceEndDate) {
        const timeToOccurrenceEnd = dateDiffInMS(
          currentDate,
          updatedEventData.currentOccurrenceEndDate
        );
        if (timeToOccurrenceEnd > 0) {
          await new Promise(resolve => setTimeout(resolve, timeToOccurrenceEnd + 500));
          return await doEasterEventForServer({ client, server });
        }

        // If past occurrenceTime and we are awaiting an occurrence response, generate response and post, then set
        // awaitingResponseToOccurrence to false, increment currentOccurrenceIndex and get time to next event
        updatedEventData = await easterEvilBunnyHuntOccurrenceOutcomes({ eventChannel, guildId: server.id, updatedEventData })
        //TODO do event and gets new data info then update updatedEventData
      }

      if (updatedEventData.nextOccurrenceDate) {
        const timeToNextOccurrence = dateDiffInMS(
          currentDate,
          updatedEventData.nextOccurrenceDate
        );
        if (timeToNextOccurrence > 0) {
          await new Promise(resolve => setTimeout(resolve, timeToNextOccurrence + 500));
          return await doEasterEventForServer({ client, server });
        }
      }

      // TODO
      // Instead of numbers have this select the schema object randomly. We need to also check special rules to filter which events are available. For example if only one person left cant do buddy save etc. 
      const numberOfAliveParticipants = updatedEventData.participants.filter((participant) => participant.isAlive).length
      const availableOccurrences = Object.keys(DEFAULT_OCCURRENCES)
        .filter((occurrence) => DEFAULT_OCCURRENCES[occurrence].minimumSelectedParticipants <= numberOfAliveParticipants);
      const randomOccurrence = availableOccurrences[Math.floor(Math.random() * availableOccurrences.length)];
      updatedEventData.currentOccurrence = DEFAULT_OCCURRENCES[randomOccurrence];
      console.log(randomOccurrence)
      console.log(updatedEventData.currentOccurrence)
      updatedEventData.currentOccurrence.selectedParticipants = getSelectedParticipants({ participants: updatedEventData.participants, minimum: updatedEventData.currentOccurrence.minimumSelectedParticipants, maximum: updatedEventData.currentOccurrence.maximumSelectedParticipants })

      console.log(updatedEventData)
      const { components, embeddedMessage } = await getEasterHuntOccurrencePage({
        currentOccurrence: updatedEventData.currentOccurrence,
        currentOccurrenceIndex: updatedEventData.currentOccurrenceIndex,
        guildId: server.id,
      });

      await eventChannel.send({
        components,
        ephemeral: false,
        embeds: embeddedMessage,
      });

      const { msToEndOfCurrentEvent, msToNextOccurrence } = generateMsWaitTimes()
      updatedEventData.currentOccurrenceEndDate = Math.floor(currentDate) + msToEndOfCurrentEvent;
      updatedEventData.nextOccurrenceDate = Math.floor(currentDate) + msToNextOccurrence;


      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      );

      await new Promise(resolve => setTimeout(resolve, msToEndOfCurrentEvent + 500));
      return await doEasterEventForServer({ client, server });
    }
  }
};

module.exports = {
  doEasterEvilBunnyHunt: async ({ client, server }) => {
    if (server) {
      doEasterEventForServer({ client, server });
    } else {
      //Get all servers with bot
      const activeEventServers = await getActiveEventServers(client);
      // const servers = client.guilds.cache.array();
      // TODO if activeServer in DB no longer has bot, set event to false

      for (const server of activeEventServers) {
        doEasterEventForServer({ client, server });
      }
    }
  },
};

/*

// const { msUntilNextStartOrEnd, isEventOver, isEventUpcoming } = easterEventTimingDetails()

  // Event either hasn't happened or has ended. 
  // - If notStarted or preEvent, reset all data except is turned on
  // - If eventState is inProgress, post results, then set to notStarted and clear reset all data except isTurnedOn.
  if (isEventOver || isEventUpcoming) {
    if (updatedEventData.eventState === 'notStarted' || updatedEventData.eventState === 'preEvent') {
      updatedEventData = defaultEasterHuntData
      updatedEventData.isEventTurnedOn = true
      updatedEventData.updated = new Date()

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      )
    }
    else if (updatedEventData.eventState === 'inProgress') {
      updatedEventData = defaultEasterHuntData
      updatedEventData.isEventTurnedOn = true
      updatedEventData.updated = new Date()

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      )

      //const { components, embeddedMessage } = await getEasterHuntCompletedPage({ guildId: server.id })
      // await eventChannel.send({
      //   components,
      //   ephemeral: false,
      //   embeds: embeddedMessage
      // });
    }
    */
