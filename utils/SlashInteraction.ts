import Eris, { PartialEmoji } from "eris";
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

export interface SlashInteractionPacketD {
  id: string;
  application_id: string;
  type: 1 | 2 | 3;
  data: SlashInteractionPacketDData;
  guild_id?: string;
  channel_id?: string;
  member: Member;
  user: User;
  token: string;
  version: number;
  message?: Eris.Message;
}

export interface SlashInteractionPacketDData {
  id: string;
  name: string;
  resolved?: ApplicationCommandInteractionDataResolved;
  options?: ApplicationCommandInteractionDataOptions;
  custom_id: string;
  component_type: number;
  type: number;
}

export interface ApplicationCommandInteractionDataResolved {
  users?: User[];
  members?: Member[];
  roles?: Eris.Role[];
  channels?: Eris.Channel[];
}

export interface ApplicationCommandInteractionDataOptions {
  name: string;
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  options?: ApplicationCommandInteractionDataOptions[];
}

export interface SlashCommandInteractionData {
  type: number;
  name: string;
  id: string;
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
  emoji?: PartialEmoji;
  url?: string;
  options: SelectOption[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  components: MessageComponent[];
}

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: PartialEmoji;
  default?: boolean;
}

export class SlashInteraction extends Eris.Base {
  version: number;
  token: string;
  id: string;
  applicationId: string;
  type: 1 | 2 | 3;
  guildId: string;
  channelId: string;
  member: Member;
  user: User;
  data: SlashCommandInteractionData;
  constructor(data: SlashInteractionPacketD) {
    super(data.id);
    this.id = data.id;
    this.applicationId = data.application_id;
    this.type = data.type;
    this.guildId = data.guild_id ?? "";
    this.channelId = data.channel_id ?? "";
    this.member = data.member;
    this.user = data.user;
    this.version = data.version;
    this.token = data.token;
    this.data = data.data;
  }

  async reply(options: InteractionResponse, client: Client) {
    try {
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 4,
            data: options.data,
          },
          {
            headers: {
              Authorization: `Bot ${client.token}`,
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

  async ephemeralReply(options: InteractionResponse, client: Client) {
    try {
      options.data.flags = 64;
      axios
        .post(
          `https://discord.com/api/v9/interactions/${this.id}/${this.token}/callback`,
          {
            type: 4,
            data: options.data,
          },
          {
            headers: {
              Authorization: `Bot ${client.token}`,
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
