import config from "../config";
import { Command } from "../utils/Command";
import snippets from "../snippets";
import Eris from "eris";
import fs from "fs";
import path from "path";

export default new Command(
  "snippet",
  async (message, args, client) => {
    if (args.length < 1) {
      let snippetToSend: string[] = [];
      for (const snippet in snippets) {
        snippetToSend.push(snippet);
      }

      await message.channel.createMessage({
        embed: {
          title: "ModMail Snippets",
          description: snippetToSend.join(", "),
          fields: [
            {
              name: "How to use snippets?",
              value: `Use \`${config.Prefix}snippet [SnippetName]\` to run a snippet in a ModMail.`,
              inline: true,
            },
          ],
        },
      });
    } else {
      if (
        (message.channel as Eris.GuildTextableChannel).parentID !==
          config.ModMailCategoryID ||
        message.channel.id === config.ModMailLogID
      ) {
        message.channel.createMessage(
          "Please use the command in a ModMail channel."
        );
        return;
      }

      const member = (
        message.channel as Eris.GuildTextableChannel
      ).guild.members.find(
        (m) => m.id === (message.channel as Eris.GuildTextableChannel).topic
      );
      const user = client.users.get(member?.id ?? "");
      const dm = await user?.getDMChannel();
      let snippetToSend = "";

      for (let i = 0; i < Object.keys(snippets).length; i++) {
        if (args[0].toLowerCase() === Object.keys(snippets)[i]) {
          snippetToSend = Object.entries(snippets)[i][1];
        }
      }

      if (snippetToSend.length < 1) {
        message.channel.createMessage("Please specify a valid snippet.");
        return;
      }

      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${user?.id}.txt`),
        `\n${message.author.username}${message.author.discriminator}: ${snippetToSend}`,
        (err) => {
          if (err) throw err;
        }
      );

      await dm?.createMessage({
        embed: {
          title: "Staff Team",
          description: snippetToSend,
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

      await message.delete();
      await message.channel.createMessage({
        embed: {
          title: message.author.username,
          description: snippetToSend,
          footer: {
            text: "Staff Reply",
            icon_url: message.author.avatarURL,
          },
        },
      });
    }
  },
  {
    custom: (message) => {
      if (message.channel.type !== 0) {
        return false;
      } else {
        if (!message.member?.roles.includes(config.ModeratorRoleID)) {
          message.channel.createMessage(
            "You must be a Moderator to use this command."
          );
          return false;
        }
        return true;
      }
    },
  }, {
    description: 'Reply to a ModMail ticket with a premade snippet message.'
  }
);
