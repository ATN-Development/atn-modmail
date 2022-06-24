import { ApplicationCommandOptions, CommandInteraction } from "eris";
import { Client } from "./Client";

async function enoughReqs(
  reqs: SlashCommandReqs,
  interaction: CommandInteraction,
  client: Client
) {
  if (reqs.custom && !(await reqs.custom(interaction, client))) {
    return false;
  }

  return true;
}

export interface SlashCommandReqs {
  custom?(
    interaction: CommandInteraction,
    client: Client
  ): boolean | Promise<boolean>;
}

export type CommandFn = (
  interaction: CommandInteraction,
  client: Client
) => Promise<void> | void;

export interface ApplicationCommandOptionChoice {
  name: string;
  value: string | number;
}

export interface CommandOptions {
  description: string;
  options?: ApplicationCommandOptions[];
  default_permission?: boolean;
}

export class Command {
  name: string;
  description: string;
  fn: CommandFn;
  reqs: SlashCommandReqs;
  options?: CommandOptions;
  constructor(
    name: string,
    fn: CommandFn,
    reqs?: SlashCommandReqs,
    options?: CommandOptions
  ) {
    this.name = name;
    this.fn = fn;
    this.reqs = reqs || {};
    this.description = "A command with no description!";
    if (options) {
      this.options = options;
      this.description = options.description;
    }
  }

  async checkPermissions(
    interaction: CommandInteraction,
    client: Client
  ): Promise<boolean> {
    return enoughReqs(this.reqs, interaction, client);
  }

  async execute(
    interaction: CommandInteraction,
    client: Client
  ): Promise<boolean> {
    if (!(await this.checkPermissions(interaction, client))) return false;

    void this.fn(interaction, client);

    return true;
  }
}
