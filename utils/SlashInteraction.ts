import {
  Interaction,
  InteractionPacketD,
  InteractionDataOptions,
} from "./Interaction";

export interface SlashInteractionData {
  id?: string;
  name?: string;
  options?: InteractionDataOptions[];
}

export class SlashInteraction extends Interaction {
  data: SlashInteractionData;
  constructor(data: InteractionPacketD) {
    super(data);
    this.data = data.data;
  }
}
