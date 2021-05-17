const { Command } = require('yuuko')

// This command is for ModMail pings so moderators can get those to answer faster to modmails.
module.exports = new Command(['modping', 'mp'], async (message, arguments, ctx) => {
  // If the member who uses the command is not an helper at least, return.
  if (!message.member.roles.includes('751475076322558044')) return message.channel.createMessage('You must be at least Helper to use this command.')

  if (message.member.roles.includes('772141547747541002')) {
    await message.member.removeRole('772141547747541002')
    await message.channel.createMessage("Succesfully removed the Mod Mail Ping role.")
  } else {
    await message.member.addRole('772141547747541002')
    await message.channel.createMessage("Succesfully added the Mod Mail Ping role.")
  }

  
}, {
  guildOnly: true
})

module.exports.help = {
  desc: 'Adds or removes Mod Mail Ping role.'
}