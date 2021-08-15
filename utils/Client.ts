// Credits to https://npmjs.com/package/yuuko for some of the Client part.

import Eris from "eris";
import { readdirSync } from "fs";
import pathPackage from "path";
import { Command } from "./Command";
import axios from "axios";
import path from "path";
import config from "../config";
import { ApplicationCommandOptions, SlashCommand } from "./SlashCommand";
import { SlashInteraction } from "./SlashInteraction";
import ComponentEvent from "./ComponentEvent";

export interface ClientOptions extends Eris.ClientOptions {
  prefix: string;
  token: string;
}

export interface CreateSlashCommandOptions {
  id?: string;
  name: string;
  description: string;
  options?: ApplicationCommandOptions[];
  default_permission?: boolean;
}

export class Client extends Eris.Client {
  token: string;
  prefix: string;
  commands: Command[] = [];
  slashCommands: SlashCommand[] = [];
  componentEvents: ComponentEvent[] = [];
  constructor(options: ClientOptions) {
    super(options.token, options);
    this.token = options.token;
    this.prefix = options.prefix;
  }

  mentionPrefixRegExp() {
    return new RegExp(`^<@!?${this.user.id}>\\s?`) || null;
  }

  addEvents(path: string) {
    const eventFiles = readdirSync(path);

    for (const file of eventFiles) {
      let event = require(pathPackage.join(path, file));
      if (event.default) {
        event = Object.assign(event.default, event);
        delete event.default;
      }
      event.computedListener = (...args: any[]) => {
        event.args[1](...args, this);
      };
      if (event.once) {
        this.once(event.args[0], event.computedListener);
      } else {
        this.on(event.args[0], event.computedListener);
      }
    }
    return this;
  }

  addInteractionEvents(path: string) {
    const interactionEventFiles = readdirSync(path);

    for (const file of interactionEventFiles) {
      let event = require(pathPackage.join(path, file));
      if (event.default) {
        event = Object.assign(event.default, event);
        delete event.default;
      }
      event.computedListener = (...args: any[]) => {
        event.args[1](...args, this);
      };
      if (event.once) {
        this.once(event.args[0], event.computedListener);
      } else {
        this.on(event.args[0], event.computedListener);
      }
    }
    return this;
  }

  addCommands(path: string) {
    const commandFiles = readdirSync(path);

    for (const file of commandFiles) {
      let command = require(pathPackage.join(path, file));
      if (command.default) {
        command = Object.assign(command.default, command);
        delete command.default;
      }
      this.commands.push(command);
    }
    return this;
  }

  async addSlashCommands(path: string) {
    const commandFiles = readdirSync(path);

    for (const file of commandFiles) {
      let command = require(pathPackage.join(path, file));

      if (command.default) {
        command = Object.assign(command.default, command);
        delete command.default;
      }

      this.slashCommands.push(command);

      this.createSlashCommand({
        name: command.name,
        description: command.description,
        default_permission: command.options
          ? command.options.default_permission
          : true,
        options: command.options ? command.options.options : [],
      });
    }

    return this;
  }

  async getPrefixesForMessage() {
    const prefixes = [this.prefix];

    return prefixes;
  }

  async splitPrefixFromContent(
    message: Eris.Message
  ): Promise<[string, string] | null> {
    const prefixes = await this.getPrefixesForMessage();

    for (const prefix of prefixes) {
      if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {
        return [prefix, message.content.substr(prefix.length)];
      }
    }

    const match = message.content.match(this.mentionPrefixRegExp()!);
    if (match) {
      return [match[0], message.content.substr(match[0].length)];
    }

    if (!(message.channel instanceof Eris.GuildChannel)) {
      return ["", message.content];
    }
    return null;
  }

  async hasCommand(
    message: Eris.Message
  ): Promise<[string, string, ...string[]] | null> {
    const matchResult = await this.splitPrefixFromContent(message);
    if (!matchResult) return null;

    const [prefix, content] = matchResult;

    if (!content) {
      if (!prefix || !prefix.match(this.mentionPrefixRegExp()!)) return null;
      return [prefix, ""];
    }

    const args = content.split(" ");
    let commandName = args.shift();
    if (commandName === undefined) return null;
    commandName.toLowerCase();
    return [prefix, commandName, ...args];
  }

  async processCommand(message: any): Promise<boolean> {
    const commandInformation = await this.hasCommand(message);
    if (!commandInformation) return false;
    const [_prefix, commandName, ...args] = commandInformation;

    const command =
      this.commands.find((c) => c.names.includes(commandName)) || null;

    if (!command) {
      return false;
    }

    await command.execute(message, args, this);

    return true;
  }

  async processSlashCommand(interaction: SlashInteraction): Promise<boolean> {
    const command = this.slashCommands.find(
      (c) => c.name === interaction.data.name
    );

    if (!command) {
      return false;
    }

    await command.execute(interaction, this);

    return true;
  }

  /**
   * @deprecated
   */
  async postTranscript(content: string): Promise<string> {
    if (!content) throw new Error("Please specify a valid content.");

    const result = await axios({
      url: "https://dumpz.org/api/dump",
      method: "POST",
      data: content,
    });

    return result.data.url;
  }

  async checkVersion(): Promise<boolean> {
    const latestVersion = await axios.get(
      "https://raw.githubusercontent.com/NotReallyEight/atn-modmail/main/package.json",
      {
        headers: {
          accept: "application/vnd.github.v3+json",
        },
      }
    );
    const actualVersion = require(path.join(
      __dirname,
      "..",
      "..",
      "package.json"
    ));
    if (latestVersion.data.version !== actualVersion.version) {
      console.log(
        "Warning: The bot is not up to date with the latest version! Please update!"
      );
      return false;
    } else {
      return true;
    }
  }

  async hasSlashCommand(name: string): Promise<boolean> {
    try {
      do {
        await this.wait(500);
      } while (!this.user);
      const commands = await axios
        .get(
          `https://discord.com/api/v9/applications/${this.user?.id}/guilds/${config.GuildID}/commands`,
          {
            headers: {
              Authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data);

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].name.toLowerCase() === name.toLowerCase()) {
          return true;
        }
      }
      return false;
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error: ", err.message);
      }
      console.log(err.config);
      return false;
    }
  }

  async createSlashCommand(options: CreateSlashCommandOptions) {
    do {
      await this.wait(500);
    } while (!this.user);
    const commands = await this.getSlashCommands();
    try {
      if (await this.hasSlashCommand(options.name)) {
        const hasOptions = options.options ? true : false;
        if (
          commands?.find((c) =>
            c.name === options.name &&
            c.description === options.description &&
            c.default_permission === options.default_permission &&
            hasOptions
              ? JSON.stringify(c.options) === JSON.stringify(options.options)
              : false
          )
        ) {
          return this;
        } else {
          await axios.patch(
            `https://discord.com/api/v9/applications/${this.user?.id}/guilds/${
              config.GuildID
            }/commands/${
              commands?.find((c) => c?.name === options?.name)?.id ?? ""
            }`,
            {
              name: options.name,
              description: options.description,
              options: options.options,
              default_permission: options ? options.default_permission : true,
            },
            {
              headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } else {
        await axios.post(
          `https://discord.com/api/v9/applications/${this.user?.id}/guilds/${config.GuildID}/commands`,
          {
            name: options.name,
            description: options.description,
            options: options.options,
            default_permission: options ? options.default_permission : true,
          },
          {
            headers: {
              Authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      console.log(err);
    }

    return this;
  }

  async wait(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async addComponentEvents(path: string) {
    const eventFiles = readdirSync(path);

    for (const file of eventFiles) {
      let event = require(pathPackage.join(path, file));

      if (event.default) {
        event = Object.assign(event.default, event);
        delete event.default;
      }

      this.componentEvents.push(event);
    }

    return this;
  }

  async getSlashCommands(): Promise<CreateSlashCommandOptions[] | void> {
    try {
      do {
        await this.wait(500);
      } while (!this.user);
      const commands = await axios
        .get(
          `https://discord.com/api/v9/applications/${this.user?.id}/guilds/${config.GuildID}/commands`,
          {
            headers: {
              Authorization: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res.data);

      return commands;
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }
}
