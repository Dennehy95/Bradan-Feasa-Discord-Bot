const _ = require('lodash');
const bunnyAmbushOutcome = require('../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/EvilBunnyOccurrences/BunnyAmbush/bunnyAmbushOutcome');
const INITIAL_MOCK_DATA = require('../bunnyOutcomeMockData.json');
const {
  sendEventOutcomeMessage,
} = require('../../../../../../src/Events/Client/SeasonalEvents/Easter/EasterEvilBunny/easterEvilBunnyHuntUtils');
let CLONED_MOCK_DATA = {};

describe('bunnyAmbushOutcome', () => {
  beforeEach(() => {
    CLONED_MOCK_DATA = _.cloneDeep(INITIAL_MOCK_DATA);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('generateInitialOccurrenceDescription', () => {
    test('should generate initial occurrence description for one participant', async () => {
      const result =
        await bunnyAmbushOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: [CLONED_MOCK_DATA.MOCK_PARTICIPANT_1],
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}> is caught in the ambush.\n​\n`
      );
    });
    test('should generate initial occurrence description for multiple participants', async () => {
      const result =
        await bunnyAmbushOutcome.generateInitialOccurrenceDescription({
          selectedParticipants: CLONED_MOCK_DATA.MOCK_SELECTED_PARTICIPANTS,
        });

      // Perform assertions on the result
      expect(result).toContain(
        `<@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_1.userId}>, <@${CLONED_MOCK_DATA.MOCK_PARTICIPANT_2.userId}> are caught in the ambush.\n​\n`
      );
    });
  });

  describe('simulateAmbushEvent', () => {
    test('should simulate the event successfully', async () => {
      const data = {
        difficultyModifier: 0,
        occurrenceDescription: 'Initial description ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      };
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll if killed
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random death message selection
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Dice roll bunny attack
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0.99999); // Dice roll if escape
      jest.spyOn(global.Math, 'random').mockReturnValueOnce(0); // Random escape message selection
      const result = await bunnyAmbushOutcome.simulateAmbushEvent(data);

      expect(result).toEqual({
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
        occurrenceDescription: `Initial description With lightning speed, the bunny hopped towards MockUser1Username, razor-sharp eggs flying in all directions.\nMockUser1Username stumbles backwards as the bunny's massive paw connects with their chest, knocking them to the ground and leaving them gasping for air. A final swipe and MockUser1Username is no more\n\u200b\nThe bunny hops towards MockUser2Username, its beady eyes glowing with malevolence as it strikes with its sharp claws!\nAs the evil Easter Bunny closed in, MockUser2Username scrambled up a nearby tree and managed to get out of reach just in the nick of time!\n\u200b\n`,
      });
      // @ts-ignore
      global.Math.random.mockRestore();
    });
  });

  describe('handleEventOutcome', () => {
    test('should return message when all participants are killed', async () => {
      CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA.participants =
        CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA.participants.map(
          (participant) => (participant.isAlive = false)
        );
      const result = await bunnyAmbushOutcome.handleEventOutcome({
        occurrenceDescription: 'InitialDescription: ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      });
      expect(result).toEqual({
        occurrenceDescription:
          'InitialDescription: All of the volunteer hunters have been defeated by the Bunny. The town is unprotected and is destroyed\n\u200b\n',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      });
    });
    test('should return message when bunny retreats', async () => {
      const result = await bunnyAmbushOutcome.handleEventOutcome({
        occurrenceDescription: 'InitialDescription: ',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      });
      expect(result).toEqual({
        occurrenceDescription:
          'InitialDescription: The Bunny retreats again, waiting for the next opportunity to strike..',
        updatedEventData: CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA,
      });
    });
  });

  describe('sendEventOutcomeMessage', () => {
    test('should send message to interaction reply if interaction is provided', () => {
      const mockEventChannel = CLONED_MOCK_DATA.MOCK_EVENT_CHANNEL;
      const mockActionTaken = { interaction: {} };
      mockActionTaken.interaction.reply = jest.fn();
      const mockEmbeddedMessage = CLONED_MOCK_DATA.MOCK_EMBEDDED_MESSAGE;
      const mockActionTakenSpy = jest.spyOn(
        mockActionTaken.interaction,
        // @ts-ignore
        'reply'
      );

      sendEventOutcomeMessage({
        actionTaken: mockActionTaken,
        eventChannel: mockEventChannel,
        embeddedMessage: mockEmbeddedMessage,
      });

      expect(mockActionTakenSpy).toHaveBeenCalledWith({
        embeds: mockEmbeddedMessage,
        ephemeral: false,
      });

      // @ts-ignore
      mockActionTakenSpy.mockRestore();
    });

    test('should send message to channel if interaction is not provided', () => {
      const mockEventChannel = CLONED_MOCK_DATA.MOCK_EVENT_CHANNEL;
      mockEventChannel.send = jest.fn();
      const mockActionTaken = {}; // No interaction provided
      const mockEmbeddedMessage = CLONED_MOCK_DATA.MOCK_EMBEDDED_MESSAGE;
      const eventChannelSendSpy = jest.spyOn(mockEventChannel, 'send');

      sendEventOutcomeMessage({
        actionTaken: mockActionTaken,
        eventChannel: mockEventChannel,
        embeddedMessage: mockEmbeddedMessage,
      });

      expect(eventChannelSendSpy).toHaveBeenCalledWith({
        embeds: mockEmbeddedMessage,
        ephemeral: false,
      });

      eventChannelSendSpy.mockRestore();
    });
  });

  // describe('triggerBunnyAmbushOutcome', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });
  //   test('should trigger Bunny Ambush Outcome and return updatedEventData', async () => {
  //     const mockActionTaken = {};

  //     const mockEventChannel = CLONED_MOCK_DATA.MOCK_EVENT_CHANNEL;

  //     const mockGuildId = 'mockGuildId';

  //     const mockOccurrenceAction = {
  //       // Your mock occurrence action data
  //     };

  //     const mockUpdatedEventData = CLONED_MOCK_DATA.MOCK_UPDATED_EVENT_DATA;

  //     // Set up mock implementations for utility functions
  //     // generateInitialOccurrenceDescription.mockResolvedValue('mockedInitialDescription');
  //     // simulateAmbushEvent.mockResolvedValue('mockedSimulatedEventDescription');
  //     // handleEventOutcome.mockResolvedValue('mockedFinalEventDescription');
  //     // getEasterHuntEventOutcomePage.mockResolvedValue({
  //     //   embeddedMessage: 'mockedEmbeddedMessage',
  //     // });

  //     // Call the function
  //     const result = await bunnyAmbushOutcome.triggerBunnyAmbushOutcome({
  //       actionTaken: mockActionTaken,
  //       eventChannel: mockEventChannel,
  //       guildId: mockGuildId,
  //       occurrenceAction: mockOccurrenceAction,
  //       updatedEventData: mockUpdatedEventData,
  //     });

  //     // Assertions
  //     expect(result).toEqual(mockUpdatedEventData);

  //     // Verify utility functions were called with expected parameters
  //     // expect(generateInitialOccurrenceDescription).toHaveBeenCalledWith({
  //     //   selectedParticipants: mockUpdatedEventData.currentOccurrence.selectedParticipants,
  //     // });

  //     // expect(simulateAmbushEvent).toHaveBeenCalledWith({
  //     //   difficultyModifier: 0,
  //     //   occurrenceDescription: 'mockedInitialDescription',
  //     //   updatedEventData: mockUpdatedEventData,
  //     // });

  //     // expect(handleEventOutcome).toHaveBeenCalledWith({
  //     //   occurrenceDescription: 'mockedSimulatedEventDescription',
  //     //   updatedEventData: mockUpdatedEventData,
  //     // });

  //     // expect(getEasterHuntEventOutcomePage).toHaveBeenCalledWith({
  //     //   guildId: mockGuildId,
  //     //   occurrenceDescription: 'mockedFinalEventDescription',
  //     //   occurrenceTitle: "Bradán Feasa - Easter 'Evil Bunny' - Ambush!",
  //     // });

  //     // expect(sendEventOutcomeMessage).toHaveBeenCalledWith({
  //     //   actionTaken: mockActionTaken,
  //     //   eventChannel: mockEventChannel,
  //     //   embeddedMessage: 'mockedEmbeddedMessage',
  //     // });
  //   });
  // });
});

// {
//   actionId: null,
//   interaction: null,
//   messageCreatedTimestamp: null,
//   occurrenceIndex: null,
//   userId: null
// }
// null
// [
//   EmbedBuilder {
//     data: {
//       color: 1752220,
//       footer: [Object],
//       image: undefined,
//       thumbnail: undefined,
//       title: "Bradán Feasa - Easter 'Evil Bunny' - Ambush!",
//       description: '<@142348873711616000> is caught in the ambush.\n' +
//         '​\n' +
//         'As dangersalmon turns to run, the bunny starts to grow in size, its eyes glowing an eerie red as it charges towards them with deadly intent!\n' +
//         'As the evil Easter Bunny closed in, dangersalmon scrambled up a nearby tree and managed to get out of reach just in the nick of time!\n' +
//         '​\n' +
//         'The Bunny retreats again, waiting for the next opportunity to strike..\n' +
//         'dangersalmon',
//       fields: [Array]
//     }
//   }
// ]
// [
//   EmbedBuilder {
//     data: {
//       color: 1752220,
//       footer: [Object],
//       image: undefined,
//       thumbnail: undefined,
//       title: "Bradán Feasa - Easter 'Evil Bunny' - Ambush!",
//       description: '<@142348873711616000> is caught in the ambush.\n' +
//         '​\n' +
//         'As dangersalmon turns to run, the bunny starts to grow in size, its eyes glowing an eerie red as it charges towards them with deadly intent!\n' +
//         'As the evil Easter Bunny closed in, dangersalmon scrambled up a nearby tree and managed to get out of reach just in the nick of time!\n' +
//         '​\n' +
//         'The Bunny retreats again, waiting for the next opportunity to strike..\n' +
//         'dangersalmon',
//       fields: [Array]
//     }
//   }
// ]
// <ref *2> TextChannel {
//   type: 0,
//   guild: <ref *1> Guild {
//     id: '142349704280276992',
//     name: 'denneland',
//     icon: 'bc80fc049905108430e2626b94c2491e',
//     features: [ 'EXPOSED_TO_ACTIVITIES_WTP_EXPERIMENT' ],
//     commands: GuildApplicationCommandManager {
//       permissions: [ApplicationCommandPermissionsManager],
//       guild: [Circular *1]
//     },
//     members: GuildMemberManager { guild: [Circular *1] },
//     channels: GuildChannelManager { guild: [Circular *1] },
//     bans: GuildBanManager { guild: [Circular *1] },
//     roles: RoleManager { guild: [Circular *1] },
//     presences: PresenceManager {},
//     voiceStates: VoiceStateManager { guild: [Circular *1] },
//     stageInstances: StageInstanceManager { guild: [Circular *1] },
//     invites: GuildInviteManager { guild: [Circular *1] },
//     scheduledEvents: GuildScheduledEventManager { guild: [Circular *1] },
//     autoModerationRules: AutoModerationRuleManager { guild: [Circular *1] },
//     available: true,
//     shardId: 0,
//     splash: null,
//     banner: null,
//     description: null,
//     verificationLevel: 0,
//     vanityURLCode: null,
//     nsfwLevel: 0,
//     premiumSubscriptionCount: 0,
//     discoverySplash: null,
//     memberCount: 10,
//     large: false,
//     premiumProgressBarEnabled: false,
//     applicationId: null,
//     afkTimeout: 300,
//     afkChannelId: null,
//     systemChannelId: null,
//     premiumTier: 0,
//     widgetEnabled: null,
//     widgetChannelId: null,
//     explicitContentFilter: 0,
//     mfaLevel: 0,
//     joinedTimestamp: 1673628947268,
//     defaultMessageNotifications: 0,
//     systemChannelFlags: SystemChannelFlagsBitField { bitfield: 0 },
//     maximumMembers: 500000,
//     maximumPresences: null,
//     maxVideoChannelUsers: 25,
//     maxStageVideoChannelUsers: 50,
//     approximateMemberCount: null,
//     approximatePresenceCount: null,
//     vanityURLUses: null,
//     rulesChannelId: null,
//     publicUpdatesChannelId: null,
//     preferredLocale: 'en-US',
//     ownerId: '142348873711616000',
//     emojis: GuildEmojiManager { guild: [Circular *1] },
//     stickers: GuildStickerManager { guild: [Circular *1] }
//   },
//   guildId: '142349704280276992',
//   parentId: null,
//   permissionOverwrites: PermissionOverwriteManager { channel: [Circular *2] },
//   messages: MessageManager { channel: [Circular *2] },
//   threads: GuildTextThreadManager { channel: [Circular *2] },
//   nsfw: false,
//   flags: ChannelFlagsBitField { bitfield: 0 },
//   id: '142349704280276992',
//   name: 'general',
//   rawPosition: 0,
//   topic: null,
//   lastMessageId: '1181287014612619435',
//   rateLimitPerUser: 0
// }

// eventData
// {
//   currentOccurrence: {
//     minimumSelectedParticipants: 1,
//     maximumSelectedParticipants: 4,
//     messageDescription: 'Suddenly the Bunny bursts from the bushes and begins attacking some unsuspecting victims!\n',
//     messageTitle: "Bradán Feasa - Easter 'Evil Bunny' - Ambush!",
//     occurrenceName: 'ambush',
//     selectedParticipants: [ [Object] ],
//     _id: new ObjectId("656fa34ccc5055bcc342d243"),
//     actions: []
//   },
//   currentOccurrenceEndDate: null,
//   currentOccurrenceIndex: 2,
//   eventState: 'inProgress',
//   evilBunny: { health: 3, _id: new ObjectId("656fa260cc5055bcc342d21d") },
//   eventStartTime: 2023-12-05T22:22:20.156Z,
//   eventStartTimeText: '1 minute',
//   isEventOver: false,
//   nextOccurrenceDate: 2023-12-05T22:25:15.691Z,
//   participants: [
//     {
//       isAlive: true,
//       userId: '142348873711616000',
//       username: 'dangersalmon',
//       _id: 'Vkl9KTl1t2P2xyyvR8vPv'
//     }
//   ],
//   _id: new ObjectId("656fa260cc5055bcc342d21b")
// }

// UPDATED EVENT DATA
// "currentOccurrence": {
//   "minimumSelectedParticipants": 1,
//   "maximumSelectedParticipants": 4,
//   "messageDescription": "<messageDescription>",
//   "messageTitle": "Bradán Feasa - Easter 'Evil Bunny' - Ambush!",
//   "occurrenceName": "ambush",
//   "selectedParticipants": [
//     {
//       "isAlive": true,
//       "userId": "142348873711616000",
//       "username": "dangersalmon",
//       "_id": "Vkl9KTl1t2P2xyyvR8vPv"
//     }
//   ],
//   "_id": {
//     "$oid": "656fa34ccc5055bcc342d243"
//   },
//   "actions": []
// },
// "currentOccurrenceEndDate": null,
// "currentOccurrenceIndex": 2,
// "eventState": "inProgress",
// "evilBunny": {
//   "health": 3,
//   "_id": {
//     "$oid": "656fa260cc5055bcc342d21d"
//   }
// },
// "eventStartTime": "2023-12-05T22:22:20.156Z",
// "eventStartTimeText": "1 minute",
// "isEventOver": false,
// "nextOccurrenceDate": "2023-12-05T22:25:15.691Z",
// "participants": [
//   {
//     "isAlive": true,
//     "userId": "142348873711616000",
//     "username": "dangersalmon",
//     "_id": "Vkl9KTl1t2P2xyyvR8vPv"
//   }
// ],
// "_id": {
//   "$oid": "656fa260cc5055bcc342d21b"
// }
