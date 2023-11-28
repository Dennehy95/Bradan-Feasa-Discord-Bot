const { defaultEasterHuntData } = require('../../../../Schemas/easterHuntSchema');
const Guild = require('../../../../Schemas/guild');
const {
  getEasterHuntEventOutcomePage,
} = require('../../../../SeasonalEvents/getEasterHuntEventOutcomePage');
const { getEasterHuntStartedPage } = require('../../../../SeasonalEvents/easterHuntStartedPage');
const { getEasterHuntOccurrencePage } = require('../../../../SeasonalEvents/getEasterHuntOccurrencePage');
const { dateDiffInMS, getEventChannel, getSelectedParticipants, generateMsWaitTimes } = require('../utils');
const { easterEvilBunnyHuntOccurrenceOutcomes } = require('./evilBunnyOccurrences/easterEvilBunnyHuntOccurrenceOutcomes');
const { DEFAULT_OCCURRENCES } = require('./evilBunnyOccurrences/easterEvilBunnyOccurrencesConstants');

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

const handlePreEvent = async ({ eventChannel, updatedEventData, currentDate, guildId, guildProfile, client, server }) => {
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
  const aliveParticipants = updatedEventData.participants.filter(participant => participant.isAlive)
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

const handleInProgress = async ({ eventChannel, eventData, currentDate, guildProfile, client, server }) => {
  if (eventData.currentOccurrenceEndDate) {
    const { callbackFunction, updatedEventData } = await handleCurrentOccurrenceEnd({ eventChannel, eventData, currentDate, server });
    if (callbackFunction) return callbackFunction({ client, server })
    eventData = updatedEventData
  }

  if (eventData.nextOccurrenceDate) {
    const { callbackFunction } = await handleNextOccurrence({ eventData, currentDate });
    if (callbackFunction) return callbackFunction({ client, server })
  }

  // TODO
  // Instead of numbers have this select the schema object randomly. We need to also check special rules to filter which events are available. For example if only one person left cant do buddy save etc. 
  const numberOfAliveParticipants = eventData.participants.filter((participant) => participant.isAlive).length
  const availableOccurrences = Object.keys(DEFAULT_OCCURRENCES)
    .filter((occurrence) => DEFAULT_OCCURRENCES[occurrence].minimumSelectedParticipants <= numberOfAliveParticipants);
  const randomOccurrence = availableOccurrences[Math.floor(Math.random() * availableOccurrences.length)];
  eventData.currentOccurrence = DEFAULT_OCCURRENCES[randomOccurrence];
  console.log(randomOccurrence)
  console.log(eventData.currentOccurrence)
  eventData.currentOccurrence.selectedParticipants = getSelectedParticipants({ participants: eventData.participants, minimum: eventData.currentOccurrence.minimumSelectedParticipants, maximum: eventData.currentOccurrence.maximumSelectedParticipants })

  console.log(eventData)
  const { components, embeddedMessage } = await getEasterHuntOccurrencePage({
    currentOccurrence: eventData.currentOccurrence,
    currentOccurrenceIndex: eventData.currentOccurrenceIndex,
    guildId: server.id,
  });

  await eventChannel.send({
    components,
    ephemeral: false,
    embeds: embeddedMessage,
  });

  const { msToEndOfCurrentEvent, msToNextOccurrence } = generateMsWaitTimes()
  eventData.currentOccurrenceEndDate = Math.floor(currentDate) + msToEndOfCurrentEvent;
  eventData.nextOccurrenceDate = Math.floor(currentDate) + msToNextOccurrence;


  console.log(eventData)
  await Guild.updateOne(
    { _id: guildProfile._id },
    { $set: { easterHunt: eventData } }
  );

  await new Promise(resolve => setTimeout(resolve, msToEndOfCurrentEvent + 500));
  return await doEasterEventForServer({ client, server });
}

const handleCurrentOccurrenceEnd = async ({ eventChannel, eventData, currentDate, server }) => {
  const timeToOccurrenceEnd = dateDiffInMS(
    currentDate,
    eventData.currentOccurrenceEndDate
  );
  if (timeToOccurrenceEnd > 0) {
    const callbackFunction = async ({ client, server }) => {
      await new Promise(resolve => setTimeout(resolve, timeToOccurrenceEnd + 500));
      return await doEasterEventForServer({ client, server });
    }
    return { callbackFunction }
  }
  // Default ending or no option ending
  const updatedEventData = await easterEvilBunnyHuntOccurrenceOutcomes({ eventChannel, guildId: server.id, updatedEventData: eventData })
  return { updatedEventData }
  // If past occurrenceTime and we are awaiting an occurrence response, generate response and post, then set
  // awaitingResponseToOccurrence to false, increment currentOccurrenceIndex and get time to next event
  //TODO do event and gets new data info then update updatedEventData
}

const handleNextOccurrence = async ({ eventData, currentDate }) => {
  if (eventData.nextOccurrenceDate) {
    const timeToNextOccurrence = dateDiffInMS(
      currentDate,
      eventData.nextOccurrenceDate
    );
    if (timeToNextOccurrence > 0) {
      const callbackFunction = async ({ client, server }) => {
        await new Promise(resolve => setTimeout(resolve, timeToNextOccurrence + 500));
        return await doEasterEventForServer({ client, server });
      }
      return { callbackFunction }
    }
  }
  return {}
}

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
  if (updatedEventData.eventState === 'preEvent') {
    await handlePreEvent({ eventChannel, updatedEventData, currentDate, guildId, guildProfile, client, server });
  }

  else if (updatedEventData.eventState === 'inProgress') {
    await handleInProgress({ eventChannel, eventData: updatedEventData, currentDate, guildProfile, client, server });
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
  doEasterEventForServer,
  noParticipantsEventStart,
  getActiveEventServers,
  doEasterEventForServer
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
