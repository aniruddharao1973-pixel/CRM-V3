import {  formatLabel } from "../../../constants";

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-red-500",
];

const LeadSourceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Deals by Lead Source</h3>
        <p className="text-gray-400 text-sm text-center py-8">No data available</p>
      </div>
    );
  }

  const totalDeals = data.reduce((sum, d) => sum + d.totalDeals, 0);

  return (
    <div className="card">
      <h3 className="section-title mb-4">Deals by Lead Source</h3>

      {/* Horizontal bar chart */}
      <div className="space-y-3">
        {data.slice(0, 6).map((item, index) => {
          const percentage = totalDeals > 0 ? (item.totalDeals / totalDeals) * 100 : 0;

          return (
            <div key={item.source} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${COLORS[index % COLORS.length]}`} />
                  <span className="text-sm text-gray-700">
                    {formatLabel(item.source)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {item.totalDeals} deals
                  </span>
                  <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${COLORS[index % COLORS.length]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Best performing source:</span>
          <span className="font-semibold text-gray-900">
            {formatLabel(data[0]?.source)} ({data[0]?.winRate}% win rate)
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeadSourceChart;