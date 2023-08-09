export default function DangerButton({
	className = '',
	variant = 'danger',
	disabled,
	children,
	...props
}) {
	return (
		<button
			{...props}
			className={
				`${variant === 'danger' ? 'bg-red-600' : 'bg-blue-500'} inline-flex items-center px-2 py-2  border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 transition ease-in-out duration-150 ${
					disabled && 'opacity-25'
				} ` + className 
			}
			disabled={disabled}
		>
			{children}
		</button>
	);
}
