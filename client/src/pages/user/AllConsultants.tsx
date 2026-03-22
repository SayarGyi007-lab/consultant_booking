import { useState, useMemo } from "react";
import { useConsultants } from "../../hooks/useConsultants";
import ConsultantCard from "../../components/user/ConsultantCard";
import Button from "../../ui/Button";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const AllConsultants = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const navigate = useNavigate()

  const debounceSearch = useDebounce(search);

  const { consultants, consultantsPagination, isLoading } = useConsultants({
    page,
    limit: 6,
    status: "active",
    search: debounceSearch,
    expertise,
  });

  const { consultants: allConsultants = [] } = useConsultants({
    page: 1,
    limit: 0, //fetch all
    status: "active",
  });

  const uniqueExpertise = useMemo(() => {
    return Array.from(
      new Set(
        allConsultants.map((c: any) => c.expertise).filter(Boolean)
      )
    );
  }, [allConsultants]);

  const totalPages = consultantsPagination?.totalPages || 1;

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">All Consultants</h1>
        <p className="text-gray-500">
          Browse and book from available consultants
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-between">

        <div className=" flex gap-3">

          <select
            value={expertise}
            onChange={(e) => {
              setExpertise(e.target.value);
              setPage(1);
            }}
            disabled={!uniqueExpertise.length}
            className="border rounded px-3 py-2 w-full md:w-[200px]"
          >
            <option value="">All Expertise</option>
            {uniqueExpertise.map((exp: string) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setExpertise("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search consultant..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded-lg px-4 py-2 w-full md:w-[300px]"
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : consultants.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg font-medium">No consultants found</p>
          <p className="text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {consultants.map((c: any) => (
            <ConsultantCard key={c.id} consultant={c} />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <Button onClick={() => navigate("/home")}>
            Back
          </Button>
        </div>

        <div className="flex  mx-auto items-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllConsultants;