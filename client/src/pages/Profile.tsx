import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedCard from "../ui/AnimateCard";
import Button from "../ui/Button";
import FormInput from "../ui/FormInput";
import { useCurrentUser } from "../hooks/useUsers";
import { useMyBookings } from "../hooks/useBookings";
import { useUpdateUserMutation } from "../slices/redux-slices/user-api";
import DeleteWarning from "../ui/DeleteWarning";
import { toast } from "react-toastify";
import ChangePasswordCard from "../components/user/ChangePassword";
import ProfileBooking from "../components/user/ProfileBooking";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading, error } = useCurrentUser();
  const { bookings } = useMyBookings();
  const [updateUser] = useUpdateUserMutation();

  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [showWarning, setShowWarning] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  if (isLoading)
    return <p className="text-gray-400 text-center mt-10">Loading profile...</p>;

  if (error || !user)
    return <p className="text-gray-400 text-center mt-10">Failed to load profile.</p>;

  // ✅ Admin check
  const isAdmin = user.role === "ADMIN";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = () => {
    if (editMode) {
      setShowWarning(true);
    } else {
      setEditMode(true);
    }
  };

  const confirmSave = async () => {
    setSaving(true);
    try {
      await updateUser({ id: user.id, ...form }).unwrap();
      toast.success("Profile updated successfully");
      setEditMode(false);
      setShowWarning(false);
    } catch (err: any) {
      let errorMessage = "Failed to update profile.";

      if (err?.data?.errors) {
        if (Array.isArray(err.data.errors)) {
          errorMessage += " " + err.data.errors.join(", ");
        } else if (typeof err.data.errors === "object") {
          errorMessage +=
            " " + Object.values(err.data.errors).flat().join(", ");
        } else {
          errorMessage += " " + err.data.errors;
        }
      }

      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gray-50">

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isAdmin ? "Admin Profile" : "Profile"}
      </h1>

      <AnimatedCard className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        {/* Avatar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="uncommon"
              className="border"
              onClick={() => setShowPasswordCard(true)}
            >
              Change Password
            </Button>

            {showPasswordCard && (
              <ChangePasswordCard onClose={() => setShowPasswordCard(false)} />
            )}

            <Button
              className={`px-6 py-2 rounded-xl font-medium ${
                editMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
              onClick={handleEditSave}
            >
              {editMode ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {["firstName", "lastName", "email", "phone"].map((field) => (
            <FormInput
              key={field}
              label={
                field === "firstName"
                  ? "First Name"
                  : field === "lastName"
                  ? "Last Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              name={field}
              type={field === "email" ? "email" : "text"}
              value={(form as any)[field]}
              readOnly={!editMode}
              onChange={handleChange}
              className={
                editMode
                  ? "bg-white border-green-500 focus:ring-2 focus:ring-green-200"
                  : "bg-gray-100 border-gray-200 cursor-not-allowed"
              }
            />
          ))}
        </div>

        {/*Hide bookings if admin */}
        {!isAdmin && (
          <ProfileBooking
            bookings={bookings}
            maxVisible={3}
            onSeeAll={() => navigate("/my-bookings")}
          />
        )}
      </AnimatedCard>

      {/*Dynamic back button */}
      <Button
        className="mt-6"
        onClick={() => navigate(isAdmin ? "/admin" : "/home")}
      >
        Back
      </Button>

      <DeleteWarning
        open={showWarning}
        title="Confirm Save"
        message="Are you sure you want to save the changes?"
        confirmVariant="success"
        confirmText="Save"
        cancelText="Cancel"
        loading={saving}
        onConfirm={confirmSave}
        onCancel={() => setShowWarning(false)}
      />
    </div>
  );
};

export default Profile;