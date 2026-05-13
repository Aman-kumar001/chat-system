const initials = (name) =>
	(name || '?')
		.trim()
		.split(/\s+/)
		.map((p) => p[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();

const ChatList = ({ chat, currentUser }) => {
	const isMine = chat.username === currentUser;

	const rowClass = `flex items-end gap-2 my-2 ${
		isMine ? 'justify-end' : 'justify-start'
	}`;

	const bubbleClass = isMine
		? 'bubble-mine rounded-2xl rounded-br-md'
		: 'bubble-theirs rounded-2xl rounded-bl-md';

	const avatar = (
		<div className='h-8 w-8 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-100 text-[11px] font-semibold flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/30'>
			{initials(chat.username)}
		</div>
	);

	return (
		<div className={rowClass}>
			{!isMine && avatar}
			<div className='flex flex-col max-w-[72%]'>
				{!isMine && (
					<span className='text-[10px] text-purple-300/70 ml-2 mb-1 font-medium tracking-wide'>
						{chat.username}
					</span>
				)}
				<div className={`${bubbleClass} px-3.5 py-2 text-sm break-words leading-relaxed`}>
					{chat.message}
				</div>
			</div>
		</div>
	);
};

export default ChatList;
