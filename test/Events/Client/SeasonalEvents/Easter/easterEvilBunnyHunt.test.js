
const Guild = require('../../../../../src/Schemas/guild');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { getEasterHuntEventOutcomePage } = require('../../../../../src/SeasonalEvents/getEasterHuntEventOutcomePage');
jest.mock('../../../../../src/SeasonalEvents/getEasterHuntEventOutcomePage');

const { noParticipantsEventStart, getActiveEventServers, doEasterEventForServer } = require('../../../../../src/Events/Client/SeasonalEvents/Easter/easterEvilBunnyHunt');
const { defaultEasterHuntData } = require('../../../../../src/Schemas/easterHuntSchema');

describe('noParticipantsEventStart', () => {
  let mockEventChannel, mockGuildId, mockGuildProfileId, mockGuild;

  beforeEach(() => {
    mockEventChannel = { send: jest.fn() };
    mockGuildId = '12345';
    mockGuildProfileId = '60b5b5b5b5b5b5b5b5b5b5b5'; // a valid ObjectId string

    mockGuild = { _id: mockGuildProfileId, easterHunt: {} };

    // mock external function calls
    Guild.findOne = jest.fn().mockResolvedValue(mockGuild);
    Guild.updateOne = jest.fn().mockResolvedValue();
    getEasterHuntEventOutcomePage.mockClear();

  });

  test('should update the Guild document and send a message to the event channel', async () => {
    const expectedEmbeds = [{ title: 'Some title', description: 'Some description' }];
    const expectedOptions = { embeds: expectedEmbeds, ephemeral: false };

    // mock external function calls
    getEasterHuntEventOutcomePage.mockResolvedValue({ embeddedMessage: expectedEmbeds });

    await noParticipantsEventStart({
      eventChannel: mockEventChannel,
      guildId: mockGuildId,
      guildProfileId: mockGuildProfileId,
    });

    expect(Guild.updateOne).toHaveBeenCalledWith(
      { _id: mockGuildProfileId },
      { $set: { easterHunt: defaultEasterHuntData } }
    );
    expect(mockEventChannel.send).toHaveBeenCalledWith(expectedOptions);
  });
})

describe('getActiveEventServers', () => {
  let mockClient, mockActiveEventServers, mockGuilds;

  beforeEach(() => {
    mockActiveEventServers = [{ guildId: '123', easterHunt: { eventState: 'inProgress' } }, { guildId: '456', easterHunt: { eventState: 'preEvent' } },];
    mockGuilds = [{ id: '123', name: 'Guild 1' }, { id: '789', name: 'Guild 2' },];
    mockClient = {
      guilds: {
        cache: mockGuilds,
        find: (guildId) => mockGuilds.find((guild) => guild.id === guildId),
      },
    };

    Guild.find = jest.fn().mockResolvedValue(mockActiveEventServers);
  });

  test('should return an array of client servers with active events', async () => {
    const expectedOutput = [mockGuilds[0]];
    const actualOutput = await getActiveEventServers(mockClient);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test('should return an empty array if there are no active events', async () => {
    Guild.find.mockResolvedValue([]);
    const actualOutput = await getActiveEventServers(mockClient);

    expect(actualOutput).toEqual([]);
  });

  test('should catch and log any errors', async () => {
    const mockError = new Error('Failed to get active event servers');
    Guild.find.mockRejectedValue(mockError);
    console.error = jest.fn(); // mock console.error to prevent logs during test

    const actualOutput = await getActiveEventServers(mockClient);

    expect(actualOutput).toEqual([]);
    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});

describe('doEasterEventForServer', () => {
  let mongoServer;
  let client;
  let server;

  beforeAll(async () => {
    // mongoServer = new MongoMemoryServer();
    // const mongoUri = await mongoServer.getUri();
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Create a new Guild document before each test
    const guildProfile = new Guild({
      guildId: server.id,
      easterHunt: { eventState: 'preEvent', isEventOver: false }
    });
    await guildProfile.save();
  });

  afterEach(async () => {
    // Remove all Guild documents after each test
    await Guild.deleteMany({});
  });

  it.only('updates the guild profile when the event is over', async () => {
    const guildProfile = await Guild.findOne({ guildId: server.id });
    guildProfile.easterHunt.isEventOver = true;
    await guildProfile.save();

    const result = await doEasterEventForServer({ client, server });
    const updatedGuildProfile = await Guild.findOne({ guildId: server.id });

    expect(result).not.toBeFalsy();
    expect(updatedGuildProfile.easterHunt).toEqual(expect.objectContaining({ isEventOver: false }));
  });

  it('does nothing when the event state is not preEvent or inProgress', async () => {
    const guildProfile = await Guild.findOne({ guildId: server.id });
    guildProfile.easterHunt.eventState = 'postEvent';
    await guildProfile.save();

    const result = await doEasterEventForServer({ client, server });
    const updatedGuildProfile = await Guild.findOne({ guildId: server.id });

    expect(result).toBeUndefined();
    expect(updatedGuildProfile.easterHunt.eventState).toBe('postEvent');
  });

  it('handles preEvent state correctly', async () => {
    const guildProfile = await Guild.findOne({ guildId: server.id });

    const eventChannel = { /* mock eventChannel object */ };
    const currentDate = new Date();
    const updatedEventData = guildProfile.easterHunt;

    await doEasterEventForServer({ client, server });

    const updatedGuildProfile = await Guild.findOne({ guildId: server.id });

    expect(eventChannel.postMessage).toHaveBeenCalledTimes(1);
    expect(eventChannel.postMessage).toHaveBeenCalledWith(/* expected message */);
    expect(updatedGuildProfile.easterHunt.eventState).toBe('inProgress');
    expect(updatedGuildProfile.easterHunt.eventStartTime).toEqual(expect.any(Date));
    expect(updatedGuildProfile.easterHunt.eventEndTime).toEqual(expect.any(Date));
  })

  it('handles inProgress state correctly', async () => {
    const client = { /* mocked client object */ };
    const server = { id: 'test-server-id' };
    const guildProfile = { easterHunt: { eventState: 'inProgress' } };
    const eventChannel = { /* mocked event channel object */ };
    const currentDate = new Date();

    // Mock the handleInProgress function
    const handleInProgressMock = jest.fn();
    handleInProgressMock.mockImplementation(async () => { });

    jest.spyOn(Guild, 'findOne').mockResolvedValue(guildProfile);
    jest.spyOn(eventUtils, 'getEventChannel').mockReturnValue(eventChannel);
    jest.spyOn(Date, 'now').mockReturnValue(currentDate.getTime());
    jest.spyOn(eventUtils, 'handleInProgress').mockImplementation(handleInProgressMock);

    await doEasterEventForServer({ client, server });

    // Verify that the handleInProgress function was called with the correct arguments
    expect(handleInProgressMock).toHaveBeenCalledWith({
      eventChannel,
      eventData: guildProfile.easterHunt,
      currentDate,
      guildProfile,
      client,
      server
    });
  });
})