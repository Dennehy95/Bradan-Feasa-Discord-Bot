const {
  doEasterEvilBunnyHunt,
} = require('../../Events/Client/SeasonalEvents/Easter/EasterEvilBunny/easterEvilBunnyHunt');
const { getEventChannel } = require('../../Events/Client/SeasonalEvents/utils');
const { defaultEasterHuntData } = require('../../Schemas/easterHuntSchema');
const Guild = require('../../Schemas/guild');
const {
  getEasterHuntOverviewPage,
} = require('../EvilEasterBunny/Pages/easterHuntOverviewPage');
const { getManageEventsPage } = require('../manageEventsPage');

const getTimeToEasterEvent = () => {
  const now = new Date();
  return {
    // timeToEvent: new Date(now.getTime() + 24 * 60 * 60 * 1000).getTime(), // 24 Hours
    // timeToEventText: '24 Hours'
    // timeToEvent: new Date(now.getTime() + 60000).getTime(),
    // timeToEventText: '1 minute', // one minute test
    timeToEvent: new Date(now.getTime() + 10000).getTime(),
    timeToEventText: '1 minute', // 10 second test
  };
};

module.exports = {
  async changeEventOnOrOffButtonClicked(
    data = { interaction: null, startingEvent: false, selectedEvent: '' }
  ) {
    const { interaction, startingEvent, selectedEvent } = { ...data };
    const guild = interaction.guild;
    const guildId = guild.id;
    const guildProfile = await Guild.findOne({ guildId: guildId });

    if (!guildProfile) return; //Error finding guild data
    let updatedEventData = guildProfile[selectedEvent];

    if (!startingEvent) {
      updatedEventData = structuredClone(defaultEasterHuntData);
      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { [selectedEvent]: updatedEventData } }
      );
    } else {
      if (
        updatedEventData.eventState === 'preEvent' ||
        updatedEventData.eventState === 'inProgress'
      ) {
        return await interaction.reply({
          content:
            'Event already in progress. Please stop he current event before starting a new one',
          ephemeral: true,
        });
      }

      // Reset to defaults, set preEvent event state and time 24 hours from now
      updatedEventData = structuredClone(defaultEasterHuntData);
      updatedEventData.eventState = 'preEvent';
      const timeToEventStart = getTimeToEasterEvent();
      updatedEventData.eventStartTime = timeToEventStart.timeToEvent;
      updatedEventData.eventStartTimeText = timeToEventStart.timeToEventText;
      await Guild.updateOne(
        { _id: guildProfile._id },
        { $set: { [selectedEvent]: updatedEventData } }
      );

      await doEasterEvilBunnyHunt({
        client: interaction.client,
        server: guild,
      });

      const eventChannel = getEventChannel({
        client: interaction.client,
        server: guild,
      });
      const { components, embeddedMessage } = await getEasterHuntOverviewPage({
        guildId,
      });
      await eventChannel.send({
        components,
        ephemeral: false,
        embeds: embeddedMessage,
      });
    }

    const { components, embeddedMessage } = await getManageEventsPage({
      interaction,
    });

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    });
  },

  async userInvolveEventButtonClicked(
    data = { interaction: null, isJoining: false, selectedEvent: null }
  ) {
    const { interaction, isJoining, selectedEvent } = { ...data };
    const guild = interaction.guild;
    const guildId = guild.id;
    const guildProfile = await Guild.findOne({ guildId: guildId });

    if (!guildProfile) return; // Error finding guild data

    const updatedEventData = guildProfile[selectedEvent];
    let participants = updatedEventData.participants;

    if (updatedEventData.eventState !== 'preEvent') return;

    if (isJoining) {
      if (
        updatedEventData.eventState === 'notStarted' ||
        updatedEventData.eventState === 'inProgress'
      )
        return; //Can't join a not started or in progress event
      if (updatedEventData.eventState === 'preEvent') {
        if (
          !participants.find(
            (participant) => participant.userId === interaction.user.id
          )
        ) {
          participants.push({
            isAlive: true,
            userId: interaction.user.id,
            username: interaction.user.username,
          });
        }
      }
    } else {
      if (updatedEventData.eventState === 'notStarted') return;
      if (updatedEventData.eventState === 'preEvent') {
        participants = participants.filter(
          (participant) => participant.userId !== interaction.user.id
        );
      }
      if (!updatedEventData.eventState === 'inProgress') {
        const participantIndex = participants.findIndex(
          (participant) => participant.id === interaction.user.id
        );
        if (participantIndex) {
          participants[participantIndex].isAlive = false;
          // TODO
          // Send an update Username has died of fear/fled the town in terror/ perished from wetting themselves
        }
      }
    }
    updatedEventData.participants = participants;

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { [selectedEvent]: updatedEventData } }
    );

    const { components, embeddedMessage } = await getEasterHuntOverviewPage({
      guildId,
    });

    return await interaction.update({
      components,
      embeds: embeddedMessage,
    });
  },
};
