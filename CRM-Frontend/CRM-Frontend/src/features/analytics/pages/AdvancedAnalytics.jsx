// CRM-Frontend-main\src\features\analytics\pages\AdvancedAnalytics.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardAnalytics,
  fetchDealsBySource,
  fetchKpiMetrics,
} from "../analyticsSlice";
import API from "../../../api/axios";
import { askAnalyticsAI } from "../../../api/aiApi";
import KpiCalculationTooltip from "../KpiCalculationTooltip";

/* ───────────────── CONSTANTS ───────────────── */

const STAGE_COLORS = {
  RFQ: "#6366f1", // indigo
  VISIT_MEETING: "#f43f5e", // rose
  PREVIEW: "#10b981", // emerald
  TECHNICAL_PROPOSAL: "#f59e0b", // amber
  COMMERCIAL_PROPOSAL: "#ef4444", // red
  REVIEW_FEEDBACK: "#0ea5e9", // sky
  MOVED_TO_PURCHASE: "#6366f1", // violet
  NEGOTIATION: "#14b8a6", // teal

  CLOSED_WON: "#22c55e", // ✅ GREEN
  CLOSED_LOST: "#ef4444", // ✅ RED
  CLOSED_LOST_TO_COMPETITION: "#a855f7",
  REGRETTED: "#78716c",
};

// const FUNNEL_COLORS = [
//   "#ef4444",
//   "#f59e0b",
//   "#10b981",
//   "#0ea5e9",
//   "#6366f1",
//   "#8b5cf6",
// ];

const STAGE_ORDER = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
  "REGRETTED",
];

const RISK_CONFIG = {
  HIGH: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-400",
    bar: "#f87171",
  },
  MEDIUM: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
    bar: "#f59e0b",
  },
  LOW: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-400",
    bar: "#10b981",
  },
};

/* ───────────────── SPINNER ───────────────── */

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg className="h-8 w-8 animate-spin text-indigo-500" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="opacity-20"
        />
        <path
          fill="currentColor"
          className="opacity-80"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      {/* FONT: text-sm → text-base */}
      <span className="text-base text-slate-400 tracking-wide">
        Loading analytics…
      </span>
    </div>
  );
}

/* ───────────────── DONUT ───────────────── */

function DonutChart({ data }) {
  const radius = 15.915;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;

  return (
    <div className="relative flex-shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 42 42" className="w-44 h-44 -rotate-90 drop-shadow-md">
        <circle
          cx="21"
          cy="21"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="4"
          fill="none"
        />
        {data.map((d, i) => {
          if (!d.count) return null;
          const dash = total > 0 ? (d.count / total) * circumference : 0;
          const gap = circumference - dash;
          const color = STAGE_COLORS[d.stage] || "#94a3b8";
          const el = (
            <circle
              key={d.stage}
              cx="21"
              cy="21"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="4.5"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dasharray 0.6s ease",
                filter: `drop-shadow(0 0 2px ${color}80)`,
              }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Total
        </span>
        <span className="text-4xl font-black text-slate-800 leading-tight">
          {total}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5">deals</span>
      </div>
    </div>
  );
}
/* ───────────────── KPI CARD ───────────────── */

function KPICard({ label, value, subtitle, accent, icon, trend, calculation }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="
group relative overflow-visible rounded-2xl 
bg-white border border-slate-100 p-7
shadow-sm hover:shadow-xl
transition-all duration-300
hover:-translate-y-1
hover:border-slate-200
"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>

        {trend !== undefined && (
          <span
            className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* <p className="text-sm uppercase tracking-widest text-slate-400 font-medium mb-1">
        {label}
      </p> */}
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm uppercase tracking-widest text-slate-400 font-medium">
          {label}
        </p>

        {calculation && (
          <div className="relative z-20">
            <button
              onClick={() => setOpen(!open)}
              className="
        flex items-center justify-center
        w-4 h-4 rounded-full
        bg-indigo-100 text-indigo-600
        text-[10px] font-bold
        hover:bg-indigo-200
        transition
        "
            >
              i
            </button>

            <KpiCalculationTooltip open={open} onClose={() => setOpen(false)}>
              {calculation}
            </KpiCalculationTooltip>
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-slate-800 leading-none">{value}</p>
      {subtitle && <p className="text-base text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

/* ───────────────── CARD ───────────────── */

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="px-8 pt-7 pb-0">
        {/* FONT: text-base → text-lg */}
        <p className="font-semibold text-slate-800 text-lg">{title}</p>
        {subtitle && (
          // FONT: text-sm → text-base
          <p className="text-base text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

/* ───────────────── STAGE LEGEND ───────────────── */

function StageLegend({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const activeData = data.filter((s) => s.count > 0);
  const half = Math.ceil(data.length / 2);
  const leftCol = data.slice(0, half);
  const rightCol = data.slice(half);

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-0">
      {[leftCol, rightCol].map((col, colIdx) => (
        <div
          key={colIdx}
          className={colIdx === 1 ? "border-l border-slate-100 pl-3" : ""}
        >
          {col.map((s, i) => {
            const globalIdx = colIdx === 0 ? i : half + i;
            const color = STAGE_COLORS[s.stage] || "#94a3b8";
            const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
            return (
              <div
                key={s.stage}
                className="flex items-center gap-2 py-2 group hover:bg-slate-50 rounded-lg px-1.5 transition cursor-pointer"
              >
                {/* Color dot with glow */}
                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{
                    background: color,
                    boxShadow: s.count > 0 ? `0 0 5px ${color}70` : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium leading-tight truncate ${s.count > 0 ? "text-slate-700" : "text-slate-400"}`}
                    >
                      {s.stage.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-xs font-bold ml-1 flex-shrink-0 ${s.count > 0 ? "text-slate-800" : "text-slate-300"}`}
                    >
                      {s.count}
                    </span>
                  </div>
                  {/* Mini bar */}
                  {s.count > 0 && (
                    <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ───────────────── VISUAL FUNNEL ───────────────── */

function VisualFunnel({ data }) {
  if (!data || data.length === 0)
    return (
      <p className="text-base text-slate-400 text-center py-8">
        No funnel data available
      </p>
    );

  // enforce pipeline order instead of sorting by count
  // sort by count DESC (2 → 2 → 1 → 1)
  const ordered = STAGE_ORDER.map((stage) =>
    data.find((d) => d.stage === stage),
  ).filter((s) => s && s.count > 0);

  const maxCount = Math.max(...ordered.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-1 w-full">
      {ordered.map((s, i) => {
        if (s.count === 0) return null;
        const pct = Math.round((s.count / maxCount) * 100);
        const minWidth = 42;
        const width = minWidth + ((100 - minWidth) * pct) / 100;
        const color = STAGE_COLORS[s.stage] || "#6366f1";
        const isLast = i === ordered.length - 1;

        return (
          <div key={s.stage} className="flex flex-col items-center">
            <div
              className="relative flex items-center justify-center transition-all duration-500 hover:brightness-110 cursor-pointer"
              style={{
                width: `${width}%`,
                height: "54px",
                background: `linear-gradient(135deg, ${color}f0, ${color}aa)`,
                clipPath: isLast
                  ? "polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)"
                  : "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)",
                boxShadow: `0 4px 18px ${color}35`,
              }}
            >
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 55%)",
                }}
              />
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-white font-black text-lg drop-shadow-sm">
                  {s.count}
                </span>
                <span className="text-white/85 text-xs font-semibold uppercase tracking-wider drop-shadow-sm">
                  {s.stage.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {!isLast && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderTop: `9px solid ${color}80`,
                  marginTop: "-1px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────── FUNNEL LEGEND ───────────────── */

function FunnelLegend({ data }) {
  // enforce pipeline order instead of sorting by count
  // sort by count DESC
  const ordered = STAGE_ORDER.map((stage) =>
    data.find((d) => d.stage === stage),
  ).filter((s) => s && s.count > 0);

  const maxCount = Math.max(...ordered.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {ordered.map((s, i) => {
        const color = STAGE_COLORS[s.stage] || "#6366f1";
        const barPct = (s.count / maxCount) * 100;

        return (
          <div
            key={s.stage}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer group"
          >
            {/* Color indicator */}
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
            />

            {/* Stage info + bar */}
            <div className="flex-1 min-w-0">
              <div className="relative z-20 flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">
                  {s.stage.replace(/_/g, " ")}
                </span>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span className="text-sm font-bold text-slate-800">
                    {s.count}
                  </span>
                  <span className="text-xs text-slate-400">
                    · {s.conversion.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${color}99, ${color})`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
/* ───────────────── VELOCITY LINE CHART ───────────────── */

function VelocityLineChart({ data, onStageClick }) {
  if (!data || data.length === 0)
    return (
      // FONT: text-sm → text-base
      <p className="text-base text-slate-400 text-center py-8">
        No velocity data
      </p>
    );

  const SVG_W = 560;
  const SVG_H = 400;
  const PAD_L = 36;
  const PAD_R = 16;
  const PAD_T = 36;
  const PAD_B = 120;

  const chartW = SVG_W - PAD_L - PAD_R;
  const chartH = SVG_H - PAD_T - PAD_B;

  const maxDays = Math.max(...data.map((d) => d.avgDays), 1);
  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const pts = data.map((d, i) => ({
    x: PAD_L + (data.length > 1 ? i * xStep : chartW / 2),
    y: PAD_T + chartH - (d.avgDays / maxDays) * chartH,
    ...d,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = [
    ...pts.map(
      (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
    ),
    `L${pts[pts.length - 1].x},${PAD_T + chartH}`,
    `L${pts[0].x},${PAD_T + chartH}`,
    "Z",
  ].join(" ");

  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, k) => ({
    y: PAD_T + chartH - (k / gridCount) * chartH,
    val: Math.round((k / gridCount) * maxDays),
  }));

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full"
      style={{ maxHeight: 460, display: "block" }}
    >
      <defs>
        <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#6366f1" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Y-axis grid lines + labels */}
      {gridLines.map((g) => (
        <g key={g.y}>
          <line
            x1={PAD_L}
            y1={g.y.toFixed(1)}
            x2={SVG_W - PAD_R}
            y2={g.y.toFixed(1)}
            stroke="#e2e8f0"
            strokeWidth="0.7"
          />
          {/* FONT: 11 → 13 */}
          <text
            x={PAD_L - 10}
            y={g.y + 3.5}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="13"
            fontFamily="DM Sans,Inter,sans-serif"
          >
            {g.val}d
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#velGrad)" />

      {/* Line stroke */}
      <path
        d={linePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Points, value labels, x-axis labels */}
      {pts.map((p, i) => (
        <g
          key={p.stage}
          className="cursor-pointer"
          onClick={() => onStageClick && onStageClick(p.stage)}
        >
          <line
            x1={p.x.toFixed(1)}
            y1={PAD_T + chartH}
            x2={p.x.toFixed(1)}
            y2={PAD_T + chartH + 4}
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />

          {/* Stage label — rotated so it doesn't overlap */}
          <text
            x={p.x}
            y={PAD_T + chartH + 14}
            textAnchor="end"
            fill="#64748b"
            fontSize="11"
            fontWeight="500"
            fontFamily="DM Sans,Inter,sans-serif"
            transform={`rotate(-45 ${p.x} ${PAD_T + chartH + 14})`}
          >
            {p.stage.replace(/_/g, " ")}
          </text>

          {/* Dot outer glow ring */}
          <circle
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="7"
            fill="#6366f1"
            opacity="0.12"
          />
          {/* Dot */}
          <circle
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="5"
            fill="#6366f1"
            stroke="white"
            strokeWidth="2"
          />

          {/* FONT: 10 → 13 */}
          <text
            x={p.x}
            y={p.y - 14}
            textAnchor="middle"
            fill="#4f46e5"
            fontSize="13"
            fontWeight="700"
            fontFamily="DM Sans,Inter,sans-serif"
          >
            {p.avgDays}d
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ───────────────── MAIN ───────────────── */

export default function AdvancedAnalytics() {
  const dispatch = useDispatch();
  const { loading, error, dashboard, kpis, dealsBySource } = useSelector(
    (state) => state.analytics,
  );

  // const safeDashboard = dashboard || {
  //   summary: { totalPipelineValue: 0, averageDealSize: 0 },
  //   deals: { winRate: 0 },
  //   thisMonth: { growth: 0 },
  // };
  // const safeDashboard = {
  //   summary: {
  //     totalPipelineValue: dashboard?.summary?.totalPipelineValue ?? 0,
  //     averageDealSize: dashboard?.summary?.averageDealSize ?? 0,
  //   },
  //   deals: {
  //     winRate: dashboard?.deals?.winRate ?? 0,
  //   },
  //   thisMonth: {
  //     growth: dashboard?.thisMonth?.growth ?? 0,
  //   },
  // };

  const safeDashboard = {
    summary: {
      totalDeals: dashboard?.summary?.totalDeals ?? 0,
      openDeals: dashboard?.summary?.openDeals ?? 0,
      closedDeals: dashboard?.summary?.closedDeals ?? 0,
    },
    performance: {
      winRate: dashboard?.performance?.winRate ?? 0,
    },
  };

  const [cohortData, setCohortData] = useState([]);
  const [expandedSource, setExpandedSource] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [stageAging, setStageAging] = useState([]);
  const [bottleneck, setBottleneck] = useState(null);
  const [stageDistribution, setStageDistribution] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  // 🔥 Drilldown state
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [riskDeals, setRiskDeals] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stageDeals, setStageDeals] = useState([]);
  const [drilldownLoading, setDrilldownLoading] = useState(false);
  // 🔥 AI Insights State
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [insightMode, setInsightMode] = useState("detailed");
  // "detailed" | "quick"

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchDealsBySource());
    dispatch(fetchKpiMetrics());
    loadAll();
  }, [dispatch]);

  async function loadAll() {
    try {
      setAnalyticsLoading(true);
      const [cohort, funnel, risk, aging, stage] = await Promise.all([
        API.get("/analytics/cohort-lead-source"),
        API.get("/analytics/funnel"),
        API.get("/analytics/risk-distribution"),
        API.get("/analytics/stage-aging"),
        API.get("/analytics/deals-by-stage"),
      ]);

      setCohortData(cohort.data.data || []);
      setFunnelData(funnel.data.data || []);
      // ✅ Ensure stable LOW → MEDIUM → HIGH order
      const riskOrder = ["LOW", "MEDIUM", "HIGH"];

      const sortedRisk = [...(risk.data.data || [])].sort(
        (a, b) =>
          riskOrder.indexOf(a.riskLevel) - riskOrder.indexOf(b.riskLevel),
      );

      setRiskDistribution(sortedRisk);

      const agingData = aging.data.data || {};
      setStageAging(agingData.stages || []);
      setBottleneck(agingData.bottleneck || null);

      const orderedStages = STAGE_ORDER.map(
        (s) =>
          stage.data.data.find((x) => x.stage === s) || { stage: s, count: 0 },
      );
      setStageDistribution(orderedStages);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  // 🔥 Fetch deals by risk
  async function loadRiskDeals(risk) {
    try {
      setDrilldownLoading(true);
      setSelectedStage(null); // ✅ ADD
      setStageDeals([]); // ✅ ADD
      setSelectedRisk(risk);
      const res = await API.get(`/analytics/risk-deals?risk=${risk}`);
      setRiskDeals(res.data.data || []);
    } finally {
      setDrilldownLoading(false);
    }
  }

  // 🔥 Fetch deals by stage (velocity drilldown)
  async function loadStageDeals(stage) {
    try {
      setDrilldownLoading(true);
      setSelectedRisk(null); // ✅ ADD
      setRiskDeals([]); // ✅ ADD
      setSelectedStage(stage);
      const res = await API.get(`/analytics/stage-deals?stage=${stage}`);
      setStageDeals(res.data.data || []);
    } finally {
      setDrilldownLoading(false);
    }
  }

  async function generateAIInsights(mode = insightMode) {
    try {
      setAiLoading(true);

      let question = "";

      if (mode === "quick") {
        question = `
You are a CRM executive assistant.

STRICT RULES:
- You MUST return ALL 4 sections.
- NEVER skip any section.
- Each section MUST be exactly ONE sentence.
- Do NOT add extra text.
- Do NOT use bullets, numbering, or markdown.

RETURN EXACTLY THIS FORMAT:

Pipeline Status: <one sentence>
Main Risk: <one sentence>
Immediate Action: <one sentence>
Strategic Recommendation: <one sentence>

If any data is missing, still generate a reasonable sentence.
`;
      } else {
        question = `
Analyze the CRM pipeline using the provided data.

Focus on:
- risk concentration
- stage bottlenecks
- conversion efficiency
- revenue potential
- actionable strategy

Be specific. Avoid generic statements.
`;
      }

      // const answer = await askAnalyticsAI(question);
      const payload = {
        question: question, // ✅ MUST be plain string
        mode: mode || insightMode, // ✅ correct mode
        regenerate: Boolean(aiInsight && aiInsight.length > 20),
        snapshot: {
          totalDeals: safeDashboard.summary.totalDeals,
          openDeals: safeDashboard.summary.openDeals,
          wonDeals: safeDashboard.summary.closedDeals,
          winRate: safeDashboard.performance.winRate,
          monthlyWonAmount: kpis?.revenueWon || 0,
          monthlyWonCount: kpis?.calculation?.wonDeals || 0,
        },
      };

      const answer = await askAnalyticsAI(payload);

      if (!answer || typeof answer !== "string") {
        setAiInsight("Unable to generate insights.");
        return;
      }

      setAiInsight(answer.trim());
    } finally {
      setAiLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      // FONT: text-sm → text-base
      <div className="m-8 rounded-2xl bg-rose-50 border border-rose-200 p-6 text-rose-600 text-base">
        {error}
      </div>
    );
  }

  const totalRisk = riskDistribution.reduce((sum, r) => sum + r._count.id, 0);

  /* ───────────────── UI ───────────────── */

  return (
    <div
      className="min-h-screen bg-slate-50/70"
      style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}
    >
      {/* TOP HEADER */}
      <div className="bg-white border-b border-slate-100 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            {/* FONT: text-lg → text-xl */}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Advanced Analytics
            </h1>
            {/* FONT: text-xs → text-sm */}
            <p className="text-sm text-slate-400 mt-0.5">
              Pipeline intelligence & performance metrics
            </p>
          </div>
          {/* FONT: text-xs → text-sm */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="w-full px-4 py-6 md:px-8 md:py-8 space-y-8">
        {/* ── AI STRATEGIC INSIGHTS ── */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 p-6 md:p-10">
          <div className="absolute -top-24 -right-24 h-72 w-72 bg-indigo-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 bg-purple-100 rounded-full blur-3xl opacity-30" />

          <div className="relative z-10">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  AI Strategic Insights
                </h2>
                <p className="text-sm md:text-base text-slate-500 mt-2">
                  Executive-grade pipeline intelligence powered by Sarvam AI
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setInsightMode("quick")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      insightMode === "quick"
                        ? "bg-white shadow text-indigo-600"
                        : "text-slate-500"
                    }`}
                  >
                    ⚡ Quick
                  </button>
                  <button
                    onClick={() => setInsightMode("detailed")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      insightMode === "detailed"
                        ? "bg-white shadow text-indigo-600"
                        : "text-slate-500"
                    }`}
                  >
                    📊 Detailed
                  </button>
                </div>

                {aiInsight && !aiLoading && (
                  <button
                    onClick={() => setAiInsight("")}
                    className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition"
                  >
                    Clear
                  </button>
                )}

                <button
                  onClick={() => generateAIInsights(insightMode)}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl
          bg-indigo-600 text-white hover:bg-indigo-700
          shadow-md hover:shadow-lg transition
          disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {aiLoading
                    ? "Analyzing..."
                    : aiInsight
                      ? `Regenerate (${insightMode === "quick" ? "Quick" : "Detailed"})`
                      : "Generate Insights"}
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-10">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="mt-6 text-sm text-slate-500">
                    Generating{" "}
                    {insightMode === "quick"
                      ? "quick summary..."
                      : "detailed strategic analysis..."}
                  </p>
                </div>
              ) : aiInsight ? (
                (() => {
                  const clean = (aiInsight || "")
                    .replace(/\*\*/g, "")
                    .replace(/\\n/g, "\n")
                    .replace(/\r/g, "")
                    .replace(/Pipeline Status:/g, "\nPipeline Status:")
                    .replace(/Main Risk:/g, "\nMain Risk:")
                    .replace(/Immediate Action:/g, "\nImmediate Action:")
                    .replace(
                      /Strategic Recommendation:/g,
                      "\nStrategic Recommendation:",
                    )
                    .trim();

                  const isDetailed = insightMode === "detailed";

                  if (!isDetailed) {
                    const allowedHeadings = [
                      "Pipeline Status",
                      "Main Risk",
                      "Immediate Action",
                      "Strategic Recommendation",
                    ];

                    // 🔧 Robust parser (handles AI line breaks)
                    const extract = (start, end) => {
                      const regex = new RegExp(
                        `${start}:\\s*([\\s\\S]*?)(?=${end}:|$)`,
                        "i",
                      );
                      const match = clean.match(regex);
                      return match ? match[1].replace(/\n/g, " ").trim() : "";
                    };

                    const lines = [
                      `Pipeline Status: ${extract("Pipeline Status", "Main Risk")}`,
                      `Main Risk: ${extract("Main Risk", "Immediate Action")}`,
                      `Immediate Action: ${extract("Immediate Action", "Strategic Recommendation")}`,
                      `Strategic Recommendation: ${extract("Strategic Recommendation", "$")}`,
                    ];

                    return (
                      <div className="space-y-6">
                        <div className="text-right text-xs text-slate-400">
                          Generated at{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        {lines.map((line, index) => {
                          const [heading, ...rest] = line.split(":");
                          const content = rest.join(":").trim();

                          let bg = "bg-indigo-50 border-indigo-200";
                          let text = "text-indigo-700";
                          let icon = "📊";

                          if (heading.toLowerCase().includes("risk")) {
                            bg = "bg-rose-50 border-rose-200";
                            text = "text-rose-700";
                            icon = "⚠️";
                          }

                          if (heading.toLowerCase().includes("action")) {
                            bg = "bg-emerald-50 border-emerald-200";
                            text = "text-emerald-700";
                            icon = "🚀";
                          }

                          if (heading.toLowerCase().includes("recommend")) {
                            bg = "bg-blue-50 border-blue-200";
                            text = "text-blue-700";
                            icon = "💡";
                          }

                          return (
                            <div
                              key={index}
                              className={`rounded-2xl border p-6 shadow-sm ${bg}`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-lg">
                                  {icon}
                                </div>
                                <div>
                                  <p className="text-xs uppercase font-semibold text-slate-500">
                                    {heading}
                                  </p>
                                  <p
                                    className={`mt-2 text-base font-medium ${text}`}
                                  >
                                    {content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // 🔥 DETAILED MODE — IMPROVED SECTION PARSER
                  // 🔥 DETAILED MODE — SMART PARSER (forces point-wise insights)

                  const sections = [];

                  const pipeline = clean.match(
                    /Pipeline Status:(.*?)(Main Risk:|$)/s,
                  );
                  const risk = clean.match(
                    /Main Risk:(.*?)(Strategic Recommendation:|$)/s,
                  );
                  const rec = clean.match(/Strategic Recommendation:(.*)/s);

                  if (pipeline) {
                    sections.push({
                      title: "Pipeline Status",
                      content: pipeline[1].trim(),
                    });
                  }

                  if (risk) {
                    const riskPoints = risk[1]
                      .split(/\d+\./)
                      .map((t) => t.trim())
                      .filter(Boolean);

                    sections.push({
                      title: "Risk Analysis",
                      content: riskPoints,
                    });
                  }

                  if (rec) {
                    const recPoints = rec[1]
                      .split(/\d+\./)
                      .map((t) => t.trim())
                      .filter(Boolean);

                    sections.push({
                      title: "Strategic Recommendations",
                      content: recPoints,
                    });
                  }

                  return (
                    <div className="space-y-10">
                      <div className="text-right text-xs text-slate-400">
                        Generated at{" "}
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {sections.map((section, index) => {
                        let borderColor = "border-indigo-200";
                        let titleColor = "text-indigo-600";
                        let dotColor = "bg-indigo-500";

                        if (section.title.toUpperCase().includes("RISK")) {
                          borderColor = "border-rose-200";
                          titleColor = "text-rose-600";
                          dotColor = "bg-rose-500";
                        }

                        if (
                          section.title.toUpperCase().includes("OPPORTUNITY")
                        ) {
                          borderColor = "border-blue-200";
                          titleColor = "text-blue-600";
                          dotColor = "bg-blue-500";
                        }

                        if (
                          section.title.toUpperCase().includes("RECOMMENDATION")
                        ) {
                          borderColor = "border-emerald-200";
                          titleColor = "text-emerald-600";
                          dotColor = "bg-emerald-500";
                        }

                        return (
                          <div
                            key={index}
                            className={`rounded-3xl border ${borderColor} bg-white shadow-sm p-8`}
                          >
                            <h3
                              className={`text-xl font-semibold tracking-tight mb-4 ${titleColor}`}
                            >
                              {section.title}
                            </h3>

                            <div className="space-y-3">
                              {Array.isArray(section.content) ? (
                                section.content.map((line, i) => (
                                  <div key={i} className="flex gap-3">
                                    <div
                                      className={`h-2 w-2 mt-2 rounded-full ${dotColor}`}
                                    />
                                    <p className="text-base text-slate-700 leading-relaxed">
                                      {line}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-base text-slate-700 leading-relaxed">
                                  {section.content}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-14 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      Unlock AI-Driven Executive Intelligence
                    </h3>
                    <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                      Generate powerful insights about pipeline health,
                      conversion velocity, bottlenecks, risk concentration, and
                      executive action recommendations in seconds.
                    </p>
                    <p className="text-xs text-slate-400 mt-6">
                      Choose Quick for a sharp snapshot or Detailed for full
                      strategic breakdown.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-center justify-between mb-1">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Pipeline Overview
            </h3>
            <p className="text-sm text-slate-400">
              Key sales performance indicators
            </p>
          </div>
        </div>

        {/* ── KPI STRIP ── */}
        {/* <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <KPICard
            label="Conversion Rate"
            value={`${kpis.conversionRate || 0}%`}
            subtitle="Closed won vs total deals"
            accent="#10b981"
            icon="🏆"
            calculation={
              <div>
                <p className="font-semibold mb-2">Calculation</p>

                <p>Won Deals: {kpis.calculation?.wonDeals || 0}</p>
                <p>Lost Deals: {kpis.calculation?.lostDeals || 0}</p>

                <p className="mt-2 text-slate-500">Formula</p>

                <p className="font-mono text-xs">
                  ({kpis.calculation?.wonDeals || 0} /{" "}
                  {kpis.calculation?.closedDeals || 0}) × 100
                </p>

                <p className="font-bold mt-1">= {kpis.conversionRate || 0}%</p>
              </div>
            }
          />

          
          <KPICard
            label="Revenue Won"
            value={`₹${(kpis.revenueWon || 0).toLocaleString()}`}
            subtitle="Total closed revenue"
            accent="#f59e0b"
            icon="💵"
            calculation={
              <div>
                <p className="font-semibold mb-2">Calculation</p>

                <p>Revenue from CLOSED_WON deals</p>

                <p className="mt-2 font-mono text-xs">
                  Total = ₹
                  {(kpis.calculation?.revenueWon || 0).toLocaleString()}
                </p>
              </div>
            }
          />

          
          <KPICard
            label="Win / Loss Ratio"
            value={`${kpis.winLossRatio?.won || 0} : ${kpis.winLossRatio?.lost || 0}`}
            subtitle="Won deals vs lost deals"
            accent="#6366f1"
            icon="⚖️"
            calculation={
              <div>
                <p className="font-semibold mb-2">Calculation</p>

                <p>Won Deals: {kpis.calculation?.wonDeals || 0}</p>
                <p>Lost Deals: {kpis.calculation?.lostDeals || 0}</p>

                <p className="mt-2 font-mono text-xs">
                  {kpis.calculation?.wonDeals || 0} :{" "}
                  {kpis.calculation?.lostDeals || 0}
                </p>
              </div>
            }
          />

          
          <KPICard
            label="Revenue Realization"
            value={`${kpis.revenueRealizationRate || 0}%`}
            subtitle="Revenue won vs potential"
            accent="#0ea5e9"
            icon="📊"
            calculation={
              <div>
                <p className="font-semibold mb-2">Calculation</p>

                <p>
                  Revenue Won: ₹
                  {(kpis.calculation?.revenueWon || 0).toLocaleString()}
                </p>

                <p>
                  Revenue Lost: ₹
                  {(kpis.calculation?.revenueLost || 0).toLocaleString()}
                </p>

                <p className="mt-2 text-slate-500">Formula</p>

                <p className="font-mono text-xs">
                  ({kpis.calculation?.revenueWon || 0} / (
                  {kpis.calculation?.revenueWon || 0} +
                  {kpis.calculation?.revenueLost || 0})) × 100
                </p>

                <p className="font-bold mt-1">
                  = {kpis.revenueRealizationRate || 0}%
                </p>
              </div>
            }
          />
        </div> */}

        {/* ── KPI STRIP ── */}
        <div className="relative z-20 overflow-visible grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Conversion Rate */}
          <KPICard
            label="Conversion Rate"
            value={`${kpis.conversionRate || 0}%`}
            subtitle="Closed won vs total deals"
            accent="#10b981"
            icon="🏆"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>

                <p>Won Deals: {kpis.calculation?.wonDeals || 0}</p>
                <p>Lost Deals: {kpis.calculation?.lostDeals || 0}</p>
                <p>Total Deals: {kpis.calculation?.closedDeals || 0}</p>

                <p className="text-slate-500 text-xs mt-2">Formula</p>
                <p className="font-mono text-xs">
                  ({kpis.calculation?.wonDeals || 0} /{" "}
                  {kpis.calculation?.closedDeals || 0}) × 100
                </p>

                <p className="font-bold">= {kpis.conversionRate || 0}%</p>

                <div className="border-t pt-2 mt-2">
                  <p className="text-emerald-600 text-xs font-medium">
                    🟢 Healthy conversion rate
                  </p>
                  <p className="text-xs text-slate-500">
                    High conversion indicates strong deal qualification.
                  </p>
                </div>
              </div>
            }
          />

          {/* Revenue Won */}
          <KPICard
            label="Revenue Won"
            value={`₹${(kpis.revenueWon || 0).toLocaleString()}`}
            subtitle="Total closed revenue"
            accent="#f59e0b"
            icon="💵"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>

                <p>Total Closed Won Revenue</p>

                <p className="text-slate-500 text-xs mt-2">Formula</p>
                <p className="font-mono text-xs">
                  Sum(All CLOSED_WON deal values)
                </p>

                <p className="font-bold">
                  = ₹{(kpis.calculation?.revenueWon || 0).toLocaleString()}
                </p>

                <div className="border-t pt-2 mt-2">
                  <p className="text-indigo-600 text-xs font-medium">
                    💰 Revenue Performance
                  </p>
                  <p className="text-xs text-slate-500">
                    Represents total realized revenue from successfully closed
                    deals.
                  </p>
                </div>
              </div>
            }
          />

          {/* Win Loss Ratio */}
          <KPICard
            label="Win / Loss Ratio"
            value={`${kpis.winLossRatio?.won || 0} : ${kpis.winLossRatio?.lost || 0}`}
            subtitle="Won deals vs lost deals"
            accent="#6366f1"
            icon="⚖️"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>

                <p>Won Deals: {kpis.calculation?.wonDeals || 0}</p>
                <p>Lost Deals: {kpis.calculation?.lostDeals || 0}</p>

                <p className="text-slate-500 text-xs mt-2">Formula</p>
                <p className="font-mono text-xs">Won Deals : Lost Deals</p>

                <p className="font-bold">
                  {kpis.calculation?.wonDeals || 0} :{" "}
                  {kpis.calculation?.lostDeals || 0}
                </p>

                <div className="border-t pt-2 mt-2">
                  <p className="text-indigo-600 text-xs font-medium">
                    ⚖️ Sales Efficiency
                  </p>
                  <p className="text-xs text-slate-500">
                    Indicates how effectively opportunities are converted into
                    wins.
                  </p>
                </div>
              </div>
            }
          />

          {/* Revenue Realization */}
          <KPICard
            label="Revenue Realization"
            value={`${kpis.revenueRealizationRate || 0}%`}
            subtitle="Revenue won vs potential"
            accent="#0ea5e9"
            icon="📊"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>

                <p>
                  Revenue Won: ₹
                  {(kpis.calculation?.revenueWon || 0).toLocaleString()}
                </p>
                <p>
                  Revenue Lost: ₹
                  {(kpis.calculation?.revenueLost || 0).toLocaleString()}
                </p>

                <p className="text-slate-500 text-xs mt-2">Formula</p>

                <p className="font-mono text-xs">
                  ({kpis.calculation?.revenueWon || 0} / (
                  {kpis.calculation?.revenueWon || 0} +{" "}
                  {kpis.calculation?.revenueLost || 0})) × 100
                </p>

                <p className="font-bold">
                  = {kpis.revenueRealizationRate || 0}%
                </p>

                <div className="border-t pt-2 mt-2">
                  <p className="text-sky-600 text-xs font-medium">
                    📊 Revenue Efficiency
                  </p>
                  <p className="text-xs text-slate-500">
                    Measures how much potential revenue was successfully
                    captured.
                  </p>
                </div>
              </div>
            }
          />
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Stage Distribution */}
          <Card
            title="Stage Distribution"
            subtitle="Deals across pipeline stages"
            className="lg:col-span-2"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-center py-2">
                <DonutChart data={stageDistribution} />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <StageLegend data={stageDistribution} />
              </div>
            </div>
          </Card>

          {/* Sales Funnel */}
          <Card
            title="Sales Funnel"
            subtitle="Stage-wise conversion rates"
            className="lg:col-span-3"
          >
            {analyticsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : funnelData.length === 0 ? (
              // FONT: text-sm → text-base
              <p className="text-base text-slate-400 text-center py-8">
                No funnel data available
              </p>
            ) : (
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Funnel visual — takes 55% width */}
                <div className="w-full lg:w-[55%] flex items-center justify-center">
                  <VisualFunnel data={funnelData} />
                </div>

                {/* Divider */}
                <div className="hidden lg:block self-stretch w-px bg-slate-100" />

                {/* Legend — takes remaining width */}
                <div className="w-full lg:flex-1 flex flex-col justify-center">
                  <FunnelLegend data={funnelData} />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ── INSIGHTS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Pipeline Risk */}
          <Card title="Pipeline Risk" subtitle="Risk level distribution">
            {analyticsLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : riskDistribution.length === 0 ? (
              // FONT: text-sm → text-base
              <p className="text-base text-slate-400 text-center py-6">
                No risk data
              </p>
            ) : (
              <div className="space-y-3">
                {riskDistribution.map((r) => {
                  const conf = RISK_CONFIG[r.riskLevel] || RISK_CONFIG.LOW;
                  const pct =
                    totalRisk > 0
                      ? Math.round((r._count.id / totalRisk) * 100)
                      : 0;
                  return (
                    <div
                      key={r.riskLevel}
                      onClick={() => loadRiskDeals(r.riskLevel)}
                      className={`rounded-xl border px-5 py-4 cursor-pointer ${conf.bg} ${conf.border} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${conf.dot}`}
                          />
                          {/* FONT: text-sm → text-base */}
                          <span
                            className={`text-base font-semibold ${conf.text}`}
                          >
                            {r.riskLevel}
                          </span>
                        </div>
                        {/* unchanged: text-2xl already large */}
                        <span className={`text-2xl font-bold ${conf.text}`}>
                          {r._count.id}
                        </span>
                      </div>
                      <div className="h-1 bg-white/70 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: conf.bar }}
                        />
                      </div>
                      {/* FONT: text-xs → text-sm */}
                      <p className="text-sm text-slate-400 mt-1">
                        {pct}% of pipeline
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Pipeline Velocity — Line Chart */}
          <Card
            title="Pipeline Velocity"
            subtitle="Avg days per stage"
            className="md:col-span-2"
          >
            {analyticsLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : (
              <>
                {bottleneck && (
                  <div className="mb-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl flex-shrink-0">
                        ⚠️
                      </div>
                      <div>
                        <p className="text-base font-bold text-amber-900">
                          Bottleneck Detected
                        </p>
                        <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mt-0.5">
                          {bottleneck.stage.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-amber-700 leading-none">
                        {bottleneck.avgDays}d
                      </p>
                      <p className="text-xs font-medium text-amber-500 mt-1 uppercase tracking-wide">
                        avg days
                      </p>
                    </div>
                  </div>
                )}
                <VelocityLineChart
                  data={stageAging}
                  onStageClick={loadStageDeals}
                />
              </>
            )}
          </Card>
        </div>
        {/* ── DRILLDOWN PANEL ── */}

        {(selectedRisk || selectedStage) && (
          <div className="mt-8 rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {selectedRisk
                    ? `${selectedRisk} Risk Deals`
                    : `${selectedStage.replace(/_/g, " ")} – Slow Deals`}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing deals stuck longer than average
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRisk(null);
                  setSelectedStage(null);
                  setRiskDeals([]);
                  setStageDeals([]);
                }}
                className="inline-flex items-center justify-center h-8 w-8 rounded-full
                   text-slate-500 hover:text-slate-700 hover:bg-slate-200
                   transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {drilldownLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <div className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="min-w-full text-sm">
                    {/* Header */}
                    <thead className="sticky top-0 z-10 bg-slate-50">
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="px-5 py-3 text-left font-medium">
                          Deal
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Account
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Stage
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Days Stuck
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Owner
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Last Stage Change
                        </th>
                        <th className="px-5 py-3 text-left font-medium">
                          Closing Date
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-slate-100">
                      {(selectedRisk ? riskDeals : stageDeals).map((d) => (
                        <tr
                          key={d.dealId}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          {/* Deal */}
                          <td className="px-5 py-3 font-medium text-slate-800">
                            {d.dealName}
                          </td>

                          {/* Account */}
                          <td className="px-5 py-3 text-slate-600">
                            {d.accountName}
                          </td>

                          {/* Stage */}
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {d.stage.replace(/_/g, " ")}
                            </span>
                          </td>

                          {/* Days Stuck */}
                          <td className="px-5 py-3 text-right">
                            <span className="font-semibold text-amber-600">
                              {d.daysInStage}d
                            </span>
                          </td>

                          {/* Owner */}
                          <td className="px-5 py-3 text-slate-600">
                            {d.owner}
                          </td>

                          {/* Last Stage Change */}
                          <td className="px-5 py-3 text-slate-500">
                            {formatDate(
                              d.lastStageChangeAt || d.enteredStageAt,
                            )}
                          </td>

                          {/* Closing Date */}
                          <td className="px-5 py-3 text-slate-500">
                            {formatDate(d.closingDate)}
                          </td>
                        </tr>
                      ))}

                      {(selectedRisk ? riskDeals : stageDeals).length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-sm text-slate-400"
                          >
                            No deals found for this selection
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* FONT: text-[11px] → text-xs */}
      <div className="text-center py-6 text-xs text-slate-800">
        SalesCRM Pro Suite · Advanced Analytics
      </div>
    </div>
  );
}
