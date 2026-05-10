// import { Mail, Phone } from "lucide-react";

// const UpcomingList = ({ bookings }: any) => {
//   if (!bookings.length) return null;

//   return (
//     <div>
//       <h2 className="text-xl font-semibold mb-4">
//         More Upcoming
//       </h2>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {bookings.map((b: any) => {
//           const c = b.slot?.consultant;

//           return (
//             <div
//               key={b.id}
//               className="bg-white p-4 rounded-xl shadow"
//             >
//               <p className="font-semibold">
//                 {c?.firstName} {c?.lastName}
//               </p>

//               <p className="text-sm text-gray-500">
//                 {new Date(b.slot?.startTime).toLocaleString()}
//               </p>

//               <div className="flex gap-2 mt-3">
//                 <a
//                   href={`mailto:${c?.email}`}
//                   className="flex-1 text-center py-2 border rounded"
//                 >
//                   <Mail size={14} />
//                 </a>

//                 <a
//                   href={`tel:${c?.phone}`}
//                   className="flex-1 text-center py-2 border rounded"
//                 >
//                   <Phone size={14} />
//                 </a>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default UpcomingList;