import Button from '../components/Button';

export default function Login({
	handleLogin,
	handleLoginChange,
	username,
	mode,
	setMode,
	targetUsername,
	handleTargetChange,
}) {
	const tabClass = (active) =>
		`flex-1 py-2 text-sm rounded-md transition font-medium ${
			active ? 'tab-active' : 'text-neutral-400 hover:text-neutral-200'
		}`;

	return (
		<div className='app-bg min-h-screen w-full flex items-center justify-center px-4'>
			<div className='relative z-10 w-full max-w-md'>
				<div className='text-center mb-8'>
					<h1 className='brand-gradient text-6xl tracking-tight font-bold'>
						baat-E
					</h1>
					<p className='text-neutral-400 text-sm mt-3'>
						no logins. just usernames.
					</p>
				</div>

				<form
					onSubmit={handleLogin}
					className='glass-strong px-6 py-8 rounded-2xl'
				>
					<div className='glass-inner flex rounded-lg p-1 mb-6'>
						<button
							type='button'
							className={tabClass(mode === 'live')}
							onClick={() => setMode('live')}
						>
							Live (P2P)
						</button>
						<button
							type='button'
							className={tabClass(mode === 'persistent')}
							onClick={() => setMode('persistent')}
						>
							Persistent
						</button>
					</div>

					<p className='text-neutral-300 text-sm text-center mb-5'>
						{mode === 'live'
							? 'Pick your username and who you want to chat with.'
							: 'Enter your username to join the room.'}
					</p>

					<div className='flex flex-col gap-3'>
						<input
							type='text'
							value={username}
							onChange={handleLoginChange}
							className='glass-input placeholder-neutral-500 rounded-md px-3.5 py-2.5 text-sm'
							placeholder='your username'
						/>

						{mode === 'live' && (
							<input
								type='text'
								value={targetUsername}
								onChange={handleTargetChange}
								className='glass-input placeholder-neutral-500 rounded-md px-3.5 py-2.5 text-sm'
								placeholder="other person's username"
							/>
						)}

						<Button text={mode === 'live' ? 'Start Chat' : 'Enter Chat'} />
					</div>

					{mode === 'live' && (
						<p className='text-xs text-neutral-500 text-center mt-5'>
							Strictly live. No history. Messages disappear when you leave.
						</p>
					)}
				</form>

				<p className='text-center text-[11px] text-neutral-600 mt-6'>
					end-to-end peer connection · no servers see your messages
				</p>
			</div>
		</div>
	);
}
