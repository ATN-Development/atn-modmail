// Credits to https://npmjs.com/package/yuuko for some of the Client part.

import Eris from "eris";
import { readdirSync } from "fs";
import pathPackage from "path";
import { Command } from "./Command";
import axios from "axios";

export interface ClientOptions extends Eris.ClientOptions {
  prefix: string;
  token: string;
}

export class Client extends Eris.Client {
  token: string;
  prefix: string;
  commands: Command[] = [];
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

  async postTranscript(content: string): Promise<string> {
    if (!content) throw new Error("Please specify a valid content.");

    const result = await axios({
      url: "https://dumpz.org/api/dump",
      method: "POST",
      data: content,
    });

    return result.data.url;
  }
}
