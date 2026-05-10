import { useNavigate, useParams } from "react-router-dom";
import { dateOptions, timeOptions } from "../../utils/date-time";
import { useGetConsultantByIdQuery } from "../../slices/redux-slices/consultant-api";
import { useGetAvailableSlotsByConsultantQuery } from "../../slices/redux-slices/time-slot-api";
import { useGetReviewsByConsultantQuery } from "../../slices/redux-slices/review";
import { IoPerson } from "react-icons/io5";
import { MdHistoryEdu } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";



const ConsultantInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  const { data: consultantData, isLoading } = useGetConsultantByIdQuery(id!);
  const { data: slotsData } = useGetAvailableSlotsByConsultantQuery(id!);
  const { data: reviewData } = useGetReviewsByConsultantQuery({
    consultantId: id!,
    page: 1,
    limit: 6,
  });

  const consultant = consultantData?.data;
  const slots = slotsData?.data || [];
  const reviews = reviewData?.data || [];

  if (isLoading) return <p className="text-gray-400">Loading...</p>;
  if (!consultant) return <p className="text-gray-400">Not found</p>;



  return (
    <div className="bg-surface px-6 py-10 max-w-7xl mx-auto space-y-10">

      <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border space-y-6">

        <div className="space-y-4">

          {/* badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-[#24389c]/10 text-[#24389c] px-3 py-1 rounded-full text-xs font-bold uppercase">
              {consultant.expertise}
            </span>

            <span className="text-[#004b4e] font-semibold">
              ★ {consultant.rating ?? "—"}
              <span className="text-[#4c616c] text-sm ml-1">
                ({consultant.reviewCount ?? 0} reviews)
              </span>
            </span>
          </div>

          {/* name */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {consultant.firstName} {consultant.lastName}
          </h1>

          {/* skills */}
          <div>

            <div className="flex flex-wrap gap-2">
              {consultant.skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="bg-[#e3f0f8] px-4 py-2 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* bio */}
      <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border space-y-4">
        <h2 className="text-xl font-bold flex gap-3 items-center text-[#24389c]"><IoPerson /><span className="text-black">Professional Biography</span></h2>

        <p className="text-secondary leading-relaxed max-w-3xl">
          {consultant.bio}
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <InfoCard logo={<MdHistoryEdu />} label="Experience" value={`${consultant.experience} yrs`} />
        <InfoCard logo={<FaMoneyBillWave />} label="Rate" value={`$${consultant.price}/hr`} />
        <InfoCard logo={<MdEmail />} label="Email" value={consultant.email} />
        <InfoCard logo={<MdLocalPhone />} label="Phone" value={consultant.phone} />

      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Available Slots
            <span className="text-sm text-gray-400 ml-2">(scroll →)</span>
          </h2>
        </div>

        {slots.length === 0 ? (
          <p className="text-secondary text-sm">No slots available</p>
        ) : (
          <div className="relative">

            {/* left arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-md rounded-full p-2 hover:scale-110 transition"
            >
              <ChevronLeft size={18} />
            </button>

            {/* right arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur shadow-md rounded-full p-2 hover:scale-110 transition"
            >
              <ChevronRight size={18} />
            </button>

            {/* scroll  */}
            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide pb-4 scroll-smooth snap-x snap-mandatory"
            >
              <div className="flex gap-4 w-max px-10">
                {slots.slice(0, 20).map((slot: any) => {
                  const date = new Date(slot.startTime);

                  return (
                    <div
                      key={slot.id}
                      onClick={() =>
                        navigate("/booking", { state: { consultant, slot } })
                      }
                      className="snap-start bg-white rounded-xl p-4 text-center cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group flex-shrink-0 w-[140px]"
                    >
                      {/* DATE */}
                      <p className="text-xs text-[#24389c] font-bold uppercase">
                        {date.toLocaleDateString(undefined, dateOptions)}
                      </p>

                      {/* TIME */}
                      <div className="mt-2 py-2 rounded-lg bg-[#8ad3d7] font-bold group-hover:bg-primary group-hover:text-white transition">
                        {date.toLocaleTimeString(undefined, timeOptions)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT FADE */}
            <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-surface to-transparent pointer-events-none" />

            {/* LEFT FADE */}
            <div className="absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-surface to-transparent pointer-events-none" />
          </div>
        )}
      </section>

      {/* reviews */}
      <section className="space-y-6 pb-10">

        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Recent Feedback
          </h2>

          <button
            onClick={() => navigate(`/consultants/${id}/reviews`)}
            className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
          >
            View All Reviews
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-secondary text-sm">No reviews yet</p>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group hover:shadow-md transition"
              >

                <div className="flex justify-between relative z-10">

                  {/* user */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                      {review.user.firstName[0]}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                    </div>
                  </div>

                  <span className="text-[#004b4e] font-semibold text-sm"> ★ <span className="text-[#4c616c] text-sm">{review.rating}</span> </span>
                </div>

                {/* comment */}
                <p className="text-slate-600 leading-relaxed italic relative z-10">
                  "{review.comment || "No comment provided"}"
                </p>

              </div>
            ))}

          </div>
        )}
      </section>

    </div>
  );
};

export default ConsultantInfo;

/* ================= INFO CARD ================= */

const InfoCard = ({ label, value, logo }: any) => (
  <div className="bg-[#e9f6fd] rounded-xl p-5 space-y-1">
    <p className="text-[#24389c] text-xl">{logo}</p>
    <p className="text-xs text-[#4c616c] font-bold uppercase">{label}</p>
    <p className="font-bold text-lg truncate">{value}</p>
  </div>
);