import {  formatIndianNumber } from "../../../constants";
import Avatar from "../../../components/Avatar";

const TopPerformers = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Top Performers</h3>
        <p className="text-gray-400 text-sm text-center py-8">No data available</p>
      </div>
    );
  }

  const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

  return (
    <div className="card">
      <h3 className="section-title mb-4">Top Sales Performers</h3>

      <div className="space-y-4">
        {data.map((performer, index) => (
          <div
            key={performer.user?.id}
            className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-center">
              {index < 3 ? (
                <span className={`text-2xl ${medalColors[index]}`}>
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
              ) : (
                <span className="text-lg font-bold text-gray-400">
                  #{index + 1}
                </span>
              )}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar
                name={performer.user?.name}
                image={performer.user?.avatar}
                size="md"
              />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {performer.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {performer.wonDeals} deals won · {performer.winRate}% win rate
                </p>
              </div>
            </div>

            {/* Revenue */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-green-600">
                {formatIndianNumber(performer.wonAmount)}
              </p>
              <p className="text-xs text-gray-500">
                {performer.totalDeals} total
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;