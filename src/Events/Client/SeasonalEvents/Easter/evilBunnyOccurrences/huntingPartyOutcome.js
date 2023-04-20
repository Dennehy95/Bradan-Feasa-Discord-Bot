
const { getEasterHuntEventOutcomePage } = require('../../../../../SeasonalEvents/getEasterHuntEventOutcomePage');
const { rollD20 } = require('../../utils');
const { allParticipantsKilled } = require('../easterEvilBunnyHuntUtils');
const { BUNNY_ATTACKS, PARTICIPANT_DEATH_MESSAGES, PARTICIPANT_ESCAPE_MESSAGES, PARTICIPANT_ATTACKS } = require('./easterEvilBunnyOccurrencesConstants');

/**
 * Hunting Party
 * 
 * 2-4 Participants get the chance to answer. They can either hunt the bunny or hide or one member can trick the others into going without them.
 * If they hunt, each one gets a 1/8 chance to hurt the bunny (The chance will probably be dynamic later. Same with Bunny health and players may have stat boosts and stuff) 
 * They also have a chance to be killed by Bunny. Many can die, many can hurt. If Bunny hits 0 that person gets the kill
 */

module.exports = {
  async triggerHuntingPartyOutcome ({ actionTaken = {}, eventChannel, guildId, occurrenceAction, updatedEventData }) {
    const selectedParticipants = updatedEventData.currentOccurrence.selectedParticipants
    let occurrenceDescription = ''
    let occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Hunt!`
    switch (occurrenceAction?.name) {
      case 'goOnHunt':
        const difficultyModifier = 0 // TODO get this from event. Based on the initial amount of participants. Harder if more people
        const initialRoll = rollD20(difficultyModifier)
        occurrenceDescription = 'The party sets out to hunt the evil Bunny.\n'
        let usedMessages = [];
        let bunnyDefeated = false
        let bunnyHurt = false

        // DO AMBUSH
        if (initialRoll < 5) {
          occurrenceDescription = 'However, they were not careful and the Bunny was able to ambush them!\n\u200b\n'
          occurrenceTitle = `Bradán Feasa - Easter 'Evil Bunny' - Hunt Ambush!`
          selectedParticipants.forEach((selectedParticipant) => {
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
        }

        // Do not found
        else if (initialRoll < 15) {
          occurrenceDescription += 'They searched for hours but could not find the Bunny. They give up and go back to the town for the night.\n'
        }
        // Do found bunny
        else {
          occurrenceDescription = 'They were able to find large paw-prints and tracked them to find the Bunny!\n\u200b\n'
          selectedParticipants.forEach((selectedParticipant) => {
            const username = selectedParticipant.username;

            const attackRoll = rollD20(difficultyModifier)
            if (attackRoll < 5) {
              const participantIndex = updatedEventData.participants.findIndex((participant) => {
                return participant.userId === selectedParticipant.userId
              })
              console.log(selectedParticipant)
              console.log(participantIndex)
              console.log(updatedEventData.participants)
              updatedEventData.participants[participantIndex].isAlive = false

              const availableParticipantDeathMessages = PARTICIPANT_DEATH_MESSAGES.filter(message => !usedMessages.includes(message));
              const randomDeathMessageIndex = Math.floor(Math.random() * availableParticipantDeathMessages.length);
              usedMessages.push(availableParticipantDeathMessages[randomDeathMessageIndex]);
              const selectedDeathMessage = availableParticipantDeathMessages[randomDeathMessageIndex].replace("{USERNAME}", username);
              occurrenceDescription += selectedDeathMessage + '\n\u200b\n'
            }
            else if (attackRoll < 15) {
              const availableEscapeMessages = PARTICIPANT_ESCAPE_MESSAGES.filter(message => !usedMessages.includes(message));
              const randomEscapeMessageIndex = Math.floor(Math.random() * availableEscapeMessages.length);
              usedMessages.push(availableEscapeMessages[randomEscapeMessageIndex]);
              const selectedEscapeMessage = availableEscapeMessages[randomEscapeMessageIndex].replace("{USERNAME}", username);
              occurrenceDescription += selectedEscapeMessage + '\n\u200b\n'
            }
            else {
              const availableParticipantAttacks = PARTICIPANT_ATTACKS.filter(message => !usedMessages.includes(message));
              const randomAttackIndex = Math.floor(Math.random() * availableParticipantAttacks.length);
              usedMessages.push(availableParticipantAttacks[randomAttackIndex]);
              const selectedParticipantAttack = availableParticipantAttacks[randomAttackIndex].replace("{USERNAME}", username);
              occurrenceDescription += selectedParticipantAttack + '\n'

              updatedEventData.evilBunny.health -= 1
              bunnyHurt = true
              if (updatedEventData.evilBunny.health <= 0) bunnyDefeated = true
            }
          })
        }

        //TODO
        // Check if bunny is alive. If hurt say it runs off, if ev
        if (bunnyDefeated) {
          occurrenceDescription += 'The bunny was defeated' + '\n\u200b\n'
          updatedEventData.isEventOver = true
        }
        // TODO Everyone killed
        else if (allParticipantsKilled(updatedEventData.participants)) {
          updatedEventData.isEventOver = true
          occurrenceDescription += 'All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed' + '\n\u200b\n'
        }
        else if (bunnyHurt) {
          occurrenceDescription += 'The bunny was hurt and retreated away' + '\n\u200b\n'
        }
        else {
          occurrenceDescription += 'The bunny lives another day' + '\n\u200b\n'
        }
        break;

      case 'hide':
        console.log('hiding')
        // Roll once. If successful the party hide and nothing happens, if major fail they are caught and one of them risks being exiled
        break;
      case 'trickOtherHunters':
        console.log('tricking')
        // The user gets to hide successfully. The others go on the hunt as in the first action
        break;
      default:
        console.log('No action taken');
        occurrenceDescription += 'No action taken'
        // Either you feel asleep, or you forgot to go on hunt
        // Random chance, either King chastises the group and nothing happens, or one member is exiled from the city and Eaten by the Bunny
        break;
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