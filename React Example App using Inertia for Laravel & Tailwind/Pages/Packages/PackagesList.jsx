import DangerButton from '@/Components/DangerButton';
import WhiteContainer from '@/Components/WhiteContainer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

export default function PackagesList({ auth, packages, classes, types }) {
	const [selectedRows, setSelectedRows] = useState(false);
	const [toggledClearRows, setToggleClearRows] = useState(false);
	const [packageList, setPackages] = useState(packages);

	const handleChange = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	// Toggle the state so React Data Table changes to clearSelectedRows are triggered
	const handleClearRows = () => {
		setToggleClearRows(!toggledClearRows);
	};

	const deletePackage = async (pack) => {
		try {
			const res = await axios.post('/api/package-delete', { id: pack });
			setPackages(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const columns = useMemo(
		() => [
			{
				name: 'Name',
				selector: (row) => row.nombre,
			},
			{
				name: 'Clase',
				selector: (row) => classes.find((clas) => row.clase == clas.id).class,
			},
			{
				name: 'Tipo',
				selector: (row) => types.find((type) => row.tipo == type.id).type,
			},
			{
				name: 'Action',
				selector: (row) => (
					<DangerButton onClick={() => deletePackage(row.id)}>
						Delete
					</DangerButton>
				),
			},
		],
		[packageList]
	);

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Packages
				</h2>
			}
		>
			<Head title="Dashboard" />

			<WhiteContainer>
				{selectedRows ? <DangerButton>Delete Packages ?</DangerButton> : ''}
				<div className="p-6 text-gray-900">
					<DataTable
						columns={columns}
						data={packageList}
						selectableRows
						onSelectedRowsChange={handleChange}
						clearSelectedRows={toggledClearRows}
					/>
				</div>
			</WhiteContainer>
		</AuthenticatedLayout>
	);
}
