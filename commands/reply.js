const { Command } = require('yuuko')
const { ModMailCategoryID, ModMailLogID, DefaultColor } = require('../config')

// Exporting a new command that is useful for replying to users who actually write to modmail.
module.exports = new Command(['reply', 'r'], async (message, arguments, ctx) => {
  // If the channel's category is not modmail one and if channel ID is logs channel ID, return an error message.
  if (message.channel.parentID !== ModMailCategoryID || message.channel.id === ModMailLogID) return message.channel.createMessage('Please use the command in a ModMail channel.')
  

  // Checks if there are enough arguments to reply a modmail. If there aren't any, return an error message.
  if (arguments.length < 1) return message.channel.createMessage('Please specify a text to send.')

  // Searches the member of the modmail through the channel's name, in the future I will add a way to make it even better through ID in the modmail channel's topic so the bot will not mess up something.
  let member = message.channel.guild.members.find(m => m.username.toLowerCase().split(' ').join('-') === message.channel.name)
  let user = ctx.client.users.get(member.id)
  let dm = await user.getDMChannel()
  if (message.attachments.length > 0) {
    await dm.createMessage({
      content: '',
      embed: {
        title: 'Staff Team',
        description: arguments.join(' '),
        color: DefaultColor,
        footer: {
          text: message.channel.guild.name + ' Staff',
          icon_url: message.channel.guild.iconURL
        },
        image: {
          url: message.attachments[0].url
        }
      }
    })
  } else {
    await dm.createMessage({
      content: '',
      embed: {
        title: 'Staff Team',
        description: arguments.join(' '),
        color: DefaultColor,
        footer: {
          text: message.channel.guild.name + ' Staff',
          icon_url: message.channel.guild.iconURL
        }
      }
    })
  }
  await message.delete()
  await message.channel.createMessage({
    content: '',
    embed: {
      title: message.author.username,
      description: arguments.join(' '),
      footer: {
        text: 'Staff Reply',
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
  desc: 'Reply to a modmail.',
  args: '<Text>'
}