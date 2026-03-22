import { useState } from "react";
import type { User } from "../../slices/interfaces/user";
import { dateOptions, timeOptions } from "../../utils/date-time";
import Button from "../../ui/Button";
import { Trash2 } from "lucide-react";
import DeleteWarning from "../../ui/DeleteWarning";

interface Props {
  users: User[];
  title?: string;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  isLoading?: boolean;
  status: "active" | "archived";
}

const UserTable = ({
  users,
  title,
  onArchive,
  onRestore,
  onPermanentDelete,
  isLoading,
  status
}: Props) => {

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmAction = () => {
    if (!selectedId) return;

    if (status === "active") {
      onArchive?.(selectedId);
    } else {
      onPermanentDelete?.(selectedId);
    }

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
              <th>User ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => {

              const createdAt = new Date(user.createdAt);
              const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;

              return (
                <tr key={user.id} className="hover:bg-gray-50 text-sm">
                  <td>{index+1}</td>
                  <td>{user.id}</td>

                  <td>{user.firstName} {user.lastName}</td>

                  <td>{user.email ?? "—"}</td>

                  <td>{user.phone ?? "—"}</td>

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
                      {user.role}
                    </span>
                  </td>

                  <td className="flex gap-2">

                    {status === "active" ? (
                      <Button
                        variant="danger"
                        size="icon"
                        onClick={() => setSelectedId(user.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRestore?.(user.id)}
                        >
                          Restore
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setSelectedId(user.id)}
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

      {/* Modal */}
      <DeleteWarning
        open={!!selectedId}
        title={status === "active" ? "Archive User" : "Delete User Permanently"}
        message={
          status === "active"
            ? "Are you sure you want to archive this user?"
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

export default UserTable