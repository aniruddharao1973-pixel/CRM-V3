// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchDeal, clearCurrentDeal } from "./dealSlice";
// import { STAGE_COLORS, PROGRESS_STAGES, formatCurrency, formatDate, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import DetailField from "../../components/DetailField";
// import { CurrencyDollarIcon, PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

// const DealDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { deal, detailLoading } = useSelector((s) => s.deals);

//   useEffect(() => { dispatch(fetchDeal(id)); return () => dispatch(clearCurrentDeal()); }, [dispatch, id]);

//   if (detailLoading || !deal) return <Spinner className="py-20" />;

//   const currentIdx = PROGRESS_STAGES.indexOf(deal.stage);
//   const isClosed = deal.stage.startsWith("CLOSED");

//   return (
//     <div className="max-w-5xl mx-auto">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate("/deals")} className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5 text-gray-500" /></button>
//           <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center"><CurrencyDollarIcon className="w-7 h-7 text-green-600" /></div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{deal.dealName}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <span className={`badge ${STAGE_COLORS[deal.stage] || "badge-gray"}`}>{formatLabel(deal.stage)}</span>
//               <span className="text-sm text-gray-500">· {formatCurrency(deal.amount)}</span>
//             </div>
//           </div>
//         </div>
//         <button onClick={() => navigate(`/deals/${id}/edit`)} className="btn-primary"><PencilSquareIcon className="w-5 h-5 mr-1.5" /> Edit</button>
//       </div>

//       {/* Progress */}
//       {!isClosed && (
//         <div className="card mb-6">
//           <p className="text-xs font-semibold text-gray-500 mb-3">DEAL PROGRESS</p>
//           <div className="flex gap-1">
//             {PROGRESS_STAGES.map((s, i) => (
//               <div key={s} className={`flex-1 h-2 rounded-full transition-colors ${i <= currentIdx ? "bg-blue-500" : "bg-gray-200"}`} title={formatLabel(s)} />
//             ))}
//           </div>
//           <div className="flex justify-between mt-2"><span className="text-xs text-gray-400">Qualification</span><span className="text-xs text-gray-400">Closed Won</span></div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Deal Details</h2>
//             <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//               <DetailField label="Amount" value={formatCurrency(deal.amount)} />
//               <DetailField label="Expected Revenue" value={formatCurrency(deal.expectedRevenue)} />
//               <DetailField label="Probability" value={deal.probability != null ? `${deal.probability}%` : null} />
//               <DetailField label="Closing Date" value={formatDate(deal.closingDate)} />
//               <DetailField label="Type" value={formatLabel(deal.type)} />
//               <DetailField label="Lead Source" value={formatLabel(deal.leadSource)} />
//               <DetailField label="Campaign" value={deal.campaignSource} />
//               <DetailField label="Next Step" value={deal.nextStep} />
//             </div>
//           </div>
//           {deal.description && <div className="card"><h2 className="section-title mb-4">Description</h2><p className="text-sm text-gray-700 whitespace-pre-wrap">{deal.description}</p></div>}
//         </div>

//         <div className="space-y-6">
//           <div className="card">
//             <h2 className="section-title mb-4">Related</h2>
//             <div className="space-y-4">
//               <DetailField label="Account"><Link to={`/accounts/${deal.account?.id}`} className="link text-sm">{deal.account?.accountName}</Link></DetailField>
//               {deal.contact && <DetailField label="Contact"><Link to={`/contacts/${deal.contact?.id}`} className="link text-sm">{deal.contact?.firstName} {deal.contact?.lastName || ""}</Link></DetailField>}
//               <DetailField label="Owner" value={deal.owner?.name} />
//             </div>
//           </div>
//           <div className="card">
//             <h2 className="section-title mb-4">Audit Info</h2>
//             <div className="space-y-3">
//               <DetailField label="Created By" value={deal.createdBy?.name} />
//               <DetailField label="Modified By" value={deal.modifiedBy?.name} />
//               <DetailField label="Created" value={formatDate(deal.createdAt)} />
//               <DetailField label="Updated" value={formatDate(deal.updatedAt)} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealDetail;

// src/features/deals/DealDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
import {
  STAGE_COLORS,
  PROGRESS_STAGES,
  PIPELINE_STAGES,
  formatCurrency,
  formatDate,
  formatLabel,
} from "../../constants";
import Spinner from "../../components/Spinner";
import {
  CurrencyDollarIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  TagIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  SparklesIcon,
  FlagIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";

/* ────────────────────── helpers ────────────────────── */

const getStageIndex = (stage) => PROGRESS_STAGES.indexOf(stage);

const getStageIcon = (stage) => {
  if (stage === "CLOSED_WON") return CheckCircleSolid;
  if (stage === "CLOSED_LOST" || stage === "CLOSED_LOST_TO_COMPETITION")
    return XCircleIcon;
  return null;
};

const getProbabilityColor = (prob) => {
  if (prob >= 75) return "text-green-600";
  if (prob >= 50) return "text-yellow-600";
  if (prob >= 25) return "text-orange-600";
  return "text-red-600";
};

const getProbabilityBg = (prob) => {
  if (prob >= 75) return "bg-green-500";
  if (prob >= 50) return "bg-yellow-500";
  if (prob >= 25) return "bg-orange-500";
  return "bg-red-500";
};

const getTimeSince = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

/* ────────────────── Info Row Component ────────────────── */

const InfoRow = ({ icon: Icon, label, children, className = "" }) => (
  <div className={`flex items-start gap-3 py-3 ${className}`}>
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-900 mt-0.5">{children}</div>
    </div>
  </div>
);

/* ────────────────── Stat Card Component ────────────────── */

const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {subtext && (
          <span className="text-xs text-gray-400 font-medium">{subtext}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  );
};

/* ════════════════════ MAIN COMPONENT ════════════════════ */

const DealDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);

  const [tab, setTab] = useState("overview");
  const [updatingStage, setUpdatingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);

  useEffect(() => {
    dispatch(fetchDeal(id));
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  /* ── stage change ── */

  const handleStageChange = async (stage) => {
    if (stage === deal.stage) return;
    try {
      setUpdatingStage(true);
      await dispatch(updateDeal({ id, stage })).unwrap();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (detailLoading || !deal) return <Spinner className="py-20" />;

  const currentIdx = getStageIndex(deal.stage);
  const probability = deal.probability ?? 0;
  const isClosed =
    deal.stage === "CLOSED_WON" ||
    deal.stage === "CLOSED_LOST" ||
    deal.stage === "CLOSED_LOST_TO_COMPETITION";

  const tabs = [
    { key: "overview", label: "Overview", icon: DocumentTextIcon },
    { key: "timeline", label: "Timeline", icon: ClockIcon },
    { key: "history", label: "Stage History", icon: ChartBarIcon },
  ];

  /* ════════════════════ RENDER ════════════════════ */

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* ───────────── HEADER ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* back btn */}
            <button
              onClick={() => navigate("/deals")}
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
            </button>

            {/* icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                isClosed && deal.stage === "CLOSED_WON"
                  ? "bg-gradient-to-br from-green-400 to-emerald-500"
                  : isClosed
                  ? "bg-gradient-to-br from-red-400 to-rose-500"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            >
              <CurrencyDollarIcon className="w-7 h-7 text-white" />
            </div>

            {/* title */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {deal.dealName}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    STAGE_COLORS[deal.stage]
                  }`}
                >
                  {formatLabel(deal.stage)}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-md">
                  {deal.dealLogId}
                </span>
                <span>•</span>
                <span className="font-semibold text-gray-700">
                  {formatCurrency(deal.amount)}
                </span>
                {deal.closingDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      Closing: {formatDate(deal.closingDate)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/deals/${id}/edit`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-200 transition-all duration-200"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Deal
            </button>
          </div>
        </div>
      </div>

      {/* ───────────── STAT CARDS ───────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CurrencyDollarIcon}
          label="Deal Value"
          value={formatCurrency(deal.amount)}
          color="green"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          label="Probability"
          value={`${probability}%`}
          subtext={
            probability >= 75
              ? "High"
              : probability >= 50
              ? "Medium"
              : "Low"
          }
          color="purple"
        />
        <StatCard
          icon={CalendarDaysIcon}
          label="Closing Date"
          value={formatDate(deal.closingDate)}
          subtext={getTimeSince(deal.createdAt)}
          color="blue"
        />
        <StatCard
          icon={ChartBarIcon}
          label="Current Stage"
          value={formatLabel(deal.stage)}
          subtext={`Step ${currentIdx + 1} of ${PROGRESS_STAGES.length}`}
          color="amber"
        />
      </div>

      {/* ───────────── PIPELINE / STAGE BAR ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FlagIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Deal Pipeline
            </h2>
          </div>

          {/* probability bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-medium">
              Probability
            </span>
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProbabilityBg(
                  probability
                )}`}
                style={{ width: `${probability}%` }}
              />
            </div>
            <span
              className={`text-sm font-bold ${getProbabilityColor(
                probability
              )}`}
            >
              {probability}%
            </span>
          </div>
        </div>

        {/* stages row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {PROGRESS_STAGES.map((stage, idx) => {
            const isActive = deal.stage === stage;
            const isPast = idx < currentIdx;
            const isFuture = idx > currentIdx;
            const StageIcon = getStageIcon(stage);
            const pipelineInfo = PIPELINE_STAGES.find(
              (p) => p.key === stage
            );

            return (
              <div key={stage} className="flex items-center">
                <button
                  disabled={updatingStage}
                  onClick={() => handleStageChange(stage)}
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                    transition-all duration-200 whitespace-nowrap border
                    ${
                      isActive
                        ? `${STAGE_COLORS[stage]} border-current shadow-sm scale-105`
                        : isPast
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                    }
                    ${updatingStage ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                    ${hoveredStage === stage && !isActive ? "ring-2 ring-blue-200" : ""}
                  `}
                >
                  {isPast && (
                    <CheckCircleSolid className="w-3.5 h-3.5 text-green-500" />
                  )}
                  {StageIcon && isActive && (
                    <StageIcon className="w-3.5 h-3.5" />
                  )}
                  {pipelineInfo?.label || formatLabel(stage)}
                </button>

                {idx < PROGRESS_STAGES.length - 1 && (
                  <ArrowRightIcon
                    className={`w-3 h-3 mx-0.5 flex-shrink-0 ${
                      isPast ? "text-green-300" : "text-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {updatingStage && (
          <div className="flex items-center gap-2 mt-3 text-xs text-blue-600">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Updating stage...
          </div>
        )}
      </div>

      {/* ───────────── TABS ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all
                  border-b-2 -mb-px
                  ${
                    tab === t.key
                      ? "border-blue-600 text-blue-600 bg-blue-50/30"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* left col */}
              <div className="lg:col-span-2 space-y-6">
                {/* deal info */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                    Deal Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
                    <div className="divide-y divide-gray-200/60">
                      <InfoRow icon={TagIcon} label="Product Group">
                        {formatLabel(deal.productGroup) || "—"}
                      </InfoRow>
                      <InfoRow icon={ChartBarIcon} label="Weightage">
                        <span className="inline-flex items-center gap-1">
                          {formatLabel(deal.weightage) || "—"}
                        </span>
                      </InfoRow>
                      <InfoRow icon={CalendarDaysIcon} label="Closing Date">
                        {formatDate(deal.closingDate)}
                      </InfoRow>
                    </div>
                    <div className="divide-y divide-gray-200/60">
                      <InfoRow icon={UserIcon} label="Person In Charge">
                        {deal.personInCharge || "—"}
                      </InfoRow>
                      <InfoRow icon={ArrowTrendingUpIcon} label="Next Step">
                        {deal.nextStep || "—"}
                      </InfoRow>
                      <InfoRow icon={ShieldCheckIcon} label="Deal Type">
                        {formatLabel(deal.dealType) || "—"}
                      </InfoRow>
                    </div>
                  </div>
                </div>

                {/* description */}
                {deal.description && (
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {deal.description}
                    </p>
                  </div>
                )}

                {/* quick stage history */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    Recent Activity
                  </h3>

                  {deal.stageHistory?.length > 0 ? (
                    <div className="space-y-3">
                      {deal.stageHistory.slice(0, 5).map((h, i) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              STAGE_COLORS[h.stage] || "bg-gray-100"
                            }`}
                          >
                            <SparklesIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              Moved to{" "}
                              <span className="font-semibold">
                                {formatLabel(h.stage)}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {h.changedBy?.name} • {formatDate(h.createdAt)}
                            </p>
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                              Latest
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No stage changes recorded yet.
                    </p>
                  )}
                </div>
              </div>

              {/* right sidebar */}
              <div className="space-y-6">
                {/* related account */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                    Account
                  </h3>

                  {deal.account ? (
                    <Link
                      to={`/accounts/${deal.account.id}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {deal.account.accountName}
                        </p>
                        <p className="text-xs text-gray-500">View Account →</p>
                      </div>
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-400">No account linked</p>
                  )}
                </div>

                {/* contact */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserCircleIcon className="w-4 h-4 text-gray-400" />
                    Contact
                  </h3>

                  {deal.contact ? (
                    <Link
                      to={`/contacts/${deal.contact.id}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          {deal.contact.firstName?.[0]}
                          {deal.contact.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {deal.contact.firstName} {deal.contact.lastName}
                        </p>
                        {deal.contact.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <EnvelopeIcon className="w-3 h-3" />
                            {deal.contact.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-400">No contact linked</p>
                  )}
                </div>

                {/* owner */}
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    Deal Owner
                  </h3>

                  {deal.owner ? (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-amber-600">
                          {deal.owner.name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {deal.owner.name}
                        </p>
                        {deal.owner.email && (
                          <p className="text-xs text-gray-500">
                            {deal.owner.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No owner assigned</p>
                  )}
                </div>

                {/* quick stats */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">
                    Deal Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Value</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(deal.amount)}
                      </span>
                    </div>
                    <div className="h-px bg-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Probability</span>
                      <span className="text-lg font-bold">{probability}%</span>
                    </div>
                    <div className="h-px bg-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">
                        Weighted Value
                      </span>
                      <span className="text-lg font-bold">
                        {formatCurrency(
                          ((deal.amount || 0) * probability) / 100
                        )}
                      </span>
                    </div>
                    <div className="h-px bg-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Stage Changes</span>
                      <span className="text-lg font-bold">
                        {deal.stageHistory?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TIMELINE TAB ═══════════ */}
          {tab === "timeline" && (
            <div className="max-w-3xl mx-auto">
              {deal.stageHistory?.length > 0 ? (
                <div className="relative">
                  {/* vertical line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

                  <div className="space-y-1">
                    {deal.stageHistory.map((h, idx) => {
                      const isFirst = idx === 0;
                      const isWon = h.stage === "CLOSED_WON";
                      const isLost =
                        h.stage === "CLOSED_LOST" ||
                        h.stage === "CLOSED_LOST_TO_COMPETITION";

                      return (
                        <div
                          key={h.id}
                          className="relative flex gap-4 pl-2 group"
                        >
                          {/* dot */}
                          <div
                            className={`
                              relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center
                              transition-all flex-shrink-0 mt-4
                              ${
                                isFirst
                                  ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-200"
                                  : isWon
                                  ? "border-green-500 bg-green-500"
                                  : isLost
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300 bg-white group-hover:border-blue-400"
                              }
                            `}
                          >
                            {isFirst ? (
                              <StarSolid className="w-3.5 h-3.5 text-white" />
                            ) : isWon ? (
                              <CheckCircleSolid className="w-3.5 h-3.5 text-white" />
                            ) : isLost ? (
                              <XCircleIcon className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors" />
                            )}
                          </div>

                          {/* content card */}
                          <div
                            className={`
                              flex-1 p-4 mb-2 rounded-xl border transition-all
                              ${
                                isFirst
                                  ? "bg-blue-50/50 border-blue-100 shadow-sm"
                                  : "bg-white border-gray-100 hover:shadow-sm hover:border-gray-200"
                              }
                            `}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    STAGE_COLORS[h.stage]
                                  }`}
                                >
                                  {formatLabel(h.stage)}
                                </span>
                                {isFirst && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {formatDate(h.createdAt)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mt-2">
                              Stage changed to{" "}
                              <span className="font-semibold text-gray-900">
                                {formatLabel(h.stage)}
                              </span>
                            </p>

                            {h.changedBy?.name && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-gray-600">
                                    {h.changedBy.name[0]}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {h.changedBy.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No timeline events yet
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Stage changes will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════ HISTORY TABLE TAB ═══════════ */}
          {tab === "history" && (
            <div>
              {deal.stageHistory?.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          #
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Stage
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Changed By
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Time Elapsed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {deal.stageHistory.map((h, idx) => (
                        <tr
                          key={h.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                STAGE_COLORS[h.stage]
                              }`}
                            >
                              {formatLabel(h.stage)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {h.changedBy?.name && (
                                <>
                                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-gray-600">
                                      {h.changedBy.name[0]}
                                    </span>
                                  </div>
                                  <span className="text-gray-700 font-medium">
                                    {h.changedBy.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatDate(h.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {getTimeSince(h.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">
                    No stage history recorded
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Changes to the deal stage will be tracked here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealDetail;
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
// import {
//   STAGE_COLORS,
//   PROGRESS_STAGES,
//   formatCurrency,
//   formatDate,
//   formatLabel,
// } from "../../constants";
// import Spinner from "../../components/Spinner";
// import DetailField from "../../components/DetailField";
// import {
//   CurrencyDollarIcon,
//   PencilSquareIcon,
//   ArrowLeftIcon,
// } from "@heroicons/react/24/outline";

// const DealDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);

//   const [tab, setTab] = useState("overview");
//   const [updatingStage, setUpdatingStage] = useState(false);

//   useEffect(() => {
//     dispatch(fetchDeal(id));
//     return () => dispatch(clearCurrentDeal());
//   }, [dispatch, id]);

//   /* ================= STAGE CHANGE ================= */

//   const handleStageChange = async (stage) => {
//     if (stage === deal.stage) return;

//     try {
//       setUpdatingStage(true);
//       await dispatch(updateDeal({ id, stage })).unwrap();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdatingStage(false);
//     }
//   };

//   if (detailLoading || !deal) return <Spinner className="py-20" />;

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-7xl mx-auto space-y-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-4">

//           <ArrowLeftIcon
//             onClick={() => navigate("/deals")}
//             className="w-5 h-5 cursor-pointer text-gray-500"
//           />

//           <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
//             <CurrencyDollarIcon className="w-7 h-7 text-green-600" />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold">{deal.dealName}</h1>
//             <p className="text-sm text-gray-500">
//               {deal.dealLogId} • {formatCurrency(deal.amount)}
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={() => navigate(`/deals/${id}/edit`)}
//           className="btn-primary"
//         >
//           <PencilSquareIcon className="w-5 h-5 mr-1.5" />
//           Edit
//         </button>
//       </div>

//       {/* ================= STAGE BAR ================= */}

//       <div className="card">
//         <p className="text-xs font-semibold text-gray-500 mb-4">
//           DEAL STAGE
//         </p>

//         <div className="flex flex-wrap gap-2">
//           {PROGRESS_STAGES.map((stage) => (
//             <button
//               key={stage}
//               disabled={updatingStage}
//               onClick={() => handleStageChange(stage)}
//               className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
//               ${
//                 deal.stage === stage
//                   ? STAGE_COLORS[stage]
//                   : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//               }`}
//             >
//               {formatLabel(stage)}
//             </button>
//           ))}
//         </div>

//         <div className="text-xs text-gray-500 mt-3">
//           Probability: <b>{deal.probability ?? 0}%</b>
//         </div>
//       </div>

//       {/* ================= TABS ================= */}

//       <div className="flex gap-6 border-b text-sm">
//         <button
//           onClick={() => setTab("overview")}
//           className={`pb-2 ${
//             tab === "overview" && "border-b-2 border-blue-600 font-semibold"
//           }`}
//         >
//           Overview
//         </button>

//         <button
//           onClick={() => setTab("timeline")}
//           className={`pb-2 ${
//             tab === "timeline" && "border-b-2 border-blue-600 font-semibold"
//           }`}
//         >
//           Timeline
//         </button>
//       </div>

//       {/* ================= OVERVIEW ================= */}

//       {tab === "overview" && (
//         <div className="grid lg:grid-cols-3 gap-6">

//           {/* LEFT */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* DEAL DETAILS */}
//             <div className="card">
//               <h2 className="section-title mb-4">Deal Details</h2>

//               <div className="grid grid-cols-2 gap-4">
//                 <DetailField label="Product Group" value={formatLabel(deal.productGroup)} />
//                 <DetailField label="Weightage" value={formatLabel(deal.weightage)} />
//                 <DetailField label="Closing Date" value={formatDate(deal.closingDate)} />
//                 <DetailField label="Person In Charge" value={deal.personInCharge} />
//                 <DetailField label="Next Step" value={deal.nextStep} />
//               </div>
//             </div>

//             {/* STAGE HISTORY */}
//             <div className="card">
//               <h2 className="section-title mb-4">Stage History</h2>

//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 text-gray-500">
//                   <tr>
//                     <th className="p-2 text-left">Stage</th>
//                     <th className="p-2 text-left">Changed By</th>
//                     <th className="p-2 text-left">Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {deal.stageHistory?.map((h) => (
//                     <tr key={h.id} className="border-t">
//                       <td className="p-2">{formatLabel(h.stage)}</td>
//                       <td className="p-2">{h.changedBy?.name}</td>
//                       <td className="p-2">{formatDate(h.createdAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </div>

//           {/* RIGHT SIDEBAR */}
//           <div className="space-y-6">

//             <div className="card">
//               <h2 className="section-title mb-4">Related</h2>

//               <DetailField label="Account">
//                 <Link to={`/accounts/${deal.account?.id}`} className="link">
//                   {deal.account?.accountName}
//                 </Link>
//               </DetailField>

//               <DetailField label="Contact">
//                 {deal.contact?.firstName} {deal.contact?.lastName}
//               </DetailField>

//               <DetailField label="Owner" value={deal.owner?.name} />
//             </div>

//           </div>
//         </div>
//       )}

//       {/* ================= TIMELINE ================= */}

//       {tab === "timeline" && (
//         <div className="card space-y-4">
//           {deal.stageHistory?.map((h) => (
//             <div key={h.id} className="flex gap-3">

//               <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />

//               <div>
//                 <p className="text-sm font-medium">
//                   Stage changed to {formatLabel(h.stage)}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   {h.changedBy?.name} • {formatDate(h.createdAt)}
//                 </p>
//               </div>

//             </div>
//           ))}
//         </div>
//       )}

//     </div>
//   );
// };

// export default DealDetail;
