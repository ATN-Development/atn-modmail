import { Event } from "../utils/Event";
import config from "../config";
import { TextableChannel, TextChannel } from "eris";
import fs from "fs";
import path from "path";

export default new Event("messageCreate", async (message, client) => {
  if ((message.channel as TextableChannel).type !== 1) return;

  const guild = client.guilds.find((g) => g.id === config.GuildID);
  const channel = guild?.channels
    .filter((ch) => ch.type === 0)
    .find((channel) => (channel as TextChannel).topic === message.author.id);
  const logsChannel = guild?.channels.find(
    (lc) => lc.id === config.ModMailLogID
  );
  if (message.author.bot) return;
  if (message.content.length > 2048)
    return message.addReaction(config.CrossEmoji);

  if (!channel) {
    const madeChannel = await guild?.createChannel(
      message.author.username.split(" ").join("-"),
      0,
      "ModMail Channel",
      {
        parentID: config.ModMailCategoryID,
        permissionOverwrites: [
          {
            id: guild.id,
            type: "role",
            deny: 1024,
            allow: 0,
          },
          {
            id: config.ModeratorRoleID,
            type: "role",
            allow: 1024,
            deny: 0,
          },
        ],
        topic: message.author.id,
      }
    );
    const description = config.ModMailAutomaticMessage.replace(
      new RegExp(/{{userid}}/, "g"),
      message.author.id
    )
      .replace(new RegExp(/{{usermention}}/, "g"), message.author.mention)
      .replace(
        new RegExp(/{{usertag}}/, "g"),
        `${message.author.username}${message.author.discriminator}`
      );
    await (message.channel as TextableChannel).createMessage({
      embed: {
        title: "Modmail Automatic Message",
        description,
        color: config.DefaultColor,
        footer: {
          text: `${guild?.name} Staff`,
          icon_url: guild?.iconURL ?? undefined,
        },
      },
    });

    if (message.attachments.length) {
      await madeChannel?.createMessage({
        content: `<@&${config.ModPingRoleID}>`,
        embed: {
          title: "New Modmail",
          description: message.content,
          footer: {
            text: `${message.author.username}${message.author.discriminator}`,
            icon_url: message.author.avatarURL,
          },
          image: {
            url: message.attachments[0].url,
          },
        },
        allowedMentions: {
          everyone: false,
          roles: true,
          users: false,
        },
      });
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
        `${message.author.username}${message.author.discriminator}: ${message.content}\nMessage attachments: ${message.attachments[0].url}`,
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      await madeChannel?.createMessage({
        content: `<@&${config.ModPingRoleID}>`,
        embed: {
          title: "New Modmail",
          description: message.content,
          footer: {
            text: `${message.author.username}${message.author.discriminator}`,
            icon_url: message.author.avatarURL,
          },
        },
        allowedMentions: {
          roles: true,
        },
      });
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
        `${message.author.username}${message.author.discriminator}: ${message.content}`,
        (err) => {
          if (err) throw err;
        }
      );
    }

    await message.addReaction(config.TickEmoji);
    await (logsChannel as TextableChannel).createMessage({
      embed: {
        title: "ModMail Created",
        description: `Opened by ${message.author.username}`,
        footer: {
          text: message.author.username,
          icon_url: message.author.avatarURL,
        },
      },
    });
  } else {
    if (message.attachments.length > 0) {
      await (channel as TextableChannel).createMessage({
        embed: {
          title: message.author.username,
          description: message.content,
          footer: {
            text: `${message.author.username}${message.author.discriminator}`,
            icon_url: message.author.avatarURL,
          },
          image: {
            url: message.attachments[0].url,
          },
        },
      });
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
        `\n${message.author.username}${message.author.discriminator}: ${message.content}\nMessage attachments: ${message.attachments[0].url}`,
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      await (channel as TextableChannel).createMessage({
        embed: {
          title: message.author.username,
          description: message.content,
          footer: {
            text: `${message.author.username}${message.author.discriminator}`,
            icon_url: message.author.avatarURL,
          },
        },
      });
      fs.appendFile(
        path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
        `\n${message.author.username}${message.author.discriminator}: ${message.content}`,
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
  await message.addReaction(config.TickEmoji);
});
