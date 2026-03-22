import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useUsers } from "../../hooks/useUsers";
import Alert from "../../ui/Alert";
import StatusToggle from "../../ui/Toggle";
import UserTable from "../../components/admin/UserTable";
import Button from "../../ui/Button";
import {
  useArchiveUserMutation,
  useRestoreUserMutation,
  usePermanentDeleteUserMutation
} from "../../slices/redux-slices/user-api";

const AllUser = () => {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"active" | "archived">("active");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const limit = 10;
  const debounceSearch = useDebounce(search, 500);

  const { users, usersPagination } = useUsers({
    page,
    limit,
    search: debounceSearch,
    status
  });

  const [archiveUser, { isLoading: isArchiving }] = useArchiveUserMutation();
  const [restoreUser] = useRestoreUserMutation();
  const [permanentDeleteUser, { isLoading: isDeleting }] = usePermanentDeleteUserMutation();

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleArchive = async (id: string) => {
    try {
      const res = await archiveUser(id).unwrap();
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Archive failed");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await restoreUser(id).unwrap();
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Restore failed");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      const res = await permanentDeleteUser(id).unwrap();
      setSuccessMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Delete failed");
    }
  };

  const hasNextPage = page < (usersPagination?.totalPages ?? 1);
  const hasPreviousPage = page > 1;

  return (
    <div className="p-6 min-h-screen w-full">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border w-[300px] rounded-lg px-4 py-2"
        />
      </div>

      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />

      <div className="mb-4">
        <StatusToggle
          value={status}
          onChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
        />
      </div>

      <UserTable
        users={users}
        title="All Users"
        status={status}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        isLoading={isArchiving || isDeleting}
      />

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-6">

        <div>
          {hasPreviousPage && (
            <Button onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
          )}
        </div>

        <div className="text-center">
          Page {page} / {usersPagination?.totalPages ?? 1}
        </div>

        <div className="flex justify-end">
          {hasNextPage && (
            <Button onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          )}
        </div>

      </div>

    </div>
  );
};

export default AllUser;