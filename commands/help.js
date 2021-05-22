const { Command } = require('yuuko')
const { Prefix, DefaultColor } = require('../config')

module.exports = new Command(['help', 'h'], async (message, arguments, ctx) => {
  // If there are no arguments returns a list of all commands.
  if (arguments.length < 1) {
    const commandList = await ctx.client.commands.map(command => `${Prefix}${command.names[0]}`).join('\n')
    const embed = {
      title: 'Bot Commands',
      description: commandList,
      footer: {
        text: `Command ran by ${message.author.username}`,
        icon_url: message.author.avatarURL
      },
      color: DefaultColor
    }
    await message.channel.createMessage({
      content: '',
      embed
    })
  // Otherwise sends specific information about a command.
  } else {
    const command = await ctx.client.commandForName(arguments[0])
    if (!command) return message.channel.createMessage("Please specify a valid command.")
    let commandsInformation = ''
    let aliases = '';
    let usage = '';
    let desc = '';
    if (command.names.length > 1) aliases += command.names.map(alias => `${Prefix}${alias}`).join(', ')
    if (command.help.args) usage += `${Prefix}${command.names[0]} ${command.help.args}`
    if (command.help.desc) desc += `${command.help.desc}`
    if (aliases.length > 1) commandsInformation += `\`\`\`Aliases:\`\`\`\n${aliases}\n`
    if (usage.length > 1) commandsInformation += `\`\`\`Usage:\`\`\`\n${usage}\n`
    if (desc.length > 1) commandsInformation += `\`\`\`Description\`\`\`\n${desc}`

    const embed = {
      title: `Information about the ${command.names[0]} command.`,
      description: commandsInformation,
      footer: {
        text: `Command ran by ${message.author.username}`,
        icon_url: message.author.avatarURL
      },
      color: DefaultColor
    }
    await message.channel.createMessage({
      content: '',
      embed
    })
  }
})

/**
 * @param {Object} help - Information about a command used for the help command.
 * @param {String} help.desc - Description of the command
 * @param {String} help.args - Arguments needed to run the bot, [] if optional, <> if needed.
 */
module.exports.help = {
  desc: 'Shows all the commands of the bot!',
  args: '[Command]'
}