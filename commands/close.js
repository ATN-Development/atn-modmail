const { Command } = require('yuuko')
const { ModMailCategoryID, ModMailLogID } = require('../config')

// This command will be used to close a modmail.
module.exports = new Command('close', async (message, arguments, ctx) => {
  // If the channel's category is not modmail one and if channel ID is logs channel ID, return an error message.
  if (message.channel.parentID !== ModMailCategoryID || message.channel.id === ModMailLogID) return message.channel.createMessage('Please use the command in a ModMail channel.')

  // Searches the member of the modmail through the channel's name, in the future I will add a way to make it even better through ID in the modmail channel's topic so the bot will not mess up something.
  let member = message.channel.guild.members.find(m => m.username.toLowerCase().split(' ').join('-') === message.channel.name)
  let user = ctx.client.users.get(member.id)
  let dm = await user.getDMChannel()
  let logsChannel = message.channel.guild.channels.find(ch => ch.id === ModMailLogID)
  await dm.createMessage({
    content: '',
    embed: {
      title: 'ModMail Closed',
      description: 'Thanks for reaching to us! Feel free to DM this bot to get help next time too.',
      footer: {
        text: message.channel.guild.name + ' Staff',
        icon_url: message.channel.guild.iconURL
      },
      color: 0xBEECCD
    }
  })
  await message.channel.delete()
  await logsChannel.createMessage({
    content: '',
    embed: {
      title: 'ModMail Closed',
      description: `Opened by ${member.username}`,
      footer: {
        text: message.author.username,
        icon_url: message.author.avatarURL
      }
    }
  })
}, {
  guildOnly: true,
  custom: async (message, arguments, ctx) => {
    if (message.channel.type !== 1) {
      return true
    } else {
      return false
    }
  }
})

module.exports.help = {
  desc: 'Closes a modmail.'
}