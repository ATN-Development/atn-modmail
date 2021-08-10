import { Event } from "../utils/Event";

export default new Event("error", (err) => {
  if (err.message.toLowerCase() === "cannot read property 'map' of undefined") return
  console.log(`Error: ${err.message}`);
});
