import DangerButton from '@/Components/DangerButton';
import WhiteContainer from '@/Components/WhiteContainer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {  useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function ListPrices({
	auth,
	prices,
	rooms,
	packages,
	classes,
	types,
}) {
	const [pricesState, setPrices] = useState(prices);

	const deletePrice = async (price) => {
		try {
			const res = await axios.post('/api/price-delete', { id: price });
			setPrices(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	console.log(types)

	const columnWidth = 90;

	const cols = [
		{
			field: 'roomId',
			headerName: 'Room',
			width: 200,
			valueGetter: (params) =>
				rooms.find((item) => params.row.roomId === item.id).name,
		},
		{
			field: 'packageId',
			headerName: 'Paquete',
			width: 170,
			valueGetter: (params) =>
				packages.find((item) => params.row.packageId === item.id).nombre,
		},
		{
			field: 'transporte',
			headerName: 'Clase',
			width: 100,
			valueGetter: (params) =>
				classes.find(
					(item) =>
						packages.find((item) => params.row.packageId === item.id).clase ===
						item.id
				).class,
		},
		{
			field: 'id',
			headerName: 'Transporte',
			width: 100,
			valueGetter: (params) =>
				types.find(
					(item) =>
						packages.find((item) => params.row.packageId === item.id).tipo ===
						item.id
				).type,
		},
		{
			field: 'single',
			headerName: 'Single',
			width: columnWidth,
			editable: true,
		},
		{
			field: 'double',
			headerName: 'Double',
			width: columnWidth,
			editable: true,
		},
		{
			field: 'triple',
			headerName: 'triple',
			width: columnWidth,
			editable: true,
		},
		{
			field: 'quad',
			headerName: 'Quadruple',
			width: columnWidth,
		},
		{
			field: 'quin',
			headerName: 'Quintuple',
			width: columnWidth,
		},
		{
			field: 'child',
			headerName: 'Child',
			width: columnWidth,
		},
		{
			field: 'extraSingle',
			headerName: 'Extra Single',
			width: columnWidth,
		},
		{
			field: 'extraDouble',
			headerName: 'Extra Double',
			width: columnWidth,
		},
		{
			field: 'extraTriple',
			headerName: 'Extra Triple',
			width: columnWidth,
		},
		{
			field: 'extraQuad',
			headerName: 'Extra Quad',
			width: columnWidth,
		},
		{
			field: 'extraQuintuple',
			headerName: 'Extra Quintuple',
			width: columnWidth,
		},
		{
			field: 'extraChild',
			headerName: 'Extra Child',
			width: columnWidth,
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
					Prices
				</h2>
			}
		>
			<Head title="Dashboard" />

			<WhiteContainer>
				<div className="p-6 text-gray-900 text-center">
					{pricesState.length ? (
						<DataGrid rows={pricesState} columns={cols} />
					) : (
						'No hay precios agregados'
					)}
				</div>
			</WhiteContainer>
		</AuthenticatedLayout>
	);
}
