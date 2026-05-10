import { useState } from "react";
import type { Consultant } from "../../slices/interfaces/consultant";
import DeleteWarning from "../../ui/DeleteWarning";
import Button from "../../ui/components/Button";
import { Trash2, Pencil, RotateCcw } from "lucide-react";
import Grid from "../../ui/Grid";
import Card from "../../ui/components/Card";

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
  limit: number;
}

const ConsultantGrid = ({
  consultants,
  title = "Consultants",
  onArchive,
  onRestore,
  onPermanentDelete,
  onEdit,
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

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>

      {/* grid */}
      <Grid cols={3} gap={6} className="sm:grid-cols-2 xl:grid-cols-3">
        {consultants.map((c, index) => (
          <Card
            key={c.id}
            className="p-7 flex flex-col gap-4 min-h-[280px] hover:shadow-lg transition-shadow"
          >
            {/* header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold">
                {getInitials(c.firstName, c.lastName)}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {c.firstName} {c.lastName}
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {c.expertise}
                </span>
              </div>

              <span className="ml-auto text-sm text-gray-400">
                #{(page - 1) * limit + index + 1}
              </span>
            </div>

            {/* details */}
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <p>{c.id}</p>
              <p className="truncate">{c.email ?? "—"}</p>
              <p>{c.phone ?? "—"}</p>
              <p className="text-green-500">{c.price ?? "—"} $ per session</p>
              <p className="text-gray-500 line-clamp-2">
                {c.bio ?? "—"}
              </p>
            </div>

            {/* skills */}
            {c.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {c.skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {skill}
                  </span>
                ))}

                {c.skills.length > 5 && (
                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-400 rounded-full">
                    +{c.skills.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* stats */}
            <div className="flex gap-4 text-sm text-gray-500">
              <span>
                {c.experience} yr{c.experience !== 1 ? "s" : ""} exp
              </span>
              <span>•</span>
              <span>
                ⭐ {c.rating ?? "—"} ({c.reviewCount ?? 0})
              </span>
            </div>

            {/* actions */}
            <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100">
              {status === "active" ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    onClick={() => onEdit(c.id)}
                  >
                    <Pencil size={14} className="mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    size="icon"
                    onClick={() => setSelectedId(c.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center"
                    onClick={() => onRestore?.(c.id)}
                  >
                    <RotateCcw size={14} className="mr-1" />
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
          </Card>
        ))}
      </Grid>

      {/* warning */}
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

export default ConsultantGrid;