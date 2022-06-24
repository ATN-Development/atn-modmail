import { Event } from "../utils/Event";

export const event = new Event(
  "ready",
  () => {
    console.log(`Ready!`);
  },
  {
    once: true,
  }
);
