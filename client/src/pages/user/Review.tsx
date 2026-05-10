import { useState } from "react";
import { useGetReviewsByConsultantQuery } from "../../slices/redux-slices/review";
import { useParams } from "react-router-dom";
import Button from "../../ui/components/Button";

type SortOption = "recent" | "high" | "low";

const getSortParams = (sort: SortOption) => {
  if (sort === "recent") return { sortBy: "createdAt", order: "desc" as const };
  if (sort === "high") return { sortBy: "rating", order: "desc" as const };
  return { sortBy: "rating", order: "asc" as const };
};

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

//  half star
function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "text-4xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(Math.max(rating - (star - 1), 0), 1);

        return (
          <span key={star} className="relative inline-block text-[#d7e4ec]">
            ★
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden text-[#24389c]"
                style={{ width: `${fill * 100}%` }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewsPage() {
  const { consultantId = "" } = useParams<{ consultantId: string }>();

  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<SortOption>("recent");

  // reviews
  const { data, isLoading, isError } =
    useGetReviewsByConsultantQuery(
      {
        consultantId,
        page,
        limit: 10,
        ...getSortParams(sort),
      },
      { skip: !consultantId }
    );

  // all reviews
  const { data: allData } =
    useGetReviewsByConsultantQuery(
      {
        consultantId,
        limit: 0, // or 0 if backend supports it safely
      },
      { skip: !consultantId }
    );

  const reviews = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const allReviews = allData?.data ?? [];

  //summary
  const avgNumber =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) /
        allReviews.length
      : 0;

  const avgRounded = Math.round(avgNumber * 2) / 2;
  const avgDisplay = avgNumber.toFixed(1);

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = allReviews.filter((r) => r.rating === star).length;
    return {
      star,
      percent: allReviews.length
        ? (count / allReviews.length) * 100
        : 0,
    };
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#24389c] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 font-semibold">
        Failed to load reviews.
      </div>
    );

  return (
    <div className="text-[#111d23] min-h-screen px-6 md:px-12 lg:px-24 py-20">
      <div className="max-w-7xl mx-auto">

        {/* header */}
        <header className="mb-12">
          <p className="uppercase tracking-[0.15em] text-[#4c616c] font-bold text-xs mb-2">
            Verified Testimonials
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Client <span className="text-[#24389c]">Experiences.</span>
          </h1>
        </header>

        {/* summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* avg */}
          <div className="lg:col-span-5 bg-white rounded-xl p-10 flex flex-col justify-center items-center text-center border border-[#c5c5d4]/30">
            <div className="text-7xl font-black text-[#24389c] mb-2">
              {avgDisplay}
            </div>

            <div className="flex justify-center text-[#24389c] gap-1 mb-4">
              <StarRating rating={avgRounded} size="lg" />
            </div>

            <p className="text-[#4c616c]">
              Based on {allReviews.length} reviews
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#e9f6fd] rounded-xl p-8">

            <div className="space-y-4">
              {breakdown.map((b) => (
                <div key={b.star} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-bold text-[#454652]">
                    {b.star} stars
                  </span>

                  <div className="flex-1 h-2.5 bg-[#d7e4ec] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#24389c] rounded-full"
                      style={{ width: `${b.percent}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-xs font-semibold text-[#4c616c]">
                    {b.percent.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            {/* sort */}
            <div className="mt-8 pt-6 border-t border-[#c5c5d4]/20">
              <label className="text-xs font-bold uppercase tracking-widest text-[#4c616c] mr-3">
                Sort By
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(1);
                }}
                className="bg-[#d7e4ec] text-sm font-semibold rounded-lg py-2 px-4"
              >
                <option value="recent">Most Recent</option>
                <option value="high">Highest Rated</option>
                <option value="low">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* reviews */}
        <div className="space-y-6">
          {reviews.map((r) => {
            const initials = getInitials(
              r.user?.firstName,
              r.user?.lastName
            );

            return (
              <article
                key={r.id}
                className="bg-white p-8 rounded-xl flex flex-col md:flex-row gap-6 hover:translate-x-1 transition"
              >
                <div className="w-14 h-14 rounded-full bg-[#dee0ff] text-[#00105c] flex items-center justify-center font-bold text-lg">
                  {initials}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">
                        {r.user?.firstName} {r.user?.lastName}
                      </h3>

                      <div className="flex mt-1">
                        <StarRating rating={r.rating} size="sm" />
                      </div>
                    </div>

                    <span className="text-sm text-[#4c616c]">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-[#454652] italic">
                    {r.comment || "No comment"}
                  </p>
                </div>
              </article>
            );
          })}

          {reviews.length === 0 && (
            <p className="text-center text-gray-400">
              No reviews yet.
            </p>
          )}
        </div>

        {/* pagination */}
        {pagination && (
          <div className="flex items-center justify-between mt-10 border-t pt-6">

            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2 rounded-xl text-sm font-semibold 
                         transition disabled:opacity-40"
            >
              ← Previous
            </Button>

            <p className="text-sm text-[#4c616c] font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </p>

            <Button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2 rounded-xl text-sm font-semibold 
                          transition disabled:opacity-40"
            >
              Next →
            </Button>

          </div>
        )}
      </div>
    </div>
  );
}