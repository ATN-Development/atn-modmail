import { Command } from "../utils/Command";
import config from "../config";
import Eris from "eris";

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
    await (logsChannel as Eris.GuildTextableChannel).createMessage({
      embed: {
        title: "ModMail Closed",
        description: `Opened by ${member?.username}`,
        footer: {
          text: message.author.username,
          icon_url: message.author.avatarURL,
        },
      },
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
