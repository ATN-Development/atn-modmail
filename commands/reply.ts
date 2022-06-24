import Eris from "eris";
import fs from "fs";
import path from "path";
import config from "../config";
import { Command } from "../utils/Command";

export const command = new Command(
  "reply",
  async (interaction, client) => {
    try {
      await interaction.acknowledge();
      const guild = client.guilds.get(interaction.guildID ?? "");
      const channel = guild?.channels.get(interaction.channel.id);
      const user = client.users.get((channel as Eris.TextChannel).topic ?? "");
      const dm = await user?.getDMChannel();

      if (
        !interaction.data.options ||
        interaction.data.options[0].type !==
          Eris.Constants["ApplicationCommandOptionTypes"]["STRING"]
      ) {
        return;
      }
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id ?? ""}.txt`),
        `\n${interaction.member?.user.username ?? "Unknown User"}#${
          interaction.member?.user.discriminator ?? "0000"
        }: ${
          interaction.data.options
            ? interaction.data.options[0].value ?? ""
            : ""
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
            text: `${guild?.name ?? "Unknown Guild"} Staff`,
            icon_url: guild?.iconURL ?? undefined,
          },
        },
      });

      await interaction.createFollowup({
        embeds: [
          {
            title: interaction.member?.user.username ?? "Unknown User",
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
      });
    } catch (err) {
      console.log(`Error: ${(err as Error).message}`);
    }
  },
  {
    custom: (interaction, client) => {
      const guild = client.guilds.get(interaction.guildID ?? "");
      const channel = guild?.channels.get(interaction.channel.id);
      if (
        channel?.parentID !== config.ModMailCategoryID ||
        interaction.channel.id === config.ModMailLogID
      ) {
        void interaction.createMessage({
          content: "Please use the command in a ModMail channel.",
          flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
        });
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
