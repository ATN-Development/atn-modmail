import Eris from "eris";
import fs from "fs";
import path from "path";
import config from "../config";
import { SlashCommand } from "../utils/SlashCommand";

export default new SlashCommand(
  "reply",
  async (interaction, client) => {
    try {
      await interaction.deferWithSource(undefined, client);
      const guild = client.guilds.get(interaction.guildId);
      const channel = guild?.channels.get(interaction.channelId);
      const user = client.users.get(
        (channel as Eris.GuildTextableChannel).topic ?? ""
      );
      const dm = await user?.getDMChannel();

      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id}.txt`),
        `\n${interaction.member.user.username}#${
          interaction.member.user.discriminator
        }: ${
          interaction.data.options ? interaction.data.options[0].value : ""
        }`,
        (err) => {
          if (err) console.error(`Error: ${err.message}`);
        }
      );

      await dm?.createMessage({
        embed: {
          title: "Staff Team",
          description: interaction.data.options
            ? interaction.data.options[0].value
            : "",
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
            flags: 0,
            embeds: [
              {
                type: "rich",
                title: interaction.member.user.username,
                description: interaction.data.options
                  ? interaction.data.options[0].value
                  : "",
                color: config.DefaultColor,
                footer: {
                  text: "Staff Reply",
                  icon_url: user?.avatarURL,
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
      if (
        channel?.parentID !== config.ModMailCategoryID ||
        interaction.channelId === config.ModMailLogID
      ) {
        interaction.ephemeralReply(
          "Please use the command in a ModMail channel.",
          client
        );
        return false;
      }
      return true;
    },
  },
  {
    options: [
      {
        type: 3,
        name: "message",
        description: "The message you want to send.",
        required: true,
      },
    ],
    default_permission: true,
    description: "Reply to a ModMail thread.",
  }
);
