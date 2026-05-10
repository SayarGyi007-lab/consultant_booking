import { useState } from "react";
import type { User } from "../../slices/interfaces/user";
import Button from "../../ui/components/Button";
import { Trash2, RotateCcw } from "lucide-react";
import DeleteWarning from "../../ui/DeleteWarning";
import Grid from "../../ui/Grid";
import Card from "../../ui/components/Card";
import { dateOptions, timeOptions } from "../../utils/date-time";

interface Props {
  users: User[];
  title?: string;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  isLoading?: boolean;
  status: "active" | "archived";
  page: number;
  limit: number;
}

const UserGrid = ({
  users,
  title = "Users",
  onArchive,
  onRestore,
  onPermanentDelete,
  isLoading,
  status,
  page,
  limit,
}: Props) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmAction = () => {
    if (!selectedId) return;

    if (status === "active") onArchive?.(selectedId);
    else onPermanentDelete?.(selectedId);

    setSelectedId(null);
  };

  const getInitials = (first: string, last: string) =>
    `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>

      {/* grid */}
      <Grid cols={3} gap={6} className="sm:grid-cols-2 xl:grid-cols-3">
        {users.map((user, index) => {
          const createdAt = new Date(user.createdAt);
          const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;

          return (
            <Card
              key={user.id}
              className="p-6 flex flex-col gap-4 min-h-[280px] hover:shadow-lg transition-shadow"
            >
              {/* header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  {getInitials(user.firstName, user.lastName)}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>

                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {user.role}
                  </span>
                </div>

                <span className="ml-auto text-sm text-gray-400">
                  #{(page - 1) * limit + index + 1}
                </span>
              </div>

              {/* details */}
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <p className="truncate">{user.email ?? "—"}</p>
                <p>{user.phone ?? "—"}</p>
                <p className="text-xs text-gray-500 font-mono truncate">
                  ID: {user.id}
                </p>
              </div>

              {/* dates */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Created:{" "}
                  {createdAt.toLocaleDateString(undefined, dateOptions)}{" "}
                  {createdAt.toLocaleTimeString(undefined, timeOptions)}
                </p>

                <p>
                  Updated:{" "}
                  {updatedAt
                    ? `${updatedAt.toLocaleDateString(undefined, dateOptions)} ${updatedAt.toLocaleTimeString(undefined, timeOptions)}`
                    : "—"}
                </p>
              </div>

              {/* actios */}
              <div className="flex gap-3 mt-auto justify-end pt-3 border-t border-gray-100">
                {status === "active" ? (
                  <Button
                    variant="danger"
                    size="icon"
                    onClick={() => setSelectedId(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center"
                      onClick={() => onRestore?.(user.id)}
                    >
                      <RotateCcw size={14} className="mr-1" />
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
            </Card>
          );
        })}
      </Grid>

      {/* warning */}
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

export default UserGrid;