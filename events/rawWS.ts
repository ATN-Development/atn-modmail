import { ComponentInteraction } from "../utils/ComponentInteraction";
import { Event } from "../utils/Event";
import {
  InteractionPacketD,
  Interaction,
} from "../utils/Interaction";
import { SlashInteraction } from "../utils/SlashInteraction";

export default new Event("rawWS", (packet, _id, client) => {
  if (!packet.t || packet.t !== 'INTERACTION_CREATE') return

  const interaction = new Interaction(packet.d as InteractionPacketD)

  if (interaction.type === 2) {
    client.emit("slashInteractionCreate", new SlashInteraction(packet.d as InteractionPacketD), client)
  } else {
    client.emit("componentInteractionCreate", new ComponentInteraction(packet.d as InteractionPacketD), client)
  }
});
