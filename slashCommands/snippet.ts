import config from "../config";
import { SlashCommand } from "../utils/SlashCommand";
import snippets from "../snippets";
import Eris from "eris";
import { InteractionDataOptions } from "../utils/Interaction";
import fs from "fs";
import path from "path";

export interface SlashOption {
  name: string;
  value: string;
}

let slashCommandOptions: SlashOption[] = [];

for (const snippet in snippets) {
  slashCommandOptions.push({
    name: snippet,
    value: snippet,
  });
}

export default new SlashCommand(
  "snippet",
  async (interaction, client) => {
    try {
      await interaction.deferWithSource(
        {
          data: {
            flags: 0,
          },
        },
        client
      );
      const guild = client.guilds.get(interaction.guildId);
      const channel = guild?.channels.get(interaction.channelId);
      const member = guild?.members.get(
        (channel as Eris.TextChannel).topic ?? ""
      );
      const user = client.users.get(member?.user.id ?? "");
      const dm = await user?.getDMChannel();

      let snippetToSend = "";

      for (let i = 0; i < Object.keys(snippets).length; i++) {
        if (
          (
            interaction.data.options as InteractionDataOptions[]
          )[0].value?.toLowerCase() === Object.keys(snippets)[i]
        ) {
          snippetToSend = Object.entries(snippets)[i][1];
        }
      }

      if (!snippetToSend.length) {
        interaction.ephemeralReply(
          "Please setup at least a snippet for the bot",
          client
        );
        return;
      }

      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id}.txt`),
        `\n${interaction.member.user.username}#${interaction.member.user.discriminator}: ${snippetToSend}`,
        (err) => {
          if (err) throw err;
        }
      );

      const interactionAuthor = client.users.get(interaction.member.user.id);

      await dm?.createMessage({
        embed: {
          title: "Staff Team",
          description: snippetToSend
            .replace(new RegExp(/{{userid}}/, "g"), user?.id ?? "")
            .replace(new RegExp(/{{usermention}}/, "g"), user?.mention ?? "")
            .replace(
              new RegExp(/{{usertag}}/, "g"),
              `${user?.username}#${user?.discriminator}`
            ),
          color: config.DefaultColor,
          footer: {
            text: `${guild?.name} Staff`,
            icon_url: guild?.iconURL ?? undefined,
          },
        },
      });

      await interaction.followUp(
        {
          data: {
            embeds: [
              {
                type: "rich",
                title: interactionAuthor?.username,
                description: snippetToSend,
                footer: {
                  text: "Staff Reply",
                  icon_url: interactionAuthor?.avatarURL,
                },
              },
            ],
          },
        },
        client
      );
    } catch (err: any) {
      console.log(`Error: ${err.message}`);
    }
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
        interaction.ephemeralReply(
          "You cannot run this command outside of a ModMail channel.",
          client
        );
        return false;
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
