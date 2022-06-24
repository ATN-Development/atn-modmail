// Credits to https://npmjs.com/package/yuuko for some of the Client part.

import Eris from "eris";
import { readdirSync } from "fs";
import pathPackage from "path";
import axios, { AxiosResponse } from "axios";
import path from "path";
import config from "../config";
import { Command } from "./Command";
import ComponentEvent from "./ComponentEvent";
import { Event } from "./Event";

export interface ClientOptions extends Eris.ClientOptions {
  prefix: string;
  token: string;
}

interface EventImport {
  event: Event<keyof Eris.EventListeners>;
}

interface CommandImport {
  command: Command;
}

interface ComponentEventImport {
  event: ComponentEvent;
}

export class Client extends Eris.Client {
  token: string;
  prefix: string;
  commands: Command[] = [];
  componentEvents: ComponentEvent[] = [];
  readyPromise: Promise<void>;
  private resolvePromise!: (arg: void | PromiseLike<void>) => void;
  constructor(options: ClientOptions) {
    super(options.token, options);
    this.token = options.token;
    this.prefix = options.prefix;
    this.readyPromise = new Promise((resolve) => {
      this.resolvePromise = resolve;
    });

    this.once("ready", this.resolvePromise);
  }

  mentionPrefixRegExp() {
    return new RegExp(`^<@!?${this.user.id}>\\s?`) || null;
  }

  public addEvents(path: string): this {
    const eventFiles = readdirSync(path);
    for (const file of eventFiles.filter((f) => f.endsWith(".js"))) {
      const { event } = require(pathPackage.join(path, file)) as EventImport;

      if (event.once)
        this.once(event.event, (...args) => void event.listener(this, ...args));
      else
        this.on(event.event, (...args) => void event.listener(this, ...args));
    }
    return this;
  }

  async addCommands(path: string) {
    try {
      await this.readyPromise;
      const commandFiles = readdirSync(path);
      const commands: Eris.ApplicationCommandStructure[] = [];

      for (const file of commandFiles.filter((f) => f.endsWith(".js"))) {
        const { command } = require(pathPackage.join(
          path,
          file
        )) as CommandImport;

        this.commands.push(command);

        commands.push({
          description: command.description,
          name: command.name,
          type: Eris.Constants["ApplicationCommandTypes"]["CHAT_INPUT"],
          defaultPermission: true,
          options: command.options?.options ? command.options.options : [],
        });
      }

      await this.bulkEditGuildCommands(config.GuildID, commands);
    } catch (error) {
      console.log(`${(error as Error).name}: ${(error as Error).message}`);
    }

    return this;
  }

  async processCommand(interaction: Eris.CommandInteraction): Promise<boolean> {
    const command = this.commands.find((c) => c.name === interaction.data.name);

    if (!command) {
      return false;
    }

    await command.execute(interaction, this);

    return true;
  }

  async checkVersion(): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const latestVersion = (await axios.get(
      "https://raw.githubusercontent.com/NotReallyEight/atn-modmail/main/package.json",
      {
        headers: {
          accept: "application/vnd.github.v3+json",
        },
      }
    )) as AxiosResponse<{ version: string }>;

    const actualVersion = require(path.join(
      __dirname,
      "..",
      "..",
      "package.json"
    )) as { version: string; [key: string]: unknown };

    if (latestVersion.data.version !== actualVersion.version) {
      console.log(
        "Warning: The bot is not up to date with the latest version! Please update!"
      );
      return false;
    } else {
      return true;
    }
  }

  addComponentEvents(path: string) {
    const eventFiles = readdirSync(path);

    for (const file of eventFiles.filter((f) => f.endsWith(".js"))) {
      const { event } = require(pathPackage.join(
        path,
        file
      )) as ComponentEventImport;

      this.componentEvents.push(event);
    }

    return this;
  }
}
