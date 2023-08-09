import DangerButton from '@/Components/DangerButton';
import ExitButton from '@/Components/ExitButton';
import Modal from '@/Components/Modal';
import WhiteContainer from '@/Components/WhiteContainer';
import AddVariantForm from '@/Components/forms/AddVariantForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

export default function ListRooms({ auth, rooms }) {
	const [selectedRows, setSelectedRows] = useState(false);
	const [toggledClearRows, setToggleClearRows] = useState(false);
	const [showModal, setshowModal] = useState(false);
	const [roomId, setRoomId] = useState(null);

	const handleChange = ({ selectedRows }) => {
		setSelectedRows(selectedRows);
	};

	// Toggle the state so React Data Table changes to clearSelectedRows are triggered
	const handleClearRows = () => {
		setToggleClearRows(!toggledClearRows);
	};

	const deletePackage = async (pack) => {
		try {
			console.log(pack);
			const res = await axios.post('/api/package-delete', { id: pack });
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	const addVariant = async (roomId) => {
		setshowModal(true);
		setRoomId(roomId);
	};

	const columns = useMemo(
		() => [
			{
				name: 'Nombre',
				selector: (row) => row.name,
			},
			{
				name: 'Guests',
				selector: (row) => row.guests,
				width: '100px',
			},
			{
				name: 'Url',
				selector: (row) => row.url,
			},
			{
				name: 'Action',
				selector: (row) => (
					<>
						<DangerButton
							variant="danger"
							className="mr-1"
							onClick={() => deletePackage(row.id)}
						>
							Delete
						</DangerButton>
						<DangerButton variant="blue" onClick={() => addVariant(row.id)}>
							+ Variant
						</DangerButton>
					</>
				),
			},
		],
		[rooms]
	);

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Rooms
				</h2>
			}
		>
			<Head title="Dashboard" />

			<WhiteContainer>
				{selectedRows ? <DangerButton>Delete Rooms ?</DangerButton> : ''}
				<div className="p-6 text-gray-900">
					<DataTable
						columns={columns}
						data={rooms}
						selectableRows
						onSelectedRowsChange={handleChange}
						clearSelectedRows={toggledClearRows}
					/>
				</div>
				<Modal show={showModal} closeable={true}>
					<ExitButton onClick={() => setshowModal(false)} />
					<AddVariantForm roomId={roomId} />
				</Modal>
			</WhiteContainer>
		</AuthenticatedLayout>
	);
}
