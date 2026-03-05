import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopRiskDeals } from "./dealRiskSlice";
import RiskBadge from "../../components/badges/RiskBadge";
import { useNavigate } from "react-router-dom";

const levelConfig = {
  LOW: { label: "Low-Risk Deals", color: "text-green-600" },
  MEDIUM: { label: "Medium-Risk Deals", color: "text-yellow-600" },
  HIGH: { label: "High-Risk Deals", color: "text-orange-600" },
  CRITICAL: { label: "Critical-Risk Deals", color: "text-red-600" },
};

export default function DealRiskPanel({ level = "HIGH" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topRiskDeals, loading, error } = useSelector(
    (state) => state.dealRisk
  );

  useEffect(() => {
    dispatch(fetchTopRiskDeals(level));
  }, [dispatch, level]);

  const config = levelConfig[level] || levelConfig.HIGH;

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
        Loading risky deals…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className={`text-sm font-semibold ${config.color}`}>
            {config.label}
          </h3>
          <span className="text-[11px] text-gray-500">
            Top {topRiskDeals.length} deals
          </span>
        </div>
      </div>

      {/* ================= LIST ================= */}
      {topRiskDeals.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
          No risky deals at the moment 🎉
        </div>
      ) : (
        <ul className="space-y-3">
          {topRiskDeals.map((item) => (
            <li
              key={item.id}
              className="group cursor-pointer rounded-lg border p-3 transition hover:shadow-md hover:bg-gray-50"
              onClick={() => navigate(`/deals/${item.deal.id}`)}
            >
              <div className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    {item.deal.dealName}
                  </span>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="rounded bg-gray-100 px-2 py-[2px]">
                      {item.deal.stage}
                    </span>

                    {item.deal.amount && (
                      <span>
                        ₹{item.deal.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <RiskBadge
                  level={item.riskLevel}
                  score={item.score}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}