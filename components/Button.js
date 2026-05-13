const Button = ({ text }) => {
	return (
		<button
			type='submit'
			className='btn-primary py-2.5 px-4 rounded-md font-semibold mt-3 text-sm'
		>
			{text}
		</button>
	);
};

export default Button;
