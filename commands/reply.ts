import Eris from "eris";
import config from "../config";
import { Command } from "../utils/Command";
import fs from "fs";
import path from "path";

export default new Command(
  ["reply", "r"],
  async (message, args, client) => {
    const member = (
      message.channel as Eris.GuildTextableChannel
    ).guild.members.find(
      (m) => m.id === (message.channel as Eris.GuildTextableChannel).topic
    );
    const user = client.users.get(member?.id ?? "");
    const dm = await user?.getDMChannel();
    if (message.attachments.length > 0) {
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id}.txt`),
        `\n${message.author.username}${
          message.author.discriminator
        }: ${args.join(" ")}\nMessage attachments: ${
          message.attachments[0].url
        }`,
        (err) => {
          if (err) throw err;
        }
      );
      await dm?.createMessage({
        embed: {
          title: "Staff Team",
          description: args.join(" "),
          color: config.DefaultColor,
          footer: {
            text:
              (message.channel as Eris.GuildTextableChannel).guild.name +
              " Staff",
            icon_url:
              (message.channel as Eris.GuildTextableChannel).guild.iconURL ??
              undefined,
          },
          image: {
            url: message.attachments[0].url,
          },
        },
      });
    } else {
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id}.txt`),
        `\n${message.author.username}${
          message.author.discriminator
        }: ${args.join(" ")}`,
        (err) => {
          if (err) throw err;
        }
      );
      await dm?.createMessage({
        embed: {
          title: "Staff Team",
          description: args.join(" "),
          color: config.DefaultColor,
          footer: {
            text:
              (message.channel as Eris.GuildTextableChannel).guild.name +
              " Staff",
            icon_url:
              (message.channel as Eris.GuildTextableChannel).guild.iconURL ??
              undefined,
          },
        },
      });
    }
    await message.delete();
    await message.channel.createMessage({
      embed: {
        title: message.author.username,
        description: args.join(" "),
        footer: {
          text: "Staff Reply",
          icon_url: message.author.avatarURL,
        },
      },
    });
  },
  {
    custom: (message, args) => {
      if (message.channel.type !== 0) {
        return false;
      } else {
        if (
          message.channel.parentID !== config.ModMailCategoryID ||
          message.channel.id === config.ModMailLogID
        ) {
          message.channel.createMessage(
            "Please use the command in a ModMail channel."
          );
          return false;
        }
        if (args.length < 1) {
          message.channel.createMessage("Please specify a text to send.");
          return false;
        }
        return true;
      }
    },
  }, {
    description: 'Reply to a ModMail ticket.'
  }
);
