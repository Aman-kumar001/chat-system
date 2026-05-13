const LeftPanel = ({ sender, onSignOut }) => (
	<>
		<div className='bg-black border border-neutral-800 shadow-md h-64 flex flex-col justify-center items-center rounded-md'>
			<div className='h-24 w-24 mb-3'>
				<img
					className='rounded-full'
					src='https://peterbe.com/avatar.random.png'
				/>
			</div>
			<p className='text-neutral-300'>
				Hello, <span className='font-semibold text-neutral-100'>{sender}</span>
			</p>
			<div className='mt-4'>
				{onSignOut && (
					<button
						onClick={onSignOut}
						className='text-neutral-900 bg-neutral-100 hover:bg-white px-4 text-xs py-2 rounded-md transition'
					>
						Leave chat
					</button>
				)}
			</div>
		</div>

		<div className='mt-10'>
			<h2 className='text-neutral-300'>You're online.</h2>
		</div>
	</>
);

export default LeftPanel;
