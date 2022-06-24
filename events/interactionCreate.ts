import { CommandInteraction, ComponentInteraction, Constants } from "eris";
import { Event } from "../utils/Event";

export const event = new Event("interactionCreate", (client, interaction) => {
	if (
		interaction.type === Constants["InteractionTypes"]["APPLICATION_COMMAND"]
	) {
		if (
			client.commands.find(
				(c) => c.name === (interaction as CommandInteraction).data.name
			)
		)
			void client.processCommand(interaction as CommandInteraction);
	} else if (
		interaction.type === Constants["InteractionTypes"]["MESSAGE_COMPONENT"]
	) {
		const componentEvent = client.componentEvents.find(
			(e) => e.name === (interaction as ComponentInteraction).data.custom_id
		);

		if (!componentEvent) return;

		void componentEvent.execute(interaction as ComponentInteraction, client);
	}
});
