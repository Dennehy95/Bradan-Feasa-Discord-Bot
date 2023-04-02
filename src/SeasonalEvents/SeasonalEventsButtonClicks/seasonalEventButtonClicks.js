const Guild = require("../../Schemas/guild");
const { getEasterHuntOverviewPage } = require("../easterHuntOverviewPage");
const { getManageEventsPage } = require("../manageEventsPage")

module.exports = {
  async changeEventOnOrOffButtonClicked (data) {
    const { interaction, newState = false, selectedEvent } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    if (!guildProfile) return //Error finding guild data
    let updatedEventData = guildProfile[selectedEvent]

    if (updatedEventData.isEventTurnedOn === newState) return

    updatedEventData = defaultEasterHuntData
    updatedEventData.created = new Date()
    updatedEventData.isEventTurnedOn = newState
    updatedEventData.updated = new Date()

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { [selectedEvent]: updatedEventData } }
    )

    await doEasterEvilBunnyHunt({ client, server: guild })

    const { components, embeddedMessage } = await getManageEventsPage({ interaction })

    return await interaction.update({
      components,
      embeds: embeddedMessage
    })
  },

  async userInvolveEventButtonClicked (data) {
    const { interaction, isJoining = false, selectedEvent } = { ...data }
    const guild = interaction.guild
    const guildId = guild.id
    const guildProfile = await Guild.findOne({ guildId: guildId });

    if (!guildProfile) return //Error finding guild data

    const updatedEventData = guildProfile[selectedEvent]
    const participants = updatedEventData.participants

    console.log(updatedEventData)
    if (!updatedEventData.isEventTurnedOn) return

    if (isJoining) {
      if (updatedEventData.eventState === 'notStarted' || updatedEventData.eventState === 'inProgress') return //Can't join a not started or in progress event
      if (updatedEventData.eventState === 'preEvent') {
        if (!participants.find((participant) => participant.id === interaction.user.id)) {
          participants.push({ isAlive: true, userId: interaction.user.id, username: interaction.user.name })
        }
      }
    }
    else {
      if (updatedEventData.eventState === 'notStarted') return
      if (updatedEventData.eventState === 'preEvent') {
        if (!participants.find((participant) => participant.id === interaction.user.id)) {
          participants.push({ isAlive: true, userId: interaction.user.id, username: interaction.user.name })
        }
      }
      if (!updatedEventData.eventState === 'inProgress') {
        const participantIndex = participants.findIndex((participant) => participant.id === interaction.user.id)
        if (participantIndex) {
          participants[participantIndex].isAlive = false;
        }
      }
    }

    await Guild.updateOne(
      { _id: guildProfile._id },
      { $set: { [selectedEvent]: updatedEventData } }
    )

    const { components, embeddedMessage } = await getEasterHuntOverviewPage({ guildId })

    return await interaction.update({
      components,
      embeds: embeddedMessage
    })
  }
}