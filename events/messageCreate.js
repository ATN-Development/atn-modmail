const { EventListener } = require('yuuko')

// New messageCreate event listener to actually listen to DM messages and then create a modmail.
module.exports = new EventListener('messageCreate', async (message, ctx) => {
  if (message.channel.type !== 1) return

  let guild = ctx.client.guilds.find(g => g.id === '746291190009430049') // Looks for ATN Server by ID through the client
  let channel = guild.channels.find(ch => ch.name === message.author.username.toLowerCase().split(' ').join('-')) // Looks for the channel through the guild
  let logsChannel = guild.channels.find(lc => lc.id === '749302891012947988')
  if (message.author.bot) return // If the author of the message is a bot return
  if (message.content.length > 2048) return message.addReaction('Cross1:843802407570112532')
  // If there's not a channel then we create one and send messages to the author and to the modmail.
  if (!channel) {
    let madeChannel = await guild.createChannel(message.author.username.split(' ').join('-'), 0, {
      nsfw: false,
      parentID: '749302890459430993',
      permissionOverwrites: [
        {
          id: guild.id,
          type: 'role',
          deny: "1024"
        }, {
          id: '751475076322558044',
          type: 'role',
          allow: "1024"
        }
      ]
    })
    await message.channel.createMessage({
      content: '',
      embed: {
        title: 'Modmail Automatic Message',
        description: 'Hello, thanks for reaching ATN Server staff team!\nA staff member will reply as soon as possible.',
        color: 0xBEECCD,
        footer: {
          text: 'ATN Server Staff',
          icon_url: guild.iconURL
        }
      }
    })
    // Look for message attachments, if none, send normal message instead of the message + message attachment.
    if (message.attachments.length > 0) {
      await madeChannel.createMessage({
        content: '<@&772141547747541002>',
        embed: {
          title: 'New ModMail',
          description: message.content,
          footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
          },
          image: {
            url: message.attachments[0].url
          }
        },
        allowedMentions: true
      })
    } else {
      await madeChannel.createMessage({
        content: '<@&772141547747541002>',
        embed: {
          title: 'New ModMail',
          description: message.content,
          footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
          },
        },
        allowedMentions: {
          roles: true
        }
      })
    }
    await message.addReaction('zx_tick_yes:843780958943838218')
    await logsChannel.createMessage({
      content: '',
      embed: {
        title: 'ModMail Created',
        description: `Opened by ${message.author.username}`,
        footer: {
          text: message.author.username,
          icon_url: message.author.avatarURL
        }
      }
    })
  } else {
    if (message.attachments.length > 0) {
      await channel.createMessage({
        content: '',
        embed: {
          title: message.author.username,
          description: message.content,
          footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
          },
          image: {
            url: message.attachments[0].url
          }
        }
      })
    } else {
      await channel.createMessage({
        content: '',
        embed: {
          title: message.author.username,
          description: message.content,
          footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
          },
        }
      })
    }
  }
  await message.addReaction('zx_tick_yes:843780958943838218')
})