import Eris from "eris";
import fs from "fs";
import config from "../config";
import { SlashCommand } from "../utils/SlashCommand";
import path from "path";

export default new SlashCommand(
  "close",
  async (interaction, client) => {
    const guild = client.guilds.get(interaction.guildId);
    const channel = guild?.channels.get(interaction.channelId);
    const member = channel?.guild.members.find(
      (m) => m.id === (channel as Eris.GuildTextableChannel).topic
    );
    const user = client.users.get(member?.id || "");
    const dm = await user?.getDMChannel();
    const logsChannel = channel?.guild.channels.find(
      (ch) => ch.id === config.ModMailLogID
    );
    const commandAuthor = client.users.get(interaction.member.user.id);

    await dm?.createMessage({
      embed: {
        title: "ModMail Closed",
        description:
          "Thanks for reaching us! Feel free to DM this bot to get help next time too.",
        footer: {
          text: `${channel?.guild.name} Staff`,
          icon_url: channel?.guild.iconURL || undefined,
        },
        color: config.DefaultColor,
      },
    });

    await interaction.reply(
      {
        data: {
          content: "Closing ModMail ticket...",
        },
      },
      client
    );

    await channel?.delete();

    const content = fs.readFileSync(
      path.join(__dirname, "..", "transcripts", `${member?.id}.txt`)
    );

    fs.unlinkSync(
      path.join(__dirname, "..", "transcripts", `${member?.id}.txt`)
    );

    const transcriptURL = await client.postTranscript(content.toString());

    let webhooks = await (
      logsChannel as Eris.GuildTextableChannel
    ).getWebhooks();

    if (!webhooks[0]) {
      const createdWebhook = await (
        logsChannel as Eris.GuildTextableChannel
      ).createWebhook({
        avatar: Buffer.from(channel?.guild.iconURL ?? "").toString("base64"),
        name: "ModMail Logs",
      });
      webhooks.push(createdWebhook);
    }
    await client.executeWebhook(webhooks[0].id, webhooks[0].token, {
      allowedMentions: {
        everyone: false,
        roles: false,
        users: false,
      },
      avatarURL: commandAuthor?.avatarURL,
      embeds: [
        {
          title: "ModMail Closed",
          description: `Opened by ${member?.username}\nTranscript URL: ${transcriptURL}`,
          footer: {
            text: interaction.member.user.username,
            icon_url: commandAuthor?.avatarURL,
          },
        },
      ],
    });
  },
  {
    custom: (interaction, client) => {
      const guild = client.guilds.get(interaction.guildId);
      const channel = guild?.channels.get(interaction.channelId);
      if (!interaction.guildId) {
        return false;
      } else if (!interaction.member.roles.includes(config.ModeratorRoleID)) {
        interaction.ephemeralReply(
          {
            data: {
              content: "Only a moderator can run this command.",
            },
          },
          client
        );
        return false;
      } else if (
        channel?.parentID !== config.ModMailCategoryID ||
        interaction.channelId === config.ModMailLogID
      ) {
        interaction.ephemeralReply(
          {
            data: {
              content: "Please use the command in a ModMail channel.",
            },
          },
          client
        );
        return false;
      } else {
        return true;
      }
    },
  }
);
