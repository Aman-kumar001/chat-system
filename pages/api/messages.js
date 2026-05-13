import { getMessages, sanitizeRoom } from '../../lib/db';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		res.status(405).json({ error: 'method not allowed' });
		return;
	}
	const room = sanitizeRoom(req.query.room);
	if (!room) {
		res.status(400).json({ error: 'room required' });
		return;
	}
	const messages = getMessages(room);
	res.json({ room, messages });
}
