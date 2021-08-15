import { Event } from "../utils/Event";

export default new Event(
  "componentInteractionCreate",
  (interaction, client) => {
    const componentEvent = client.componentEvents.find(
      (e) => e.name === interaction.data.custom_id
    );

    if (!componentEvent) return;

    componentEvent.execute(interaction, client);
  }
);
