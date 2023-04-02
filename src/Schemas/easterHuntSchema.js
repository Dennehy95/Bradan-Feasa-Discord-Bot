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

/*
eventState: notStarted, preEvent, inProgress
*/

module.exports = {
  defaultEasterHuntData: {
    evilBunny: { health: 3 },
    isEventTurnedOn: false,
    eventState: 'notStarted',
    participants: [],
    updated: new Date(),
  },
  easterHuntSchema: new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    eventState: { type: String, default: 'notStarted', required: true },
    evilBunny: evilBunnySchema,
    eventStartTime: Date,
    isEventTurnedOn: { type: Boolean, default: false, required: true },
    participants: [participantsSchema],
    updated: {
      type: Date,
      default: Date.now
    }
  })
}