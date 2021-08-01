import { Command } from "../utils/Command";
import config from "../config";
import Eris from "eris";
import fs from "fs";
import path from "path";

export default new Command(
  "close",
  async (message, _args, client) => {
    if (
      (message.channel as Eris.GuildTextableChannel).parentID !==
      config.ModMailCategoryID
    ) {
      (message.channel as Eris.GuildTextableChannel).createMessage(
        "Please use the command in a ModMail channel."
      );
      return;
    }

    const member = (
      message.channel as Eris.GuildTextableChannel
    ).guild.members.find(
      (m) => m.id === (message.channel as Eris.GuildTextableChannel).topic
    );
    const user = client.users.get(member?.id || "");
    const dm = await user?.getDMChannel();
    const logsChannel = (
      message.channel as Eris.GuildTextableChannel
    ).guild.channels.find((ch) => ch.id === config.ModMailLogID);

    await dm?.createMessage({
      embed: {
        title: "ModMail Closed",
        description:
          "Thanks for reaching us! Feel free to DM this bot to get help next time too.",
        footer: {
          text: `${
            (message.channel as Eris.GuildTextableChannel).guild.name
          } Staff`,
          icon_url:
            (message.channel as Eris.GuildTextableChannel).guild.iconURL ||
            undefined,
        },
        color: config.DefaultColor,
      },
    });

    await (message.channel as Eris.GuildTextableChannel).delete();

    const content = fs.readFileSync(
      path.join(__dirname, "..", "transcripts", `${member?.id}.txt`)
    );

    fs.unlinkSync(
      path.join(__dirname, "..", "transcripts", `${member?.id}.txt`)
    );

    const transcriptURL = await client.postTranscript(content.toString());

    let webhooks = await (logsChannel as Eris.GuildTextableChannel).getWebhooks();

    if (!webhooks[0]) {
      const createdWebhook = await (
        logsChannel as Eris.GuildTextableChannel
      ).createWebhook({
        avatar: Buffer.from(
          (message.channel as Eris.GuildTextableChannel).guild?.iconURL ?? ""
        ).toString("base64"),
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
      avatarURL: message.author.avatarURL,
      embeds: [
        {
          title: "ModMail Closed",
          description: `Opened by ${member?.username}\nTranscript URL: ${transcriptURL}`,
          footer: {
            text: message.author.username,
            icon_url: message.author.avatarURL,
          },
        },
      ],
    });
  },
  {
    custom: (message) => {
      if (message.channel.type !== 0) {
        return false;
      } else {
        return true;
      }
    },
  }
);
