import { Link } from "react-router-dom";
import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";
import { CalendarIcon } from "@heroicons/react/24/outline";

const DealsClosingSoon = ({ deals }) => {
  if (!deals || deals.length === 0) {
    return (
      <div className="card">
        <h3 className="section-title mb-4">Deals Closing This Month</h3>
        <div className="text-center py-8">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No deals closing this month</p>
        </div>
      </div>
    );
  }

  const today = new Date();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title">Deals Closing This Month</h3>
        <span className="badge-blue">{deals.length} deals</span>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => {
          const closingDate = new Date(deal.closingDate);
          const daysLeft = Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));
          const isOverdue = daysLeft < 0;
          const isUrgent = daysLeft <= 7 && daysLeft >= 0;

          return (
            <Link
              key={deal.id}
              to={`/deals/${deal.id}`}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate group-hover:text-blue-700">
                    {deal.dealName}
                  </p>
                  <span className={`badge text-[10px] ${STAGE_COLORS[deal.stage]}`}>
                    {formatLabel(deal.stage)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {deal.account?.accountName} · {deal.owner?.name}
                </p>
              </div>

              <div className="text-right ml-4 flex-shrink-0">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(deal.amount)}
                </p>
                <p
                  className={`text-xs font-medium ${
                    isOverdue
                      ? "text-red-600"
                      : isUrgent
                      ? "text-amber-600"
                      : "text-gray-500"
                  }`}
                >
                  {isOverdue
                    ? `${Math.abs(daysLeft)} days overdue`
                    : daysLeft === 0
                    ? "Closing today"
                    : `${daysLeft} days left`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <Link
        to="/deals"
        className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-4 border-t border-gray-100"
      >
        View all deals →
      </Link>
    </div>
  );
};

export default DealsClosingSoon;