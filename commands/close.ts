import Eris from "eris";
import fs from "fs";
import config from "../config";
import { Command } from "../utils/Command";
import path from "path";

export const command = new Command(
	"close",
	async (interaction, client) => {
		try {
			const guild = client.guilds.get(interaction.guildID ?? "");
			const channel = guild?.channels.get(interaction.channel.id ?? "");
			const member = channel?.guild.members.find(
				(m) => m.id === (channel as Eris.TextChannel).topic
			);
			const user = client.users.get(member?.id || "");
			const dm = await user?.getDMChannel();
			const logsChannel = channel?.guild.channels.find(
				(ch) => ch.id === config.ModMailLogID
			);
			const commandAuthor = client.users.get(interaction.member?.user.id ?? "");

			if (!channel) {
				return console.log(
					`Error: Cannot find channel with the following ID: ${interaction.channel.id}`
				);
			}

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

			await channel?.delete();

			const content = fs.readFileSync(
				path.join(__dirname, "..", "transcripts", `${member?.id ?? ""}.txt`)
			);

			fs.unlinkSync(
				path.join(__dirname, "..", "transcripts", `${member?.id ?? ""}.txt`)
			);

			const webhooks = await (
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
			await client.executeWebhook(webhooks[0].id, webhooks[0].token ?? "", {
				allowedMentions: {
					everyone: false,
					roles: false,
					users: false,
				},
				avatarURL: commandAuthor?.avatarURL,
				embeds: [
					{
						title: "ModMail Closed",
						description: `Opened by ${member?.username ?? "Unknown"}`,
						footer: {
							text: interaction.member?.user.username ?? "Unknown User",
							icon_url: commandAuthor?.avatarURL,
						},
					},
				],
				file: {
					file: content,
					name: "transcript.txt",
				},
			});
		} catch (err) {
			console.log(`Error: ${(err as Error).message}`);
		}
	},
	{
		custom: (interaction, client) => {
			const guild = client.guilds.get(interaction.guildID ?? "");
			const channel = guild?.channels.get(interaction.channel.id);
			if (!interaction.guildID) {
				return false;
			} else if (!interaction.member?.roles.includes(config.ModeratorRoleID)) {
				void interaction.createMessage({
					content: "Only a moderator can run this command.",
					flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
				});
				return false;
			} else if (
				channel?.parentID !== config.ModMailCategoryID ||
				interaction.channel.id === config.ModMailLogID
			) {
				void interaction.createMessage({
					content: "Please use the command in a ModMail channel.",
					flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
				});
				return false;
			} else {
				return true;
			}
		},
	},
	{
		description: "Close a ModMail ticket.",
	}
);
