import { pusher } from '../../../lib/pusher';
import { addMessage, sanitizeRoom } from '../../../lib/db';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'method not allowed' });
		return;
	}
	const { message, username, room } = req.body || {};
	const cleanRoom = sanitizeRoom(room);
	const cleanMessage = String(message || '').trim();
	const cleanUsername = String(username || '').trim();

	if (!cleanRoom || !cleanMessage || !cleanUsername) {
		res.status(400).json({ error: 'room, username, and message required' });
		return;
	}

	const id = addMessage({
		room: cleanRoom,
		username: cleanUsername,
		message: cleanMessage,
	});

	const channel = `presence-room-${cleanRoom}`;
	await pusher.trigger(channel, 'chat-update', {
		id,
		username: cleanUsername,
		message: cleanMessage,
		created_at: Date.now(),
	});

	res.json({ status: 200, id });
}
