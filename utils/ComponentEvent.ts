import { ComponentInteraction } from "./ComponentInteraction";
import { Client } from "./Client";

export interface ComponentEventFn {
  (interaction: ComponentInteraction, client: Client): Promise<void> | void;
}

export interface ComponentEventReqs {
  custom?(
    interaction: ComponentInteraction,
    client: Client
  ): Promise<boolean> | boolean;
}

export default class ComponentEvent {
  name: string;
  fn: ComponentEventFn;
  reqs: ComponentEventReqs;
  constructor(name: string, fn: ComponentEventFn, reqs?: ComponentEventReqs) {
    this.name = name;
    this.fn = fn;
    this.reqs = {};
    if (reqs) {
      if (reqs.custom) {
        this.reqs.custom = reqs.custom;
      }
    }
  }

  async checkPermissions(
    interaction: ComponentInteraction,
    client: Client
  ): Promise<boolean> {
    return this._enoughReqs(this.reqs, interaction, client);
  }

  async execute(
    interaction: ComponentInteraction,
    client: Client
  ): Promise<boolean> {
    if (!(await this.checkPermissions(interaction, client))) return false;
    this.fn(interaction, client);

    return true;
  }

  private async _enoughReqs(
    reqs: ComponentEventReqs,
    interaction: ComponentInteraction,
    client: Client
  ) {
    const { custom } = reqs;

    if (custom && !(await custom(interaction, client))) {
      return false;
    }

    return true;
  }
}
