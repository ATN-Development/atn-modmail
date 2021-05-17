const { Command } = require('yuuko')
const { PARTNER } = require('../snippets.json')

// This command is for snippets
module.exports = new Command('snippet', async (message, arguments, ctx) => {
  // If the user isn't a helper at least, return.
  if (!message.member.roles.includes('751475076322558044')) return message.channel.createMessage('You must be at least Helper to use this command.')

  await message.channel.createMessage({
    content: '',
    embed: {
      title: 'ModMail Snippets',
      description: ctx.client.commandForName('snippet').subcommands.map(sub => sub.names[0]).join('\n'),
      fields: [
        {
          name: 'How to use snippets?',
          value: 'Use `=snippet [SnippetName]` to run a snippet in a ModMail.',
          inline: true
        }
      ]
    }
  })
}, {
  guildOnly: true
}).addSubcommand(new Command('partner', async (message, arguments, ctx) => {
  // If the channel's category is not modmail one and if channel ID is logs channel ID, return an error message.
  if (message.channel.parentID !== '749302890459430993' || message.channel.id === '749302891012947988') return message.channel.createMessage('Please use the command in a ModMail channel.')

  // Searches the member of the modmail through the channel's name, in the future I will add a way to make it even better through ID in the modmail channel's topic so the bot will not mess up something.
  let member = message.channel.guild.members.find(m => m.username.toLowerCase().split(' ').join('-') === message.channel.name)
  let user = ctx.client.users.get(member.id)
  let dm = await user.getDMChannel()
  await dm.createMessage({
    content: '',
    embed: {
      title: 'Staff Team',
      description: PARTNER,
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
      description: PARTNER,
      footer: {
        text: 'Staff Reply',
        icon_url: message.author.avatarURL
      }
    }
  })
}))