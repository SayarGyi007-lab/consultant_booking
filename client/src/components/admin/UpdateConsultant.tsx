import * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Button from "../../ui/components/Button";
import FormInput from "../../ui/components/FormInput";
import { useUpdateConsultantMutation } from "../../slices/redux-slices/consultant-api";
import { updateConsultantSchema } from "../../validation/consultant";
import type { Consultant } from "../../slices/interfaces/consultant";
import FormField from "../../ui/FormField";

type FormInputs = z.infer<typeof updateConsultantSchema>;

interface Props {
  consultant: Consultant;
  onClose: () => void;
}

const UpdateConsultant = ({ consultant, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    resolver: zodResolver(updateConsultantSchema),
    defaultValues: {
      firstName: consultant.firstName,
      lastName: consultant.lastName,
      email: consultant.email,
      phone: consultant.phone,
      expertise: consultant.expertise,
      bio: consultant.bio,
      experience: consultant.experience,
      skills: consultant.skills,
      price: consultant.price
    },
  });

  const [updateConsultant, { isLoading }] =
    useUpdateConsultantMutation();

  const submit: SubmitHandler<FormInputs> = async (data) => {
    try {
      await updateConsultant({
        id: consultant.id,
        ...data,
      }).unwrap();

      toast.success("Consultant updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || err.error || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-100">

        {/* header */}
        <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-white rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Edit Consultant
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Update consultant profile details
          </p>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* grid */}
          <div className="grid grid-cols-2 gap-4">
            <FormField error={errors.firstName?.message}>
              <FormInput label="First Name" type="text" {...register("firstName")} />
            </FormField>

            <FormField error={errors.lastName?.message}>
              <FormInput label="Last Name" type="text" {...register("lastName")} />
            </FormField>
          </div>

          <div>
            <FormField error={errors.email?.message}>
              <FormInput label="Email" type="email" {...register("email")} />
            </FormField>
          </div>

          <div>
            <FormField error={errors.phone?.message}>
              <FormInput label="Phone" type="text" {...register("phone")} />
            </FormField>
          </div>

          <div>
            <FormField error={errors.expertise?.message}>
              <FormInput label="Expertise" type="text" {...register("expertise")} />
            </FormField>
          </div>

          <div>
            <FormField error={errors.bio?.message}>
              <FormInput label="Bio" type="text" {...register("bio")} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField error={errors.experience?.message}>
              <FormInput
                label="Experience"
                type="number"
                {...register("experience", { valueAsNumber: true })}
              />
            </FormField>

            <FormField error={errors.price?.message}>
              <FormInput
                label="Price"
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <div>
            <FormField error={errors.skills?.message}>
              <FormInput
                label="Skills"
                type="text"
                {...register("skills", {
                  setValueAs: (value) => {
                    if (!value) return [];

                    if (Array.isArray(value)) return value;

                    if (typeof value === "string") {
                      return value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean);
                    }

                    return [];
                  },
                })}
              />
            </FormField>
          </div>

        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3 rounded-b-3xl">

          <Button
            className="w-full justify-center"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isSubmitting || isLoading}
            onClick={handleSubmit(submit)}
          >
            {isSubmitting || isLoading ? "Updating..." : "Save Changes"}
          </Button>

        </div>
      </div>
    </div>
  );
};

export default UpdateConsultant;