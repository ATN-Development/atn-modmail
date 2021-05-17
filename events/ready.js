const { EventListener } = require('yuuko')

// Listen to the ready event and log in the console once the bot is ready.
module.exports = new EventListener('ready', () => {
  console.log('Ready')
})