// // src/features/deals/DealDetail.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
// import SendEmailModal from "../email/components/SendEmailModal";
// import EmailTemplateManager from "../email/components/EmailTemplateManager";
// import EmailLogs from "../email/components/EmailLogs";
// import { fetchMe } from "../auth/authSlice";
// import API from "../../api/axios";
// import {
//   STAGE_COLORS,
//   PROGRESS_STAGES,
//   PIPELINE_STAGES,
//   formatCurrency,
//   formatDate,
//   formatLabel,
// } from "../../constants";
// import Spinner from "../../components/Spinner";
// import {
//   CurrencyDollarIcon,
//   PencilSquareIcon,
//   ArrowLeftIcon,
//   BuildingOfficeIcon,
//   UserCircleIcon,
//   CalendarDaysIcon,
//   ChartBarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   ArrowTrendingUpIcon,
//   BriefcaseIcon,
//   TagIcon,
//   UserIcon,
//   PhoneIcon,
//   EnvelopeIcon,
//   ArrowRightIcon,
//   SparklesIcon,
//   FlagIcon,
//   DocumentTextIcon,
//   ShieldCheckIcon,
// } from "@heroicons/react/24/outline";
// import {
//   CheckCircleIcon as CheckCircleSolid,
//   StarIcon as StarSolid,
// } from "@heroicons/react/24/solid";

// /* ────────────────────── helpers ────────────────────── */

// const getStageIndex = (stage) => PROGRESS_STAGES.indexOf(stage);

// const getStageIcon = (stage) => {
//   if (stage === "CLOSED_WON") return CheckCircleSolid;
//   if (stage === "CLOSED_LOST" || stage === "CLOSED_LOST_TO_COMPETITION")
//     return XCircleIcon;
//   return null;
// };

// const getProbabilityColor = (prob) => {
//   if (prob >= 75) return "text-green-600";
//   if (prob >= 50) return "text-yellow-600";
//   if (prob >= 25) return "text-orange-600";
//   return "text-red-600";
// };

// const getProbabilityBg = (prob) => {
//   if (prob >= 75) return "bg-green-500";
//   if (prob >= 50) return "bg-yellow-500";
//   if (prob >= 25) return "bg-orange-500";
//   return "bg-red-500";
// };

// const getTimeSince = (date) => {
//   if (!date) return "";
//   const now = new Date();
//   const past = new Date(date);
//   const diffMs = now - past;
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   if (diffDays === 0) return "Today";
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays < 30) return `${diffDays} days ago`;
//   if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
//   return `${Math.floor(diffDays / 365)} years ago`;
// };

// /* ────────────────── Info Row Component ────────────────── */

// const InfoRow = ({ icon: Icon, label, children, className = "" }) => (
//   <div className={`flex items-start gap-3 py-3 ${className}`}>
//     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//       <Icon className="w-4 h-4 text-gray-400" />
//     </div>
//     <div className="min-w-0 flex-1">
//       <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
//         {label}
//       </p>
//       <div className="text-sm font-medium text-gray-900 mt-0.5">{children}</div>
//     </div>
//   </div>
// );

// const detectEmailProvider = (email) => {
//   if (!email) return "SMTP";

//   const domain = email.split("@")[1]?.toLowerCase();

//   if (domain.includes("gmail.com")) return "GOOGLE";

//   if (
//     domain.includes("outlook.com") ||
//     domain.includes("hotmail.com") ||
//     domain.includes("live.com")
//   ) {
//     return "MICROSOFT";
//   }

//   return "SMTP";
// };

// /* ────────────────── Stat Card Component ────────────────── */

// const StatCard = ({ icon: Icon, label, value, subtext, color = "blue" }) => {
//   const colors = {
//     blue: "bg-blue-50 text-blue-600 border-blue-100",
//     green: "bg-green-50 text-green-600 border-green-100",
//     purple: "bg-purple-50 text-purple-600 border-purple-100",
//     amber: "bg-amber-50 text-amber-600 border-amber-100",
//   };

//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-300 group">
//       <div className="flex items-center justify-between mb-3">
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colors[color]}`}
//         >
//           <Icon className="w-5 h-5" />
//         </div>
//         {subtext && (
//           <span className="text-xs text-gray-400 font-medium">{subtext}</span>
//         )}
//       </div>
//       <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
//       <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
//     </div>
//   );
// };

// /* ════════════════════ MAIN COMPONENT ════════════════════ */

// const DealDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);

//   const { user } = useSelector((state) => state.auth);

//   // console.log("🔍 Logged In User:", user);
//   // console.log("🔍 Email Provider:", user?.emailProvider);
//   // console.log("🔍 Email Access Token:", user?.emailAccessToken);

//   const emailProvider = user?.emailProvider || detectEmailProvider(user?.email);

//   const [tab, setTab] = useState("overview");
//   const [updatingStage, setUpdatingStage] = useState(false);
//   const [hoveredStage, setHoveredStage] = useState(null);
//   const [showSendEmail, setShowSendEmail] = useState(false);
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showEmailLogs, setShowEmailLogs] = useState(false);

//   const [stageModal, setStageModal] = useState({
//     open: false,
//     stage: null,
//     description: "",
//   });

//   const [notesModal, setNotesModal] = useState({
//     open: false,
//     historyId: null,
//     description: "",
//   });

//   // const API = import.meta.env.VITE_API_BASE_URL;

//   const connectGmail = async () => {
//     const res = await fetch(`${API}/email/connect/google`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();
//     window.location.href = data.url;
//   };

//   const connectOutlook = async () => {
//     const res = await fetch(`${API}/email/connect/outlook`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const data = await res.json();
//     window.location.href = data.url;
//   };

//   useEffect(() => {
//     dispatch(fetchDeal(id));

//     // ⭐ Refresh logged-in user after OAuth redirect
//     console.log("🔄 Refreshing logged-in user after OAuth");
//     dispatch(fetchMe());

//     return () => dispatch(clearCurrentDeal());
//   }, [dispatch, id]);

//   /* ── stage change ── */

//   const handleStageChange = async () => {
//     if (stageModal.stage === deal.stage) return;

//     try {
//       setUpdatingStage(true);

//       await dispatch(
//         updateDeal({
//           id,
//           stage: stageModal.stage,
//           description: stageModal.description,
//         }),
//       ).unwrap();

//       setStageModal({ open: false, stage: null, description: "" });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setUpdatingStage(false);
//     }
//   };

//   if (detailLoading || !deal) return <Spinner className="py-20" />;

//   const currentIdx = getStageIndex(deal.stage);
//   const probability = deal.probability ?? 0;
//   const isClosed =
//     deal.stage === "CLOSED_WON" ||
//     deal.stage === "CLOSED_LOST" ||
//     deal.stage === "CLOSED_LOST_TO_COMPETITION";

//   const tabs = [
//     { key: "overview", label: "Overview", icon: DocumentTextIcon },
//     { key: "timeline", label: "Timeline", icon: ClockIcon },
//     { key: "history", label: "Stage History", icon: ChartBarIcon },
//   ];

//   /* ════════════════════ RENDER ════════════════════ */

//   return (
//     <div className="max-w-7xl mx-auto space-y-6 pb-10">
//       {/* ───────────── HEADER ───────────── */}
//       <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           {/* LEFT SIDE */}
//           <div className="flex items-center gap-4">
//             {/* back btn */}
//             <button
//               onClick={() => navigate("/deals")}
//               className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
//             >
//               <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//             </button>

//             {/* icon */}
//             <div
//               className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
//                 isClosed && deal.stage === "CLOSED_WON"
//                   ? "bg-gradient-to-br from-green-400 to-emerald-500"
//                   : isClosed
//                     ? "bg-gradient-to-br from-red-400 to-rose-500"
//                     : "bg-gradient-to-br from-blue-500 to-indigo-600"
//               }`}
//             >
//               <CurrencyDollarIcon className="w-7 h-7 text-white" />
//             </div>

//             {/* title */}
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//                   {deal.dealName}
//                 </h1>

//                 <span
//                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//                     STAGE_COLORS[deal.stage]
//                   }`}
//                 >
//                   {formatLabel(deal.stage)}
//                 </span>
//               </div>

//               <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
//                 <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded-md">
//                   {deal.dealLogId}
//                 </span>

//                 <span>•</span>

//                 <span className="font-semibold text-gray-700">
//                   {formatCurrency(deal.amount)}
//                 </span>

//                 {deal.closingDate && (
//                   <>
//                     <span>•</span>
//                     <span className="flex items-center gap-1">
//                       <CalendarDaysIcon className="w-3.5 h-3.5" />
//                       Closing: {formatDate(deal.closingDate)}
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE ACTIONS */}
//           <div className="flex items-center gap-2">
//             {/* Send Email (always visible) */}
//             <button
//               disabled={!user?.emailProvider}
//               onClick={() => {
//                 if (!user?.emailProvider) {
//                   alert("Please connect your email provider first");
//                   return;
//                 }

//                 if (!deal.contact?.email) {
//                   alert("Contact email not available for this deal");
//                   return;
//                 }

//                 setShowSendEmail(true);
//               }}
//               className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition
//   ${
//     user?.emailProvider
//       ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
//       : "bg-gray-100 text-gray-400 cursor-not-allowed"
//   }`}
//             >
//               <EnvelopeIcon className="w-4 h-4" />
//               Send Email
//             </button>

//             {/* Connect Email Provider */}
//             {!user?.emailAccessToken && (
//               <>
//                 {emailProvider === "GOOGLE" && (
//                   <button
//                     onClick={connectGmail}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700"
//                   >
//                     Connect Gmail
//                   </button>
//                 )}

//                 {emailProvider === "MICROSOFT" && (
//                   <button
//                     onClick={connectOutlook}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
//                   >
//                     Connect Outlook
//                   </button>
//                 )}

//                 {emailProvider === "SMTP" && (
//                   <button
//                     onClick={() => navigate("/settings/email")}
//                     className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-700 text-white"
//                   >
//                     Configure SMTP
//                   </button>
//                 )}
//               </>
//             )}

//             {/* Email Logs */}
//             <button
//               onClick={() => setShowEmailLogs(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium"
//             >
//               <ClockIcon className="w-4 h-4" />
//               Emails
//             </button>

//             {/* Templates */}
//             <button
//               onClick={() => setShowTemplates(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium"
//             >
//               <DocumentTextIcon className="w-4 h-4" />
//               Templates
//             </button>

//             {/* Edit Deal */}
//             <button
//               onClick={() => navigate(`/deals/${id}/edit`)}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-200 transition-all duration-200"
//             >
//               <PencilSquareIcon className="w-4 h-4" />
//               Edit Deal
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ───────────── STAT CARDS ───────────── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           icon={CurrencyDollarIcon}
//           label="Deal Value"
//           value={formatCurrency(deal.amount)}
//           color="green"
//         />
//         <StatCard
//           icon={ArrowTrendingUpIcon}
//           label="Probability"
//           value={`${probability}%`}
//           subtext={
//             probability >= 75 ? "High" : probability >= 50 ? "Medium" : "Low"
//           }
//           color="purple"
//         />
//         <StatCard
//           icon={CalendarDaysIcon}
//           label="Closing Date"
//           value={formatDate(deal.closingDate)}
//           subtext={getTimeSince(deal.createdAt)}
//           color="blue"
//         />
//         <StatCard
//           icon={ChartBarIcon}
//           label="Current Stage"
//           value={formatLabel(deal.stage)}
//           subtext={`Step ${currentIdx + 1} of ${PROGRESS_STAGES.length}`}
//           color="amber"
//         />
//       </div>

//       {/* ───────────── PIPELINE / STAGE BAR ───────────── */}
//       <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
//         <div className="flex items-center justify-between mb-5">
//           <div className="flex items-center gap-2">
//             <FlagIcon className="w-5 h-5 text-gray-400" />
//             <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
//               Deal Pipeline
//             </h2>
//           </div>

//           {/* probability bar */}
//           <div className="flex items-center gap-3">
//             <span className="text-xs text-gray-500 font-medium">
//               Probability
//             </span>
//             <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
//               <div
//                 className={`h-full rounded-full transition-all duration-500 ${getProbabilityBg(
//                   probability,
//                 )}`}
//                 style={{ width: `${probability}%` }}
//               />
//             </div>
//             <span
//               className={`text-sm font-bold ${getProbabilityColor(
//                 probability,
//               )}`}
//             >
//               {probability}%
//             </span>
//           </div>
//         </div>

//         {/* stages row */}
//         <div className="flex items-center gap-1 overflow-x-auto pb-2">
//           {PROGRESS_STAGES.map((stage, idx) => {
//             const isActive = deal.stage === stage;
//             const isPast = idx < currentIdx;
//             const isFuture = idx > currentIdx;
//             const StageIcon = getStageIcon(stage);
//             const pipelineInfo = PIPELINE_STAGES.find((p) => p.key === stage);

//             return (
//               <div key={stage} className="flex items-center">
//                 <button
//                   disabled={updatingStage}
//                   onClick={() =>
//                     setStageModal({
//                       open: true,
//                       stage,
//                       description: "",
//                     })
//                   }
//                   onMouseEnter={() => setHoveredStage(stage)}
//                   onMouseLeave={() => setHoveredStage(null)}
//                   className={`
//                       relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
//                       transition-all duration-200 whitespace-nowrap border
//                       ${
//                         isActive
//                           ? `${STAGE_COLORS[stage]} border-current shadow-sm scale-105`
//                           : isPast
//                             ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
//                             : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
//                       }
//                       ${updatingStage ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
//                       ${hoveredStage === stage && !isActive ? "ring-2 ring-blue-200" : ""}
//                     `}
//                 >
//                   {isPast && (
//                     <CheckCircleSolid className="w-3.5 h-3.5 text-green-500" />
//                   )}
//                   {StageIcon && isActive && (
//                     <StageIcon className="w-3.5 h-3.5" />
//                   )}
//                   {pipelineInfo?.label || formatLabel(stage)}
//                 </button>

//                 {idx < PROGRESS_STAGES.length - 1 && (
//                   <ArrowRightIcon
//                     className={`w-3 h-3 mx-0.5 flex-shrink-0 ${
//                       isPast ? "text-green-300" : "text-gray-300"
//                     }`}
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {updatingStage && (
//           <div className="flex items-center gap-2 mt-3 text-xs text-blue-600">
//             <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             Updating stage...
//           </div>
//         )}
//       </div>

//       {/* ───────────── TABS ───────────── */}
//       <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
//         <div className="flex border-b border-gray-100">
//           {tabs.map((t) => {
//             const Icon = t.icon;
//             return (
//               <button
//                 key={t.key}
//                 onClick={() => setTab(t.key)}
//                 className={`
//                     flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all
//                     border-b-2 -mb-px
//                     ${
//                       tab === t.key
//                         ? "border-blue-600 text-blue-600 bg-blue-50/30"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//                     }
//                   `}
//               >
//                 <Icon className="w-4 h-4" />
//                 {t.label}
//               </button>
//             );
//           })}
//         </div>

//         <div className="p-6">
//           {/* ═══════════ OVERVIEW TAB ═══════════ */}
//           {tab === "overview" && (
//             <div className="grid lg:grid-cols-3 gap-6">
//               {/* left col */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* deal info */}
//                 <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <BriefcaseIcon className="w-4 h-4 text-gray-400" />
//                     Deal Information
//                   </h3>

//                   <div className="grid sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0">
//                     <div className="divide-y divide-gray-200/60">
//                       <InfoRow icon={TagIcon} label="Product Group">
//                         {formatLabel(deal.productGroup) || "—"}
//                       </InfoRow>
//                       <InfoRow icon={ChartBarIcon} label="Weightage">
//                         <span className="inline-flex items-center gap-1">
//                           {formatLabel(deal.weightage) || "—"}
//                         </span>
//                       </InfoRow>
//                       <InfoRow icon={CalendarDaysIcon} label="Closing Date">
//                         {formatDate(deal.closingDate)}
//                       </InfoRow>
//                     </div>
//                     <div className="divide-y divide-gray-200/60">
//                       <InfoRow icon={UserIcon} label="Person In Charge">
//                         {deal.personInCharge || "—"}
//                       </InfoRow>
//                       <InfoRow icon={ArrowTrendingUpIcon} label="Next Step">
//                         {deal.nextStep || "—"}
//                       </InfoRow>
//                       <InfoRow icon={ShieldCheckIcon} label="Deal Type">
//                         {formatLabel(deal.dealType) || "—"}
//                       </InfoRow>
//                     </div>
//                   </div>
//                 </div>

//                 {/* description */}
//                 {deal.description && (
//                   <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                     <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
//                       <DocumentTextIcon className="w-4 h-4 text-gray-400" />
//                       Description
//                     </h3>
//                     <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
//                       {deal.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* quick stage history */}
//                 <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <ClockIcon className="w-4 h-4 text-gray-400" />
//                     Recent Activity
//                   </h3>

//                   {deal.stageHistory?.length > 0 ? (
//                     <div className="space-y-3">
//                       {deal.stageHistory.slice(0, 5).map((h, i) => (
//                         <div
//                           key={h.id}
//                           className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow"
//                         >
//                           <div
//                             className={`w-8 h-8 rounded-lg flex items-center justify-center ${
//                               STAGE_COLORS[h.stage] || "bg-gray-100"
//                             }`}
//                           >
//                             <SparklesIcon className="w-4 h-4" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-gray-900">
//                               Moved to{" "}
//                               <span className="font-semibold">
//                                 {formatLabel(h.stage)}
//                               </span>
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {h.changedBy?.name} • {formatDate(h.createdAt)}
//                             </p>

//                             {h.description && (
//                               <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">
//                                 {h.description}
//                               </p>
//                             )}
//                           </div>
//                           {i === 0 && (
//                             <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
//                               Latest
//                             </span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-400 italic">
//                       No stage changes recorded yet.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* right sidebar */}
//               <div className="space-y-6">
//                 {/* related account */}
//                 <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
//                     Account
//                   </h3>

//                   {deal.account ? (
//                     <Link
//                       to={`/accounts/${deal.account.id}`}
//                       className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
//                     >
//                       <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
//                         <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
//                           {deal.account.accountName}
//                         </p>
//                         <p className="text-xs text-gray-500">View Account →</p>
//                       </div>
//                     </Link>
//                   ) : (
//                     <p className="text-sm text-gray-400">No account linked</p>
//                   )}
//                 </div>

//                 {/* contact */}
//                 <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <UserCircleIcon className="w-4 h-4 text-gray-400" />
//                     Contact
//                   </h3>

//                   {deal.contact ? (
//                     <Link
//                       to={`/contacts/${deal.contact.id}`}
//                       className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
//                     >
//                       <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
//                         <span className="text-sm font-bold text-purple-600">
//                           {deal.contact.firstName?.[0]}
//                           {deal.contact.lastName?.[0]}
//                         </span>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
//                           {deal.contact.firstName} {deal.contact.lastName}
//                         </p>
//                         {deal.contact.email && (
//                           <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
//                             <EnvelopeIcon className="w-3 h-3" />
//                             {deal.contact.email}
//                           </p>
//                         )}
//                       </div>
//                     </Link>
//                   ) : (
//                     <p className="text-sm text-gray-400">No contact linked</p>
//                   )}
//                 </div>

//                 {/* owner */}
//                 <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
//                   <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
//                     <UserIcon className="w-4 h-4 text-gray-400" />
//                     Deal Owner
//                   </h3>

//                   {deal.owner ? (
//                     <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
//                       <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
//                         <span className="text-sm font-bold text-amber-600">
//                           {deal.owner.name?.[0]}
//                         </span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {deal.owner.name}
//                         </p>
//                         {deal.owner.email && (
//                           <p className="text-xs text-gray-500">
//                             {deal.owner.email}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-400">No owner assigned</p>
//                   )}
//                 </div>

//                 {/* quick stats */}
//                 <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
//                   <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">
//                     Deal Summary
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm opacity-80">Value</span>
//                       <span className="text-lg font-bold">
//                         {formatCurrency(deal.amount)}
//                       </span>
//                     </div>
//                     <div className="h-px bg-white/20" />
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm opacity-80">Probability</span>
//                       <span className="text-lg font-bold">{probability}%</span>
//                     </div>
//                     <div className="h-px bg-white/20" />
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm opacity-80">Weighted Value</span>
//                       <span className="text-lg font-bold">
//                         {formatCurrency(
//                           ((deal.amount || 0) * probability) / 100,
//                         )}
//                       </span>
//                     </div>
//                     <div className="h-px bg-white/20" />
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm opacity-80">Stage Changes</span>
//                       <span className="text-lg font-bold">
//                         {deal.stageHistory?.length || 0}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ═══════════ TIMELINE TAB ═══════════ */}
//           {tab === "timeline" && (
//             <div className="max-w-3xl mx-auto">
//               {deal.stageHistory?.length > 0 ? (
//                 <div className="relative">
//                   {/* vertical line */}
//                   <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

//                   <div className="space-y-1">
//                     {deal.stageHistory.map((h, idx) => {
//                       const isFirst = idx === 0;
//                       const isWon = h.stage === "CLOSED_WON";
//                       const isLost =
//                         h.stage === "CLOSED_LOST" ||
//                         h.stage === "CLOSED_LOST_TO_COMPETITION";

//                       return (
//                         <div
//                           key={h.id}
//                           className="relative flex gap-4 pl-2 group"
//                         >
//                           {/* dot */}
//                           <div
//                             className={`
//                                 relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center
//                                 transition-all flex-shrink-0 mt-4
//                                 ${
//                                   isFirst
//                                     ? "border-blue-500 bg-blue-500 shadow-lg shadow-blue-200"
//                                     : isWon
//                                       ? "border-green-500 bg-green-500"
//                                       : isLost
//                                         ? "border-red-500 bg-red-500"
//                                         : "border-gray-300 bg-white group-hover:border-blue-400"
//                                 }
//                               `}
//                           >
//                             {isFirst ? (
//                               <StarSolid className="w-3.5 h-3.5 text-white" />
//                             ) : isWon ? (
//                               <CheckCircleSolid className="w-3.5 h-3.5 text-white" />
//                             ) : isLost ? (
//                               <XCircleIcon className="w-3.5 h-3.5 text-white" />
//                             ) : (
//                               <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors" />
//                             )}
//                           </div>

//                           {/* content card */}
//                           <div
//                             className={`
//                                 flex-1 p-4 mb-2 rounded-xl border transition-all
//                                 ${
//                                   isFirst
//                                     ? "bg-blue-50/50 border-blue-100 shadow-sm"
//                                     : "bg-white border-gray-100 hover:shadow-sm hover:border-gray-200"
//                                 }
//                               `}
//                           >
//                             <div className="flex items-center justify-between flex-wrap gap-2">
//                               <div className="flex items-center gap-2">
//                                 <span
//                                   className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//                                     STAGE_COLORS[h.stage]
//                                   }`}
//                                 >
//                                   {formatLabel(h.stage)}
//                                 </span>
//                                 {isFirst && (
//                                   <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
//                                     Current
//                                   </span>
//                                 )}
//                               </div>
//                               <span className="text-xs text-gray-400">
//                                 {formatDate(h.createdAt)}
//                               </span>
//                             </div>

//                             <p className="text-sm text-gray-600 mt-2">
//                               Stage changed to{" "}
//                               <span className="font-semibold text-gray-900">
//                                 {formatLabel(h.stage)}
//                               </span>
//                             </p>

//                             {h.description && (
//                               <p className="text-sm text-gray-500 mt-1 italic">
//                                 "{h.description}"
//                               </p>
//                             )}

//                             {h.changedBy?.name && (
//                               <div className="flex items-center gap-2 mt-2">
//                                 <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
//                                   <span className="text-[10px] font-bold text-gray-600">
//                                     {h.changedBy.name[0]}
//                                   </span>
//                                 </div>
//                                 <span className="text-xs text-gray-500">
//                                   {h.changedBy.name}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-16">
//                   <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 font-medium">
//                     No timeline events yet
//                   </p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Stage changes will appear here
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ═══════════ HISTORY TABLE TAB ═══════════ */}
//           {tab === "history" && (
//             <div>
//               {deal.stageHistory?.length > 0 ? (
//                 <div className="overflow-hidden rounded-xl border border-gray-200">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           #
//                         </th>
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Stage
//                         </th>
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Changed By
//                         </th>
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Date
//                         </th>
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Notes
//                         </th>
//                         <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           Time Elapsed
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {deal.stageHistory.map((h, idx) => (
//                         <tr
//                           key={h.id}
//                           className="hover:bg-gray-50/50 transition-colors"
//                         >
//                           <td className="px-4 py-3 text-gray-400 font-mono text-xs">
//                             {idx + 1}
//                           </td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
//                                 STAGE_COLORS[h.stage]
//                               }`}
//                             >
//                               {formatLabel(h.stage)}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <div className="flex items-center gap-2">
//                               {h.changedBy?.name && (
//                                 <>
//                                   <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
//                                     <span className="text-[10px] font-bold text-gray-600">
//                                       {h.changedBy.name[0]}
//                                     </span>
//                                   </div>
//                                   <span className="text-gray-700 font-medium">
//                                     {h.changedBy.name}
//                                   </span>
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-4 py-3 text-gray-600">
//                             {formatDate(h.createdAt)}
//                           </td>
//                           <td className="px-4 py-3 text-xs relative overflow-visible">
//                             {h.description ? (
//                               <div
//                                 className="relative w-fit"
//                                 onMouseEnter={() =>
//                                   setHoveredStage(`note-${h.id}`)
//                                 }
//                                 onMouseLeave={() => setHoveredStage(null)}
//                               >
//                                 <button
//                                   onClick={() =>
//                                     setNotesModal({
//                                       open: true,
//                                       historyId: h.id,
//                                       description: h.description || "",
//                                     })
//                                   }
//                                   className="text-blue-600 hover:text-blue-800 font-medium underline"
//                                 >
//                                   Click to view
//                                 </button>

//                                 {/* 🔥 HOVER PREVIEW CARD */}
//                                 {hoveredStage === `note-${h.id}` && (
//                                   <div
//                                     className="
//       absolute left-0 top-full mt-2
//       z-50 w-80
//       bg-white border border-gray-200
//       rounded-xl shadow-xl p-4
//     "
//                                   >
//                                     <p className="text-xs text-gray-500 mb-2 font-semibold">
//                                       Notes Preview
//                                     </p>

//                                     {/* ✅ FIXED CONTENT */}
//                                     <div className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-hidden">
//                                       <p className="break-words whitespace-pre-wrap">
//                                         {h.description}
//                                       </p>
//                                     </div>

//                                     <div className="text-[10px] text-gray-400 mt-2">
//                                       Click to edit →
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-gray-400 text-xs">
//                             {getTimeSince(h.createdAt)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-16">
//                   <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 font-medium">
//                     No stage history recorded
//                   </p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Changes to the deal stage will be tracked here
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* SEND EMAIL MODAL */}
//       {showSendEmail && (
//         <SendEmailModal deal={deal} onClose={() => setShowSendEmail(false)} />
//       )}

//       {/* EMAIL TEMPLATE MANAGER */}
//       {showTemplates && (
//         <EmailTemplateManager onClose={() => setShowTemplates(false)} />
//       )}

//       {/* EMAIL LOGS */}
//       {showEmailLogs && (
//         <EmailLogs dealId={deal.id} onClose={() => setShowEmailLogs(false)} />
//       )}

//       {stageModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
//             onClick={() =>
//               setStageModal({ open: false, stage: null, description: "" })
//             }
//           />

//           <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
//             <h2 className="text-lg font-bold text-gray-900 mb-2">
//               Update Stage
//             </h2>

//             <p className="text-sm text-gray-500 mb-4">
//               Add notes for{" "}
//               <span className="font-semibold">
//                 {formatLabel(stageModal.stage)}
//               </span>
//             </p>

//             <textarea
//               rows={4}
//               value={stageModal.description}
//               onChange={(e) =>
//                 setStageModal((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               placeholder="Enter reason / notes..."
//               className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() =>
//                   setStageModal({ open: false, stage: null, description: "" })
//                 }
//                 className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleStageChange}
//                 className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {notesModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-sm"
//             onClick={() =>
//               setNotesModal({ open: false, historyId: null, description: "" })
//             }
//           />

//           {/* modal */}
//           <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-50">
//             <h2 className="text-lg font-bold text-gray-900 mb-2">
//               Stage Notes
//             </h2>

//             <textarea
//               rows={6}
//               value={notesModal.description}
//               onChange={(e) =>
//                 setNotesModal((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() =>
//                   setNotesModal({
//                     open: false,
//                     historyId: null,
//                     description: "",
//                   })
//                 }
//                 className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={async () => {
//                   try {
//                     await API.put(
//                       `/deals/stage-history/${notesModal.historyId}`,
//                       {
//                         description: notesModal.description,
//                       },
//                     );

//                     // refresh deal
//                     dispatch(fetchDeal(id));

//                     setNotesModal({
//                       open: false,
//                       historyId: null,
//                       description: "",
//                     });
//                   } catch (err) {
//                     console.error(err);
//                   }
//                 }}
//                 className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default DealDetail;

// ==========================================================================================================================================================================

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

// src/features/deals/DealDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
import SendEmailModal from "../email/components/SendEmailModal";
import EmailTemplateManager from "../email/components/EmailTemplateManager";
import EmailLogs from "../email/components/EmailLogs";
import { fetchMe } from "../auth/authSlice";
import API from "../../api/axios";
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
  EllipsisVerticalIcon,
  ChevronDownIcon,
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
  if (prob >= 75) return "text-emerald-600";
  if (prob >= 50) return "text-amber-600";
  if (prob >= 25) return "text-orange-600";
  return "text-red-600";
};

const getProbabilityBg = (prob) => {
  if (prob >= 75) return "bg-emerald-500";
  if (prob >= 50) return "bg-amber-500";
  if (prob >= 25) return "bg-orange-500";
  return "bg-red-500";
};

const getProbabilityRingColor = (prob) => {
  if (prob >= 75) return "stroke-emerald-500";
  if (prob >= 50) return "stroke-amber-500";
  if (prob >= 25) return "stroke-orange-500";
  return "stroke-red-500";
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

const detectEmailProvider = (email) => {
  if (!email) return "SMTP";
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain.includes("gmail.com")) return "GOOGLE";
  if (
    domain.includes("outlook.com") ||
    domain.includes("hotmail.com") ||
    domain.includes("live.com")
  ) {
    return "MICROSOFT";
  }
  return "SMTP";
};

/* ────────────────── Info Row Component ────────────────── */

const InfoRow = ({ icon: Icon, label, children, className = "" }) => (
  <div
    className={`flex items-start gap-3 py-3.5 group hover:bg-white/60 -mx-2 px-2 rounded-xl transition-colors duration-200 ${className}`}
  >
    <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:shadow-md group-hover:border-blue-100 transition-all duration-200">
      <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-sm font-medium text-gray-800">{children}</div>
    </div>
  </div>
);

/* ────────────────── Circular Progress ────────────────── */

const CircularProgress = ({ percentage, size = 56, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={getProbabilityRingColor(percentage)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <span
        className={`absolute text-xs font-bold ${getProbabilityColor(percentage)}`}
      >
        {percentage}%
      </span>
    </div>
  );
};

/* ────────────────── Stat Card Component ────────────────── */

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color = "blue",
  accent,
}) => {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
      border: "border-blue-100",
      glow: "group-hover:shadow-blue-100/50",
    },
    green: {
      bg: "bg-emerald-50",
      icon: "text-emerald-500",
      border: "border-emerald-100",
      glow: "group-hover:shadow-emerald-100/50",
    },
    purple: {
      bg: "bg-violet-50",
      icon: "text-violet-500",
      border: "border-violet-100",
      glow: "group-hover:shadow-violet-100/50",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-500",
      border: "border-amber-100",
      glow: "group-hover:shadow-amber-100/50",
    },
  };

  const c = colors[color];

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg ${c.glow} transition-all duration-300 group cursor-default`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border ${c.bg} ${c.border} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {subtext && (
          <span className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">
            {subtext}
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
        {value}
      </p>
      <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  );
};

/* ────────────────── Mobile Action Menu ────────────────── */

const MobileActionMenu = ({
  isOpen,
  onToggle,
  user,
  emailProvider,
  deal,
  navigate,
  id,
  connectGmail,
  connectOutlook,
  setShowSendEmail,
  setShowEmailLogs,
  setShowTemplates,
}) => (
  <div className="relative lg:hidden">
    <button
      onClick={onToggle}
      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
    >
      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
    </button>

    {isOpen && (
      <>
        <div className="fixed inset-0 z-40" onClick={onToggle} />
        <div className="absolute right-0 top-12 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            disabled={!user?.emailProvider}
            onClick={() => {
              if (!user?.emailProvider) {
                alert("Please connect your email provider first");
                return;
              }
              if (!deal.contact?.email) {
                alert("Contact email not available for this deal");
                return;
              }
              setShowSendEmail(true);
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
            Send Email
          </button>

          <button
            onClick={() => {
              setShowEmailLogs(true);
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ClockIcon className="w-4 h-4 text-gray-400" />
            Email Logs
          </button>

          <button
            onClick={() => {
              setShowTemplates(true);
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <DocumentTextIcon className="w-4 h-4 text-gray-400" />
            Templates
          </button>

          <div className="h-px bg-gray-100 my-1" />

          {!user?.emailAccessToken && emailProvider === "GOOGLE" && (
            <button
              onClick={() => {
                connectGmail();
                onToggle();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Connect Gmail
            </button>
          )}

          {!user?.emailAccessToken && emailProvider === "MICROSOFT" && (
            <button
              onClick={() => {
                connectOutlook();
                onToggle();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Connect Outlook
            </button>
          )}

          {!user?.emailAccessToken && emailProvider === "SMTP" && (
            <button
              onClick={() => {
                navigate("/settings/email");
                onToggle();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ShieldCheckIcon className="w-4 h-4" />
              Configure SMTP
            </button>
          )}

          <div className="h-px bg-gray-100 my-1" />

          <button
            onClick={() => {
              navigate(`/deals/${id}/edit`);
              onToggle();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit Deal
          </button>
        </div>
      </>
    )}
  </div>
);

/* ════════════════════ MAIN COMPONENT ════════════════════ */

const DealDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);
  const { user } = useSelector((state) => state.auth);

  const emailProvider = user?.emailProvider || detectEmailProvider(user?.email);

  const [tab, setTab] = useState("overview");
  const [updatingStage, setUpdatingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmailLogs, setShowEmailLogs] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pipelineExpanded, setPipelineExpanded] = useState(false);

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [stageModal, setStageModal] = useState({
    open: false,
    stage: null,
    description: "",
  });

  const [notesModal, setNotesModal] = useState({
    open: false,
    historyId: null,
    description: "",
  });

  const connectGmail = async () => {
    const res = await fetch(`${API}/email/connect/google`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const connectOutlook = async () => {
    const res = await fetch(`${API}/email/connect/outlook`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  useEffect(() => {
    dispatch(fetchDeal(id));
    console.log("🔄 Refreshing logged-in user after OAuth");
    dispatch(fetchMe());
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  /* ── stage change ── */

  const handleStageChange = async () => {
    if (stageModal.stage === deal.stage) return;
    try {
      setUpdatingStage(true);
      await dispatch(
        updateDeal({
          id,
          stage: stageModal.stage,
          description: stageModal.description,
        }),
      ).unwrap();
      setStageModal({ open: false, stage: null, description: "" });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 space-y-4 sm:space-y-6 pb-10">
      {/* ───────────── HEADER ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            {/* LEFT SIDE */}
            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
              {/* back btn */}
              <button
                onClick={() => navigate("/deals")}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 flex-shrink-0 hover:scale-105 active:scale-95"
              >
                <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </button>

              {/* icon */}
              <div
                className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                  isClosed && deal.stage === "CLOSED_WON"
                    ? "bg-gradient-to-br from-emerald-400 to-green-500"
                    : isClosed
                      ? "bg-gradient-to-br from-red-400 to-rose-500"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                }`}
              >
                <CurrencyDollarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>

              {/* title */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                    {deal.dealName}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                      STAGE_COLORS[deal.stage]
                    }`}
                  >
                    {formatLabel(deal.stage)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500">
                  <span className="font-mono text-[10px] sm:text-xs bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-md">
                    {deal.dealLogId}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(deal.amount)}
                  </span>
                  {deal.closingDate && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        Closing: {formatDate(deal.closingDate)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile action menu */}
            <MobileActionMenu
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              user={user}
              emailProvider={emailProvider}
              deal={deal}
              navigate={navigate}
              id={id}
              connectGmail={connectGmail}
              connectOutlook={connectOutlook}
              setShowSendEmail={setShowSendEmail}
              setShowEmailLogs={setShowEmailLogs}
              setShowTemplates={setShowTemplates}
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 pt-2 border-t border-gray-50">
            <button
              disabled={!user?.emailProvider}
              onClick={() => {
                if (!user?.emailProvider) {
                  alert("Please connect your email provider first");
                  return;
                }
                if (!deal.contact?.email) {
                  alert("Contact email not available for this deal");
                  return;
                }
                setShowSendEmail(true);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  user?.emailProvider
                    ? "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100"
                }`}
            >
              <EnvelopeIcon className="w-4 h-4" />
              Send Email
            </button>

            {!user?.emailAccessToken && (
              <>
                {emailProvider === "GOOGLE" && (
                  <button
                    onClick={connectGmail}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 hover:shadow-md hover:shadow-red-200"
                  >
                    Connect Gmail
                  </button>
                )}
                {emailProvider === "MICROSOFT" && (
                  <button
                    onClick={connectOutlook}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-md hover:shadow-blue-200"
                  >
                    Connect Outlook
                  </button>
                )}
                {emailProvider === "SMTP" && (
                  <button
                    onClick={() => navigate("/settings/email")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-700 text-white hover:bg-gray-800 transition-all duration-200"
                  >
                    Configure SMTP
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setShowEmailLogs(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm"
            >
              <ClockIcon className="w-4 h-4 text-gray-400" />
              Emails
            </button>

            <button
              onClick={() => setShowTemplates(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-sm"
            >
              <DocumentTextIcon className="w-4 h-4 text-gray-400" />
              Templates
            </button>

            <div className="flex-1" />

            <button
              onClick={() => navigate(`/deals/${id}/edit`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-200 transition-all duration-200 hover:shadow-md hover:shadow-blue-300 active:scale-[0.98]"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Deal
            </button>
          </div>

          {/* Mobile Edit Button */}
          <div className="lg:hidden">
            <button
              onClick={() => navigate(`/deals/${id}/edit`)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Deal
            </button>
          </div>
        </div>
      </div>

      {/* ───────────── STAT CARDS ───────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            probability >= 75 ? "High" : probability >= 50 ? "Medium" : "Low"
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
          subtext={`Step ${currentIdx + 1}/${PROGRESS_STAGES.length}`}
          color="amber"
        />
      </div>

      {/* ───────────── PIPELINE / STAGE BAR ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <FlagIcon className="w-4 h-4 text-amber-500" />
            </div>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Pipeline
            </h2>
          </div>

          {/* probability indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:block text-xs text-gray-500 font-medium">
              Win Probability
            </span>
            <CircularProgress
              percentage={probability}
              size={44}
              strokeWidth={3}
            />
          </div>
        </div>

        {/* Mobile: Compact pipeline view */}
        <div className="sm:hidden">
          <button
            onClick={() => setPipelineExpanded(!pipelineExpanded)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mb-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  STAGE_COLORS[deal.stage]
                }`}
              >
                {formatLabel(deal.stage)}
              </span>
              <span className="text-xs text-gray-400">
                Step {currentIdx + 1} of {PROGRESS_STAGES.length}
              </span>
            </div>
            <ChevronDownIcon
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                pipelineExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Progress bar for mobile */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${((currentIdx + 1) / PROGRESS_STAGES.length) * 100}%`,
              }}
            />
          </div>

          {pipelineExpanded && (
            <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {PROGRESS_STAGES.map((stage, idx) => {
                const isActive = deal.stage === stage;
                const isPast = idx < currentIdx;
                const pipelineInfo = PIPELINE_STAGES.find(
                  (p) => p.key === stage,
                );

                return (
                  <button
                    key={stage}
                    disabled={updatingStage}
                    onClick={() =>
                      setStageModal({ open: true, stage, description: "" })
                    }
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium
                      transition-all duration-200 border text-left
                      ${
                        isActive
                          ? `${STAGE_COLORS[stage]} border-current shadow-sm`
                          : isPast
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-500 border-gray-200"
                      }
                      ${updatingStage ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-95"}
                    `}
                  >
                    {isPast && (
                      <CheckCircleSolid className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    )}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-current flex-shrink-0 animate-pulse" />
                    )}
                    <span className="truncate">
                      {pipelineInfo?.label || formatLabel(stage)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop: Full pipeline stages */}
        <div className="hidden sm:flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {PROGRESS_STAGES.map((stage, idx) => {
            const isActive = deal.stage === stage;
            const isPast = idx < currentIdx;
            const StageIcon = getStageIcon(stage);
            const pipelineInfo = PIPELINE_STAGES.find((p) => p.key === stage);

            return (
              <div key={stage} className="flex items-center">
                <button
                  disabled={updatingStage}
                  onClick={() =>
                    setStageModal({ open: true, stage, description: "" })
                  }
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`
                    relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                    transition-all duration-200 whitespace-nowrap border
                    ${
                      isActive
                        ? `${STAGE_COLORS[stage]} border-current shadow-sm scale-105`
                        : isPast
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:text-gray-700"
                    }
                    ${updatingStage ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                    ${hoveredStage === stage && !isActive ? "ring-2 ring-blue-200 ring-offset-1" : ""}
                  `}
                >
                  {isPast && (
                    <CheckCircleSolid className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  {StageIcon && isActive && (
                    <StageIcon className="w-3.5 h-3.5" />
                  )}
                  {isActive && !StageIcon && (
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
                  {pipelineInfo?.label || formatLabel(stage)}
                </button>

                {idx < PROGRESS_STAGES.length - 1 && (
                  <ArrowRightIcon
                    className={`w-3 h-3 mx-0.5 flex-shrink-0 ${
                      isPast ? "text-emerald-300" : "text-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {updatingStage && (
          <div className="flex items-center gap-2 mt-3 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Updating stage...
          </div>
        )}
      </div>

      {/* ───────────── TABS ───────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-medium transition-all
                  border-b-2 -mb-px whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start
                  ${
                    tab === t.key
                      ? "border-blue-600 text-blue-600 bg-blue-50/40"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* left col */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* deal info */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <BriefcaseIcon className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    Deal Information
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-x-6">
                    <div className="divide-y divide-gray-100">
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
                    <div className="divide-y divide-gray-100">
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
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                        <DocumentTextIcon className="w-3.5 h-3.5 text-violet-500" />
                      </div>
                      Description
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap bg-white rounded-xl p-4 border border-gray-100">
                      {deal.description}
                    </p>
                  </div>
                )}

                {/* recent activity */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                      <ClockIcon className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    Recent Activity
                  </h3>

                  {deal.stageHistory?.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {deal.stageHistory.slice(0, 5).map((h, i) => (
                        <div
                          key={h.id}
                          className="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              STAGE_COLORS[h.stage] || "bg-gray-100"
                            } group-hover:scale-110 transition-transform duration-200`}
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
                            <p className="text-xs text-gray-500 mt-0.5">
                              {h.changedBy?.name} • {formatDate(h.createdAt)}
                            </p>
                            {h.description && (
                              <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">
                                {h.description}
                              </p>
                            )}
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
                              Latest
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                      <ClockIcon className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 italic">
                        No stage changes recorded yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* right sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* related account */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    Account
                  </h3>

                  {deal.account ? (
                    <Link
                      to={`/accounts/${deal.account.id}`}
                      className="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {deal.account.accountName}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                          View Account →
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                      <BuildingOfficeIcon className="w-8 h-8 text-gray-200 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">No account linked</p>
                    </div>
                  )}
                </div>

                {/* contact */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                      <UserCircleIcon className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    Contact
                  </h3>

                  {deal.contact ? (
                    <Link
                      to={`/contacts/${deal.contact.id}`}
                      className="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-violet-200 transition-all duration-200 group active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <span className="text-sm font-bold text-violet-600">
                          {deal.contact.firstName?.[0]}
                          {deal.contact.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-600 transition-colors truncate">
                          {deal.contact.firstName} {deal.contact.lastName}
                        </p>
                        {deal.contact.email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <EnvelopeIcon className="w-3 h-3 flex-shrink-0" />
                            {deal.contact.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                      <UserCircleIcon className="w-8 h-8 text-gray-200 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">No contact linked</p>
                    </div>
                  )}
                </div>

                {/* owner */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                      <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    Deal Owner
                  </h3>

                  {deal.owner ? (
                    <div className="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-gray-100">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
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
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200">
                      <UserIcon className="w-8 h-8 text-gray-200 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">No owner assigned</p>
                    </div>
                  )}
                </div>

                {/* deal summary card */}
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-blue-200/30 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80 relative z-10">
                    Deal Summary
                  </h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Value</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(deal.amount)}
                      </span>
                    </div>
                    <div className="h-px bg-white/15" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Probability</span>
                      <span className="text-lg font-bold">{probability}%</span>
                    </div>
                    <div className="h-px bg-white/15" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-80">Weighted Value</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(
                          ((deal.amount || 0) * probability) / 100,
                        )}
                      </span>
                    </div>
                    <div className="h-px bg-white/15" />
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
                  <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

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
                          className="relative flex gap-3 sm:gap-4 pl-0 sm:pl-2 group"
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
                                    ? "border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-200"
                                    : isLost
                                      ? "border-red-500 bg-red-500 shadow-md shadow-red-200"
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
                              flex-1 p-3 sm:p-4 mb-2 rounded-xl border transition-all duration-200
                              ${
                                isFirst
                                  ? "bg-blue-50/50 border-blue-100 shadow-sm"
                                  : "bg-white border-gray-100 hover:shadow-md hover:border-gray-200"
                              }
                            `}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    STAGE_COLORS[h.stage]
                                  }`}
                                >
                                  {formatLabel(h.stage)}
                                </span>
                                {isFirst && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-medium">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] sm:text-xs text-gray-400">
                                {formatDate(h.createdAt)}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-600 mt-2">
                              Stage changed to{" "}
                              <span className="font-semibold text-gray-900">
                                {formatLabel(h.stage)}
                              </span>
                            </p>

                            {h.description && (
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 italic bg-white/60 rounded-lg p-2 border border-gray-50">
                                "{h.description}"
                              </p>
                            )}

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
                <div className="text-center py-16 sm:py-20">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-base">
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
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50/80">
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            #
                          </th>
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Stage
                          </th>
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Changed By
                          </th>
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Notes
                          </th>
                          <th className="text-left px-4 py-3.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            Time Elapsed
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {deal.stageHistory.map((h, idx) => (
                          <tr
                            key={h.id}
                            className="hover:bg-blue-50/30 transition-colors duration-150"
                          >
                            <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">
                              {idx + 1}
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  STAGE_COLORS[h.stage]
                                }`}
                              >
                                {formatLabel(h.stage)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
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
                            <td className="px-4 py-3.5 text-gray-600">
                              {formatDate(h.createdAt)}
                            </td>
                            <td className="px-4 py-3.5 text-xs">
                              {h.description ? (
                                <div className="w-fit">
                                  {/* Trigger */}
                                  <button
                                    onMouseEnter={(e) => {
                                      const rect =
                                        e.currentTarget.getBoundingClientRect();

                                      setTooltipPosition({
                                        x: Math.min(
                                          rect.left,
                                          window.innerWidth - 320,
                                        ), // prevent overflow
                                        y: rect.bottom + 8,
                                      });

                                      setHoveredStage(`note-${h.id}`);
                                    }}
                                    onMouseLeave={() => setHoveredStage(null)}
                                    onClick={() =>
                                      setNotesModal({
                                        open: true,
                                        historyId: h.id,
                                        description: h.description || "",
                                      })
                                    }
                                    className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2 decoration-blue-300 hover:decoration-blue-500 transition-colors"
                                  >
                                    Click to view
                                  </button>

                                  {/* Tooltip (rendered outside table flow using fixed) */}
                                  {hoveredStage === `note-${h.id}` && (
                                    <div
                                      onMouseEnter={() =>
                                        setHoveredStage(`note-${h.id}`)
                                      }
                                      onMouseLeave={() => setHoveredStage(null)}
                                      className="fixed z-[9999] w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 animate-in fade-in duration-150"
                                      style={{
                                        top: tooltipPosition.y,
                                        left: tooltipPosition.x,
                                      }}
                                    >
                                      <p className="text-xs text-gray-500 mb-2 font-semibold flex items-center gap-1">
                                        <DocumentTextIcon className="w-3 h-3" />
                                        Notes Preview
                                      </p>

                                      <div className="text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto pr-1">
                                        <p className="break-words whitespace-pre-wrap text-[13px] leading-6">
                                          {h.description}
                                        </p>
                                      </div>

                                      <div className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
                                        Click to edit →
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-gray-400 text-xs">
                              <span className="bg-gray-50 px-2 py-0.5 rounded-md">
                                {getTimeSince(h.createdAt)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {deal.stageHistory.map((h, idx) => (
                      <div
                        key={h.id}
                        className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                STAGE_COLORS[h.stage]
                              }`}
                            >
                              {formatLabel(h.stage)}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                            {getTimeSince(h.createdAt)}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {h.changedBy?.name && (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-gray-600">
                                  {h.changedBy.name[0]}
                                </span>
                              </div>
                              <span className="text-gray-700 font-medium">
                                {h.changedBy.name}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 text-gray-500">
                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                            {formatDate(h.createdAt)}
                          </div>

                          {h.description && (
                            <button
                              onClick={() =>
                                setNotesModal({
                                  open: true,
                                  historyId: h.id,
                                  description: h.description || "",
                                })
                              }
                              className="w-full text-left p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-blue-700"
                            >
                              <p className="text-[10px] font-semibold text-blue-500 mb-1">
                                Notes
                              </p>
                              <p className="line-clamp-2 text-xs">
                                {h.description}
                              </p>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 sm:py-20">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium text-base">
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

      {/* ───────────── MODALS ───────────── */}

      {/* SEND EMAIL MODAL */}
      {showSendEmail && (
        <SendEmailModal deal={deal} onClose={() => setShowSendEmail(false)} />
      )}

      {/* EMAIL TEMPLATE MANAGER */}
      {showTemplates && (
        <EmailTemplateManager onClose={() => setShowTemplates(false)} />
      )}

      {/* EMAIL LOGS */}
      {showEmailLogs && (
        <EmailLogs dealId={deal.id} onClose={() => setShowEmailLogs(false)} />
      )}

      {/* STAGE UPDATE MODAL */}
      {stageModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() =>
              setStageModal({ open: false, stage: null, description: "" })
            }
          />

          <div className="relative z-50 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Drag handle for mobile */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <FlagIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Update Stage
                </h2>
                <p className="text-sm text-gray-500">
                  Moving to{" "}
                  <span className="font-semibold text-gray-700">
                    {formatLabel(stageModal.stage)}
                  </span>
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={stageModal.description}
              onChange={(e) =>
                setStageModal((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Add notes or reason for this change..."
              className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50/50 placeholder:text-gray-400 transition-all duration-200"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  setStageModal({ open: false, stage: null, description: "" })
                }
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition-colors active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleStageChange}
                disabled={updatingStage}
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
              >
                {updatingStage ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {notesModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setNotesModal({ open: false, historyId: null, description: "" })
            }
          />

          {/* modal */}
          <div className="relative w-full max-w-sm sm:max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Stage Notes
                </h2>
                <p className="text-xs text-gray-500">
                  Add or update notes for this stage
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto">
              <textarea
                rows={6}
                value={notesModal.description}
                onChange={(e) =>
                  setNotesModal((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-[14px] leading-7 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="Write detailed notes about this stage..."
              />

              {/* Helper text */}
              <p className="text-[11px] text-gray-400 mt-2">
                Tip: Keep notes clear and actionable for better tracking
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() =>
                  setNotesModal({
                    open: false,
                    historyId: null,
                    description: "",
                  })
                }
                className="px-4 py-2.5 text-sm rounded-xl bg-white border border-gray-200 hover:bg-gray-100 font-medium text-gray-700 transition-all active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await API.put(
                      `/deals/stage-history/${notesModal.historyId}`,
                      {
                        description: notesModal.description,
                      },
                    );
                    dispatch(fetchDeal(id));
                    setNotesModal({
                      open: false,
                      historyId: null,
                      description: "",
                    });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="px-6 py-2.5 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 transition-all active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetail;
