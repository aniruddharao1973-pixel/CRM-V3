// // src\features\dashboard\components\LeadSourceChart.jsx
// import {  formatLabel } from "../../../constants";

// const COLORS = [
//   "bg-blue-500",
//   "bg-green-500",
//   "bg-purple-500",
//   "bg-amber-500",
//   "bg-pink-500",
//   "bg-indigo-500",
//   "bg-teal-500",
//   "bg-red-500",
// ];

// const LeadSourceChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Deals by Lead Source</h3>
//         <p className="text-gray-400 text-sm text-center py-8">No data available</p>
//       </div>
//     );
//   }

//   const totalDeals = data.reduce((sum, d) => sum + d.totalDeals, 0);

//   return (
//     <div className="card">
//       <h3 className="section-title mb-4">Deals by Lead Source</h3>

//       {/* Horizontal bar chart */}
//       <div className="space-y-3">
//         {data.slice(0, 6).map((item, index) => {
//           const percentage = totalDeals > 0 ? (item.totalDeals / totalDeals) * 100 : 0;

//           return (
//             <div key={item.source} className="group">
//               <div className="flex items-center justify-between mb-1">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-3 h-3 rounded-full ${COLORS[index % COLORS.length]}`} />
//                   <span className="text-sm text-gray-700">
//                     {formatLabel(item.source)}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs text-gray-500">
//                     {item.totalDeals} deals
//                   </span>
//                   <span className="text-sm font-semibold text-gray-900 w-16 text-right">
//                     {percentage.toFixed(1)}%
//                   </span>
//                 </div>
//               </div>
//               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className={`h-full rounded-full transition-all duration-500 ${COLORS[index % COLORS.length]}`}
//                   style={{ width: `${percentage}%` }}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Summary */}
//       <div className="mt-4 pt-4 border-t border-gray-100">
//         <div className="flex items-center justify-between text-sm">
//           <span className="text-gray-500">Best performing source:</span>
//           <span className="font-semibold text-gray-900">
//             {formatLabel(data[0]?.source)} ({data[0]?.winRate}% win rate)
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadSourceChart;

// src\features\dashboard\components\LeadSourceChart.jsx
import { formatLabel } from "../../../constants";

const COLORS = [
  {
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  {
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    text: "text-violet-600",
    badge: "bg-violet-50 text-violet-600 ring-violet-100",
  },
  {
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    text: "text-amber-600",
    badge: "bg-amber-50 text-amber-600 ring-amber-100",
  },
  {
    bar: "bg-pink-500",
    dot: "bg-pink-500",
    text: "text-pink-600",
    badge: "bg-pink-50 text-pink-600 ring-pink-100",
  },
  {
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
    text: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  },
  {
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    text: "text-teal-600",
    badge: "bg-teal-50 text-teal-600 ring-teal-100",
  },
  {
    bar: "bg-red-500",
    dot: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-50 text-red-600 ring-red-100",
  },
];

const LeadSourceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h3 className="text-sm font-semibold tracking-tight text-gray-800">
          Deals by Lead Source
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📊
          </div>
          <p className="text-sm font-medium text-gray-500">No data available</p>
          <p className="mt-1 text-xs text-gray-400">
            Lead source stats will appear here.
          </p>
        </div>
      </div>
    );
  }

  const totalDeals = data.reduce((sum, d) => sum + d.totalDeals, 0);
  const topSource = data[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]">
      {/* ─── Header ─── */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold tracking-tight text-gray-800">
          Deals by Lead Source
        </h3>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {totalDeals} total deal{totalDeals !== 1 ? "s" : ""} ·{" "}
          {data.slice(0, 6).length} sources
        </p>
      </div>

      {/* ─── Bar chart ─── */}
      <div className="space-y-3.5">
        {data.slice(0, 6).map((item, index) => {
          const percentage =
            totalDeals > 0 ? (item.totalDeals / totalDeals) * 100 : 0;
          const color = COLORS[index % COLORS.length];

          return (
            <div key={item.source} className="group">
              {/* Label row */}
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${color.dot}`}
                  />
                  <span className="truncate text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {formatLabel(item.source)}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] tabular-nums text-gray-400">
                    {item.totalDeals} deal{item.totalDeals !== 1 ? "s" : ""}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset tabular-nums ${color.badge}`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${color.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Summary footer ─── */}
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Best source
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
            {formatLabel(topSource?.source)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Win rate
          </p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-emerald-600">
            {topSource?.winRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadSourceChart;
