const { Command } = require('yuuko')

// Exporting a new command that is useful for replying to users who actually write to modmail.
module.exports = new Command(['reply', 'r'], async (message, arguments, ctx) => {
  // If the channel's category is not modmail one and if channel ID is logs channel ID, return an error message.
  if (message.channel.parentID !== '749302890459430993' || message.channel.id === '749302891012947988') return message.channel.createMessage('Please use the command in a ModMail channel.')

  // Checks if there are enough arguments to reply a modmail. If there aren't any, return an error message.
  if (arguments.length < 1) return message.channel.createMessage('Please specify a text to send.')

  // Searches the member of the modmail through the channel's name, in the future I will add a way to make it even better through ID in the modmail channel's topic so the bot will not mess up something.
  let member = message.channel.guild.members.find(m => m.username.toLowerCase().split(' ').join('-') === message.channel.name)
  let user = ctx.client.users.get(member.id)
  let dm = await user.getDMChannel()
  await dm.createMessage({
    content: '',
    embed: {
      title: 'Staff Team',
      description: arguments.join(' '),
      color: 0xBEECCD,
      footer: {
        text: 'ATN Server Staff',
        icon_url: message.channel.guild.iconURL
      }
    }
  })
  await message.delete()
  await message.channel.createMessage({
    content: '',
    embed: {
      title: message.author.username,
      description: arguments.join(' '),
      footer: {
        text: 'Reply',
        icon_url: message.author.avatarURL
      }
    }
  })
}, {
  guildOnly: true
})

module.exports.help = {
  desc: 'Reply to a modmail.',
  args: '<Text>'
}