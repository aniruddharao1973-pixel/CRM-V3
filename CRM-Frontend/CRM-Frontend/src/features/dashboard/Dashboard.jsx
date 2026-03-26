// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { fetchAccounts } from "../accounts/accountSlice";
// import { fetchContacts } from "../contacts/contactSlice";
// import { fetchDeals, fetchPipelineStats } from "../deals/dealSlice";
// import { formatCurrency } from "../../constants";
// import Spinner from "../../components/Spinner";
// import {
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   TrophyIcon,
// } from "@heroicons/react/24/outline";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const hasFetched = useRef(false);

//   const { pagination: accPag, loading: accLoading } = useSelector((s) => s.accounts);
//   const { pagination: conPag, loading: conLoading } = useSelector((s) => s.contacts);
//   const { pagination: dealPag, pipelineStats, loading: dealLoading } = useSelector((s) => s.deals);

//   useEffect(() => {
//     // Only fetch once
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       dispatch(fetchAccounts({ page: 1, limit: 1 }));
//       dispatch(fetchContacts({ page: 1, limit: 1 }));
//       dispatch(fetchDeals({ page: 1, limit: 1 }));
//       dispatch(fetchPipelineStats());
//     }
//   }, [dispatch]);

//   const isLoading = accLoading || conLoading || dealLoading;

//   const stats = [
//     {
//       label: "Total Accounts",
//       value: accPag?.total ?? "—",
//       icon: BuildingOffice2Icon,
//       lightColor: "bg-blue-100 text-blue-700",
//       link: "/accounts",
//     },
//     {
//       label: "Total Contacts",
//       value: conPag?.total ?? "—",
//       icon: UserGroupIcon,
//       lightColor: "bg-purple-100 text-purple-700",
//       link: "/contacts",
//     },
//     {
//       label: "Total Deals",
//       value: dealPag?.total ?? "—",
//       icon: CurrencyDollarIcon,
//       lightColor: "bg-green-100 text-green-700",
//       link: "/deals",
//     },
//     {
//       label: "Won Revenue",
//       value: pipelineStats?.wonRevenue ? formatCurrency(pipelineStats.wonRevenue) : "—",
//       icon: TrophyIcon,
//       lightColor: "bg-amber-100 text-amber-700",
//       link: "/deals/pipeline",
//     },
//   ];

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="page-title">Dashboard</h1>
//         <p className="text-gray-500 text-sm mt-1">Overview of your CRM data</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat) => (
//           <Link
//             key={stat.label}
//             to={stat.link}
//             className="card hover:shadow-md transition-all group"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.lightColor}`}>
//                 <stat.icon className="w-5 h-5" />
//               </div>
//             </div>
//             <p className="text-sm text-gray-500">{stat.label}</p>
//             <p className="text-2xl font-bold text-gray-900 mt-1">
//               {isLoading ? <span className="animate-pulse">...</span> : stat.value}
//             </p>
//           </Link>
//         ))}
//       </div>

//       {/* Pipeline Summary */}
//       <div className="card">
//         <h2 className="section-title mb-4">Pipeline Summary</h2>
//         {isLoading ? (
//           <Spinner className="py-8" />
//         ) : pipelineStats?.stages && pipelineStats.stages.length > 0 ? (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {pipelineStats.stages.map((s) => (
//                 <div
//                   key={s.stage}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {s.stage.replace(/_/g, " ")}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {s._count.id} deal{s._count.id !== 1 ? "s" : ""}
//                     </p>
//                   </div>
//                   <p className="text-sm font-semibold text-gray-700">
//                     {formatCurrency(s._sum.amount || 0)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
//               <p className="text-sm font-medium text-gray-500">Total Pipeline Value</p>
//               <p className="text-lg font-bold text-gray-900">
//                 {formatCurrency(pipelineStats.totalRevenue || 0)}
//               </p>
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-gray-400 text-sm">No pipeline data yet</p>
//             <Link to="/deals/new" className="link text-sm mt-2 inline-block">
//               Create your first deal
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchDashboardAnalytics,
//   fetchDealsByStage,
//   fetchMonthlyTrend,
//   fetchTopPerformers,
//   fetchDealsBySource,
// } from "../analytics/analyticsSlice";
// import { formatIndianNumber } from "../../constants";
// import Spinner from "../../components/Spinner";
// import StatCard from "./components/StatCard";
// import StageChart from "./components/StageChart";
// import MonthlyTrendChart from "./components/MonthlyTrendChart";
// import TopPerformers from "./components/TopPerformers";
// import DealsClosingSoon from "./components/DealsClosingSoon";
// import WinRateGauge from "./components/WinRateGauge";
// import LeadSourceChart from "./components/LeadSourceChart";
// import {
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   CurrencyRupeeIcon,
//   ChartBarIcon,
//   TrophyIcon,
//   ArrowTrendingUpIcon,
//   ClipboardDocumentListIcon,
//   BanknotesIcon,
// } from "@heroicons/react/24/outline";

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const hasFetched = useRef(false);

//   const {
//     dashboard,
//     dealsByStage,
//     monthlyTrend,
//     topPerformers,
//     dealsBySource,
//     loading,
//   } = useSelector((s) => s.analytics);

//   useEffect(() => {
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       dispatch(fetchDashboardAnalytics());
//       dispatch(fetchDealsByStage());
//       dispatch(fetchMonthlyTrend(6));
//       dispatch(fetchTopPerformers(5));
//       dispatch(fetchDealsBySource());
//     }
//   }, [dispatch]);

//   if (loading && !dashboard) {
//     return <Spinner className="py-20" size="lg" />;
//   }

//   const summary = dashboard?.summary || {};
//   const deals = dashboard?.deals || {};
//   const thisMonth = dashboard?.thisMonth || {};

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="page-title">Dashboard</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Welcome back! Here's what's happening with your sales.
//           </p>
//         </div>
//         <div className="text-right hidden sm:block">
//           <p className="text-sm text-gray-500">
//             {new Date().toLocaleDateString("en-IN", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>

//       {/* Main Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Pipeline"
//           value={formatIndianNumber(summary.totalPipelineValue)}
//           subtitle={`${summary.totalDeals || 0} deals`}
//           icon={CurrencyRupeeIcon}
//           color="blue"
//           onClick={() => navigate("/deals")}
//         />
//         <StatCard
//           title="Won Revenue"
//           value={formatIndianNumber(deals.won?.amount)}
//           subtitle={`${deals.won?.count || 0} deals closed`}
//           icon={TrophyIcon}
//           color="green"
//           onClick={() => navigate("/deals?stage=CLOSED_WON")}
//         />
//         <StatCard
//           title="Open Deals"
//           value={formatIndianNumber(deals.open?.amount)}
//           subtitle={`${deals.open?.count || 0} active deals`}
//           icon={ClipboardDocumentListIcon}
//           color="purple"
//           onClick={() => navigate("/deals")}
//         />
//         <StatCard
//           title="This Month"
//           value={formatIndianNumber(thisMonth.wonAmount)}
//           subtitle={`${thisMonth.wonDeals || 0} deals won`}
//           trend={thisMonth.growth}
//           trendLabel="vs last month"
//           icon={ArrowTrendingUpIcon}
//           color="amber"
//         />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         <div
//           className="card py-4 cursor-pointer hover:shadow-md transition-all"
//           onClick={() => navigate("/accounts")}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {summary.totalAccounts || 0}
//               </p>
//               <p className="text-xs text-gray-500">Accounts</p>
//             </div>
//           </div>
//         </div>

//         <div
//           className="card py-4 cursor-pointer hover:shadow-md transition-all"
//           onClick={() => navigate("/contacts")}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <UserGroupIcon className="w-5 h-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {summary.totalContacts || 0}
//               </p>
//               <p className="text-xs text-gray-500">Contacts</p>
//             </div>
//           </div>
//         </div>

//         <div className="card py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <BanknotesIcon className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {formatIndianNumber(summary.averageDealSize)}
//               </p>
//               <p className="text-xs text-gray-500">Avg Deal Size</p>
//             </div>
//           </div>
//         </div>

//         <div
//           className="card py-4 cursor-pointer hover:shadow-md transition-all"
//           onClick={() => navigate("/deals/pipeline")}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//               <ChartBarIcon className="w-5 h-5 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {summary.averageProbability || 0}%
//               </p>
//               <p className="text-xs text-gray-500">Avg Probability</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <MonthlyTrendChart data={monthlyTrend} />
//         </div>
//         <div>
//           <WinRateGauge
//             winRate={deals.winRate || 0}
//             wonDeals={deals.won?.count || 0}
//             lostDeals={deals.lost?.count || 0}
//             openDeals={deals.open?.count || 0}
//           />
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <StageChart data={dealsByStage} />
//         <LeadSourceChart data={dealsBySource} />
//       </div>

//       {/* Bottom Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth} />
//         <TopPerformers data={topPerformers} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// // src\features\dashboard\Dashboard.jsx
// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchDashboardAnalytics,
//   fetchDealsByStage,
//   fetchMonthlyTrend,
//   fetchTopPerformers,
//   fetchDealsBySource,
//   fetchDealMomentum,
// } from "../analytics/analyticsSlice";
// import InfoTooltip from "../deals/InfoTooltip";
// import DealMomentumInfo from "../deals/DealMomentumInfo";

// import Spinner from "../../components/Spinner";
// import StatCard from "./components/StatCard";
// import StageChart from "./components/StageChart";
// import MonthlyTrendChart from "./components/MonthlyTrendChart";
// import TopPerformers from "./components/TopPerformers";
// import DealsClosingSoon from "./components/DealsClosingSoon";
// import WinRateGauge from "./components/WinRateGauge";
// import LeadSourceChart from "./components/LeadSourceChart";

// import {
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   ClipboardDocumentListIcon,
//   TrophyIcon,
//   ChartBarIcon,
//   ArrowTrendingUpIcon,
// } from "@heroicons/react/24/outline";
// import DealRiskPanel from "../analytics/DealRiskPanel";
// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const hasFetched = useRef(false);

//   const {
//     dashboard,
//     dealsByStage,
//     monthlyTrend,
//     topPerformers,
//     dealsBySource,
//     dealMomentum,
//     dashboardLoading,
//   } = useSelector((s) => s.analytics);

//   useEffect(() => {
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       dispatch(fetchDashboardAnalytics());
//       dispatch(fetchDealsByStage());
//       dispatch(fetchMonthlyTrend(6));
//       dispatch(fetchTopPerformers(5));
//       dispatch(fetchDealsBySource());
//       dispatch(fetchDealMomentum());
//     }
//   }, [dispatch]);

//   if (dashboardLoading && !dashboard) {
//     return <Spinner className="py-20" size="lg" />;
//   }

//   const summary = dashboard?.summary || {};
//   const performance = dashboard?.performance || {};

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="page-title">Dashboard</h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Overview of your CRM activity and performance.
//           </p>
//         </div>
//         <div className="text-right hidden sm:block">
//           <p className="text-sm text-gray-500">
//             {new Date().toLocaleDateString("en-IN", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>
//       </div>

//       {/* Main Stats (Operational Only) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Deals"
//           value={summary.totalDeals || 0}
//           subtitle="All deals"
//           icon={ClipboardDocumentListIcon}
//           color="blue"
//           onClick={() => navigate("/deals")}
//         />

//         <StatCard
//           title="Open Deals"
//           value={summary.openDeals || 0}
//           subtitle="Active deals"
//           icon={ChartBarIcon}
//           color="purple"
//           onClick={() => navigate("/deals")}
//         />

//         <StatCard
//           title="Closed Deals"
//           value={summary.closedDeals || 0}
//           subtitle="Completed deals"
//           icon={TrophyIcon}
//           color="green"
//           onClick={() => navigate("/deals?stage=CLOSED_WON")}
//         />

//         <StatCard
//           title="This Month"
//           value={summary.thisMonthDeals || 0}
//           subtitle="New deals created"
//           icon={ArrowTrendingUpIcon}
//           color="amber"
//         />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div
//           className="card py-4 cursor-pointer hover:shadow-md transition-all"
//           onClick={() => navigate("/accounts")}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//               <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {summary.totalAccounts || 0}
//               </p>
//               <p className="text-xs text-gray-500">Accounts</p>
//             </div>
//           </div>
//         </div>

//         <div
//           className="card py-4 cursor-pointer hover:shadow-md transition-all"
//           onClick={() => navigate("/contacts")}
//         >
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//               <UserGroupIcon className="w-5 h-5 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {summary.totalContacts || 0}
//               </p>
//               <p className="text-xs text-gray-500">Contacts</p>
//             </div>
//           </div>
//         </div>

//         <div className="card py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <TrophyIcon className="w-5 h-5 text-green-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {performance.wonDeals || 0}
//               </p>
//               <p className="text-xs text-gray-500">Won Deals</p>
//             </div>
//           </div>
//         </div>

//         <div className="card py-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//               <ChartBarIcon className="w-5 h-5 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {performance.winRate || 0}%
//               </p>
//               <p className="text-xs text-gray-500">Win Rate</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Deal Priority Engine */}
//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
//               <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
//                 <path
//                   d="M9 2L3 9h5l-1 5 6-7H8l1-5z"
//                   fill="white"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>
//             <div className="flex items-center gap-2">
//               <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
//                 Deal Momentum
//               </h2>
//             </div>
//           </div>
//           <span className="text-[11px] text-gray-400 font-medium">
//             Focus on these first
//           </span>
//         </div>

//         {/* List */}
//         <div className="divide-y divide-slate-50">
//           {dealMomentum?.slice(0, 5).map((deal, idx) => (
//             <div
//               key={deal.dealId}
//               onClick={() => navigate(`/deals/${deal.dealId}`)}
//               className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer"
//             >
//               {/* Rank */}
//               <span
//                 className={`text-xs font-bold w-4 text-center flex-shrink-0 ${
//                   idx === 0 ? "text-indigo-600" : "text-slate-300"
//                 }`}
//               >
//                 {idx + 1}
//               </span>

//               {/* Deal info */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
//                   {deal.dealName}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <span className="text-[11px] text-gray-400">
//                     {deal.account}
//                   </span>
//                   <span className="text-gray-200">·</span>
//                   <span
//                     className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
//                       idx === 0
//                         ? "bg-indigo-50 text-indigo-600"
//                         : idx === 1
//                           ? "bg-violet-50 text-violet-500"
//                           : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     {deal.stage.replace(/_/g, " ")}
//                   </span>
//                 </div>
//               </div>

//               {/* Score */}
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <div className="flex flex-col items-end">
//                   <span
//                     className={`text-base font-bold leading-none ${
//                       idx === 0 ? "text-indigo-600" : "text-slate-400"
//                     }`}
//                   >
//                     {deal.momentumScore}
//                   </span>

//                   <span className="text-[10px] text-gray-400 leading-none text-right">
//                     {deal.reason}
//                   </span>
//                 </div>

//                 {/* 🔥 Modern Hover Insight */}
//                 <InfoTooltip
//                   position="right"
//                   content={<DealMomentumInfo deal={deal} />}
//                 />
//               </div>
//             </div>
//           ))}

//           {!dealMomentum?.length && (
//             <div className="py-10 text-center">
//               <p className="text-sm text-slate-400">No priority deals found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Charts Row 1 */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <MonthlyTrendChart data={monthlyTrend} />
//         </div>
//         <div>
//           <WinRateGauge
//             winRate={performance.winRate || 0}
//             wonDeals={performance.wonDeals || 0}
//             lostDeals={performance.lostDeals || 0}
//             openDeals={summary.openDeals || 0}
//           />
//         </div>
//       </div>

//       {/* Charts Row 2 */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <StageChart data={dealsByStage} />
//         <LeadSourceChart data={dealsBySource} />
//       </div>

//       {/* Bottom Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth || []} />
//         <TopPerformers data={topPerformers} />
//         <DealRiskPanel level="HIGH" />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// src\features\dashboard\Dashboard.jsx
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardAnalytics,
  fetchDealsByStage,
  fetchMonthlyTrend,
  fetchTopPerformers,
  fetchDealsBySource,
  fetchDealMomentum,
} from "../analytics/analyticsSlice";
import InfoTooltip from "../deals/InfoTooltip";
import DealMomentumInfo from "../deals/DealMomentumInfo";

import Spinner from "../../components/Spinner";
import StatCard from "./components/StatCard";
import StageChart from "./components/StageChart";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import TopPerformers from "./components/TopPerformers";
import DealsClosingSoon from "./components/DealsClosingSoon";
import WinRateGauge from "./components/WinRateGauge";
import LeadSourceChart from "./components/LeadSourceChart";

import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import DealRiskPanel from "../analytics/DealRiskPanel";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const {
    dashboard,
    dealsByStage,
    monthlyTrend,
    topPerformers,
    dealsBySource,
    dealMomentum,
    dashboardLoading,
  } = useSelector((s) => s.analytics);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchDashboardAnalytics());
      dispatch(fetchDealsByStage());
      dispatch(fetchMonthlyTrend(6));
      dispatch(fetchTopPerformers(5));
      dispatch(fetchDealsBySource());
      dispatch(fetchDealMomentum());
    }
  }, [dispatch]);

  if (dashboardLoading && !dashboard) {
    return <Spinner className="py-20" size="lg" />;
  }

  const summary = dashboard?.summary || {};
  const performance = dashboard?.performance || {};

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Overview
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your CRM activity and performance at a glance.
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-0.5 pt-1">
          <p className="text-xs font-medium text-gray-400">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* ── Primary Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Deals"
          value={summary.totalDeals || 0}
          subtitle="All deals"
          icon={ClipboardDocumentListIcon}
          color="blue"
          onClick={() => navigate("/deals")}
        />
        <StatCard
          title="Open Deals"
          value={summary.openDeals || 0}
          subtitle="Active deals"
          icon={ChartBarIcon}
          color="purple"
          onClick={() => navigate("/deals")}
        />
        <StatCard
          title="Closed Deals"
          value={summary.closedDeals || 0}
          subtitle="Completed deals"
          icon={TrophyIcon}
          color="green"
          onClick={() => navigate("/deals?stage=CLOSED_WON")}
        />
        <StatCard
          title="This Month"
          value={summary.thisMonthDeals || 0}
          subtitle="New deals created"
          icon={ArrowTrendingUpIcon}
          color="amber"
        />
      </div>

      {/* ── Secondary Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            value: summary.totalAccounts || 0,
            label: "Accounts",
            icon: BuildingOffice2Icon,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            onClick: () => navigate("/accounts"),
            clickable: true,
          },
          {
            value: summary.totalContacts || 0,
            label: "Contacts",
            icon: UserGroupIcon,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-500",
            onClick: () => navigate("/contacts"),
            clickable: true,
          },
          {
            value: performance.wonDeals || 0,
            label: "Won Deals",
            icon: TrophyIcon,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-500",
            clickable: false,
          },
          {
            value: `${performance.winRate || 0}%`,
            label: "Win Rate",
            icon: ChartBarIcon,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
            clickable: false,
          },
        ].map(
          ({
            value,
            label,
            icon: Icon,
            iconBg,
            iconColor,
            onClick,
            clickable,
          }) => (
            <div
              key={label}
              onClick={clickable ? onClick : undefined}
              className={`bg-white border border-gray-200 rounded-2xl px-4 py-4 sm:px-5 shadow-sm transition-all duration-200 ${
                clickable
                  ? "cursor-pointer hover:shadow-md hover:border-gray-300"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums leading-tight">
                    {value}
                  </p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* ── Deal Momentum Panel ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 2L3 9h5l-1 5 6-7H8l1-5z"
                  fill="white"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
                Prioritized
              </p>
              <h2 className="text-sm font-semibold text-gray-900 leading-none">
                Deal Momentum
              </h2>
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:block">
            Focus on these first
          </span>
        </div>

        {/* Deal rows */}
        <div className="divide-y divide-gray-50">
          {dealMomentum?.slice(0, 5).map((deal, idx) => (
            <div
              key={deal.dealId}
              onClick={() => navigate(`/deals/${deal.dealId}`)}
              className="flex items-center gap-4 px-5 sm:px-6 py-3.5 hover:bg-gray-50/70 transition-colors duration-150 cursor-pointer group"
            >
              {/* Rank */}
              <span
                className={`text-xs font-bold w-4 text-center flex-shrink-0 ${
                  idx === 0 ? "text-indigo-600" : "text-gray-300"
                }`}
              >
                {idx + 1}
              </span>

              {/* Deal info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate leading-tight group-hover:text-gray-900 transition-colors">
                  {deal.dealName}
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[11px] text-gray-400">
                    {deal.account}
                  </span>
                  <span className="text-gray-200">·</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
                      idx === 0
                        ? "bg-indigo-50 text-indigo-600"
                        : idx === 1
                          ? "bg-violet-50 text-violet-500"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {deal.stage.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Score + tooltip */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-end">
                  <span
                    className={`text-base font-bold leading-none ${
                      idx === 0 ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {deal.momentumScore}
                  </span>
                  <span className="text-[10px] text-gray-400 leading-none text-right mt-0.5">
                    {deal.reason}
                  </span>
                </div>
                <InfoTooltip
                  position="right"
                  content={<DealMomentumInfo deal={deal} />}
                />
              </div>
            </div>
          ))}

          {!dealMomentum?.length && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <ChartBarIcon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                No priority deals found
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Check back once deals are active
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Charts Row 1: Trend + Win Rate ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={monthlyTrend} />
        </div>
        <div>
          <WinRateGauge
            winRate={performance.winRate || 0}
            wonDeals={performance.wonDeals || 0}
            lostDeals={performance.lostDeals || 0}
            openDeals={summary.openDeals || 0}
          />
        </div>
      </div>

      {/* ── Charts Row 2: Stage + Lead Source ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StageChart data={dealsByStage} />
        <LeadSourceChart data={dealsBySource} />
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth || []} />
        <TopPerformers data={topPerformers} />
        <DealRiskPanel level="HIGH" />
      </div>
    </div>
  );
};

export default Dashboard;
