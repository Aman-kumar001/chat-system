import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LiveChat from '../components/LiveChat';
import PersistentChat from '../components/PersistentChat';

const Chat = ({ username, mode, targetUsername, persistentRoom }) => {
	const router = useRouter();

	useEffect(() => {
		if (!username) router.replace('/');
		else if (mode === 'live' && !targetUsername) router.replace('/');
		else if (mode === 'persistent' && !persistentRoom) router.replace('/');
	}, [username, mode, targetUsername, persistentRoom, router]);

	if (!username) return null;
	if (mode === 'live' && !targetUsername) return null;
	if (mode === 'persistent' && !persistentRoom) return null;

	const handleSignOut = () => router.push('/');

	return (
		<div className='app-bg min-h-screen w-full flex items-center justify-center px-4 py-8'>
			<div className='relative z-10 w-full flex justify-center'>
				{mode === 'live' ? (
					<LiveChat
						username={username}
						targetUsername={targetUsername}
						onSignOut={handleSignOut}
					/>
				) : (
					<PersistentChat
						username={username}
						persistentRoom={persistentRoom}
						onSignOut={handleSignOut}
					/>
				)}
			</div>
		</div>
	);
};

export default Chat;
