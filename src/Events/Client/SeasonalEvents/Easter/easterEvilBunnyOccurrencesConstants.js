const DEFAULT_EASTER_HUNT_HUNTING_OCCURRENCE_ACTIONS = [
  {
    id: 0,
    label: 'Go on the Hunt',
    name: 'goOnHunt'
  }, {
    id: 1,
    label: 'Hide',
    name: 'hide'
  }, {
    id: 2,
    label: 'Trick Other Hunters',
    name: 'trickOtherHunters'
  }
];

module.exports = {
  DEFAULT_EASTER_HUNT_HUNTING_OCCURRENCE: {
    actions: DEFAULT_EASTER_HUNT_HUNTING_OCCURRENCE_ACTIONS,
    eventName: 'Hunting Party',
    minimumSelectedParticipants: 1,
    maximumSelectedParticipants: 4,
    messageDescription: 'The King has chosen you to lead a hunt for the Evil Bunny. What will you do?\n',
    messageTitle: 'Bradán Feasa - Easter \'Evil Bunny\' - Time to Hunt!',
    selectedParticipants: [],
  }
}