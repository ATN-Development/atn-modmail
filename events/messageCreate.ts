import { Event } from "../utils/Event";
import config from "../config";
import Eris, { GuildTextableChannel, TextableChannel, TextChannel } from "eris";
import fs from "fs";
import path from "path";

export const event = new Event("messageCreate", async (client, message) => {
	try {
		if ((message.channel as TextableChannel).type !== undefined) return;

		const guild = client.guilds.find((g) => g.id === config.GuildID);

		if (!guild) return;

		const channel = guild?.channels
			.filter((ch) => ch.type === 0)
			.find((channel) => (channel as TextChannel).topic === message.author.id);
		const logsChannel = guild?.channels.find(
			(lc) => lc.id === config.ModMailLogID
		);
		if (message.author.bot) return;
		if (message.content.length > 2048)
			return void message.addReaction(config.CrossEmoji);

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
							type: Eris.Constants.PermissionOverwriteTypes.ROLE,
							deny: 1024,
							allow: 0,
						},
						{
							id: config.ModeratorRoleID,
							type: Eris.Constants.PermissionOverwriteTypes.ROLE,
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
					`${message.author.username}#${message.author.discriminator}`
				);

			const dmChannel = await message.author.getDMChannel();

			await dmChannel.createMessage({
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
						fields: [
							{
								name: "Attachments",
								value: message.attachments
									.map((a, index) => `${index + 1}. [Attachment URL](${a.url})`)
									.join("\n"),
							},
						],
						footer: {
							text: `${message.author.username}#${message.author.discriminator}`,
							icon_url: message.author.avatarURL,
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
					`${message.author.username}#${message.author.discriminator}: ${
						message.content
					}\nMessage attachments: ${message.attachments
						.map((a, index) => `${index + 1}. ${a.url}`)
						.join("\n")}`,
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
							text: `${message.author.username}#${message.author.discriminator}`,
							icon_url: message.author.avatarURL,
						},
					},
					allowedMentions: {
						roles: true,
					},
				});
				fs.appendFile(
					path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
					`${message.author.username}#${message.author.discriminator}: ${message.content}`,
					(err) => {
						if (err) throw err;
					}
				);
			}

			await message.addReaction(config.TickEmoji);

			const webhooks = await (
				logsChannel as GuildTextableChannel
			).getWebhooks();

			if (!webhooks[0]) {
				const createdWebhook = await (
					logsChannel as GuildTextableChannel
				).createWebhook({
					avatar: Buffer.from(
						(message.channel as GuildTextableChannel).guild.iconURL ?? ""
					).toString("base64"),
					name: "ModMail Logs",
				});
				webhooks.push(createdWebhook);
			}
			await client.executeWebhook(webhooks[0].id, webhooks[0].token ?? "", {
				allowedMentions: {
					everyone: false,
					roles: false,
					users: false,
				},
				avatarURL: message.author.avatarURL,
				embeds: [
					{
						title: "ModMail Created",
						description: `Opened by ${message.author.username}`,
						footer: {
							text: message.author.username,
							icon_url: message.author.avatarURL,
						},
					},
				],
			});
		} else {
			if (message.attachments.length > 0) {
				await (channel as TextableChannel).createMessage({
					embed: {
						title: message.author.username,
						description: message.content,
						footer: {
							text: `${message.author.username}#${message.author.discriminator}`,
							icon_url: message.author.avatarURL,
						},
						fields: [
							{
								name: "Attachments",
								value: message.attachments
									.map((a, index) => `${index + 1}. [Attachment URL](${a.url})`)
									.join("\n"),
							},
						],
					},
				});
				fs.appendFile(
					path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
					`\n${message.author.username}#${message.author.discriminator}: ${
						message.content
					}\nMessage attachments: ${message.attachments
						.map((a, index) => `${index + 1}. ${a.url}`)
						.join("\n")}`,
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
							text: `${message.author.username}#${message.author.discriminator}`,
							icon_url: message.author.avatarURL,
						},
					},
				});
				fs.appendFile(
					path.join(__dirname, "..", "transcripts", `${message.author.id}.txt`),
					`\n${message.author.username}#${message.author.discriminator}: ${message.content}`,
					(err) => {
						if (err) throw err;
					}
				);
			}
		}
		return void message.addReaction(config.TickEmoji);
	} catch (err) {
		console.log(`${(err as Error).name}: ${(err as Error).message}`);
		return void message.addReaction(config.CrossEmoji);
	}
});
