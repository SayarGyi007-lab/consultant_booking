import { useState } from "react";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../slices/redux-slices/user-api";
import Button from "../../ui/Button";
import PasswordInput from "../../ui/PasswordInput";

interface Props {
  onClose: () => void;
}

const ChangePasswordCard = ({ onClose }: Props) => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [changePassword] = useChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await changePassword(form).unwrap();
      toast.success("Password updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Change Password</h2>

        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="uncommon"
            className="border"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordCard;