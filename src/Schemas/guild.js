const { model, Schema } = require('mongoose');
const { nanoid } = require('nanoid');
const { easterHuntSchema } = require('./easterHuntSchema');


const movieListSchema = new Schema({
  name: String,
  genre: String,
  description: String,
  imageURL: String,
  isMovieWatched: String,
  movieURL: String,
  _id: {
    type: String,
    default: () => nanoid(),
  },
})

const moviesDataSchema = new Schema({
  genreList: [String],
  movieList: [
    movieListSchema
  ]
})

const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  easterHunt: easterHuntSchema,
  guildId: String,
  guildName: String,
  moviesData: moviesDataSchema
})



module.exports = model('Guild', guildSchema, 'guilds');