import { Event } from "../utils/Event";

export default new Event("messageCreate", (message, client) => {
  if (message.author.bot) return;
  client.processCommand(message);
});
