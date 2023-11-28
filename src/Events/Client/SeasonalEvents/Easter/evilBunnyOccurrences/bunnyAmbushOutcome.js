const { getEasterHuntEventOutcomePage } = require('../../../../../SeasonalEvents/getEasterHuntEventOutcomePage');
const { rollD20 } = require('../../utils');
const { allParticipantsKilled } = require('../easterEvilBunnyHuntUtils');
const { BUNNY_ATTACKS, PARTICIPANT_DEATH_MESSAGES, PARTICIPANT_ESCAPE_MESSAGES } = require('./easterEvilBunnyOccurrencesConstants');


module.exports = {
  async triggerBunnyAmbushOutcome ({ actionTaken = {}, eventChannel, guildId, occurrenceAction, updatedEventData }) {
    let usedMessages = [];
    const difficultyModifier = 0 // TODO get this from event. Based on the initial amount of participants. Harder if more people
    const { selectedParticipants } = updatedEventData.currentOccurrence;
    const participantNames = selectedParticipants.map(participant => `<@${participant.userId}>`);
    // Discord has a max of 25 fields so just ensuring its all good here
    const participantList = participantNames.slice(0, 25).join(', ');
    let occurrenceDescription = `${participantList} ${selectedParticipants.length > 1 ? 'are' : 'is'
      } caught in the ambush.\n\u200b\n`;

    occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Ambush!`
    updatedEventData.currentOccurrence.selectedParticipants.forEach((selectedParticipant) => {
      const username = selectedParticipant.username;
      const availableBunnyAttacks = BUNNY_ATTACKS.filter(message => !usedMessages.includes(message));
      const randomAttackIndex = Math.floor(Math.random() * availableBunnyAttacks.length);
      usedMessages.push(availableBunnyAttacks[randomAttackIndex]);
      const selectedAttack = availableBunnyAttacks[randomAttackIndex].replace("{USERNAME}", username);
      occurrenceDescription += selectedAttack + '\n'

      if (rollD20(difficultyModifier) < 11) {
        const participantIndex = updatedEventData.participants.findIndex((participant) => participant.userId === selectedParticipant.userId)
        updatedEventData.participants[participantIndex].isAlive = false

        const availableParticipantDeathMessages = PARTICIPANT_DEATH_MESSAGES.filter(message => !usedMessages.includes(message));
        const randomDeathMessageIndex = Math.floor(Math.random() * availableParticipantDeathMessages.length);
        usedMessages.push(availableParticipantDeathMessages[randomDeathMessageIndex]);
        console.log(username)
        console.log('username')
        const selectedDeathMessage = availableParticipantDeathMessages[randomDeathMessageIndex].replace("{USERNAME}", username);
        occurrenceDescription += selectedDeathMessage + '\n\u200b\n'
      } else {
        const availableEscapeMessages = PARTICIPANT_ESCAPE_MESSAGES.filter(message => !usedMessages.includes(message));
        const randomEscapeMessageIndex = Math.floor(Math.random() * availableEscapeMessages.length);
        usedMessages.push(availableEscapeMessages[randomEscapeMessageIndex]);
        const selectedEscapeMessage = availableEscapeMessages[randomEscapeMessageIndex].replace("{USERNAME}", username);
        occurrenceDescription += selectedEscapeMessage + '\n\u200b\n'
      }
    })
    if (allParticipantsKilled(updatedEventData.participants)) {
      updatedEventData.isEventOver = true
      occurrenceDescription += 'All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed' + '\n\u200b\n'
    } else {
      occurrenceDescription += 'The Bunny retreats again, waiting for the next opportunity to strike..'
    }

    const { embeddedMessage } = await getEasterHuntEventOutcomePage({ guildId, occurrenceDescription, occurrenceTitle })
    if (actionTaken.interaction) {
      await actionTaken.interaction.reply({
        embeds: embeddedMessage,
        ephemeral: false,
      })
    } else {
      await eventChannel.send({
        embeds: embeddedMessage,
        ephemeral: false,
      })
    }
    return updatedEventData
  }

} 
