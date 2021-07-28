import { Event } from "../utils/Event";

export default new Event("error", (err) => {
  console.log(`Error: ${err.message}`);
});
