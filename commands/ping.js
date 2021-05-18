const { Command } = require('yuuko')

// Basic ping command for seeing if the bot is online or not, nothing much.
module.exports = new Command('ping', (message, arguments, ctx) => {
  message.channel.createMessage('Pong!')
}, {
  custom: async (message, arguments, ctx) => {
    if (message.channel.type !== 1) {
      return true
    } else {
      return false
    }
  }
})

// Export some stuff that we will need for a basic help command.
module.exports.help = {
  desc: 'See if the bot is online!'
}