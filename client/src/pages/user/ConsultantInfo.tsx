import { useParams, useNavigate } from "react-router-dom";
import { useGetConsultantByIdQuery } from "../../slices/redux-slices/consultant-api";
import { useGetAvailableSlotsByConsultantQuery } from "../../slices/redux-slices/time-slot-api";
import Button from "../../ui/Button";
import { dateOptions, timeOptions } from "../../utils/date-time";
import AnimatedCard from "../../ui/AnimateCard";

const ConsultantInfo = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: consultantData, isLoading: isConsultantLoading } = useGetConsultantByIdQuery(id!);
    const consultant = consultantData?.data;

    const { data: slotsData, isLoading: isSlotsLoading } = useGetAvailableSlotsByConsultantQuery(id!);
    const slots = slotsData?.data || [];

    if (isConsultantLoading) return <p className="text-gray-400">Loading consultant...</p>;
    if (!consultant) return <p className="text-gray-400">Consultant not found.</p>;

    return (
        <div className="max-w-3xl mx-auto mt-8">
            <h1 className="text-3xl font-bold py-2">Consultant Info</h1>
            <AnimatedCard className="p-6 border rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold mb-2">
                    {consultant.firstName} {consultant.lastName}
                </h1>

                <span className="inline-block text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full mb-4">
                    {consultant.expertise}
                </span>

                <div className="space-y-1 mb-6">
                    <p>
                        Email:{" "}
                        <a
                            href={`mailto:${consultant.email}`}
                            className="text-blue-600 hover:underline"
                        >
                            {consultant.email}
                        </a>
                    </p>
                    <p>
                        Phone:{" "}
                        <a
                            href={`tel:${consultant.phone}`}
                            className="text-blue-600 hover:underline"
                        >
                            {consultant.phone}
                        </a>
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">Available Slots:</p>

                    {isSlotsLoading ? (
                        <p className="text-xs text-gray-400">Loading slots...</p>
                    ) : slots.length === 0 ? (
                        <p className="text-xs text-gray-400">No available slots</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() =>
                                        navigate("/booking", { state: { consultant, slot } })
                                    }
                                    className="text-xs border px-2 py-1 rounded hover:bg-black hover:text-white transition"
                                >
                                    {new Date(slot.startTime).toLocaleDateString(undefined, dateOptions)}{" "}
                                    {new Date(slot.startTime).toLocaleTimeString(undefined, timeOptions)} -{" "}
                                    {new Date(slot.endTime).toLocaleTimeString(undefined, timeOptions)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    className="mt-6 w-full"
                    size="sm"
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </AnimatedCard>
        </div>
    );
};

export default ConsultantInfo;