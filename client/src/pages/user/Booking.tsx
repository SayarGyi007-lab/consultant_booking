import { useState, useMemo } from 'react'
import * as z from 'zod'
import { createBookingSchema } from '../../validation/booking'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateBookingMutation } from '../../slices/redux-slices/booking-api'
import { useConsultants } from '../../hooks/useConsultants'
import { useTimeSlots } from '../../hooks/useTimeSlots'
import { toast } from 'react-toastify'
import { useNavigate, useLocation } from 'react-router-dom'
import FormInput from '../../ui/FormInput'
import Button from '../../ui/Button'
import { dateOptions, timeOptions } from '../../utils/date-time'

type formInputs = z.infer<typeof createBookingSchema>

const Booking = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<formInputs>({
    resolver: zodResolver(createBookingSchema)
  })

  const [createBooking, { isLoading }] = useCreateBookingMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { consultant?: any, slot?: any } | undefined

  // Pre-select if coming from ConsultantCard
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(state?.consultant?.expertise || null)
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(state?.consultant?.id || null)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(state?.slot?.id || null)

  const { consultants = [] } = useConsultants({ page: 1, limit: 0 })
  const { timeSlots = [] } = useTimeSlots({ page: 1, limit: 0, status: 'AVAILABLE' })

  // Filter consultants by expertise
  const filteredConsultants = useMemo(() => {
    if (!selectedExpertise) return []
    return consultants.filter(c => c.expertise === selectedExpertise)
  }, [selectedExpertise, consultants])

  // Filter slots by selected consultant
  const filteredSlots = useMemo(() => {
    if (!selectedConsultantId) return []
    return timeSlots.filter(slot => slot.consultantId === selectedConsultantId && slot.status === "AVAILABLE")
  }, [selectedConsultantId, timeSlots])

  const submit: SubmitHandler<formInputs> = async (data) => {
    if (!selectedExpertise) return toast.error("Please select expertise")
    if (!selectedConsultantId) return toast.error("Please select a consultant")
    if (!selectedSlotId) return toast.error("Please select a time slot")

    try {
      await createBooking({ ...data, slotId: selectedSlotId }).unwrap()
      reset()
      setSelectedExpertise(null)
      setSelectedConsultantId(null)
      setSelectedSlotId(null)
      toast.success("Booking successful")
      navigate('/home')
    } catch (err: any) {
      toast.error(err?.data?.message || err.error)
    }
  }

  const handleBack = () => {
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Book a Consultant</h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">

          {/* Customer Info */}
          <FormInput
            label="Customer Name"
            type="text"
            placeholder="John Doe"
            {...register('customerName')}
          />
          {errors.customerName && <p className="text-red-400 text-sm">{errors.customerName.message}</p>}

          <FormInput
            label="Customer Email"
            type="email"
            placeholder="john@example.com"
            {...register('customerEmail')}
          />
          {errors.customerEmail && <p className="text-red-400 text-sm">{errors.customerEmail.message}</p>}

          {/* Expertise */}
          <div>
            <label className="block font-medium mb-1">Select Expertise</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedExpertise || ""}
              onChange={e => {
                setSelectedExpertise(e.target.value)
                setSelectedConsultantId(null)
                setSelectedSlotId(null)
              }}
              disabled={!!state?.consultant} // disable if navigated from ConsultantCard
            >
              <option value="">Choose Expertise</option>
              {[...new Set(consultants.map(c => c.expertise))].map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Consultant */}
          {selectedExpertise && (
            <div>
              <label className="block font-medium mb-1">Select Consultant</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedConsultantId || ""}
                onChange={e => {
                  setSelectedConsultantId(e.target.value)
                  setSelectedSlotId(null)
                }}
                disabled={!!state?.consultant} // disable if pre-selected
              >
                <option value="">Choose Consultant</option>
                {filteredConsultants.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
          )}

          {/* Time Slot */}
          {selectedConsultantId && (
            <div>
              <label className="block font-medium mb-1">Select Time Slot</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedSlotId || ""}
                onChange={e => setSelectedSlotId(e.target.value)}
                disabled={!!state?.slot} // disable if pre-selected
              >
                {filteredSlots.length === 0 && !state?.slot ? (
                  <option value="">No slots available</option>
                ) : (
                  <>
                    <option value="">Choose Slot</option>
                    {(state?.slot ? [state.slot] : filteredSlots).map(slot => (
                      <option key={slot.id} value={slot.id}>
                        {new Date(slot.startTime).toLocaleDateString(undefined, dateOptions)}{' '}
                        {new Date(slot.startTime).toLocaleTimeString(undefined, timeOptions)} -{' '}
                        {new Date(slot.endTime).toLocaleTimeString(undefined, timeOptions)}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className='flex gap-4'>
            <Button className="w-full justify-center" variant='outline' onClick={handleBack}>
              Back
            </Button>
            <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Booking..." : "Book"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Booking