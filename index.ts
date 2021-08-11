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
  intents: 4611,
});

client.addEvents(path.join(__dirname, "events"));

client.addCommands(path.join(__dirname, "commands"));

client.addSlashCommands(path.join(__dirname, "slashCommands"));

client.checkVersion();

client.addInteractionEvents(path.join(__dirname, "interactionEvents"));

client.addComponentEvents(path.join(__dirname, "componentEvents"));

client.connect();
