const { Command } = require('yuuko')
const { ModeratorRoleID, ModPingRoleID } = require('../config')

// This command is for ModMail pings so moderators can get those to answer faster to modmails.
module.exports = new Command(['modping', 'mp'], async (message, arguments, ctx) => {
  // If the member who uses the command is not an helper at least, return.
  if (!message.member.roles.includes(ModeratorRoleID)) return message.channel.createMessage('You must be a Moderator to use this command.')

  if (message.member.roles.includes(ModPingRoleID)) {
    await message.member.removeRole(ModPingRoleID)
    await message.channel.createMessage("Succesfully removed the Mod Mail Ping role.")
  } else {
    await message.member.addRole(ModPingRoleID)
    await message.channel.createMessage("Succesfully added the Mod Mail Ping role.")
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

module.exports.help = {
  desc: 'Adds or removes Mod Mail Ping role.'
}