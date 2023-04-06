const { model, Schema } = require('mongoose');
const { nanoid } = require('nanoid');

// const easterHuntDataSchema = new Schema({
//   name: String,
//   genre: String,
//   description: String,
//   imageURL: String,
//   isMovieWatched: String,
//   movieURL: String,
//   _id: {
//     type: String,
//     default: () => nanoid(),
//   },
// })

const evilBunnySchema = new Schema({
  health: { type: Number, required: true }
})

const participantsSchema = new Schema({
  isAlive: Boolean,
  userId: { type: String, required: true },
  username: { type: String, required: true },
  _id: {
    type: String,
    default: () => nanoid(),
  },
})

const actionSchema = new Schema({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  name: { type: String, required: true },
})

const occurrenceSchema = new Schema({
  actions: [actionSchema],
  eventName: { type: String, required: true },
  minimumSelectedParticipants: { type: Number },
  maximumSelectedParticipants: { type: Number },
  messageDescription: { type: String },
  messageTitle: { type: String },
  selectedParticipants: [participantsSchema],
})


/*
eventState: notStarted, preEvent, inProgress
*/

module.exports = {
  defaultEasterHuntData: {
    currentOccurrence: {},
    currentOccurrenceIndex: 0,
    evilBunny: { health: 3 },
    eventState: 'notStarted',
    isEventOver: false,
    participants: [],
  },
  easterHuntSchema: new Schema({
    currentOccurrence: occurrenceSchema,
    currentOccurrenceEndDate: Date,
    currentOccurrenceIndex: { type: Number, default: 0, required: true },
    eventCreatedDate: Date,
    eventState: { type: String, default: 'notStarted', required: true },
    evilBunny: evilBunnySchema,
    eventStartTime: Date,
    isEventOver: Boolean,
    nextOccurrenceDate: Date,
    participants: [participantsSchema],
  })
}