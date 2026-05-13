import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import ChatLayout from './ChatLayout';

const sanitize = (s) =>
	String(s || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 64);

const PersistentChat = ({ username, persistentRoom, onSignOut }) => {
	const [chats, setChats] = useState([]);
	const [messageToSend, setMessageToSend] = useState('');
	const [status, setStatus] = useState('loading');
	const seenIds = useRef(new Set());

	const room = sanitize(persistentRoom);

	const appendIfNew = (entry) => {
		if (entry.id != null) {
			if (seenIds.current.has(entry.id)) return;
			seenIds.current.add(entry.id);
		}
		setChats((prev) => [...prev, entry]);
	};

	useEffect(() => {
		if (!room) return;

		let cancelled = false;

		(async () => {
			try {
				const { data } = await axios.get('/api/messages', { params: { room } });
				if (cancelled) return;
				seenIds.current = new Set();
				const history = (data.messages || []).map((m) => {
					seenIds.current.add(m.id);
					return { id: m.id, username: m.username, message: m.message };
				});
				setChats(history);
				setStatus('live');
			} catch (e) {
				if (!cancelled) setStatus('error');
			}
		})();

		const pusher = new Pusher('f7de14c222e7d0b55468', {
			cluster: 'ap2',
			authEndpoint: `api/pusher/auth`,
			auth: { params: { username } },
		});

		const channelName = `presence-room-${room}`;
		const channel = pusher.subscribe(channelName);

		channel.bind('chat-update', (data) => {
			appendIfNew({
				id: data.id,
				username: data.username,
				message: data.message,
			});
		});

		return () => {
			cancelled = true;
			pusher.unsubscribe(channelName);
			pusher.disconnect();
		};
	}, [username, room]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const text = messageToSend.trim();
		if (!text) return;
		setMessageToSend('');
		try {
			await axios.post('/api/pusher/chat-update', {
				message: text,
				username,
				room,
			});
		} catch (err) {
			setStatus('error');
		}
	};

	return (
		<ChatLayout
			title={`@${username}`}
			subtitle={`room: ${room}`}
			statusLabel={status === 'live' ? 'live' : status}
			statusTone={status === 'live' ? 'ok' : status === 'error' ? 'idle' : 'warn'}
			onLeave={onSignOut}
			chats={chats}
			currentUser={username}
			emptyHint='No messages yet — say hi.'
			message={messageToSend}
			onMessageChange={(e) => setMessageToSend(e.target.value)}
			onSubmit={handleSubmit}
			canSend={status === 'live'}
			disabledHint={status === 'loading' ? 'Loading history…' : 'Something went wrong.'}
		/>
	);
};

export default PersistentChat;
