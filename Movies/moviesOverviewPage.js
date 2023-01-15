// const { createButtonComponent, createEmbedMessage } = require('../Utils/discordEmbedUtils.js')
// const storage = require('node-persist')

// function getGameHistoryButton () {
//   return { 'type': 1, 'components': [createButtonComponent('History', 'history', 'open')] }
// }

function getComponentsMoviesOverviewPage (gameInfo) {
  let components = [
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `Add a Movie`,
          "custom_id": `AddMovieButton`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `Random Movie`,
          "custom_id": `GetRandomMovie`,
          "disabled": false,
          "type": 2
        }
      ]
    },
    {
      "type": 1,
      "components": [
        {
          "custom_id": `SelectGenreMenu`,
          "placeholder": `Select Genre`,
          "options": [
            {
              "label": `All Genres`,
              "value": `All Genres`,
              "default": true
            }
          ],
          "min_values": 1,
          "max_values": 1,
          "type": 3
        }
      ]
    }
  ]

  return components
}

export const getMoviesOverviewPage = async (server) => {
  const components = getComponentsMoviesOverviewPage()
  // const embedColor = '0xabffcd'
  // const embedFooter = '\u200b'
  // const embedImage = ''
  // const fields = [{ name: 'Saved Games', value: '\u200B' }, { name: 'Save1: ', value: Save1Info }, { name: 'Save2: ', value: Save2Info }, { name: 'Save3: ', value: Save3Info }]
  // const messageTitle = 'Movies'
  // let messageDescription = 'Player: ' + user.username + '\n\n > Enter the land of Garbonzia and take on the role of one of 3 heroes, each with their own motives and backstory. Explore new locations, interact with witty characters and make tough, story defining decisions as you live vicariously through your chosen champion. Will you survive to your journeys end? And if you do, will you be satisfied with the life you have lived?'

  // const embeddedMessage = createEmbedMessage({ embedColor, embedFooter, embedImage, fields, messageDescription, messageTitle })
  // return { components, embeddedMessage }
  return { components }
}