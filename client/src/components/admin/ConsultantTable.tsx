import { useState } from "react";
import type { Consultant } from "../../slices/interfaces/consultant";
import DeleteWarning from "../../ui/DeleteWarning";
import Button from "../../ui/Button";
import { Trash2 } from "lucide-react";
import { dateOptions, timeOptions } from "../../utils/date-time";

interface Props {
  consultants: Consultant[];
  title?: string;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onEdit: (id: string) => void;
  isLoading?: boolean;
  status: "active" | "archived";
}
const ConsultantTable = ({
  consultants,
  title,
  onArchive,
  onRestore,
  onPermanentDelete,
  onEdit,
  isLoading,
  status
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmAction = () => {
    if (!selectedId) return;

    if (status === "active") onArchive?.(selectedId);
    else onPermanentDelete?.(selectedId);

    setSelectedId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="min-w-[1400px] text-left border-separate border-spacing-x-6 border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th>No.</th>
              <th>Consultant ID</th>
              <th>Consultant</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Expertise</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {consultants.map((c,index) => {
              const createdAt = new Date(c.createdAt);
              const updatedAt = c.updatedAt ? new Date(c.updatedAt) : null;

              return (
                <tr key={c.id} className="hover:bg-gray-50 text-sm">
                  <td>{index + 1}</td>
                  <td>{c.id}</td>
                  <td>{c.firstName} {c.lastName}</td>
                  <td>{c.email ?? "—"}</td>
                  <td>{c.phone ?? "—"}</td>
                  <td>
                    {createdAt.toLocaleDateString(undefined, dateOptions)}{" "}
                    {createdAt.toLocaleTimeString(undefined, timeOptions)}
                  </td>
                  <td>
                    {updatedAt
                      ? `${updatedAt.toLocaleDateString(undefined, dateOptions)} ${updatedAt.toLocaleTimeString(undefined, timeOptions)}`
                      : "—"}
                  </td>
                  <td>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {c.expertise}
                    </span>
                  </td>

                  <td className="flex gap-2 justify-center">
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
}

export default ConsultantTable