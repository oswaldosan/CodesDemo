import WhiteContainer from '@/Components/WhiteContainer';
import BackButton from '@/Components/BackButton';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

const AddVariantForm = ({ roomId }) => {
	const [formError, setformError] = useState(false);
	const { register, handleSubmit } = useForm();
	const addForm = useRef();
	const { enqueueSnackbar } = useSnackbar();

	console.log(roomId);

	const onSubmit = async (data) => {
		try {
			const res = await axios.post('/api/addvariants', data);
			if (res.status === 200) {
				enqueueSnackbar('New Class Added Correctly', {
					variant: 'success',
				});
				addForm.current.reset();
			}
		} catch (e) {
			setformError(e.response.data.message);
		}
	};
	return (
		<WhiteContainer>
			<formn
				className="w-full px-10 mb-8"
				onSubmit={handleSubmit(onSubmit)}
				ref={addForm}
			>
				<div class="mb-4 w-full">
					<label
						className="w-full block text-gray-700 text-sm font-bold mb-2"
						htmlFor="variantName"
					>
						Variant Name
					</label>
					<input
						className="w-full"
						type={'text'}
						name="variantName "
						{...register('variantName')}
					/>
				</div>
				<div class="mb-4 w-full">
					<label
						className="w-full block text-gray-700 text-sm font-bold mb-2"
						htmlFor="variantDescription"
					>
						Variant Description
					</label>
					<textarea
						className="w-full"
						type={'text'}
						name="variantDescription "
						{...register('variantDescription')}
					/>
				</div>
				<div class="mb-4 w-full">
					<label
						className="w-full block text-gray-700 text-sm font-bold mb-2"
						htmlFor="location"
					>
						Location
					</label>
					<select className="w-full" name="location " {...register('location')}>
						<option defaultValue={'Select Location'}>Select Location</option>
						<option value="Mayan Princess">Mayan Princess</option>
						<option value="Sirenas">Sirenas</option>
					</select>
				</div>

				{formError && <div className="text-red-600">{formError}</div>}

				<input
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="submit"
				/>
			</formn>
		</WhiteContainer>
	);
};

export default AddVariantForm;
