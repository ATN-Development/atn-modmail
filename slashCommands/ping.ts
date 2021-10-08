import { SlashCommand } from "../utils/SlashCommand";

export default new SlashCommand(
  "ping",
  async (interaction, client) => {
    try {
      await interaction.reply(
        {
          data: {
            content: `Pong! My latency is \`${
              Date.now() - interaction.createdAt
            }\`ms.`,
          },
        },
        client
      );
    } catch (err: any) {
      console.log(`Error: ${err.message}`);
    }
  },
  {
    custom: (interaction) => {
      if (!interaction.guildId) {
        return false;
      } else {
        return true;
      }
    },
  },
  {
    description: "Get latency of the bot!",
    default_permission: true,
  }
);
