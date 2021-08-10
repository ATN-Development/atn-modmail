import { Event } from "../utils/Event";

export default new Event("slashInteractionCreate", (interaction, client) => {
  if (client.slashCommands.find((c) => c.name === interaction.data?.name)) {
    client.processSlashCommand(interaction);
  }
});
