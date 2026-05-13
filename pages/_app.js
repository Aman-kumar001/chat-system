import '../styles/globals.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	const [username, setUsername] = useState('');
	const [mode, setMode] = useState('live');
	const [targetUsername, setTargetUsername] = useState('');
	const [persistentRoom, setPersistentRoom] = useState('');
	const router = useRouter();

	const handleLogin = (e) => {
		e.preventDefault();
		if (!username.trim()) return;
		if (mode === 'live' && !targetUsername.trim()) return;
		if (mode === 'persistent' && !persistentRoom.trim()) return;
		router.push('/chat');
	};

	return (
		<>
			<Head>
				<title>baat-E</title>
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			</Head>
			<Component
				username={username}
				handleLoginChange={(e) => setUsername(e.target.value)}
				mode={mode}
				setMode={setMode}
				targetUsername={targetUsername}
				handleTargetChange={(e) => setTargetUsername(e.target.value)}
				persistentRoom={persistentRoom}
				handlePersistentRoomChange={(e) => setPersistentRoom(e.target.value)}
				handleLogin={handleLogin}
				{...pageProps}
			/>
		</>
	);
}

export default MyApp;
