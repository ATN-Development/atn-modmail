import { Client } from "./Client";
import { SlashInteraction } from "./SlashInteraction";

async function enoughReqs(
  reqs: SlashCommandReqs,
  interaction: SlashInteraction,
  client: Client
) {
  const { custom } = reqs;

  if (custom && !(await custom(interaction, client))) {
    return false;
  }

  return true;
}

export interface SlashCommandReqs {
  custom?(
    interaction: SlashInteraction,
    client: Client
  ): boolean | Promise<boolean>;
}

export interface CommandFn {
  (interaction: SlashInteraction, client: Client): Promise<void> | void;
}

export interface ApplicationCommandOptions {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  name: string;
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOptions;
}

export interface ApplicationCommandOptionChoice {
  name: string;
  value: string | number;
}

export interface CommandOptions {
  description: string;
  options?: ApplicationCommandOptions[];
  default_permission?: boolean;
}

export class SlashCommand {
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
    this.reqs = {};
    if (reqs) {
      if (reqs.custom) {
        this.reqs.custom = reqs.custom;
      }
    }
    this.description = "A command with no description!";
    if (options) {
      this.options = options;
      this.description = options.description;
    }
  }

  async checkPermissions(
    interaction: SlashInteraction,
    client: Client
  ): Promise<boolean> {
    return enoughReqs(this.reqs, interaction, client);
  }

  async execute(
    interaction: SlashInteraction,
    client: Client
  ): Promise<boolean> {
    if (!(await this.checkPermissions(interaction, client))) return false;

    this.fn(interaction, client);

    return true;
  }
}
