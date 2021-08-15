import Eris from "eris";
import axios from "axios";
import { Client } from "./Client";

export interface Member {
  user: User;
  nick?: string;
  roles: string[];
  joined_at: Date;
  premium_since?: Date;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
  permissions?: string;
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot: boolean;
  system: boolean;
  mfa_enabled: boolean;
  locale: string;
  verified: boolean;
  email: boolean;
  flags: number;
  premium_type: 0 | 1 | 2;
  public_flags: number;
}

export interface InteractionDataOptions {
  name: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  value?: string;
  options?: InteractionDataOptions[];
}

export interface InteractionPacketD {
  version: number;
  token: string;
  id: string;
  application_id: string;
  type: 1 | 2 | 3;
  guild_id: string;
  channel_id: string;
  member: Member;
  data?: any;
}

export interface InteractionResponse {
  data: InteractionApplicationCommandCallbackDataStructure;
}

export interface InteractionApplicationCommandCallbackDataStructure {
  tts?: boolean;
  content?: string;
  embeds?: Eris.Embed[];
  allowed_mentions?: Eris.AllowedMentions;
  flags?: 0 | 64;
  components?: MessageComponent[];
}

export interface MessageComponent {
  type: 1 | 2 | 3;
  custom_id?: string;
  disabled?: boolean;
  style?: 1 | 2 | 3 | 4 | 5;
  label?: string;
  emoji?: Eris.PartialEmoji;
  url?: string;
  options?: SelectOption[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  components?: MessageComponent[];
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: Eris.PartialEmoji;
  default?: boolean;
}

export class Interaction extends Eris.Base {
  version: number;
  token: string;
  id: string;
  applicationId: string;
  type: 1 | 2 | 3;
  guildId: string;
  channelId: string;
  member: Member;
  user: User;
  data: any | undefined;
  constructor(data: InteractionPacketD) {
    super(data.id);
    this.id = data.id;
    this.version = data.version;
    this.token = data.token;
    this.applicationId = data.application_id;
    this.type = data.type;
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
    this.member = data.member;
    this.user = data.member.user;
    this.data = data.data ? data.data : undefined;
  }

  async reply(options: InteractionResponse | string, client: Client) {
    try {
      let response: InteractionResponse = {
        data: {},
      };
      if (typeof options === "string") {
        response.data.content = options;
      } else {
        response.data = options.data;
      }
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 4,
            data: response.data,
          },
          {
            headers: {
              Authorization: client.token.startsWith('Bot') ? client.token: `Bot ${client.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    }
  }

  async ephemeralReply(options: InteractionResponse | string, client: Client) {
    try {
      let response: InteractionResponse = {
        data: {},
      };
      if (typeof options === "string") {
        response.data.content = options;
      } else {
        response.data = options.data;
      }
      response.data.flags = 64;
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 4,
            data: response.data,
          },
          {
            headers: {
              Authorization: client.token.startsWith('Bot') ? client.token: `Bot ${client.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    }
  }

  async deferUpdate(options: InteractionResponse | string, client: Client) {
    try {
      let response: InteractionResponse = {
        data: {},
      };
      if (typeof options === "string") {
        response.data.content = options;
        response.data.flags = 64;
      } else {
        response.data = options.data;
      }
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 6,
            data: response.data,
          },
          {
            headers: {
              Authorization: client.token.startsWith('Bot') ? client.token: `Bot ${client.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    }
  }

  async deferWithSource(
    options?: InteractionResponse | string,
    client?: Client
  ) {
    try {
      let response: InteractionResponse = {
        data: {},
      };
      if (typeof options === "string") {
        response.data.content = options;
        response.data.flags = 64;
      } else {
        response.data = options?.data ?? {};
      }
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 5,
            data: response.data,
          },
          {
            headers: {
              Authorization: client?.token.startsWith('Bot') ? client.token: `Bot ${this.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    }
  }

  async followUp(options: InteractionResponse | string, client: Client) {
    try {
      let response: InteractionResponse = {
        data: {},
      };
      if (typeof options === "string") {
        response.data.content = options;
      } else {
        response.data = options.data;
      }
      await axios
        .patch(
          `https://discord.com/api/v9/webhooks/${client.user.id}/${this.token}/messages/@original`,
          response.data,
          {
            headers: {
              Authorization: client.token.startsWith('Bot') ? client.token: `Bot ${client.token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => res);
    } catch (err: any) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
      console.log(err.config);
    }
  }
}
