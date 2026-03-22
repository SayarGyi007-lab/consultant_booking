import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { TimeSlot } from "../../slices/interfaces/time-slot";
import Button from "../../ui/Button";
import DeleteWarning from "../../ui/DeleteWarning";

interface Props {
  timeSlots: TimeSlot[];
  title?: string;
  onDelete?: (id: string, status: "AVAILABLE" | "BOOKED") => void;
  onUpdate: (id: string) => void;
  isDeleting?: boolean;
}
const TimeSlotsTable = ({
  timeSlots,
  title = "Time Slots",
  onDelete,
  onUpdate,
  isDeleting,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!selectedId) return;
    const slot = timeSlots.find((s) => s.id === selectedId);
    if (slot) {
      onDelete?.(slot.id, slot.status);
    }
    setSelectedId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[1600px] text-left border-separate border-spacing-x-4 border-spacing-y-2">
            <thead className="p-4">
              <tr className="text-gray-500 text-sm border-b p-4">
                <th className="pb-3 w-[500px]">No.</th>
                <th className="pb-3 w-[500px]">Slot ID</th>
                <th className="w-[300px]">Consultant</th>
                <th className="w-[250px]">Consultant Email</th>
                <th className="w-[180px]">Consultant Phone</th>
                <th className="w-[180px]">Expertise</th>
                <th className="w-[120px]">Date</th>
                <th className="w-[100px]">Start</th>
                <th className="w-[100px]">End</th>
                <th className="w-[120px]">Status</th>
                <th className="w-[180px]">Booked By</th>
                <th className="w-[250px]">Customer Email</th>
                <th className="w-[150px] text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((slot,index) => {
                const start = new Date(slot.startTime);
                const end = new Date(slot.endTime);

                return (
                  <tr key={slot.id} className="hover:bg-gray-50 text-sm">
                    <td>{index+1}</td>
                    <td>{slot.id}</td>
                    <td>{slot.consultant ? `${slot.consultant.firstName} ${slot.consultant.lastName}` : "Unknown"}</td>
                    <td>{slot.consultant?.email ?? "—"}</td>
                    <td>{slot.consultant?.phone ?? "—"}</td>
                    <td>{slot.consultant?.expertise ?? "—"}</td>
                    <td>{start.toLocaleDateString()}</td>
                    <td>{start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${slot.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {slot.status}
                      </span>
                    </td>
                    <td>{slot.booking?.customerName ?? "—"}</td>
                    <td>{slot.booking?.customerEmail ?? "—"}</td>
                    <td className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate(slot.id)}
                        className="bg-green-300 hover:bg-green-400"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="icon"
                        onClick={() => setSelectedId(slot.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteWarning
        open={!!selectedId}
        title="Delete Time Slot"
        message="Are you sure you want to delete this time slot? This action cannot be undone."
        confirmText="Delete"
        loading={isDeleting}
        onCancel={() => setSelectedId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default TimeSlotsTable