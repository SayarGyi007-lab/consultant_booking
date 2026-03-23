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
    if (status === "active") onArchive?.(selectedId);
    else onPermanentDelete?.(selectedId);
    setSelectedId(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[1000px] text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-sm border-b border-gray-200">
              <th className="px-4 py-3 whitespace-nowrap font-medium">No.</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">User ID</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">User</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Email</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Phone</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Created</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Updated</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium">Role</th>
              <th className="px-4 py-3 whitespace-nowrap font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => {
              const createdAt = new Date(user.createdAt);
              const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;

              return (
                <tr key={user.id} className="hover:bg-gray-50 text-sm border-b border-gray-100">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{user.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">{user.email ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.phone ?? "—"}</td>
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
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-middle">
                    <div className="flex justify-center items-center gap-2">
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
};

export default UserTable;