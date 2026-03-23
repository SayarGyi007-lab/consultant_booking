import * as z from 'zod'
import { createTimeSlotFormSchema } from '../../validation/time-slot'
import { useCreateTimeSlotMutation } from '../../slices/redux-slices/time-slot-api'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Button from '../../ui/Button'
import FormInput from '../../ui/FormInput'
import { useConsultants } from '../../hooks/useConsultants'

type formInputs = z.infer<typeof createTimeSlotFormSchema>

const AddTimeslot = () => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<formInputs>({
        resolver: zodResolver(createTimeSlotFormSchema)
    })

    const [timeSlot, { isLoading }] = useCreateTimeSlotMutation()
    const navigate = useNavigate()

    const { consultants, isLoading: isConsultantsLoading } = useConsultants({ status: 'active' })

    const selectedExpertise = watch('expertise', '')

    const filteredConsultants = selectedExpertise
        ? consultants.filter(c => c.expertise === selectedExpertise)
        : consultants

    const expertiseOptions = Array.from(new Set(consultants.map(c => c.expertise))).filter(Boolean)

    const submit: SubmitHandler<formInputs> = async (data) => {

        const start = new Date(data.startTime);
        const now = new Date();

        if (start <= now) {
            toast.error("Cannot create a time slot in the past");
            return;
        }
        try {
            const { expertise, ...payload } = data

            const payloadWithISO = {
                ...payload,
                startTime: new Date(payload.startTime).toISOString(),
                endTime: new Date(payload.endTime).toISOString(),
            }

            await timeSlot(payloadWithISO).unwrap()
            reset()
            toast.success('Time slot created successfully')
            navigate('/admin')
        } catch (err: any) {
            toast.error(err?.data?.message || err.error || 'Something went wrong')
        }
    }

    const backHandler = () => navigate('/admin')

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Add Time Slot
                </h2>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">

                    <FormInput label="Expertise" type="select" {...register('expertise')}>
                        <option value="">Select Expertise</option>
                        {expertiseOptions.map((exp) => (
                            <option key={exp} value={exp}>{exp}</option>
                        ))}
                    </FormInput>
                    {errors.expertise && (
                        <span className="text-red-400 text-sm font-medium">{errors.expertise.message}</span>
                    )}

                    <FormInput label="Consultant" type="select" {...register('consultantId')}>
                        <option value="">Select Consultant</option>
                        {isConsultantsLoading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            filteredConsultants.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.firstName} {c.lastName}
                                </option>
                            ))
                        )}
                    </FormInput>
                    {errors.consultantId && (
                        <span className="text-red-400 text-sm font-medium">{errors.consultantId.message}</span>
                    )}

                    <FormInput
                        label="Start Time"
                        type="datetime-local"
                        {...register('startTime')}
                    />
                    {errors.startTime && (
                        <span className="text-red-400 text-sm font-medium">{errors.startTime.message}</span>
                    )}

                    <FormInput
                        label="End Time"
                        type="datetime-local"
                        {...register('endTime')}
                    />
                    {errors.endTime && (
                        <span className="text-red-400 text-sm font-medium">{errors.endTime.message}</span>
                    )}

                    <div className='flex gap-4'>
                        <Button className="w-full justify-center" variant='outline' onClick={backHandler}>
                            Back
                        </Button>

                        <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
                            {isSubmitting || isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddTimeslot