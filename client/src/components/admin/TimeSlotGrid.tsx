import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import type { TimeSlot } from "../../slices/interfaces/time-slot";
import Button from "../../ui/components/Button";
import Card from "../../ui/components/Card";
import Grid from "../../ui/Grid";
import DeleteWarning from "../../ui/DeleteWarning";
import { dateOptions, timeOptions } from "../../utils/date-time";

interface Props {
  timeSlots: TimeSlot[];
  title?: string;
  onDelete?: (id: string, status: "AVAILABLE" | "BOOKED" | "EXPIRED") => void;
  onUpdate: (id: string) => void;
  isDeleting?: boolean;
  page: number;
  limit: number;
}

const TimeSlotsGrid = ({
  timeSlots,
  title = "Time Slots",
  onDelete,
  onUpdate,
  isDeleting,
  page,
  limit,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!selectedId) return;

    const slot = timeSlots.find((s) => s.id === selectedId);
    if (slot) onDelete?.(slot.id, slot.status);

    setSelectedId(null);
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
      case "BOOKED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };



  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>

      <Grid cols={3} gap={6} className="sm:grid-cols-2 xl:grid-cols-3">
        {timeSlots.map((slot, index) => {
          const start = slot.startTime ? new Date(slot.startTime) : null;
          const end = slot.endTime ? new Date(slot.endTime) : null;

          const canEdit = slot.status === "AVAILABLE";

          return (
            <Card
              key={slot.id}
              className="p-7 flex flex-col gap-4 min-h-[280px] hover:shadow-lg transition-shadow"
            >
              {/* header */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">
                  #{(page - 1) * limit + index + 1}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                    slot.status
                  )}`}
                >
                  {slot.status}
                </span>
              </div>

              {/* slot id */}
              <div className="text-xs text-gray-500">
                Slot ID:{" "}
                <span className="font-mono text-gray-700">{slot.id}</span>
              </div>

              {/* consultant */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Consultant</p>
                <p className="font-semibold text-gray-900 truncate">
                  {slot.consultant
                    ? `${slot.consultant.firstName} ${slot.consultant.lastName}`
                    : "Unknown"}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {slot.consultant?.email ?? "—"}
                </p>
              </div>

              {/* booking info */}
              {slot.booking?.length ? (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Booked By</p>

                  <p className="text-sm text-gray-800 truncate">
                    {slot.booking?.[0]?.customerName ?? "—"}
                  </p>

                  <p className="text-xs text-gray-600 truncate">
                    {slot.booking?.[0]?.customerEmail ?? "—"}
                  </p>
                </div>
              ) : null}

              {/* time */}
              <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
                <p>
                  Date:{" "}
                  {start
                    ? start.toLocaleDateString(undefined, dateOptions)
                    : "—"}
                </p>
                <p>
                  Time:{" "}
                  {start && end
                    ? `${start.toLocaleTimeString(
                      undefined,
                      timeOptions
                    )} - ${end.toLocaleTimeString(
                      undefined,
                      timeOptions
                    )}`
                    : "—"}
                </p>
              </div>

              {/* actions */}
              <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100">

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-center bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  onClick={() => onUpdate(slot.id)}
                  disabled={!canEdit}
                >
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>

                {/* delete */}
                <Button
                  variant="danger"
                  size="icon"
                  onClick={() => setSelectedId(slot.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          );
        })}
      </Grid>

      {/* CONFIRM MODAL */}
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

export default TimeSlotsGrid;