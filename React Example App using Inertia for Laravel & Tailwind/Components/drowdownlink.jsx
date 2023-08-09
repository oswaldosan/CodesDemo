import PropTypes from 'prop-types';
import NavLink from '@/Components/NavLink';

const DropdownLink = ({ mainLink, childLinks, mainRoute }) => {
	return (
		<div className="mx-auto flex">
			<div className="mx-auto group relative cursor-pointer py-5">
				<div className="flex items-center justify-between space-x-2 bg-white px-4">
					<NavLink
						href={mainRoute ? route(mainRoute) : ''}
						active={mainRoute ? route().current(mainRoute) : ''}
					>
						{mainLink}
					</NavLink>
					{childLinks ? (
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1"
								stroke="currentColor"
								className="h-6 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 8.25l-7.5 7.5-7.5-7.5"
								/>
							</svg>
						</span>
					) : (
						' '
					)}
				</div>
				<div className="invisible absolute z-50 flex w-full flex-col bg-gray-100 py-1 px-4 text-gray-800 shadow-xl group-hover:visible">
					{childLinks?.map((link, index) => {
						return (
							<NavLink
								key={index}
								href={route(link.route)}
								active={route().current(link.route)}
							>
								{link.label}
							</NavLink>
						);
					})}
				</div>
			</div>
		</div>
	);
};

DropdownLink.propTypes = {
	mainLink: PropTypes.string,
	mainRoute: PropTypes.string,
	childLinks: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			route: PropTypes.string,
		})
	),
};

export default DropdownLink;
