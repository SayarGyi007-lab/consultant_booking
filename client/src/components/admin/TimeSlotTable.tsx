import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { TimeSlot } from "../../slices/interfaces/time-slot";
import Button from "../../ui/Button";
import DeleteWarning from "../../ui/DeleteWarning";
import { dateOptions, timeOptions } from "../../utils/date-time";

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
    if (slot) onDelete?.(slot.id, slot.status);
    setSelectedId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1600px] text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200">
              <th className="px-4 py-3 whitespace-nowrap font-medium">No.</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Slot ID</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant Phone</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Expertise</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Date</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Start</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">End</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Status</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Booked By</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Customer Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {timeSlots.map((slot, index) => {
              const start = new Date(slot.startTime);
              const end = new Date(slot.endTime);

              return (
                <tr key={slot.id} className="hover:bg-gray-50 text-sm border-b border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{slot.id}</td>

                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {slot.consultant
                      ? `${slot.consultant.firstName} ${slot.consultant.lastName}`
                      : "Unknown"}
                  </td>

                  <td className="px-4 py-3">{slot.consultant?.email ?? "—"}</td>

                  <td className="px-4 py-3 whitespace-nowrap">{slot.consultant?.phone ?? "—"}</td>

                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                      {slot.consultant?.expertise ?? "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {start ? start.toLocaleDateString(undefined, dateOptions) : "—"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {start ? start.toLocaleTimeString(undefined, timeOptions) : "—"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {end ? end.toLocaleTimeString(undefined, timeOptions) : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${slot.status === "AVAILABLE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {slot.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">{slot.booking?.customerName ?? "—"}</td>

                  <td className="px-4 py-3">{slot.booking?.customerEmail ?? "—"}</td>

                  <td className="px-4 py-3 text-center align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-300 hover:bg-green-400"
                        onClick={() => onUpdate(slot.id)}
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
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
};

export default TimeSlotsTable;