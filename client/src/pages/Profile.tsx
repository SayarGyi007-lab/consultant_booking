import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/components/Button";
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

  // Admin check
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
    <div className="min-h-screen px-4 py-12 ">

      {/* Title */}
      <div className="max-w-4xl mx-auto mb-8">
        <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">
          Account Settings
        </p>
        <h1 className="text-4xl font-extrabold text-[#111d23]">
          {isAdmin ? "Admin Profile" : "Profile"}
        </h1>
      </div>

      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white backdrop-blur-xl rounded-2xl shadow-[0_32px_64px_rgba(76,97,108,0.06)] overflow-hidden">

        <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#e9f6fd]/30">

          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.firstName[0]}{user.lastName[0]}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#111d23]">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowPasswordCard(true)}
              className="px-5 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-100 transition"
            >
              Change Password
            </Button>

            <Button
              onClick={handleEditSave}
              variant='primary'
              className={`px-5 py-2 rounded-lg text-white text-sm font-semibold transition ${editMode
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
                }`}
            >
              {editMode ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="p-10 border-t grid grid-cols-1 md:grid-cols-2 gap-8">

          {["firstName", "lastName", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="text-sm font-semibold text-gray-500 mb-1 block">
                {field === "firstName"
                  ? "First Name"
                  : field === "lastName"
                    ? "Last Name"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>

              <input
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-4 py-3 rounded-lg text-[#111d23] font-medium border transition ${editMode
                    ? "bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    : "bg-[#e9f6fd] border-transparent cursor-not-allowed"
                  }`}
              />
            </div>
          ))}
        </div>

        {/* booking */}
        {!isAdmin && (
          <div className="px-10 pb-10 border-t">
            <ProfileBooking
              bookings={bookings}
              maxVisible={3}
              onSeeAll={() => navigate("/my-bookings")}
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => navigate(isAdmin ? "/admin" : "/home")}
          className="text-gray-500 hover:text-indigo-600 font-semibold transition"
          variant="outline"
        >
           Home
        </Button>
      </div>

      {showPasswordCard && (
        <ChangePasswordCard onClose={() => setShowPasswordCard(false)} />
      )}

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