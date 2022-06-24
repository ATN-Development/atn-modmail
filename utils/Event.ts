// Credits to https://npmjs.com/package/yuuko for some of the Event handler part.

import { Client } from "./Client";
import Eris from "eris";

export interface EventListenerOptions {
	once?: boolean;
}

export class Event<K extends keyof Eris.EventListeners>
	implements EventListenerOptions
{
	event: K;

	once: boolean;

	listener: (
		client: Client,
		...args: [...Eris.EventListeners[K]]
	) => void | Promise<void>;

	constructor(
		event: K,
		listener: (
			client: Client,
			...args: [...Eris.EventListeners[K]]
		) => void | Promise<void>,
		{ once = false }: EventListenerOptions = {}
	) {
		this.event = event;
		this.listener = listener;
		this.once = once;
	}
}
