import * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import { useUpdateConsultantMutation } from "../../slices/redux-slices/consultant-api";
import { updateConsultantSchema } from "../../validation/consultant";
import type { Consultant } from "../../slices/interfaces/consultant";

type FormInputs = z.infer<typeof updateConsultantSchema>;

interface Props {
  consultant: Consultant;
  onClose: () => void;
}

const UpdateConsultant = ({ consultant, onClose }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    resolver: zodResolver(updateConsultantSchema),
    defaultValues: {
      firstName: consultant.firstName,
      lastName: consultant.lastName,
      email: consultant.email,
      phone: consultant.phone,
      expertise: consultant.expertise,
    }
  });

  const [updateConsultant, { isLoading }] = useUpdateConsultantMutation();

  const submit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await updateConsultant({ id: consultant.id, ...data }).unwrap();
      toast.success("Consultant updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Consultant</h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <FormInput label="First Name" type="text" {...register("firstName")} />
          {errors.firstName && <span className="text-red-400 text-sm">{errors.firstName.message}</span>}

          <FormInput label="Last Name" type="text" {...register("lastName")} />
          {errors.lastName && <span className="text-red-400 text-sm">{errors.lastName.message}</span>}

          <FormInput label="Email" type="email" {...register("email")} />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}

          <FormInput label="Phone" type="text" {...register("phone")} />
          {errors.phone && <span className="text-red-400 text-sm">{errors.phone.message}</span>}

          <FormInput label="Expertise" type="text" {...register("expertise")} />
          {errors.expertise && <span className="text-red-400 text-sm">{errors.expertise.message}</span>}

          <div className="flex gap-4">
            <Button className="w-full justify-center" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button className="w-full justify-center" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateConsultant