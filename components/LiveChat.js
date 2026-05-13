import { useEffect, useRef, useState } from 'react';
import ChatLayout from './ChatLayout';

const sanitize = (s) => s.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
const peerIdFor = (user) => `buddydr-${sanitize(user)}`;

const RETRY_MS = 3000;

const STATUS_LABEL = {
	connecting: 'connecting…',
	'waiting for peer': 'waiting for peer',
	connected: 'connected',
	disconnected: 'disconnected',
	'username-taken': 'username taken',
};

const STATUS_TONE = {
	connected: 'ok',
	connecting: 'warn',
	'waiting for peer': 'warn',
	disconnected: 'idle',
	'username-taken': 'idle',
};

const LiveChat = ({ username, targetUsername, onSignOut }) => {
	const [chats, setChats] = useState([]);
	const [messageToSend, setMessageToSend] = useState('');
	const [status, setStatus] = useState('connecting');

	const peerRef = useRef(null);
	const connRef = useRef(null);
	const retryTimerRef = useRef(null);
	const cancelledRef = useRef(false);

	const targetId = peerIdFor(targetUsername);

	const appendChat = (entry) => setChats((prev) => [...prev, entry]);

	const wireConnection = (conn) => {
		if (connRef.current && connRef.current.open && connRef.current !== conn) {
			conn.close();
			return;
		}
		connRef.current = conn;

		conn.on('open', () => setStatus('connected'));
		conn.on('data', (data) => {
			if (data && data.type === 'msg') {
				appendChat({ username: data.username, message: data.message });
			}
		});
		const drop = () => {
			if (connRef.current === conn) {
				connRef.current = null;
				setStatus('waiting for peer');
				scheduleRetry();
			}
		};
		conn.on('close', drop);
		conn.on('error', drop);
	};

	const tryConnect = () => {
		const peer = peerRef.current;
		if (!peer || peer.destroyed) return;
		if (connRef.current && connRef.current.open) return;
		const conn = peer.connect(targetId, { reliable: true });
		wireConnection(conn);
	};

	const scheduleRetry = () => {
		if (cancelledRef.current) return;
		if (retryTimerRef.current) return;
		retryTimerRef.current = setTimeout(() => {
			retryTimerRef.current = null;
			if (cancelledRef.current) return;
			if (connRef.current && connRef.current.open) return;
			tryConnect();
			scheduleRetry();
		}, RETRY_MS);
	};

	useEffect(() => {
		cancelledRef.current = false;

		(async () => {
			const { default: Peer } = await import('peerjs');
			if (cancelledRef.current) return;

			const myId = peerIdFor(username);
			const peer = new Peer(myId, { debug: 1 });
			peerRef.current = peer;

			peer.on('open', () => {
				setStatus('waiting for peer');
				tryConnect();
				scheduleRetry();
			});

			peer.on('connection', (conn) => {
				if (conn.peer === targetId) wireConnection(conn);
				else conn.close();
			});

			peer.on('error', (err) => {
				if (err.type === 'unavailable-id') {
					setStatus('username-taken');
				} else if (err.type === 'peer-unavailable') {
					setStatus('waiting for peer');
					scheduleRetry();
				} else {
					setStatus(`error: ${err.type || 'unknown'}`);
				}
			});

			peer.on('disconnected', () => setStatus('disconnected'));
		})();

		return () => {
			cancelledRef.current = true;
			if (retryTimerRef.current) {
				clearTimeout(retryTimerRef.current);
				retryTimerRef.current = null;
			}
			if (connRef.current) {
				connRef.current.close();
				connRef.current = null;
			}
			if (peerRef.current) {
				peerRef.current.destroy();
				peerRef.current = null;
			}
			setChats([]);
		};
	}, [username, targetUsername]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const text = messageToSend.trim();
		if (!text) return;
		const conn = connRef.current;
		if (!conn || !conn.open) return;
		conn.send({ type: 'msg', username, message: text });
		appendChat({ username, message: text });
		setMessageToSend('');
	};

	const canSend = status === 'connected';

	const disabledHint =
		status === 'username-taken'
			? `Your username "${username}" is already in use. Pick another.`
			: 'Waiting for the other person to join…';

	return (
		<ChatLayout
			title={`@${username}`}
			subtitle={`chatting with @${targetUsername}`}
			statusLabel={STATUS_LABEL[status] || status}
			statusTone={STATUS_TONE[status] || 'idle'}
			onLeave={onSignOut}
			chats={chats}
			currentUser={username}
			emptyHint='Strictly live. Messages here vanish when you close the tab.'
			message={messageToSend}
			onMessageChange={(e) => setMessageToSend(e.target.value)}
			onSubmit={handleSubmit}
			canSend={canSend}
			disabledHint={disabledHint}
		/>
	);
};

export default LiveChat;
