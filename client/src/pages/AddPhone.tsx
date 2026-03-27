import { useState } from "react";
import { useUpdatePhoneMutation } from "../slices/redux-slices/user-api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";

const AddPhonePage = () => {
  const [phone, setPhone] = useState("");
  const [updatePhone, { isLoading }] = useUpdatePhoneMutation();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePhone(phone).unwrap();

      toast.success("Phone added successfully");

      navigate("/home"); // or admin check if needed
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update phone");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Add Your Phone Number
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <FormInput
            label="Phone"
            type="text"
            placeholder="Enter your phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button className="w-full justify-center" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Phone"}
          </Button>

        </form>
      </div>
    </div>
  );
};

export default AddPhonePage;