const { model, Schema } = require('mongoose');
const guildSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  guildName: String,
  moviesData: Object
})

module.exports = model('Guild', guildSchema, 'guilds');