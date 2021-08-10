// Credits to https://npmjs.com/package/yuuko for some of the Event handler part.

import { Client } from "./Client";
import Eris from "eris";
import { SlashInteraction } from "./SlashInteraction";
import { ComponentInteraction } from "./ComponentInteraction";

export interface EventListenerOptions {
  once?: boolean;
}

export class Event implements EventListenerOptions {
  args: Parameters<Client["on"]>;

  once: boolean;

  computedListener?: (...args: any[]) => void;

  constructor(
    event: "ready" | "disconnect",
    listener: (client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "callCreate" | "callRing" | "callDelete",
    listener: (call: Eris.Call, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "callUpdate",
    listener: (call: Eris.Call, oldCall: Eris.OldCall, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "channelCreate" | "channelDelete",
    listener: (channel: Eris.AnyChannel, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "channelPinUpdate",
    listener: (
      channel: Eris.TextableChannel,
      timestamp: number,
      oldTimestamp: number,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "channelRecipientAdd" | "channelRecipientRemove",
    listener: (
      channel: Eris.GroupChannel,
      user: Eris.User,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "channelUpdate",
    listener: (
      channel: Eris.AnyChannel,
      oldChannel: Eris.OldGuildChannel | Eris.OldGroupChannel,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "connect" | "shardPreReady",
    listener: (id: number, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "friendSuggestionCreate",
    listener: (
      user: Eris.User,
      reasons: Eris.FriendSuggestionReasons,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "friendSuggestionDelete",
    listener: (user: Eris.User, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildBanAdd" | "guildBanRemove",
    listener: (guild: Eris.Guild, user: Eris.User, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildAvailable" | "guildCreate",
    listener: (guild: Eris.Guild, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildDelete",
    listener: (guild: Eris.PossiblyUncachedGuild, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildEmojisUpdate",
    listener: (
      guild: Eris.PossiblyUncachedGuild,
      emojis: Eris.Emoji[],
      oldEmojis: Eris.Emoji[] | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildMemberAdd",
    listener: (guild: Eris.Guild, member: Eris.Member, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildMemberChunk",
    listener: (
      guild: Eris.Guild,
      members: Eris.Member[],
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildMemberRemove",
    listener: (
      guild: Eris.Guild,
      member: Eris.Member | Eris.MemberPartial,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildMemberUpdate",
    listener: (
      guild: Eris.Guild,
      member: Eris.Member,
      oldMember: {
        nick?: string;
        premiumSince: number;
        roles: string[];
        pending?: boolean;
      } | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildRoleCreate" | "guildRoleDelete",
    listener: (guild: Eris.Guild, role: Eris.Role, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildRoleUpdate",
    listener: (
      guild: Eris.Guild,
      role: Eris.Role,
      oldRole: Eris.OldRole,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildUnavailable" | "unavailableGuildCreate",
    listener: (guild: Eris.UnavailableGuild, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "guildUpdate",
    listener: (
      guild: Eris.Guild,
      oldGuild: Eris.OldGuild,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "hello",
    listener: (trace: string[], id: number, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "inviteCreate" | "inviteDelete",
    listener: (guild: Eris.Guild, invite: Eris.Invite, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageCreate",
    listener: (
      message: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageDelete" | "messageReactionRemoveAll",
    listener: (message: Eris.PossiblyUncachedMessage, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageReactionRemoveEmoji",
    listener: (
      message: Eris.PossiblyUncachedMessage,
      emoji: Eris.PartialEmoji,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageDeleteBulk",
    listener: (
      messages: Eris.PossiblyUncachedMessage[],
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageReactionAdd",
    listener: (
      message: Eris.PossiblyUncachedMessage,
      emoji: Eris.Emoji,
      reactor: Eris.Member | { id: string },
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageReactionRemove",
    listener: (
      message: Eris.PossiblyUncachedMessage,
      emoji: Eris.PartialEmoji,
      userID: string,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "messageUpdate",
    listener: (
      message: Eris.Message<Eris.PossiblyUncachedTextableChannel>,
      oldMessage: Eris.OldMessage | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "presenceUpdate",
    listener: (
      other: Eris.Member | Eris.Relationship,
      oldPresence: Eris.Presence | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "rawREST",
    listener: (request: Eris.RawRESTRequest, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "rawWS" | "unknown",
    listener: (packet: Eris.RawPacket, id: number, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "relationshipAdd" | "relationshipRemove",
    listener: (relationship: Eris.Relationship, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "relationshipUpdate",
    listener: (
      relationship: Eris.Relationship,
      oldRelationship: { type: number },
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "typingStart",
    listener: (
      channel: Eris.TextableChannel | { id: string },
      user: Eris.User | { id: string },
      member: Eris.Member | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "userUpdate",
    listener: (
      user: Eris.User,
      oldUser: Eris.PartialUser | null,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "voiceChannelJoin",
    listener: (
      member: Eris.Member,
      newChannel: Eris.AnyVoiceChannel,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "voiceChannelLeave",
    listener: (
      member: Eris.Member,
      oldChannel: Eris.AnyVoiceChannel,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "voiceChannelSwitch",
    listener: (
      member: Eris.Member,
      newChannel: Eris.AnyVoiceChannel,
      oldChannel: Eris.AnyVoiceChannel,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "voiceStateUpdate",
    listener: (
      member: Eris.Member,
      oldState: Eris.OldVoiceState,
      client: Client
    ) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "warn" | "debug",
    listener: (message: string, id: number, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "webhooksUpdate",
    listener: (data: Eris.WebhookData, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "shardReady" | "shardResume",
    listener: (id: number, client: Client) => void,
    options?: EventListenerOptions
  );
  constructor(
    event: "shardDisconnect" | "error",
    listener: (err: Error, id: number, client: Client) => void,
    options?: EventListenerOptions
  );

  // Self made events
  constructor(
    event: "componentInteractionCreate",
    listener: (interaction: ComponentInteraction, client: Client) => void,
    options?: EventListenerOptions
  );

  constructor(
    event: "slashInteractionCreate",
    listener: (interaction: SlashInteraction, client: Client) => void,
    options?: EventListenerOptions
  );

  constructor(
    event: string,
    listener: (...args: any) => void,
    { once = false }: EventListenerOptions = {}
  ) {
    this.args = [event, listener];
    this.once = once;
  }
}
