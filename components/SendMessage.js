const SendMessage = ({ handleSubmit, handleMessageChange, message, disabled }) => {
	return (
		<form onSubmit={handleSubmit} className='flex items-center gap-2'>
			<input
				type='text'
				value={message}
				onChange={handleMessageChange}
				disabled={disabled}
				className='glass-input flex-1 placeholder-neutral-500 rounded-md px-3.5 py-2.5 text-sm disabled:opacity-50'
				placeholder={disabled ? 'waiting…' : 'type a message…'}
			/>
			<button
				type='submit'
				disabled={disabled}
				className='btn-primary px-5 py-2.5 rounded-md font-semibold text-sm'
			>
				Send
			</button>
		</form>
	);
};

export default SendMessage;
