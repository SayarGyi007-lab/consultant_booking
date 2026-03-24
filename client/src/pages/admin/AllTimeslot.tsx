import { useEffect, useState, useMemo } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useTimeSlots } from "../../hooks/useTimeSlots";
import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import { useDeleteTimeSlotMutation } from "../../slices/redux-slices/time-slot-api";
import UpdateTimeSlot from "../../components/admin/UpdateTimeSlot";
import { TimeSlotsTable } from "../../constant/lazyload";

const AllTimeSlots = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expertise, setExpertise] = useState<string>("");
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const limit = 10;
  const debounceSearch = useDebounce(search, 500);

  const { timeSlots, timeslotsPagination } = useTimeSlots({
    page,
    limit,
    search: debounceSearch,
    expertise: expertise || undefined,
  });

  const { timeSlots: allTimeSlots = [] } = useTimeSlots({
    page: 1,
    limit: 0,
  });

  const [deleteTimeSlot, { isLoading }] = useDeleteTimeSlotMutation();

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleDelete = async (id: string, status: "AVAILABLE" | "BOOKED") => {
    if (status === "BOOKED") {
      setErrorMsg("Cannot delete a booked time slot");
      return;
    }
    try {
      const res = await deleteTimeSlot(id).unwrap();
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Delete failed");
    }
  };

  const uniqueExpertise = useMemo(() => {
    return Array.from(
      new Set(allTimeSlots.map((slot) => slot.consultant?.expertise).filter(Boolean))
    );
  }, [allTimeSlots]);

  const hasNextPage = page < (timeslotsPagination?.totalPages ?? 1);
  const hasPreviousPage = page > 1;
  const slotToEdit = timeSlots.find((s) => s.id === editingSlotId);

  return (
    <div className="p-6 min-h-screen w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Time Slots</h1>
        <input
          type="text"
          placeholder="Search by consultant..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border w-full sm:w-[300px] rounded-lg px-4 py-2"
        />
      </div>

      {/* Alerts */}
      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />

      {/* Filter + Reset */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <select
          disabled={!uniqueExpertise.length}
          value={expertise}
          onChange={(e) => { setExpertise(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2"
        >
          <option value="">All Expertise</option>
          {uniqueExpertise.map((exp) => (
            <option key={exp} value={exp}>{exp}</option>
          ))}
        </select>

        <Button
          variant="outline"
          onClick={() => { setSearch(""); setExpertise(""); setPage(1); }}
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <TimeSlotsTable
          timeSlots={timeSlots}
          onDelete={handleDelete}
          isDeleting={isLoading}
          onUpdate={(id) => setEditingSlotId(id)}
          page={page}
          limit={limit}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <div>
          {hasPreviousPage && <Button onClick={() => setPage(p => p - 1)}>Previous</Button>}
        </div>
        <div className="text-center">
          Page {page} / {timeslotsPagination?.totalPages ?? 1}
        </div>
        <div>
          {hasNextPage && <Button onClick={() => setPage(p => p + 1)}>Next</Button>}
        </div>
      </div>

      {/* Update Modal */}
      {slotToEdit && (
        <UpdateTimeSlot
          slot={slotToEdit}
          onClose={() => setEditingSlotId(null)}
        />
      )}
    </div>
  );
};

export default AllTimeSlots;