import { SlashCommand } from "../utils/SlashCommand";

export default new SlashCommand(
  "ping",
  (interaction, client) => {
    interaction.reply(
      {
        data: {
          content: `Pong! My latency is \`${
            Date.now() - interaction.createdAt
          }\`ms.`,
        },
        type: 4,
      },
      client
    );
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
