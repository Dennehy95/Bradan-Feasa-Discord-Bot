const {
  triggerBunnyAmbushOutcome,
} = require('../../../../../../src/Events/Client/SeasonalEvents/Easter/evilBunnyOccurrences/bunnyAmbushOutcome'); // Replace with the actual file name

const {
  getEasterHuntEventOutcomePage,
  rollD20,
  allParticipantsKilled,
} = require('../../../../../SeasonalEvents/getEasterHuntEventOutcomePage');

jest.mock('../../../../../../src/SeasonalEvents/getEasterHuntEventOutcomePage');
jest.mock('../../../../../../src/Events/Client/SeasonalEvents/utils');

describe('triggerBunnyAmbushOutcome', () => {
  beforeEach(() => {
    // Clear all mock implementations and calls before each test
    jest.clearAllMocks();
  });

  test('should trigger bunny ambush outcome successfully', async () => {
    // Mock external functions
    getEasterHuntEventOutcomePage.mockResolvedValue({ embeddedMessage: 'mockedEmbeddedMessage' });
    rollD20.mockReturnValue(10); // Mocking a roll that is less than 11

    // Mock input data
    const eventData = {
      currentOccurrence: {
        selectedParticipants: [
          { userId: 'user1', username: 'User1', isAlive: true },
          { userId: 'user2', username: 'User2', isAlive: true },
        ],
      },
      participants: [
        { userId: 'user1', isAlive: true },
        { userId: 'user2', isAlive: true },
      ],
      isEventOver: false,
    };

    const actionTaken = {
      interaction: { reply: jest.fn() },
    };
    const eventChannel = { send: jest.fn() };
    const guildId = 'mockGuildId';
    const occurrenceAction = 'mockOccurrenceAction';
    const updatedEventData = eventData;

    // Run the function
    const result = await triggerBunnyAmbushOutcome({
      actionTaken,
      eventChannel,
      guildId,
      occurrenceAction,
      updatedEventData,
    });

    // Assert the result and function calls
    expect(result).toEqual(updatedEventData);
    expect(getEasterHuntEventOutcomePage).toHaveBeenCalledWith({
      guildId,
      occurrenceDescription: expect.any(String),
      occurrenceTitle: expect.any(String),
    });

    if (actionTaken.interaction) {
      expect(actionTaken.interaction.reply).toHaveBeenCalledWith({
        embeds: 'mockedEmbeddedMessage',
        ephemeral: false,
      });
    } else {
      expect(eventChannel.send).toHaveBeenCalledWith({
        embeds: 'mockedEmbeddedMessage',
        ephemeral: false,
      });
    }
  });

  // Add more tests for different scenarios and edge cases
});
