// Credits to https://npmjs.com/package/yuuko for some of the Command handler part.

import Eris from "eris";
import { Client } from "./Client";

async function enoughReqs(
  reqs: CommandReqs,
  message: Eris.Message,
  args: string[],
  client: Client
) {
  const { custom } = reqs;

  if (custom && !(await custom(message, args, client))) {
    return false;
  }

  return true;
}

export interface CommandReqs {
  custom?(
    msg: Eris.Message,
    args: string[],
    client: Client
  ): boolean | Promise<boolean>;
}

export interface CommandFn<T extends Eris.Textable = Eris.TextableChannel> {
  (message: Eris.Message<T>, args: string[], client: Client): void;
}

export interface CommandOptions {
  description?: string;
  expectedArguments?: string;
}

export class Command {
  names: string[];
  fn: CommandFn;
  reqs: CommandReqs;
  description?: string;
  expectedArguments?: string;
  constructor(
    names: string | string[],
    fn: CommandFn,
    reqs?: CommandReqs,
    options?: CommandOptions
  ) {
    if (Array.isArray(names)) {
      this.names = names;
    } else {
      this.names = [names];
    }
    if (!this.names[0]) throw new Error("No command names set.");
    this.fn = fn;
    if (!this.fn)
      throw new Error("Where is the function you want to execute bro?");
    this.reqs = {};
    if (reqs) {
      if (reqs.custom) {
        this.reqs.custom = reqs.custom;
      }
    }
    if (options?.description) {
      this.description = options?.description;
    }
    if (options?.expectedArguments) {
      this.expectedArguments = options?.expectedArguments;
    }
  }

  async checkPermissions(
    message: Eris.Message,
    args: string[],
    client: Client
  ): Promise<boolean> {
    return enoughReqs(this.reqs, message, args, client);
  }

  async execute(
    message: Eris.Message,
    args: string[],
    client: Client
  ): Promise<boolean> {
    if (!(await this.checkPermissions(message, args, client))) return false;

    this.fn(message, args, client);

    return true;
  }
}
