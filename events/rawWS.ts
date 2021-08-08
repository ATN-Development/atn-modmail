import { Event } from "../utils/Event";
import {
  SlashInteractionPacketD,
  SlashInteraction,
} from "../utils/SlashInteraction";

export default new Event("rawWS", (packet, _id, client) => {
  if (!(packet.d as SlashInteractionPacketD)) return;
  if ((packet.d as SlashInteractionPacketD).type !== 2) return;
  client.emit(
    "interactionCreate",
    new SlashInteraction(packet.d as SlashInteractionPacketD),
    client
  );
});
