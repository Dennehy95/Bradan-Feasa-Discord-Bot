module.exports = {
  allParticipantsKilled (participants) {
    return !participants.some((participant) => participant.isAlive)
  }
}