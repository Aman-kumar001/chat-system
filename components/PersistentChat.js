import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import ChatLayout from './ChatLayout';

const PersistentChat = ({ username, onSignOut }) => {
	const [chats, setChats] = useState([]);
	const [messageToSend, setMessageToSend] = useState('');

	useEffect(() => {
		const pusher = new Pusher('f7de14c222e7d0b55468', {
			cluster: 'ap2',
			authEndpoint: `api/pusher/auth`,
			auth: { params: { username } },
		});

		const channel = pusher.subscribe('presence-channel');

		channel.bind('chat-update', ({ username: u, message }) => {
			setChats((prev) => [...prev, { username: u, message }]);
		});

		return () => {
			pusher.unsubscribe('presence-channel');
			pusher.disconnect();
		};
	}, [username]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!messageToSend.trim()) return;
		await axios.post('/api/pusher/chat-update', {
			message: messageToSend,
			username,
		});
		setMessageToSend('');
	};

	return (
		<ChatLayout
			title={`@${username}`}
			subtitle='persistent room'
			statusLabel='live'
			statusTone='ok'
			onLeave={onSignOut}
			chats={chats}
			currentUser={username}
			emptyHint='Say hi — everyone in the persistent room will see it.'
			message={messageToSend}
			onMessageChange={(e) => setMessageToSend(e.target.value)}
			onSubmit={handleSubmit}
			canSend
		/>
	);
};

export default PersistentChat;
