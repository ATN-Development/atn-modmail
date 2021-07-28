import { Event } from "../utils/Event";

export default new Event(
  "ready",
  () => {
    console.log(`Ready!`);
  },
  {
    once: true,
  }
);
