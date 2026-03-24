import { useState } from "react";
import type { Consultant } from "../../slices/interfaces/consultant";
import DeleteWarning from "../../ui/DeleteWarning";
import Button from "../../ui/Button";
import { Trash2 } from "lucide-react";
import { dateOptions, timeOptions } from "../../utils/date-time";
import { number } from "zod";

interface Props {
  consultants: Consultant[];
  title?: string;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onEdit: (id: string) => void;
  isLoading?: boolean;
  status: "active" | "archived";
  page: number;
  limit: number
}

const ConsultantTable = ({
  consultants,
  title = "Consultants",
  onArchive,
  onRestore,
  onPermanentDelete,
  onEdit,
  isLoading,
  status,
  page,
  limit
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmAction = () => {
    if (!selectedId) return;
    if (status === "active") onArchive?.(selectedId);
    else onPermanentDelete?.(selectedId);
    setSelectedId(null);
  };

  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1400px] text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200">
              <th className="px-4 py-3 whitespace-nowrap font-medium">No.</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant ID</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Consultant</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Phone</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Created</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Updated</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Expertise</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {consultants.map((c, index) => {
              const createdAt = new Date(c.createdAt);
              const updatedAt = c.updatedAt ? new Date(c.updatedAt) : null;

              return (
                <tr key={c.id} className="hover:bg-gray-50 text-sm border-b border-gray-100">
                  <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{c.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3">{c.email ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {createdAt.toLocaleDateString(undefined, dateOptions)}{" "}
                    {createdAt.toLocaleTimeString(undefined, timeOptions)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                    {updatedAt
                      ? `${updatedAt.toLocaleDateString(undefined, dateOptions)} ${updatedAt.toLocaleTimeString(undefined, timeOptions)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 whitespace-nowrap">
                      {c.expertise}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {status === "active" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-300 hover:bg-green-400"
                            onClick={() => onEdit(c.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="icon"
                            onClick={() => setSelectedId(c.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestore?.(c.id)}
                          >
                            Restore
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setSelectedId(c.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
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
        title={status === "active" ? "Archive Consultant" : "Delete Consultant"}
        message={
          status === "active"
            ? "Are you sure you want to archive this consultant?"
            : "This action cannot be undone."
        }
        confirmText={status === "active" ? "Archive" : "Delete"}
        loading={isLoading}
        onCancel={() => setSelectedId(null)}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default ConsultantTable;