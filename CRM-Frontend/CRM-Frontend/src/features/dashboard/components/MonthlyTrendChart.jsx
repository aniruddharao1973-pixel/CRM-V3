import {  formatIndianNumber } from "../../../constants";

const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Monthly Revenue Trend</h3>
        <p className="text-gray-400 text-sm text-center py-8">No data available</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.wonRevenue || 0), 1);

  return (
    <div className="card">
      <h3 className="section-title mb-4">Monthly Revenue Trend</h3>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-48 mb-4">
        {data.map((item, index) => {
          const height = maxRevenue > 0 ? (item.wonRevenue / maxRevenue) * 100 : 0;

          return (
            <div key={index} className="flex-1 flex flex-col items-center group">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-center">
                <p className="text-xs font-semibold text-gray-900">
                  {formatIndianNumber(item.wonRevenue)}
                </p>
                <p className="text-[10px] text-gray-500">
                  {item.wonCount} deals
                </p>
              </div>

              {/* Bar */}
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 min-h-[4px]"
                style={{ height: `${Math.max(height, 2)}%` }}
              />

              {/* Label */}
              <p className="text-xs text-gray-500 mt-2">{item.month}</p>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">
            {formatIndianNumber(data.reduce((sum, d) => sum + d.wonRevenue, 0))}
          </p>
          <p className="text-xs text-gray-500">Total Won</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">
            {data.reduce((sum, d) => sum + d.newDeals, 0)}
          </p>
          <p className="text-xs text-gray-500">New Deals</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.wonCount, 0)}
          </p>
          <p className="text-xs text-gray-500">Deals Won</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendChart;