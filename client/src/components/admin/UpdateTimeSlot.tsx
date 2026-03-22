import * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { useUpdateTimeSlotMutation } from "../../slices/redux-slices/time-slot-api";
import type { TimeSlot } from "../../slices/interfaces/time-slot";
import { updateTimeSlotSchema } from "../../validation/time-slot";

// helper to convert ISO UTC string to local datetime-local format
function toLocalDatetime(isoString: string) {
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in ms
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

type FormInputs = z.infer<typeof updateTimeSlotSchema>;

interface Props {
  slot: TimeSlot;
  onClose: () => void;
}

const UpdateTimeSlot = ({ slot, onClose }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    resolver: zodResolver(updateTimeSlotSchema),
    defaultValues: {
      startTime: toLocalDatetime(slot.startTime),
      endTime: toLocalDatetime(slot.endTime),
    },
  });

  const [updateTimeSlot, { isLoading }] = useUpdateTimeSlotMutation();

  const submit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await updateTimeSlot({
        id: slot.id,
        startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
        endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined,
      }).unwrap();

      toast.success("Time slot updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Time Slot</h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">

          <div className="border rounded px-3 py-2 bg-gray-100 text-gray-700">
            {slot.consultant?.firstName} {slot.consultant?.lastName} ({slot.consultant?.expertise})
          </div>

          <FormInput
            label="Start Time"
            type="datetime-local"
            {...register("startTime")}
          />
          {errors.startTime && <span className="text-red-400 text-sm font-medium">{errors.startTime.message}</span>}

          <FormInput
            label="End Time"
            type="datetime-local"
            {...register("endTime")}
          />
          {errors.endTime && <span className="text-red-400 text-sm font-medium">{errors.endTime.message}</span>}

          <div className="flex gap-4">
            <Button
              className="w-full justify-center"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              className="w-full justify-center"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTimeSlot