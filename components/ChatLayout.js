import { useEffect, useRef } from 'react';
import SendMessage from './SendMessage';
import ChatList from './ChatList';

const StatusDot = ({ tone }) => {
	const colors =
		tone === 'ok'
			? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
			: tone === 'warn'
			? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
			: 'bg-neutral-500';
	return (
		<span className={`inline-block h-2 w-2 rounded-full ${colors} mr-2 align-middle`} />
	);
};

const ChatLayout = ({
	title,
	subtitle,
	statusLabel,
	statusTone,
	onLeave,
	chats,
	currentUser,
	emptyHint,
	message,
	onMessageChange,
	onSubmit,
	disabledHint,
	canSend = true,
}) => {
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [chats]);

	return (
		<div className='glass-strong flex flex-col h-[85vh] w-full max-w-3xl rounded-2xl overflow-hidden'>
			<header className='glass-inner flex items-center justify-between px-5 py-4 border-b glass-divider'>
				<div className='flex items-center gap-3'>
					<div className='h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-900/40' style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
						{(title || '?').replace(/^@/, '').slice(0, 1).toUpperCase()}
					</div>
					<div className='flex flex-col leading-tight'>
						<span className='text-neutral-100 font-semibold text-sm tracking-tight'>
							{title}
						</span>
						{subtitle && (
							<span className='text-[11px] text-purple-300/70 mt-0.5'>{subtitle}</span>
						)}
					</div>
				</div>
				<div className='flex items-center gap-3'>
					{statusLabel && (
						<span className='text-[11px] text-neutral-300 flex items-center'>
							<StatusDot tone={statusTone} />
							{statusLabel}
						</span>
					)}
					{onLeave && (
						<button
							onClick={onLeave}
							className='btn-ghost text-xs px-3 py-1.5 rounded-md'
						>
							Leave
						</button>
					)}
				</div>
			</header>

			<div ref={scrollRef} className='flex-1 overflow-y-auto px-5 py-4'>
				{chats.length === 0 ? (
					<div className='h-full flex items-center justify-center'>
						<p className='text-sm text-neutral-500 text-center max-w-xs'>
							{emptyHint}
						</p>
					</div>
				) : (
					chats.map((chat, id) => (
						<ChatList key={id} chat={chat} currentUser={currentUser} />
					))
				)}
			</div>

			<div className='glass-inner border-t glass-divider px-4 py-3'>
				<SendMessage
					message={message}
					handleMessageChange={onMessageChange}
					handleSubmit={onSubmit}
					disabled={!canSend}
				/>
				{!canSend && disabledHint && (
					<p className='text-xs text-purple-300/70 mt-2'>{disabledHint}</p>
				)}
			</div>
		</div>
	);
};

export default ChatLayout;
