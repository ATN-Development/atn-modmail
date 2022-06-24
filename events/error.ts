import { Event } from "../utils/Event";

export const event = new Event("error", (_client, err) => {
	if (err.message.toLowerCase() === "cannot read property 'map' of undefined")
		return;
	console.log(`Error: ${err.message}`);
});
