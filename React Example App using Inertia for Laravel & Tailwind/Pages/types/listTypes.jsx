import DangerButton from '@/Components/DangerButton';
import WhiteContainer from '@/Components/WhiteContainer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function ListPrices({
	auth,
	types,
	
}) {
	const [classesState, setClasses] = useState(types);

	const deletePrice = async (price) => {
		try {
			const res = await axios.post('/api/price-delete', { id: price });
			setClasses(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const columnWidth = 90;

	const cols = [
		{
			field: 'id',
			headerName: 'Id',
			width: 200,
		},
		{
			field: 'type',
			headerName: 'Type Name',
			width: 170,
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: columnWidth,
			renderCell: (params) => (
				<DangerButton onClick={() => deletePrice(params.row.id)}>
					Delete
				</DangerButton>
			),
		},
	];

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Classes
				</h2>
			}
		>
			<Head title="Dashboard" />

			<WhiteContainer>
				<div className="p-6 text-gray-900 text-center">
					{classesState.length ? (
						<DataGrid rows={classesState} columns={cols} />
					) : (
						'No hay Tipos agregados'
					)}
				</div>
			</WhiteContainer>
		</AuthenticatedLayout>
	);
}
