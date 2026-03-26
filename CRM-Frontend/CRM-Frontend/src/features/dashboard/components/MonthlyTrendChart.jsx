// // src\features\dashboard\components\MonthlyTrendChart.jsx
// import { formatIndianNumber } from "../../../constants";

// const MonthlyTrendChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Monthly Revenue Trend</h3>
//         <p className="text-gray-400 text-sm text-center py-8">
//           No data available
//         </p>
//       </div>
//     );
//   }

//   const maxRevenue = Math.max(...data.map((d) => d.wonRevenue || 0), 1);

//   return (
//     <div className="card">
//       <h3 className="section-title mb-4">Monthly Revenue Trend</h3>

//       {/* Chart */}
//       <div className="flex items-end justify-between gap-2 h-48 mb-4">
//         {data.map((item, index) => {
//           const height =
//             maxRevenue > 0 ? (item.wonRevenue / maxRevenue) * 100 : 0;

//           return (
//             <div
//               key={index}
//               className="flex-1 flex flex-col items-center group"
//             >
//               {/* Tooltip */}
//               <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-center">
//                 <p className="text-xs font-semibold text-gray-900">
//                   {formatIndianNumber(item.wonRevenue)}
//                 </p>
//                 <p className="text-[10px] text-gray-500">
//                   {item.wonCount} deals
//                 </p>
//               </div>

//               {/* Bar */}
//               <div
//                 className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 min-h-[4px]"
//                 style={{ height: `${Math.max(height, 2)}%` }}
//               />

//               {/* Label */}
//               <p className="text-xs text-gray-500 mt-2">{item.month}</p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Summary */}
//       <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
//         <div className="text-center">
//           <p className="text-lg font-bold text-green-600">
//             {formatIndianNumber(data.reduce((sum, d) => sum + d.wonRevenue, 0))}
//           </p>
//           <p className="text-xs text-gray-500">Total Won</p>
//         </div>
//         <div className="text-center">
//           <p className="text-lg font-bold text-blue-600">
//             {data.reduce((sum, d) => sum + d.newDeals, 0)}
//           </p>
//           <p className="text-xs text-gray-500">New Deals</p>
//         </div>
//         <div className="text-center">
//           <p className="text-lg font-bold text-gray-900">
//             {data.reduce((sum, d) => sum + d.wonCount, 0)}
//           </p>
//           <p className="text-xs text-gray-500">Deals Won</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MonthlyTrendChart;

// src\features\dashboard\components\MonthlyTrendChart.jsx
import { formatIndianNumber } from "../../../constants";

const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Revenue
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-6">
          Monthly Revenue Trend
        </h3>
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 17l4-4 4 4 4-6 4 2"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">No trend data</p>
          <p className="text-xs text-gray-300">
            Revenue data will appear here once available
          </p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.wonRevenue || 0), 1);
  const totalWon = data.reduce((sum, d) => sum + d.wonRevenue, 0);
  const totalNewDeals = data.reduce((sum, d) => sum + d.newDeals, 0);
  const totalWonCount = data.reduce((sum, d) => sum + d.wonCount, 0);

  const summaryStats = [
    {
      value: formatIndianNumber(totalWon),
      label: "Total Won",
      valueColor: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      dot: "bg-emerald-400",
    },
    {
      value: totalNewDeals,
      label: "New Deals",
      valueColor: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      dot: "bg-blue-400",
    },
    {
      value: totalWonCount,
      label: "Deals Won",
      valueColor: "text-gray-800",
      bg: "bg-gray-50",
      border: "border-gray-200",
      dot: "bg-gray-400",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Revenue
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
          Monthly Revenue Trend
        </h3>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-44 sm:h-52 mb-2">
        {data.map((item, index) => {
          const height =
            maxRevenue > 0 ? (item.wonRevenue / maxRevenue) * 100 : 0;
          const isMax = item.wonRevenue === maxRevenue;

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group relative"
            >
              {/* Hover tooltip */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-xl px-3 py-2 text-center shadow-xl min-w-[90px]">
                  <p className="text-xs font-bold text-white leading-tight">
                    {formatIndianNumber(item.wonRevenue)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {item.wonCount} deals
                  </p>
                  {/* Arrow */}
                  <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 rotate-45 rounded-sm" />
                </div>
              </div>

              {/* Bar */}
              <div className="w-full flex items-end" style={{ height: "100%" }}>
                <div
                  className={`
                    w-full rounded-t-lg transition-all duration-500
                    ${
                      isMax
                        ? "bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                        : "bg-gradient-to-t from-blue-400/70 to-blue-300/70 hover:from-blue-500/80 hover:to-blue-400/80"
                    }
                    hover:brightness-110 cursor-pointer
                  `}
                  style={{
                    height: `${Math.max(height, 2)}%`,
                    minHeight: "4px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Month labels */}
      <div className="flex justify-between gap-1.5 sm:gap-2 mb-6">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex justify-center">
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">
              {item.month}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-5" />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {summaryStats.map(({ value, label, valueColor, bg, border, dot }) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border ${bg} ${border} transition-all duration-200 hover:brightness-95`}
          >
            <p
              className={`text-base sm:text-lg font-bold tabular-nums leading-tight ${valueColor}`}
            >
              {value}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}
              />
              <p className="text-xs text-gray-400 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyTrendChart;
