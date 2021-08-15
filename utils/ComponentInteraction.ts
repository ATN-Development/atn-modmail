import { Interaction, InteractionPacketD } from "./Interaction";

export interface ComponentInteractionData {
  custom_id?: string;
  component_type?: number;
}

export class ComponentInteraction extends Interaction {
  data: ComponentInteractionData;
  constructor(data: InteractionPacketD) {
    super(data);
    this.data = data.data;
  }
}
