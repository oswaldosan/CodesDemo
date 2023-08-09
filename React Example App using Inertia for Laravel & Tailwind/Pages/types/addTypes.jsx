import WhiteContainer from '@/Components/WhiteContainer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import BackButton from '@/Components/BackButton';

const AddPackage = ({ auth }) => {
	const [formError, setformError] = useState(false);
	const { register, handleSubmit } = useForm();
	const addForm = useRef();
	const { enqueueSnackbar } = useSnackbar();

	const onSubmit = async (data) => {
		try {
			const res = await axios.post('/api/types', data);
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
		<AuthenticatedLayout
			user={auth.user}
			header={
				<h2 className="font-semibold text-xl text-gray-800 leading-tight">
					Add Type
				</h2>
			}
		>
			<WhiteContainer>
				<div className="px-10 py-5">
					<BackButton label={'All Packages'} route={'packages'} />
				</div>
				<form
					className="w-full px-10 mb-8"
					onSubmit={handleSubmit(onSubmit)}
					ref={addForm}
				>
					<div class="mb-4 w-full">
						<label
							className="w-full block text-gray-700 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Type Name
						</label>
						<input
							className="w-full"
							type={'text'}
							name="type "
							{...register('type')}
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

export default AddPackage;
