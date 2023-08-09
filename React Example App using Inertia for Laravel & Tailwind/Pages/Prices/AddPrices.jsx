import WhiteContainer from '@/Components/WhiteContainer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import BackButton from '@/Components/BackButton';
import { router } from '@inertiajs/react';

const AddPrices = ({ auth, rooms, packages, types, classes }) => {
	const [formError, setformError] = useState(false);
	const { register, handleSubmit } = useForm();
	const addForm = useRef();
	const { enqueueSnackbar } = useSnackbar();

	console.log(auth)

	const onSubmit = async (data) => {
		try {
			const res = await axios.post('/api/prices', data);
			if (res.status === 200) {
				enqueueSnackbar('Price Added Correctly', {
					variant: 'success',
				});
				router.get('prices');
				addForm.current.reset();
			}
			2;
		} catch (e) {
			setformError(e.response.data.message);
		}
	};

	//element at the top of the array

	return (
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Add Prices
				</h2>
			}
		>
			<WhiteContainer>
				<div className="px-10 py-5">
					<BackButton label={'All Prices'} route={'prices'} />
				</div>
				<form
					className="w-full px-10 mb-8"
					onSubmit={handleSubmit(onSubmit)}
					ref={addForm}
				>
					<div className="mb-4 w-full">
						<h2 className="font-bold text-lg">Select Room and Package</h2>
					</div>
					<hr className="mb-4"></hr>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="roomId"
						>
							Room
						</label>

						<select
							className="w-full"
							type={'text'}
							name="roomId"
							{...register('roomId', { required: true })}
						>
							{rooms.length == 0 && (
								<option>No hay habitaciones ingresadas</option>
							)}
							{rooms.map((room, index) => (
								<option key={room + index} value={room.id}>
									{room.name}{' '}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="paquete"
						>
							Paquete
						</label>

						<select
							className="w-full"
							type={'text'}
							name="paquete"
							{...register('packageId', { required: true })}
						>
							{packages.length == 0 && (
								<option>No hay paquetes ingresados</option>
							)}
							{packages.map((pack, index) => (
								<option key={pack + index} value={pack.id}>
									{pack.nombre}
									{' | '}
									{classes.find((clas) => pack.clase == clas.id).class}
									{' | '}
									{types.find((tipo) => pack.tipo == tipo.id).type}
								</option>
							))}
						</select>
					</div>
					<div className="mb-4 w-full">
						<h2 className="font-bold text-lg">Main Prices</h2>
					</div>
					<hr className="mb-4"></hr>
					<div className="mb-4 w-full"></div>

					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="single"
						>
							Single
						</label>
						<input
							min={0}
							className="w-full"
							type={'number'}
							name="single"
							{...register('single', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="double"
						>
							Double
						</label>
						<input
							className="w-full"
							type={'number'}
							name="double"
							{...register('double', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="triple"
						>
							Triple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="triple"
							{...register('triple', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="quad"
						>
							Quadruple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="quad"
							{...register('quad', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="quin"
						>
							Quintuple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="quin"
							{...register('quin', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="child"
						>
							Child
						</label>
						<input
							className="w-full"
							type={'number'}
							name="child"
							{...register('child', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<h2 className="font-bold text-lg"> Extra nights prices</h2>
					</div>
					<hr className="mb-4"></hr>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraSingle"
						>
							Extra Single
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraSingle"
							{...register('extraSingle', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraDouble"
						>
							Extra Double
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraDouble"
							{...register('extraDouble', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraTriple"
						>
							Extra Triple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraTriple"
							{...register('extraTriple', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraQuad"
						>
							Extra Quadruple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraQuad"
							{...register('extraQuad', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraQuintuple"
						>
							Extra Quintuple
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraQuintuple"
							{...register('extraQuintuple', { required: true })}
						/>
					</div>
					<div className="mb-4 w-full">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="extraChild"
						>
							Extra Child
						</label>
						<input
							className="w-full"
							type={'number'}
							name="extraChild"
							{...register('extraChild', { required: true })}
						/>
					</div>

					{formError && <div className="text-red-600">{formError}</div>}

					<input
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					/>
				</form>
			</WhiteContainer>
		</AuthenticatedLayout>
	);
};

export default AddPrices;
