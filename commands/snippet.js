const { Command } = require('yuuko')
const { ModMailCategoryID, ModMailLogID, DefaultColor, Prefix, ModeratorRoleID } = require('../config')

// This command is for snippets
module.exports = new Command('snippet', async (message, arguments, ctx) => {
  if (arguments.length < 1) {
    // If the user isn't a helper at least, return.
    if (!message.member.roles.includes(ModeratorRoleID)) return message.channel.createMessage('You must be a Moderator to use this command.')

    snippetToSend = []
    const snippetList = require('../snippets')
    for (const snippets in snippetList) {
      snippetToSend.push(snippets)
    }
    await message.channel.createMessage({
      content: '',
      embed: {
        title: 'ModMail Snippets',
        description: snippetToSend.join(', '),
        fields: [
          {
            name: 'How to use snippets?',
            value: `Use \`${Prefix}snippet [SnippetName]\` to run a snippet in a ModMail.`,
            inline: true
          }
        ]
      }
    })
  } else {
    if (message.channel.parentID !== ModMailCategoryID || message.channel.id === ModMailLogID) return message.channel.createMessage('Please use the command in a ModMail channel.')
    // Searches the member of the modmail through the channel's name, in the future I will add a way to make it even better through ID in the modmail channel's topic so the bot will not mess up something.
    let member = message.channel.guild.members.find(m => m.username.toLowerCase().split(' ').join('-') === message.channel.name)
    let user = ctx.client.users.get(member.id)
    let dm = await user.getDMChannel()
    const snippetList = require('../snippets')
    let snippetToSend = ''
    for (const snippets in snippetList) {
      if (arguments[0].toLowerCase() === snippets.toLowerCase()) {
        snippetToSend = snippetList[snippets]
      }
    }

    // If there aren't any snippets, return an error message.
    if (snippetToSend.length < 1) {
      await message.channel.createMessage("Please specify a valid snippet.")
      return
    }


    await dm.createMessage({
      content: '',
      embed: {
        title: 'Staff Team',
        description: snippetToSend,
        color: DefaultColor,
        footer: {
          text: message.channel.guild.name + ' Staff',
          icon_url: message.channel.guild.iconURL
        }
      }
    })
    await message.delete()
    await message.channel.createMessage({
      content: '',
      embed: {
        title: message.author.username,
        description: snippetToSend,
        footer: {
          text: 'Staff Reply',
          icon_url: message.author.avatarURL
        }
      }
    })
  }
  
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