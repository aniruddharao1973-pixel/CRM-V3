// import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";

// const StageChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Deals by Stage</h3>
//         <p className="text-gray-400 text-sm text-center py-8">No data available</p>
//       </div>
//     );
//   }

//   const maxAmount = Math.max(...data.map((d) => d.amount || 0), 1);
//   const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="section-title">Deals by Stage</h3>
//         <span className="text-sm text-gray-500">{totalDeals} total deals</span>
//       </div>

//       <div className="space-y-3">
//  {data.map((item) => {
//   const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;

//   const stageColor = STAGE_COLORS[item.stage] || {
//     bg: "bg-gray-50",
//     text: "text-gray-700",
//     dot: "bg-gray-500",
//   };

//   return (
//     <div key={item.stage} className="group">
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center gap-2">
//           <span className={`badge text-[10px] ${stageColor.bg} ${stageColor.text}`}>
//             {item.count}
//           </span>

//           <span className="text-sm text-gray-700">
//             {formatLabel(item.stage)}
//           </span>
//         </div>

//         <span className="text-sm font-semibold text-gray-900">
//           {formatCurrency(item.amount)}
//         </span>
//       </div>

//       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${stageColor.dot}`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// })}
//       </div>
//     </div>
//   );
// };


// export default StageChart;
import { formatLabel, STAGE_COLORS } from "../../../constants";

const StageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Deals by Stage</h3>
        <p className="text-gray-400 text-sm text-center py-8">
          No data available
        </p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title">My Pipeline Deals By Stage</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="text-lg font-semibold text-gray-800">
            {totalDeals}
          </span>
        </div>
      </div>

      <div className="relative flex flex-col items-center py-4">
        {data.map((item, index) => {
          const widthPercentage = (item.count / maxCount) * 100;
          const percentOfTotal = ((item.count / totalDeals) * 100).toFixed(1);

          const stageColor = STAGE_COLORS[item.stage] || {
            dot: "bg-gray-400",
          };

          return (
            <div
              key={item.stage}
              className="relative group w-full flex flex-col items-center"
            >
              {/* Funnel Block Container */}
              <div className="relative w-full flex justify-center">
                {/* Funnel Block */}
                <div
                  className={`
                    transition-all duration-500 ease-out
                    ${stageColor.dot}
                    hover:brightness-110 hover:scale-105
                    cursor-pointer
                    shadow-md hover:shadow-lg
                    relative overflow-hidden
                  `}
                  style={{
                    width: `${Math.max(widthPercentage, 20)}%`,
                    height: "55px",
                    clipPath:
                      index === 0
                        ? "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)"
                        : index === data.length - 1
                        ? "polygon(10% 0%, 90% 0%, 70% 100%, 30% 100%)"
                        : "polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)",
                  }}
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
                </div>

                {/* Stage Label & Count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-semibold text-gray-900 drop-shadow-sm">
                    {formatLabel(item.stage)}
                  </span>
                  <span className="text-lg font-bold text-gray-900 drop-shadow-sm">
                    {item.count}
                  </span>
                </div>

                {/* Percentage Badge */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
                  <span className="text-xs font-medium text-gray-600">
                    {percentOfTotal}%
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-gray-900 text-white shadow-xl rounded-lg px-4 py-2 text-xs z-20 min-w-[160px]">
                <div className="font-semibold text-sm mb-1">
                  {formatLabel(item.stage)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Deals:</span>
                  <span className="font-bold">{item.count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Percentage:</span>
                  <span className="font-bold">{percentOfTotal}%</span>
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageChart;