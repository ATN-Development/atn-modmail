import { Command } from "../utils/Command";

export default new Command(
  "ping",
  (message) => {
    message.channel.createMessage(
      `Pong! My latency is \`${Date.now() - message.createdAt}\` ms.`
    );
  },
  {
    custom: (message) => {
      if (message.channel.type !== 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  {
    description: "Check the bot's latency.",
  }
);
