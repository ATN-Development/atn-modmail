const { EventListener } = require('yuuko')
const { GuildID, ModMailLogID, ModMailCategoryID, CrossEmoji, ModeratorRoleID, ModMailAutomaticMessage, DefaultColor, TickEmoji, ModPingRoleID } = require('../config')

// New messageCreate event listener to actually listen to DM messages and then create a modmail.
module.exports = new EventListener('messageCreate', async (message, ctx) => {
  if (message.channel.type !== 1) return

  let guild = ctx.client.guilds.find(g => g.id === GuildID) // Looks for ATN Server by ID through the client
  let channel = guild.channels.find(ch => ch.name === message.author.username.toLowerCase().split(' ').join('-')) // Looks for the channel through the guild
  let logsChannel = guild.channels.find(lc => lc.id === ModMailLogID)
  if (message.author.bot) return // If the author of the message is a bot return
  if (message.content.length > 2048) return message.addReaction(CrossEmoji)
  // If there's not a channel then we create one and send messages to the author and to the modmail.
  if (!channel) {
    let madeChannel = await guild.createChannel(message.author.username.split(' ').join('-'), 0, {
      nsfw: false,
      parentID: ModMailCategoryID,
      permissionOverwrites: [
        {
          id: guild.id,
          type: 'role',
          deny: "1024"
        }, {
          id: ModeratorRoleID,
          type: 'role',
          allow: "1024"
        }
      ]
    })
    await message.channel.createMessage({
      content: '',
      embed: {
        title: 'Modmail Automatic Message',
        description: ModMailAutomaticMessage,
        color: DefaultColor,
        footer: {
          text: guild.name + ' Staff',
          icon_url: guild.iconURL
        }
      }
    })
    // Look for message attachments, if none, send normal message instead of the message + message attachment.
    if (message.attachments.length > 0) {
      await madeChannel.createMessage({
        content: `<@&${ModPingRoleID}>`,
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
        content: `<@&${ModPingRoleID}>`,
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
    await message.addReaction(TickEmoji)
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
  await message.addReaction(TickEmoji)
})