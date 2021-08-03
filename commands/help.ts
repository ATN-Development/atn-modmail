import { Command } from "../utils/Command";
import config from "../config";

export default new Command(['help', 'h'], (message, args, client) => {
  if (!args.length) {
    message.channel.createMessage({
      embed: {
        title: "Bot Commands",
        description: `${client.commands.map(c => `\`${client.prefix}${c.names[0]}\``).join('\n')}\n\nWant more info about a command? Run the \`${client.prefix}help [Command]\` for info!`,
        color: config.DefaultColor,
        footer: {
          text: `Command ran by ${message.author.username}`,
          icon_url: message.author.avatarURL
        }
      }
    })
  } else {
    const command = client.commands.find(c => c.names.includes(args[0].toLowerCase()))

    if (!command) {
      message.channel.createMessage('Please, specify a valid command!')
      return
    }

    let helpMessage = '';

    if (command.description) helpMessage += `**Description**: \`${command.description}\`\n`

    if (command.expectedArguments) helpMessage += `**Command Usage**: \`${client.prefix}${command.names[0]} ${command.expectedArguments}\`\n`

    if (command.names.length > 1) helpMessage += `**Aliases**: \`${command.names.slice(1).map(c => `${client.prefix}${c}`).join(', ')}\``

    message.channel.createMessage({
      embed: {
        title: `Information for the ${client.prefix}${command.names[0]} command`,
        description: helpMessage,
        color: config.DefaultColor
      }
    })
  }
}, undefined, {
  description: 'Get help about a command!',
  expectedArguments: '[Command]'
})