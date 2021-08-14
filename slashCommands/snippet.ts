import config from "../config";
import { SlashCommand } from "../utils/SlashCommand";
import snippets from "../snippets";
// import Eris from "eris";

export interface SlashOption {
  name: string;
  value: string;
}

let slashCommandOptions: SlashOption[] = [];

for (const snippet in snippets) {
  slashCommandOptions.push({
    name: snippet,
    value: "A premade snippet message!",
  });
}

export default new SlashCommand(
  "snippet",
  async (interaction, _client) => {
    // const guild = client.guilds.get(interaction.guildId);
    // const channel = guild?.channels.get(interaction.channelId);
    // const member = guild?.members.get(
    //   (channel as Eris.GuildTextableChannel).topic ?? ""
    // );
    // const user = client.users.get(member?.user.id ?? "");

    // let snippetToSend = "";

    // for (let i = 0; i < Object.keys(snippets).length; i++) {
    //   if (args[0].toLowerCase() === Object.keys(snippets)[i]) {
    //     snippetToSend = Object.entries(snippets)[i][1];
    //   }
    // }
    console.log(interaction.data.options ? interaction.data.options[0] : undefined)

  },
  {
    custom: (interaction, client) => {
      const guild = client.guilds.get(interaction.guildId);
      const channel = guild?.channels.get(interaction.channelId);
      if (!interaction.member.roles.includes(config.ModeratorRoleID)) {
        interaction.ephemeralReply(
          "You must be a Moderator to use this command.",
          client
        );
        return false;
      }

      if (
        channel?.parentID !== config.ModMailCategoryID ||
        channel.id === config.ModMailLogID
      ) {
        interaction.reply(
          "You cannot run this command outside of a ModMail channel.",
          client
        );
      }

      return true;
    },
  },
  {
    description: "Reply to a ModMail ticket with a premade snippet message.",
    default_permission: true,
    options: [
      {
        type: 3,
        name: "snippet",
        description: "The snippet you want to send.",
        choices: slashCommandOptions,
        required: true,
      },
    ],
  }
);
