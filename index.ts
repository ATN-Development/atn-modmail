import { Client } from "./utils/Client";
import config from "./config";
import path from "path";

const client = new Client({
	prefix: config.Prefix,
	allowedMentions: {
		everyone: false,
		roles: true,
		users: true,
	},
	autoreconnect: true,
	getAllUsers: true,
	token: config.Token,
	intents: ["guilds", "guildMembers", "guildMessages"],
});

client.addEvents(path.join(__dirname, "events"));

void client.addCommands(path.join(__dirname, "commands"));

void client.checkVersion();

void client.addComponentEvents(path.join(__dirname, "componentEvents"));

void client.connect();
