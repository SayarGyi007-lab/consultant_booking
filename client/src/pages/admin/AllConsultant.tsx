
// import { useState, useEffect, useMemo } from 'react';
// import useDebounce from '../../hooks/useDebounce';
// import { useConsultants } from '../../hooks/useConsultants';
// import ConsultantTable from '../../components/admin/ConsultantTable';
// import UpdateConsultant from '../../components/admin/UpdateConsultant';
// import Button from '../../ui/Button';
// import Alert from '../../ui/Alert';
// import StatusToggle from '../../ui/Toggle';
// import {
//   useArchiveConsultantMutation,
//   useRestoreConsultantMutation,
//   usePermanentDeleteConsultantMutation
// } from '../../slices/redux-slices/consultant-api';

// const AllConsultant = () => {
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [status, setStatus] = useState<"active" | "archived">("active");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [expertise, setExpertise] = useState("");
//   const [editingConsultantId, setEditingConsultantId] = useState<string | null>(null);

//   const limit = 5;
//   const debounceSearch = useDebounce(search, 500);

//   const { consultants, consultantsPagination } = useConsultants({
//     page,
//     limit,
//     search: debounceSearch,
//     status,
//     expertise
//   });

//   const { consultants: allConsultants = [] } = useConsultants({
//     page: 1,
//     limit: 0,
//     status
//   });

//   const uniqueExpertise = useMemo(() => {
//     return Array.from(new Set(allConsultants.map(c => c.expertise).filter(Boolean)));
//   }, [allConsultants]);

//   const [archiveConsultant, { isLoading: isArchiving }] = useArchiveConsultantMutation();
//   const [restoreConsultant] = useRestoreConsultantMutation();
//   const [permanentDeleteConsultant, { isLoading: isDeleting }] = usePermanentDeleteConsultantMutation();

//   useEffect(() => {
//     if (errorMsg || successMsg) {
//       const timer = setTimeout(() => {
//         setErrorMsg("");
//         setSuccessMsg("");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMsg, successMsg]);

//   const handleArchive = async (id: string) => {
//     try {
//       const res = await archiveConsultant(id).unwrap();
//       const { success, message } = res.data;
//       if (success) setSuccessMsg(message);
//       else setErrorMsg(message);
//     } catch (err: any) {
//       setErrorMsg(err?.data?.data?.message || "Archive failed");
//     }
//   };

//   const handleRestore = async (id: string) => {
//     try {
//       const res = await restoreConsultant(id).unwrap();
//       if (res.success) setSuccessMsg(res.message);
//       else setErrorMsg(res.message);
//     } catch (err: any) {
//       setErrorMsg(err?.data?.data?.message || "Restore failed");
//     }
//   };

//   const handlePermanentDelete = async (id: string) => {
//     try {
//       const res = await permanentDeleteConsultant(id).unwrap();
//       if (res.success) setSuccessMsg(res.message);
//       else setErrorMsg(res.message);
//     } catch (err: any) {
//       setErrorMsg(err?.data?.data?.message || "Delete failed");
//     }
//   };

//   const hasNextPage = page < (consultantsPagination?.totalPages ?? 1);
//   const hasPreviousPage = page > 1;

//   const consultantToEdit = consultants.find(c => c.id === editingConsultantId);

//   return (
//     <div className="p-6 min-h-screen w-full overflow-x-hidden">

//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Consultants</h1>
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//           className="border w-[300px] rounded-lg px-4 py-2"
//         />
//       </div>

//       <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
//       <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />

//       <div className="flex justify-between mb-4">
//         <StatusToggle
//           value={status}
//           onChange={(val) => { setStatus(val); setExpertise(""); setPage(1); }}
//         />

//         <div className="flex gap-2">
//           <select
//             disabled={!uniqueExpertise.length}
//             value={expertise}
//             onChange={(e) => { setExpertise(e.target.value); setPage(1); }}
//             className="border rounded px-3 py-2"
//           >
//             <option value="">All Expertise</option>
//             {uniqueExpertise.map((exp) => (
//               <option key={exp} value={exp}>{exp}</option>
//             ))}
//           </select>

//           <Button
//             variant="outline"
//             onClick={() => { setSearch(""); setExpertise(""); setPage(1); }}
//           >
//             Reset
//           </Button>
//         </div>
//       </div>

//       <ConsultantTable
//         consultants={consultants}
//         title="All Consultants"
//         status={status}
//         onArchive={handleArchive}
//         onRestore={handleRestore}
//         onPermanentDelete={handlePermanentDelete}
//         onEdit={setEditingConsultantId}
//         isLoading={isArchiving || isDeleting}
//       />

//       <div className="grid grid-cols-3 items-center mt-6">
//         <div>
//           {hasPreviousPage && <Button onClick={() => setPage(p => p - 1)}>Previous</Button>}
//         </div>
//         <div className="text-center">
//           Page {page} / {consultantsPagination?.totalPages ?? 1}
//         </div>
//         <div className="flex justify-end">
//           {hasNextPage && <Button onClick={() => setPage(p => p + 1)}>Next</Button>}
//         </div>
//       </div>

//       {consultantToEdit && (
//         <UpdateConsultant
//           consultant={consultantToEdit}
//           onClose={() => setEditingConsultantId(null)}
//         />
//       )}

//     </div>
//   );
// };

// export default AllConsultant;

import { useState, useEffect, useMemo } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { useConsultants } from '../../hooks/useConsultants';
import ConsultantTable from '../../components/admin/ConsultantTable';
import UpdateConsultant from '../../components/admin/UpdateConsultant';
import Button from '../../ui/Button';
import Alert from '../../ui/Alert';
import StatusToggle from '../../ui/Toggle';
import {
  useArchiveConsultantMutation,
  useRestoreConsultantMutation,
  usePermanentDeleteConsultantMutation
} from '../../slices/redux-slices/consultant-api';

const AllConsultant = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"active" | "archived">("active");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expertise, setExpertise] = useState("");
  const [editingConsultantId, setEditingConsultantId] = useState<string | null>(null);

  const limit = 5;
  const debounceSearch = useDebounce(search, 500);

  const { consultants, consultantsPagination } = useConsultants({
    page,
    limit,
    search: debounceSearch,
    status,
    expertise
  });

  const { consultants: allConsultants = [] } = useConsultants({
    page: 1,
    limit: 0,
    status
  });

  const uniqueExpertise = useMemo(() => {
    return Array.from(new Set(allConsultants.map(c => c.expertise).filter(Boolean)));
  }, [allConsultants]);

  const [archiveConsultant, { isLoading: isArchiving }] = useArchiveConsultantMutation();
  const [restoreConsultant] = useRestoreConsultantMutation();
  const [permanentDeleteConsultant, { isLoading: isDeleting }] = usePermanentDeleteConsultantMutation();

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
      const res = await archiveConsultant(id).unwrap();
      const { success, message } = res.data;
      if (success) setSuccessMsg(message);
      else setErrorMsg(message);
    } catch (err: any) {
      setErrorMsg(err?.data?.data?.message || "Archive failed");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const res = await restoreConsultant(id).unwrap();
      if (res.success) setSuccessMsg(res.message);
      else setErrorMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.data?.message || "Restore failed");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      const res = await permanentDeleteConsultant(id).unwrap();
      if (res.success) setSuccessMsg(res.message);
      else setErrorMsg(res.message);
    } catch (err: any) {
      setErrorMsg(err?.data?.data?.message || "Delete failed");
    }
  };

  const hasNextPage = page < (consultantsPagination?.totalPages ?? 1);
  const hasPreviousPage = page > 1;

  const consultantToEdit = consultants.find(c => c.id === editingConsultantId);

  return (
    <div className="p-4 lg:p-6 min-h-screen w-full overflow-x-hidden">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Consultants</h1>
        <input
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border w-full sm:w-[300px] rounded-lg px-4 py-2"
        />
      </div>

      {/* Alerts */}
      <Alert type="error" message={errorMsg} onClose={() => setErrorMsg("")} />
      <Alert type="success" message={successMsg} onClose={() => setSuccessMsg("")} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <StatusToggle
          value={status}
          onChange={(val) => { setStatus(val); setExpertise(""); setPage(1); }}
        />

        <div className="flex gap-2">
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
      </div>

      {/* Consultant Table */}
      {consultants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No consultants found</div>
      ) : (
        <ConsultantTable
          consultants={consultants}
          title="All Consultants"
          status={status}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
          onEdit={setEditingConsultantId}
          isLoading={isArchiving || isDeleting}
        />
      )}

      {/* Pagination */}
      <div className="grid grid-cols-3 items-center mt-6">
        <div>
          {hasPreviousPage && <Button onClick={() => setPage(p => p - 1)}>Previous</Button>}
        </div>
        <div className="text-center text-sm">
          Page {page} / {consultantsPagination?.totalPages ?? 1}
        </div>
        <div className="flex justify-end">
          {hasNextPage && <Button onClick={() => setPage(p => p + 1)}>Next</Button>}
        </div>
      </div>

      {/* Edit Modal */}
      {consultantToEdit && (
        <UpdateConsultant
          consultant={consultantToEdit}
          onClose={() => setEditingConsultantId(null)}
        />
      )}
    </div>
  );
};

export default AllConsultant;