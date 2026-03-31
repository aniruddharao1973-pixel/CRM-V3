// // src/components/assign/AssignmentGrid.jsx

// import { useDispatch, useSelector } from "react-redux";
// import { toggleAssignment } from "../../features/assign/assignmentSlice";

// export default function AssignmentGrid({ type }) {
//   const dispatch = useDispatch();

//   const assignmentState = useSelector((state) => state.assignment) || {};
//   const {
//     users = [],
//     records = [],
//     loading = false,
//     toggleLoadingMap = {},
//   } = assignmentState;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
//         Loading assignments...
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <div className="w-full overflow-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
//         <table className="min-w-full text-sm">
//           {/* HEADER */}
//           <thead className="bg-gradient-to-b from-gray-50 to-white sticky top-0 z-10 border-b">
//             <tr>
//               <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 {type} Name
//               </th>

//               {users.map((u) => (
//                 <th key={u.id} className="px-4 py-4 text-center min-w-[120px]">
//                   <div className="flex flex-col items-center gap-1">
//                     <span className="text-xs font-semibold text-gray-700">
//                       {u.name}
//                     </span>

//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
//                         u.role === "SALES_REP"
//                           ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
//                           : u.role === "MANAGER"
//                             ? "bg-purple-50 text-purple-600 border border-purple-100"
//                             : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {u.role === "SALES_REP"
//                         ? "Sales Rep"
//                         : u.role === "MANAGER"
//                           ? "Manager"
//                           : u.role || "Unknown"}
//                     </span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* BODY */}
//           <tbody>
//             {records.map((r, index) => (
//               <tr
//                 key={r.id}
//                 className={`border-b last:border-none transition ${
//                   index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                 } hover:bg-blue-50/40`}
//               >
//                 <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap">
//                   {r.name}
//                 </td>

//                 {users.map((u) => {
//                   // ✅ ALWAYS BOOLEAN
//                   const assigned = !!r.assignments?.[u.id];

//                   const isToggling = toggleLoadingMap?.[`${r.id}_${u.id}`];

//                   return (
//                     <td key={u.id} className="text-center py-4">
//                       <button
//                         disabled={isToggling}
//                         onClick={() =>
//                           dispatch(
//                             toggleAssignment({
//                               type,
//                               recordId: r.id,
//                               userId: u.id,
//                               assigned: !assigned,
//                             }),
//                           )
//                         }
//                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
//                           assigned ? "bg-blue-500" : "bg-gray-300"
//                         } ${
//                           isToggling
//                             ? "opacity-50 cursor-not-allowed"
//                             : "cursor-pointer"
//                         } shadow-sm`}
//                       >
//                         <span
//                           className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
//                             assigned ? "translate-x-5" : "translate-x-1"
//                           }`}
//                         />
//                       </button>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {!records.length && (
//           <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
//             <span>No {type} records found</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // src/components/assign/AssignmentGrid.jsx
// import { useDispatch, useSelector } from "react-redux";
// import { toggleAssignment } from "../../features/assign/assignmentSlice";

// export default function AssignmentGrid({ type }) {
//   const dispatch = useDispatch();

//   const {
//     users = [],
//     records = [],
//     loading = false,
//     toggleLoadingMap = {},
//   } = useSelector((state) => state.assignment) || {};

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full text-gray-500 text-sm">
//         Loading access...
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full overflow-auto">
//       {/* 🔥 Scroll Hint (right fade) */}
//       <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white z-10" />

//       <div className="min-w-[900px] lg:min-w-[1100px]">
//         <table className="w-full text-sm border-separate border-spacing-0">
//           {/* HEADER */}
//           <thead className="bg-gray-50 sticky top-0 z-20 border-b">
//             <tr>
//               {/* Sticky First Column */}
//               <th className="sticky left-0 z-30 bg-gray-50 px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
//                 {type} Name
//               </th>

//               {users.map((u) => (
//                 <th
//                   key={u.id}
//                   className="px-4 py-4 text-center min-w-[140px] border-b"
//                 >
//                   <div className="flex flex-col items-center gap-1">
//                     <span className="text-xs font-semibold text-gray-800">
//                       {u.name}
//                     </span>

//                     <span
//                       className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
//                         u.role === "SALES_REP"
//                           ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
//                           : u.role === "MANAGER"
//                             ? "bg-purple-50 text-purple-600 border border-purple-100"
//                             : "bg-gray-100 text-gray-500"
//                       }`}
//                     >
//                       {u.role === "SALES_REP"
//                         ? "Sales Rep"
//                         : u.role === "MANAGER"
//                           ? "Manager"
//                           : u.role}
//                     </span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* BODY */}
//           <tbody>
//             {records.map((r, index) => (
//               <tr
//                 key={r.id}
//                 className={`transition ${
//                   index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                 } hover:bg-blue-50/40`}
//               >
//                 {/* Sticky First Column */}
//                 <td className="sticky left-0 z-10 bg-inherit px-5 py-4 font-medium text-gray-800 border-b whitespace-nowrap">
//                   {r.name}
//                 </td>

//                 {users.map((u) => {
//                   const assigned = !!r.assignments?.[u.id];
//                   const isToggling = toggleLoadingMap?.[`${r.id}_${u.id}`];

//                   return (
//                     <td key={u.id} className="text-center py-4 border-b">
//                       <button
//                         disabled={isToggling}
//                         onClick={() =>
//                           dispatch(
//                             toggleAssignment({
//                               type,
//                               recordId: r.id,
//                               userId: u.id,
//                               assigned: !assigned,
//                             }),
//                           )
//                         }
//                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
//                           assigned ? "bg-blue-500" : "bg-gray-300"
//                         } ${
//                           isToggling
//                             ? "opacity-50 cursor-not-allowed"
//                             : "cursor-pointer hover:scale-105"
//                         } shadow-sm`}
//                       >
//                         <span
//                           className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
//                             assigned ? "translate-x-5" : "translate-x-1"
//                           }`}
//                         />
//                       </button>
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* EMPTY STATE */}
//       {!records.length && (
//         <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
//           No {type} records found
//         </div>
//       )}
//     </div>
//   );
// }

// // src/components/assign/AssignmentGrid.jsx
// import { useDispatch, useSelector } from "react-redux";
// import { toggleAssignment } from "../../features/assign/assignmentSlice";

// export default function AssignmentGrid({ type }) {
//   const dispatch = useDispatch();

//   const {
//     users = [],
//     records = [],
//     loading = false,
//     toggleLoadingMap = {},
//   } = useSelector((state) => state.assignment) || {};

//   if (loading) {
//     return (
//       <div className="w-full h-full flex flex-col">
//         {/* Skeleton Header */}
//         <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
//           <div className="h-5 w-36 bg-gray-100 rounded-md animate-pulse" />
//           <div className="h-9 w-56 bg-gray-100 rounded-lg animate-pulse" />
//         </div>
//         {/* Skeleton Table */}
//         <div className="flex-1 overflow-hidden p-6">
//           <div className="rounded-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gray-50 px-5 py-3.5 flex gap-6 border-b border-gray-100">
//               {[120, 100, 100, 100, 100].map((w, i) => (
//                 <div
//                   key={i}
//                   className={`h-3.5 bg-gray-200 rounded animate-pulse`}
//                   style={{ width: w }}
//                 />
//               ))}
//             </div>
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className={`flex gap-6 px-5 py-4 border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
//               >
//                 <div className="h-3.5 w-28 bg-gray-100 rounded animate-pulse" />
//                 {[...Array(4)].map((_, j) => (
//                   <div
//                     key={j}
//                     className="h-6 w-11 bg-gray-100 rounded-full animate-pulse"
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col bg-white font-[system-ui,sans-serif]">
//       {/* ── Top Bar ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 pt-5 pb-4 border-b border-gray-100 shrink-0">
//         <div className="flex items-center gap-3">
//           <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
//             {type} Access
//           </h2>
//           {records.length > 0 && (
//             <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium tabular-nums">
//               {records.length} {records.length === 1 ? "record" : "records"}
//             </span>
//           )}
//         </div>
//         {/* Search — UI only placeholder */}
//         <div className="relative w-full sm:w-56">
//           <svg
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             width="14"
//             height="14"
//             viewBox="0 0 16 16"
//             fill="none"
//           >
//             <circle
//               cx="6.5"
//               cy="6.5"
//               r="5"
//               stroke="currentColor"
//               strokeWidth="1.5"
//             />
//             <path
//               d="M10.5 10.5L14 14"
//               stroke="currentColor"
//               strokeWidth="1.5"
//               strokeLinecap="round"
//             />
//           </svg>
//           <input
//             type="text"
//             placeholder={`Search ${type.toLowerCase()}s…`}
//             className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
//           />
//         </div>
//       </div>

//       {/* ── Table Wrapper ── */}
//       <div className="flex-1 overflow-auto relative">
//         {/* Right scroll-fade hint */}
//         <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/80 to-transparent z-10" />

//         <div className="min-w-[760px]">
//           <table className="w-full text-sm border-separate border-spacing-0">
//             {/* ── HEADER ── */}
//             <thead className="sticky top-0 z-20">
//               <tr>
//                 {/* Sticky name column */}
//                 <th className="sticky left-0 z-30 bg-gray-50/95 backdrop-blur-sm px-5 sm:px-7 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-gray-400 border-b border-r border-gray-100 w-44 sm:w-52">
//                   {type} Name
//                 </th>

//                 {users.map((u) => (
//                   <th
//                     key={u.id}
//                     className="bg-gray-50/95 backdrop-blur-sm px-4 py-3.5 text-center min-w-[136px] border-b border-gray-100"
//                   >
//                     <div className="flex flex-col items-center gap-1.5">
//                       <span className="text-[13px] font-semibold text-gray-700 leading-none">
//                         {u.name}
//                       </span>
//                       <span
//                         className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold leading-none border ${
//                           u.role === "SALES_REP"
//                             ? "bg-violet-50 text-violet-600 border-violet-100"
//                             : u.role === "MANAGER"
//                               ? "bg-amber-50 text-amber-600 border-amber-100"
//                               : "bg-gray-100 text-gray-500 border-gray-200"
//                         }`}
//                       >
//                         {u.role === "SALES_REP"
//                           ? "Sales Rep"
//                           : u.role === "MANAGER"
//                             ? "Manager"
//                             : u.role}
//                       </span>
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             {/* ── BODY ── */}
//             <tbody>
//               {records.map((r, index) => (
//                 <tr
//                   key={r.id}
//                   className={`group transition-colors duration-100 ${
//                     index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
//                   } hover:bg-blue-50/30`}
//                 >
//                   {/* Sticky record name */}
//                   <td className="sticky left-0 z-10 bg-inherit px-5 sm:px-7 py-3.5 border-b border-r border-gray-100 whitespace-nowrap">
//                     <span className="text-[13px] font-medium text-gray-800">
//                       {r.name}
//                     </span>
//                   </td>

//                   {users.map((u) => {
//                     const assigned = !!r.assignments?.[u.id];
//                     const isToggling = toggleLoadingMap?.[`${r.id}_${u.id}`];

//                     return (
//                       <td
//                         key={u.id}
//                         className="text-center py-3.5 px-4 border-b border-gray-100"
//                       >
//                         <button
//                           disabled={isToggling}
//                           onClick={() =>
//                             dispatch(
//                               toggleAssignment({
//                                 type,
//                                 recordId: r.id,
//                                 userId: u.id,
//                                 assigned: !assigned,
//                               }),
//                             )
//                           }
//                           className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
//                             assigned
//                               ? "bg-blue-500 border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
//                               : "bg-white border-gray-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
//                           } ${
//                             isToggling
//                               ? "opacity-60 cursor-wait"
//                               : "cursor-pointer hover:scale-105 active:scale-95"
//                           }`}
//                           aria-checked={assigned}
//                           role="switch"
//                         >
//                           <span
//                             className={`flex items-center justify-center pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full shadow-sm transition-transform duration-200 ${
//                               assigned
//                                 ? "translate-x-[20px] bg-white"
//                                 : "translate-x-[2px] bg-gray-400"
//                             }`}
//                           >
//                             {/* 🔥 Loading Spinner */}
//                             {isToggling && (
//                               <span className="w-[10px] h-[10px] border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                             )}
//                           </span>
//                         </button>
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ── EMPTY STATE ── */}
//         {!records.length && (
//           <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
//             <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
//               <svg
//                 width="22"
//                 height="22"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="text-gray-400"
//               >
//                 <rect
//                   x="3"
//                   y="7"
//                   width="18"
//                   height="13"
//                   rx="2"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                 />
//                 <path
//                   d="M3 10h18M8 7V5a2 2 0 0 1 4 0v2"
//                   stroke="currentColor"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             </div>
//             <p className="text-[14px] font-semibold text-gray-700 mb-1">
//               No {type} records found
//             </p>
//             <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed">
//               There are no {type.toLowerCase()} records to display. Try
//               adjusting your filters.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/assign/AssignmentGrid.jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleAssignment } from "../../features/assign/assignmentSlice";
import { useState } from "react";

export default function AssignmentGrid({ type }) {
  const dispatch = useDispatch();

  const {
    users = [],
    records = [],
    loading = false,
    toggleLoadingMap = {},
  } = useSelector((state) => state.assignment) || {};

  const getInitials = (name) =>
    (name || "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const palette = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-fuchsia-500",
    "bg-teal-500",
  ];

  const [searchTerm, setSearchTerm] = useState("");

  /* ─── TOGGLE SWITCH ─── */
  const Toggle = ({ assigned, toggling, onToggle, label }) => (
    <button
      disabled={toggling}
      onClick={onToggle}
      role="switch"
      aria-checked={assigned}
      aria-label={label}
      className={`
        relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${assigned ? "bg-blue-600" : "bg-gray-200"}
        ${toggling ? "opacity-50 cursor-wait" : "cursor-pointer active:scale-95"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-flex items-center justify-center
          h-[18px] w-[18px] rounded-full bg-white shadow-sm
          transition-transform duration-200 ease-in-out
          ${assigned ? "translate-x-[23px]" : "translate-x-[3px]"}
        `}
      >
        {toggling && (
          <span className="block w-2.5 h-2.5 border-[1.5px] border-gray-300 border-t-transparent rounded-full animate-spin" />
        )}
      </span>
    </button>
  );

  /* ─── ROLE BADGE ─── */
  const RoleBadge = ({ role }) => {
    const map = {
      SALES_REP: { cls: "bg-sky-50 text-sky-700", label: "Sales Rep" },
      MANAGER: { cls: "bg-amber-50 text-amber-700", label: "Manager" },
      ADMIN: { cls: "bg-rose-50 text-rose-700", label: "Admin" },
    };
    const { cls, label } = map[role] || {
      cls: "bg-gray-100 text-gray-600",
      label: role,
    };
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold leading-tight ${cls}`}
      >
        {label}
      </span>
    );
  };

  /* ─── LOADING SKELETON ─── */
  if (loading) {
    return (
      <div className="w-full h-full flex flex-col bg-white">
        <div className="shrink-0 p-4 sm:p-6 border-b border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-100 rounded-xl animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" />
              <div className="h-3 w-44 bg-gray-50 rounded-md animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
        </div>

        {/* Mobile skeleton */}
        <div className="flex-1 overflow-auto p-4 space-y-3 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="divide-y divide-gray-50">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-2.5 w-14 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop skeleton */}
        <div className="flex-1 overflow-auto p-6 hidden md:block">
          <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-5">
              <div className="flex items-center gap-12">
                {[130, 90, 90, 90].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 bg-gray-200 rounded animate-pulse"
                    style={{ width: w }}
                  />
                ))}
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-12 px-6 py-4 border-t border-gray-50"
              >
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-6 w-11 bg-gray-100 rounded-full animate-pulse"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case "deal":
        return "💼";
      case "contact":
        return "👤";
      case "account":
        return "🏢";
      default:
        return "🔐";
    }
  };

  const filteredRecords = records.filter((r) => {
    const search = (searchTerm || "").toLowerCase().trim();

    if (!search) return true; // show all when empty

    // Match record name
    const matchRecord = (r.name || "").toLowerCase().includes(search);

    // Match ONLY assigned users for this record
    const matchUser = users.some((u) => {
      const isAssigned = !!r.assignments?.[u.id];
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();

      return (
        isAssigned &&
        (name.includes(search) ||
          email.includes(search) ||
          role.includes(search))
      );
    });
    return matchRecord || matchUser;
  });

  /* ─── MAIN RENDER ─── */
  return (
    <div className="w-full h-full flex flex-col bg-white font-sans">
      {/* ═══ HEADER ═══ */}
      <div className="shrink-0 px-4 sm:px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-200 flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white text-sm">{getIcon()}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900 leading-tight">
                  Manage {type} permissions
                </h2>
                {records.length > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold tabular-nums">
                    {records.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                Assign or revoke access for each user across{" "}
                {type.toLowerCase()} records
              </p>
            </div>
          </div>

          {users.length > 0 && (
            <div className="hidden sm:flex items-center -space-x-1.5 mt-1">
              {users.slice(0, 4).map((u, i) => (
                <div
                  key={u.id}
                  className={`w-7 h-7 rounded-full ${palette[i % palette.length]} flex items-center justify-center ring-2 ring-white`}
                  title={u.name}
                >
                  <span className="text-[9px] font-bold text-white">
                    {getInitials(u.name)}
                  </span>
                </div>
              ))}
              {users.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white">
                  <span className="text-[9px] font-semibold text-gray-500">
                    +{users.length - 4}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            width="15"
            height="15"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={searchTerm} // *
            onChange={(e) => setSearchTerm(e.target.value)} // *
            placeholder={`Search ${type.toLowerCase()} or user...`}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 focus:bg-white
              transition-all duration-150"
          />
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 overflow-auto overscroll-contain">
        {filteredRecords.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center h-full min-h-[320px] px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                className="text-gray-300"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 9h6M9 12h6M9 15h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No {type.toLowerCase()} records
            </h3>
            <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
              There are no {type.toLowerCase()} records available. Try adjusting
              your filters or create a new one.
            </p>
          </div>
        ) : (
          <>
            {/* ═══════ MOBILE: Card Layout ═══════ */}
            <div className="md:hidden p-4 space-y-3 pb-8">
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
                >
                  {/* Card title bar */}
                  <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-[13px] font-semibold text-gray-900 truncate">
                      {r.name}
                    </span>
                  </div>

                  {/* User rows */}
                  <div className="divide-y divide-gray-100">
                    {users.map((u, ui) => {
                      const assigned = !!r.assignments?.[u.id];
                      const isToggling = toggleLoadingMap?.[`${r.id}_${u.id}`];
                      return (
                        <div
                          key={u.id}
                          className="flex items-center justify-between px-4 py-3 active:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full ${palette[ui % palette.length]} flex items-center justify-center shrink-0`}
                            >
                              <span className="text-[11px] font-bold text-white leading-none">
                                {getInitials(u.name)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-gray-900 truncate leading-tight">
                                {u.name}
                              </p>
                              <div className="mt-0.5">
                                <RoleBadge role={u.role} />
                              </div>
                            </div>
                          </div>
                          <Toggle
                            assigned={assigned}
                            toggling={isToggling}
                            onToggle={() =>
                              dispatch(
                                toggleAssignment({
                                  type,
                                  recordId: r.id,
                                  userId: u.id,
                                  assigned: !assigned,
                                }),
                              )
                            }
                            label={`Toggle ${u.name} access for ${r.name}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ═══════ DESKTOP: Table Layout ═══════ */}
            <div className="hidden md:block p-6">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="sticky left-0 z-20 bg-gray-50 text-left px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-52 min-w-[200px] border-r border-gray-100">
                          {type} Name
                        </th>
                        {users.map((u, ui) => (
                          <th
                            key={u.id}
                            className="px-5 py-4 text-center min-w-[130px]"
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <div
                                className={`w-9 h-9 rounded-full ${palette[ui % palette.length]} flex items-center justify-center shadow-sm`}
                              >
                                <span className="text-xs font-bold text-white">
                                  {getInitials(u.name)}
                                </span>
                              </div>
                              <span className="text-[13px] font-semibold text-gray-800 leading-tight">
                                {u.name}
                              </span>
                              <RoleBadge role={u.role} />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map((r, ri) => (
                        <tr
                          key={r.id}
                          className={`group transition-colors duration-100 hover:bg-blue-50/30 ${
                            ri % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <td className="sticky left-0 z-10 bg-inherit px-6 py-3.5 border-b border-r border-gray-100 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                              <span className="text-[13px] font-medium text-gray-800">
                                {r.name}
                              </span>
                            </div>
                          </td>
                          {users.map((u) => {
                            const assigned = !!r.assignments?.[u.id];
                            const isToggling =
                              toggleLoadingMap?.[`${r.id}_${u.id}`];
                            return (
                              <td
                                key={u.id}
                                className="text-center py-3.5 px-5 border-b border-gray-100"
                              >
                                <Toggle
                                  assigned={assigned}
                                  toggling={isToggling}
                                  onToggle={() =>
                                    dispatch(
                                      toggleAssignment({
                                        type,
                                        recordId: r.id,
                                        userId: u.id,
                                        assigned: !assigned,
                                      }),
                                    )
                                  }
                                  label={`Toggle ${u.name} access for ${r.name}`}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
