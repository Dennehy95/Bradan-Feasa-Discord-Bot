const Guild = require("../../../../Schemas/guild");
const { getEasterHuntOverviewPage } = require("../../../../SeasonalEvents/easterHuntOverviewPage");
const { getAllowedChannels } = require("../../../../Utils/discordGuildUtils");
const { dateDiffInMS } = require("../utils");
const { easterEventTimingDetails } = require("./easterTimingUtils");

const getActiveEventServers = async (client) => {
  try {
    const activeEventServers = await Guild.find({ 'easterHunt.isEventTurnedOn': true }, { guildId: 1 });
    const clientServers = client.guilds.cache
    let clientActiveServers = []
    activeEventServers.forEach((activeEventServer) => {
      const matchingServer = clientServers.find(server => server.id === activeEventServer.guildId)
      if (matchingServer) clientActiveServers.push(matchingServer)
    })
    return clientActiveServers
  } catch (err) {
    console.error(err);
    return []
  }
}

const doEasterEventForServer = async (server, eventChannel) => {
  const guildId = server.id
  let guildProfile = await Guild.findOne({ guildId: guildId });
  let updatedEventData = guildProfile.easterHunt

  if (!updatedEventData.isEventTurnedOn) {
    //Set not started, clear participants, reset bunny, updated updated
    return
  }

  // else is on, 
  const { msUntilNextStartOrEnd, isEventOver, isEventUpcoming } = easterEventTimingDetails()

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
  }

  // eventStartTime

  // Event is ongoing
  // - If notStarted, set to preEvent, post initial message and schedule a call for 48 hours from then
  // - if preEvent, check we are before created start time (the 24 hours) if no wait until then, if yes, set to in progress
  // - If eventState is inProgress, trigger an event occurrence
  else {
    if (updatedEventData.eventState === 'notStarted') {
      const now = new Date(); // Creates a new Date object for the current date and time
      const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000); // Adds 48 hours in milliseconds to the current date and time
      const twoDaysFromNowInMs = twoDaysFromNow.getTime();

      updatedEventData.eventState = 'preEvent'
      updatedEventData.eventStartTime = twoDaysFromNowInMs
      updatedEventData.updated = new Date()

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      )

      const { components, embeddedMessage } = await getEasterHuntOverviewPage({ guildId: server.id })
      await eventChannel.send({
        components,
        ephemeral: false,
        embeds: embeddedMessage
      });


      setTimeout(doEasterEventForServer.bind(null, server), (msUntilNextStartOrEnd + 1000));
    }
    else if (updatedEventData.eventState === 'preEvent') {
      const currentDate = new Date()
      const timeToEventStart = dateDiffInMS(currentDate, updatedEventData.eventStartTime)
      if (timeToEventStart > 0) {
        setTimeout(doEasterEventForServer.bind(null, server), (timeToEventStart + 1000));
      }

      updatedEventData.eventState = 'inProgress'
      updatedEventData.updated = new Date()

      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { easterHunt: updatedEventData } }
      )

      // const { components, embeddedMessage } = await getEasterHuntStartedPage({ guildId: server.id })
      // await eventChannel.send({
      //   components,
      //   ephemeral: false,
      //   embeds: embeddedMessage
      // });

    }
  }
}

module.exports = {
  doEasterEvilBunnyHunt: async ({ client, server }) => {
    if (server) {
      doEasterEventForServer(server)
    } else {
      //Get all servers with bot
      const activeEventServers = await getActiveEventServers(client)
      // const servers = client.guilds.cache.array();
      // TODO if activeServer in DB no longer has bot, set event to false

      for (const server of activeEventServers) {
        const channels = getAllowedChannels({ client, server, channelTypes: ['text'] })
        let eventChannel = channels.find(channel => channel.name.toLowerCase() === 'events');
        if (!eventChannel) {
          eventChannel = channels.find(channel => channel.name.toLowerCase() === 'general');
        }
        if (!eventChannel) {
          eventChannel = channels.random();
        }

        //If server is not started, post intro message and set to preEvent
        doEasterEventForServer(server, eventChannel)
      }
    }
  }
}