import * as z from 'zod'
import { createConsultantSchema } from '../../validation/consultant'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateConsultantMutation } from '../../slices/redux-slices/consultant-api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormInput from '../../ui/FormInput'
import Button from '../../ui/Button'

type formInputs = z.infer<typeof createConsultantSchema>

const AddConsultant = () => {

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<formInputs>({ resolver: zodResolver(createConsultantSchema) })

    const [consultant, { isLoading }] = useCreateConsultantMutation()

    const navigate = useNavigate()

    const submit: SubmitHandler<formInputs> = async (data) => {
        try {
            await consultant(data).unwrap()
            reset()
            toast.success('Consultant registration successful')
            navigate('/admin')
        } catch (err: any) {
            toast.error(err?.data?.message || err.error)
        }
    }

    const backHandler = () => {
        navigate('/admin')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Register Consultant
                </h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    <FormInput
                        label="First Name"
                        type="text"
                        placeholder="John"
                        {...register('firstName')}
                    />
                    {errors.firstName && <span className="text-red-400 text-sm font-medium">{errors.firstName.message}</span>}


                    <FormInput
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        {...register('lastName')}
                    />
                    {errors.lastName && <span className="text-red-400 text-sm font-medium">{errors.lastName.message}</span>}


                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                    />
                    {errors.email && <span className="text-red-400 text-sm font-medium">{errors.email.message}</span>}


                    <FormInput
                        label="Phone"
                        type="text"
                        placeholder="Enter your phone"
                        {...register('phone')}
                    />
                    {errors.phone && <span className="text-red-400 text-sm font-medium">{errors.phone.message}</span>}

                    <FormInput
                        label="Expertise"
                        type="text"
                        placeholder="Enter the expertise"
                        {...register('expertise')}
                    />
                    {errors.expertise && <span className="text-red-400 text-sm font-medium">{errors.expertise.message}</span>}

                    <div onClick={backHandler} className='flex gap-4'>
                        <Button className="w-full justify-center" variant='outline'>
                            Back
                        </Button>

                        <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
                            {isSubmitting || isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddConsultant
