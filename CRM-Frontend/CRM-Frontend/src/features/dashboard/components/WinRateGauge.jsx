const WinRateGauge = ({ winRate, wonDeals, lostDeals, openDeals }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  return (
    <div className="card">
      <h3 className="section-title mb-4">Win Rate</h3>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={winRate >= 50 ? "#10b981" : winRate >= 30 ? "#f59e0b" : "#ef4444"}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{winRate}%</span>
            <span className="text-xs text-gray-500">Win Rate</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        <div className="text-center p-2 rounded-lg bg-green-50">
          <p className="text-lg font-bold text-green-600">{wonDeals}</p>
          <p className="text-xs text-green-700">Won</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-red-50">
          <p className="text-lg font-bold text-red-600">{lostDeals}</p>
          <p className="text-xs text-red-700">Lost</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-blue-50">
          <p className="text-lg font-bold text-blue-600">{openDeals}</p>
          <p className="text-xs text-blue-700">Open</p>
        </div>
      </div>
    </div>
  );
};

export default WinRateGauge;