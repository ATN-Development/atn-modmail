import { Command } from "../utils/Command";

export const command = new Command(
  "ping",
  async (interaction) => {
    try {
      await interaction.createMessage({
        content: `Pong! My latency is \`${
          Date.now() - interaction.createdAt
        }\`ms.`,
      });
    } catch (err) {
      console.log(`Error: ${(err as Error).message}`);
    }
  },
  {
    custom: (interaction) => {
      if (!interaction.guildID) {
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
