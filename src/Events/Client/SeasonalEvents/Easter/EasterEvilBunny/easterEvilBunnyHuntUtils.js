module.exports = {
  allParticipantsKilled(participants) {
    return !participants.some((participant) => participant.isAlive);
  },

  selectRandomMessage({ messages, usedMessages }) {
    let updatedUsedMessages = usedMessages;
    if (messages.length <= updatedUsedMessages.length) {
      updatedUsedMessages = [];
    }
    const availableMessages = messages.filter(
      (message) => !updatedUsedMessages.includes(message)
    );
    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    updatedUsedMessages.push(availableMessages[randomIndex]);
    return {
      selectedMessage: availableMessages[randomIndex],
      usedMessages: updatedUsedMessages,
    };
  },
};
