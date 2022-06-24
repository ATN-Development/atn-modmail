import config from "../config";
import { Command } from "../utils/Command";
import snippets from "../snippets";
import Eris from "eris";
import fs from "fs";
import path from "path";

export interface SlashOption {
	name: string;
	value: string;
}

const slashCommandOptions: SlashOption[] = [];

for (const snippet in snippets) {
	slashCommandOptions.push({
		name: snippet,
		value: snippet,
	});
}

export const command = new Command(
	"snippet",
	async (interaction, client) => {
		try {
			await interaction.acknowledge();
			const guild = client.guilds.get(interaction.guildID ?? "");
			const channel = guild?.channels.get(interaction.channel.id);
			const member = guild?.members.get(
				(channel as Eris.TextChannel).topic ?? ""
			);
			const user = client.users.get(member?.user.id ?? "");
			const dm = await user?.getDMChannel();

			let snippetToSend = "";

			if (
				!interaction.data.options ||
				interaction.data.options[0].type !==
					Eris.Constants["ApplicationCommandOptionTypes"]["STRING"]
			) {
				return;
			}

			for (let i = 0; i < Object.keys(snippets).length; i++) {
				if (
					interaction.data.options !== undefined &&
					interaction.data.options[0].value?.toLowerCase() ===
						Object.keys(snippets)[i]
				) {
					snippetToSend = Object.entries(snippets)[i][1];
				}
			}

			if (!snippetToSend.length) {
				void interaction.createMessage({
					content: "Please setup at least a snippet for the bot",
					flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
				});
				return;
			}

			fs.appendFile(
				path.join(__dirname, "..", "transcripts", `${user?.id ?? ""}.txt`),
				`\n${interaction.member?.user.username ?? "Unknown User"}#${
					interaction.member?.user.discriminator ?? "0000"
				}: ${snippetToSend}`,
				(err) => {
					if (err) throw err;
				}
			);

			const interactionAuthor = client.users.get(
				interaction.member?.user.id ?? ""
			);

			await dm?.createMessage({
				embed: {
					title: "Staff Team",
					description: snippetToSend
						.replace(new RegExp(/{{userid}}/, "g"), user?.id ?? "")
						.replace(new RegExp(/{{usermention}}/, "g"), user?.mention ?? "")
						.replace(
							new RegExp(/{{usertag}}/, "g"),
							`${user?.username ?? "Unknown user"}#${
								user?.discriminator ?? "0000"
							}`
						),
					color: config.DefaultColor,
					footer: {
						text: `${guild?.name ?? "Unknown Guild"} Staff`,
						icon_url: guild?.iconURL ?? undefined,
					},
				},
			});

			void interaction.createFollowup({
				embeds: [
					{
						title: interactionAuthor?.username,
						description: snippetToSend,
						footer: {
							text: "Staff Reply",
							icon_url: interactionAuthor?.avatarURL,
						},
					},
				],
			});
			return;
		} catch (err) {
			console.log(`Error: ${(err as Error).message}`);
		}
	},
	{
		custom: (interaction, client) => {
			const guild = client.guilds.get(interaction.guildID ?? "");
			const channel = guild?.channels.get(interaction.channel.id);
			if (!interaction.member?.roles.includes(config.ModeratorRoleID)) {
				void interaction.createMessage({
					content: "You must be a Moderator to use this command.",
					flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
				});
				return false;
			}

			if (
				channel?.parentID !== config.ModMailCategoryID ||
				channel.id === config.ModMailLogID
			) {
				void interaction.createMessage({
					content: "You cannot run this command outside of a ModMail channel.",
					flags: Eris.Constants["MessageFlags"]["EPHEMERAL"],
				});
				return false;
			}

			return true;
		},
	},
	{
		description: "Reply to a ModMail ticket with a premade snippet message.",
		default_permission: true,
		options: [
			{
				type: 3,
				name: "snippet",
				description: "The snippet you want to send.",
				choices: slashCommandOptions,
				required: true,
			},
		],
	}
);
