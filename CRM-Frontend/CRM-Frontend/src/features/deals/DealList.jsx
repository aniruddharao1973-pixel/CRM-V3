// // src/features/deals/DealList.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchDeals, deleteDeal } from "./dealSlice";
// import { useDebounce } from "../../hooks/useDebounce";
// import {
//   STAGE_COLORS,
//   DEAL_STAGES,
//   formatDate,
//   formatLabel,
// } from "../../constants";

// import toast from "react-hot-toast";
// import {
//   PlusIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   DocumentTextIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   XMarkIcon,
//   ExclamationTriangleIcon,
// } from "@heroicons/react/24/outline";
// import { BriefcaseIcon } from "@heroicons/react/24/solid";

// const DealList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deals, pagination, loading } = useSelector((s) => s.deals);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [stageFilter, setStageFilter] = useState("");

//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     id: null,
//     name: "",
//   });

//   const [deleting, setDeleting] = useState(false);

//   const debouncedSearch = useDebounce(search);

//   useEffect(() => {
//     dispatch(
//       fetchDeals({
//         page,
//         limit: 10,
//         search: debouncedSearch,
//         stage: stageFilter || undefined,
//       })
//     );
//   }, [dispatch, page, debouncedSearch, stageFilter]);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await dispatch(deleteDeal(deleteModal.id)).unwrap();
//       toast.success("Deal deleted successfully");
//       setDeleteModal({ open: false, id: null, name: "" });
//     } catch (err) {
//       toast.error(err || "Failed to delete deal");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setStageFilter("");
//     setPage(1);
//   };

//   const hasFilters = search || stageFilter;

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage your sales pipeline and track deal progress
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/deals/new")}
//           className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
//         >
//           <PlusIcon className="w-5 h-5 mr-2" />
//           New Deal
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-blue-50 rounded-lg">
//               <BriefcaseIcon className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {pagination?.total || 0}
//               </p>
//               <p className="text-sm text-gray-500">Total Deals</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-emerald-50 rounded-lg">
//               <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {deals.filter((d) => d.stage === "CLOSED_WON").length}
//               </p>
//               <p className="text-sm text-gray-500">Won Deals</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-amber-50 rounded-lg">
//               <FunnelIcon className="w-6 h-6 text-amber-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {deals.filter((d) => d.stage === "NEGOTIATION").length}
//               </p>
//               <p className="text-sm text-gray-500">In Negotiation</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-purple-50 rounded-lg">
//               <DocumentTextIcon className="w-6 h-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {deals.filter((d) => d.stage === "COMMERCIAL_PROPOSAL").length}
//               </p>
//               <p className="text-sm text-gray-500">Proposals Sent</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Search Input */}
//           <div className="relative flex-1">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search by deal name, account, or log ID..."
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//             />
//           </div>

//           {/* Stage Filter */}
//           <div className="relative">
//             <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             <select
//               value={stageFilter}
//               onChange={(e) => {
//                 setStageFilter(e.target.value);
//                 setPage(1);
//               }}
//               className="w-full sm:w-56 pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
//             >
//               <option value="">All Stages</option>
//               {DEAL_STAGES.map((s) => (
//                 <option key={s} value={s}>
//                   {formatLabel(s)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Clear Filters */}
//           {hasFilters && (
//             <button
//               onClick={clearFilters}
//               className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               <XMarkIcon className="w-4 h-4 mr-1.5" />
//               Clear
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <p className="text-sm text-gray-500">Loading deals...</p>
//             </div>
//           </div>
//         ) : deals.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <BriefcaseIcon className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               No deals found
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               {hasFilters
//                 ? "Try adjusting your search or filters"
//                 : "Get started by creating your first deal"}
//             </p>
//             {!hasFilters && (
//               <button
//                 onClick={() => navigate("/deals/new")}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <PlusIcon className="w-4 h-4 mr-1.5" />
//                 Create Deal
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Deal Log ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Logged On
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Deal Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Account Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Product Group
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Stage
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Person In Charge
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Weightage
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Closing Date
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {deals.map((deal, index) => {
//                     const stageColor = STAGE_COLORS[deal.stage] || {
//                       bg: "bg-gray-50",
//                       text: "text-gray-700",
//                       dot: "bg-gray-500",
//                     };

//                     return (
//                       <tr
//                         key={deal.id}
//                         className="hover:bg-gray-50/50 transition-colors duration-150"
//                       >
//                         {/* Deal Log ID */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm font-medium text-gray-900">
//                             {deal.dealLogId}
//                           </span>
//                         </td>

//                         {/* Logged On */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-gray-500">
//                             {formatDate(deal.createdAt)}
//                           </span>
//                         </td>

//                         {/* Deal Name */}
//                         <td className="px-6 py-4">
//                           <Link
//                             to={`/deals/${deal.id}`}
//                             className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//                           >
//                             {deal.dealName}
//                           </Link>
//                         </td>

//                         {/* Account Name */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-gray-900">
//                             {deal.account?.accountName || (
//                               <span className="text-gray-400">—</span>
//                             )}
//                           </span>
//                         </td>

//                         {/* Product Group */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-gray-900">
//                             {deal.productGroup || (
//                               <span className="text-gray-400">—</span>
//                             )}
//                           </span>
//                         </td>

//                         {/* Stage Badge */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stageColor.bg} ${stageColor.text}`}
//                           >
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full ${stageColor.dot}`}
//                             />
//                             {formatLabel(deal.stage)}
//                           </span>
//                         </td>

//                         {/* Person In Charge */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-gray-900">
//                             {deal.personInCharge || (
//                               <span className="text-gray-400">—</span>
//                             )}
//                           </span>
//                         </td>

//                         {/* Weightage */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {deal.weightage ? (
//                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
//                               {formatLabel(deal.weightage)}
//                             </span>
//                           ) : (
//                             <span className="text-sm text-gray-400">—</span>
//                           )}
//                         </td>

//                         {/* Closing Date */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="text-sm text-gray-500">
//                             {formatDate(deal.closingDate)}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center justify-end gap-1">
//                             <button
//                               onClick={() => navigate(`/deals/${deal.id}`)}
//                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                               title="View Deal"
//                             >
//                               <EyeIcon className="w-4.5 h-4.5" />
//                             </button>
//                             <button
//                               onClick={() => navigate(`/deals/${deal.id}/edit`)}
//                               className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
//                               title="Edit Deal"
//                             >
//                               <PencilSquareIcon className="w-4.5 h-4.5" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 setDeleteModal({
//                                   open: true,
//                                   id: deal.id,
//                                   name: deal.dealName,
//                                 })
//                               }
//                               className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                               title="Delete Deal"
//                             >
//                               <TrashIcon className="w-4.5 h-4.5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {pagination?.pages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
//                 <p className="text-sm text-gray-600">
//                   Showing{" "}
//                   <span className="font-medium">
//                     {(page - 1) * 10 + 1}
//                   </span>{" "}
//                   to{" "}
//                   <span className="font-medium">
//                     {Math.min(page * 10, pagination.total)}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-medium">{pagination.total}</span> deals
//                 </p>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                     className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronLeftIcon className="w-4 h-4 mr-1" />
//                     Previous
//                   </button>
//                   <div className="hidden sm:flex items-center gap-1">
//                     {Array.from({ length: pagination.pages }, (_, i) => i + 1)
//                       .filter((p) => {
//                         if (pagination.pages <= 7) return true;
//                         if (p === 1 || p === pagination.pages) return true;
//                         if (Math.abs(p - page) <= 1) return true;
//                         return false;
//                       })
//                       .map((p, idx, arr) => {
//                         const showEllipsis =
//                           idx > 0 && p - arr[idx - 1] > 1;
//                         return (
//                           <div key={p} className="flex items-center">
//                             {showEllipsis && (
//                               <span className="px-2 text-gray-400">...</span>
//                             )}
//                             <button
//                               onClick={() => setPage(p)}
//                               className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
//                                 page === p
//                                   ? "bg-blue-600 text-white"
//                                   : "text-gray-700 hover:bg-gray-100"
//                               }`}
//                             >
//                               {p}
//                             </button>
//                           </div>
//                         );
//                       })}
//                   </div>
//                   <button
//                     onClick={() =>
//                       setPage((p) => Math.min(pagination.pages, p + 1))
//                     }
//                     disabled={page === pagination.pages}
//                     className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                   >
//                     Next
//                     <ChevronRightIcon className="w-4 h-4 ml-1" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Delete Modal */}
//       {deleteModal.open && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             {/* Backdrop */}
//             <div
//               className="fixed inset-0 bg-black/50 transition-opacity"
//               onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
//             />

//             {/* Modal */}
//             <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
//               <div className="flex items-center gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Delete Deal
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-500">
//                     Are you sure you want to delete "{deleteModal.name}"? This
//                     action cannot be undone.
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-6 flex items-center justify-end gap-3">
//                 <button
//                   onClick={() =>
//                     setDeleteModal({ open: false, id: null, name: "" })
//                   }
//                   disabled={deleting}
//                   className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleting}
//                   className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
//                 >
//                   {deleting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       Deleting...
//                     </>
//                   ) : (
//                     "Delete Deal"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealList;

// src/features/deals/DealList.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals, deleteDeal } from "./dealSlice";
import { STAGE_COLORS, formatDate, formatLabel } from "../../constants";

import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

// Sort columns configuration
const SORT_COLUMNS = [
  { key: "dealLogId", label: "Deal Log ID" },
  { key: "createdAt", label: "Logged On" },
  { key: "dealName", label: "Deal Name" },
  { key: "accountName", label: "Account Name" },
  { key: "productGroup", label: "Product Group" },
  { key: "stage", label: "Stage" },
  { key: "personInCharge", label: "Person In Charge" },
  { key: "weightage", label: "Weightage" },
  { key: "closingDate", label: "Closing Date" },
];

// Helper to parse deal log ID for sorting (e.g., FY2526.1010)
const parseDealLogId = (logId) => {
  if (!logId) return { year: 0, number: 0 };
  const match = logId.match(/FY(\d+)\.(\d+)/);
  if (match) {
    return { year: parseInt(match[1]), number: parseInt(match[2]) };
  }
  return { year: 0, number: 0 };
};

// Sort Dropdown Component
const SortDropdown = ({ isOpen, onClose, sortConfig, onSortChange }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Sort Options
            </h3>
            <button
              onClick={() =>
                onSortChange({ column: "dealLogId", order: "desc" })
              }
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Column Selection */}
        <div className="p-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sort By Column
          </label>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {SORT_COLUMNS.map((col) => (
              <button
                key={col.key}
                onClick={() => onSortChange({ ...sortConfig, column: col.key })}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all
                  ${
                    sortConfig.column === col.key
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{col.label}</span>
                {sortConfig.column === col.key && (
                  <CheckIcon className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Order Selection */}
        <div className="px-3 pb-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Sort Order
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSortChange({ ...sortConfig, order: "asc" })}
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all
                ${
                  sortConfig.order === "asc"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <BarsArrowUpIcon className="w-4 h-4" />
              Ascending
            </button>
            <button
              onClick={() => onSortChange({ ...sortConfig, order: "desc" })}
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all
                ${
                  sortConfig.order === "desc"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              <BarsArrowDownIcon className="w-4 h-4" />
              Descending
            </button>
          </div>
        </div>

        {/* Apply Button */}
        <div className="px-3 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Apply Sorting
          </button>
        </div>
      </div>
    </>
  );
};

// Sortable Column Header Component
const SortableHeader = ({
  label,
  columnKey,
  sortConfig,
  onSort,
  className = "",
}) => {
  const isActive = sortConfig.column === columnKey;

  return (
    <th className={`px-6 py-4 text-left ${className}`}>
      <button
        onClick={() => onSort(columnKey)}
        className={`
          inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors
          ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
        `}
      >
        {label}
        <span className="flex flex-col -space-y-1">
          <ChevronUpIcon
            className={`w-3 h-3 ${
              isActive && sortConfig.order === "asc"
                ? "text-blue-600"
                : "text-gray-300"
            }`}
          />
          <ChevronDownIcon
            className={`w-3 h-3 ${
              isActive && sortConfig.order === "desc"
                ? "text-blue-600"
                : "text-gray-300"
            }`}
          />
        </span>
      </button>
    </th>
  );
};

const DealList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deals, pagination, loading } = useSelector((s) => s.deals);

  const [page, setPage] = useState(1);

  const [showExportDropdown, setShowExportDropdown] = useState(false);

  // Sort state - default to dealLogId descending (newest first)
  const [sortConfig, setSortConfig] = useState({
    column: "dealLogId",
    order: "desc",
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(
      fetchDeals({
        page,
        limit: 10,
        sortBy: sortConfig.column,
        sortOrder: sortConfig.order,
      }),
    );
  }, [dispatch, page, sortConfig]);

  // Client-side sorting (fallback if API doesn't support sorting)
  const sortedDeals = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    return [...deals].sort((a, b) => {
      const { column, order } = sortConfig;
      let comparison = 0;

      switch (column) {
        case "dealLogId":
          const aLog = parseDealLogId(a.dealLogId);
          const bLog = parseDealLogId(b.dealLogId);
          comparison =
            aLog.year !== bLog.year
              ? aLog.year - bLog.year
              : aLog.number - bLog.number;
          break;

        case "dealName":
          comparison = (a.dealName || "").localeCompare(b.dealName || "");
          break;

        case "accountName":
          comparison = (a.account?.accountName || "").localeCompare(
            b.account?.accountName || "",
          );
          break;

        case "productGroup":
          comparison = (a.productGroup || "").localeCompare(
            b.productGroup || "",
          );
          break;

        case "stage":
          comparison = (a.stage || "").localeCompare(b.stage || "");
          break;

        case "personInCharge":
          comparison = (a.personInCharge || "").localeCompare(
            b.personInCharge || "",
          );
          break;

        case "weightage":
          comparison = (a.weightage || "").localeCompare(b.weightage || "");
          break;

        case "createdAt":
        case "closingDate":
          const dateA = a[column] ? new Date(a[column]).getTime() : 0;
          const dateB = b[column] ? new Date(b[column]).getTime() : 0;
          comparison = dateA - dateB;
          break;

        default:
          comparison = 0;
      }

      return order === "asc" ? comparison : -comparison;
    });
  }, [deals, sortConfig]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteDeal(deleteModal.id)).unwrap();
      toast.success("Deal deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete deal");
    } finally {
      setDeleting(false);
    }
  };

  const handleColumnSort = (columnKey) => {
    setSortConfig((prev) => ({
      column: columnKey,
      order:
        prev.column === columnKey && prev.order === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const handleSortChange = (newConfig) => {
    setSortConfig(newConfig);
    setPage(1);
  };

  const resetSort = () => {
    setSortConfig({ column: "dealLogId", order: "desc" });
    setPage(1);
  };

  const prepareExportData = () => {
    return sortedDeals.map((deal) => ({
      "Deal Log ID": deal.dealLogId,
      "Logged On": formatDate(deal.createdAt),
      "Deal Name": deal.dealName,
      "Account Name": deal.account?.accountName || "",
      "Product Group": deal.productGroup || "",
      Stage: formatLabel(deal.stage),
      "Person In Charge": deal.personInCharge || "",
      Weightage: deal.weightage || "",
      "Closing Date": formatDate(deal.closingDate),
    }));
  };

  const exportCSV = () => {
    const data = prepareExportData();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `deals_export_${Date.now()}.csv`);

    setShowExportDropdown(false);
  };

  const exportExcel = () => {
    const data = prepareExportData();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Deals");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `deals_export_${Date.now()}.xlsx`);

    setShowExportDropdown(false);
  };

  const isDefaultSort =
    sortConfig.column === "dealLogId" && sortConfig.order === "desc";

  const getCurrentSortLabel = () => {
    const col = SORT_COLUMNS.find((c) => c.key === sortConfig.column);
    const orderLabel = sortConfig.order === "asc" ? "↑" : "↓";
    return col ? `${col.label} ${orderLabel}` : "";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your sales pipeline and track deal progress
          </p>
        </div>
        <button
          onClick={() => navigate("/deals/new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Deal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <BriefcaseIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || sortedDeals.length}
              </p>
              <p className="text-sm text-gray-500">Total Deals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {deals.filter((d) => d.stage === "CLOSED_WON").length}
              </p>
              <p className="text-sm text-gray-500">Won Deals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <FunnelIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {deals.filter((d) => d.stage === "NEGOTIATION").length}
              </p>
              <p className="text-sm text-gray-500">In Negotiation</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {deals.filter((d) => d.stage === "COMMERCIAL_PROPOSAL").length}
              </p>
              <p className="text-sm text-gray-500">Proposals Sent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Sort Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {pagination?.total || sortedDeals.length} deals
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
              <ArrowsUpDownIcon className="w-3.5 h-3.5" />
              {getCurrentSortLabel()}
            </span>
          </div>

          {/* Sort Actions */}
          <div className="flex items-center gap-2">
            {/* EXPORT BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white text-gray-700 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Export
              </button>

              {showExportDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowExportDropdown(false)}
                  />

                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={exportExcel}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as Excel
                    </button>

                    <button
                      onClick={exportCSV}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Export as CSV
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* Sort Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border-2 transition-all
                  ${
                    showSortDropdown || !isDefaultSort
                      ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                `}
              >
                <ArrowsUpDownIcon className="w-5 h-5" />
                Sort
                {sortConfig.order === "desc" ? (
                  <BarsArrowDownIcon className="w-4 h-4" />
                ) : (
                  <BarsArrowUpIcon className="w-4 h-4" />
                )}
              </button>

              <SortDropdown
                isOpen={showSortDropdown}
                onClose={() => setShowSortDropdown(false)}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Reset Button */}
            {!isDefaultSort && (
              <button
                onClick={resetSort}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading deals...</p>
            </div>
          </div>
        ) : sortedDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BriefcaseIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No deals found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by creating your first deal
            </p>
            <button
              onClick={() => navigate("/deals/new")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Create Deal
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <SortableHeader
                      label="Deal Log ID"
                      columnKey="dealLogId"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Logged On"
                      columnKey="createdAt"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Deal Name"
                      columnKey="dealName"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Account Name"
                      columnKey="accountName"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Product Group"
                      columnKey="productGroup"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Stage"
                      columnKey="stage"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Person In Charge"
                      columnKey="personInCharge"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Weightage"
                      columnKey="weightage"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <SortableHeader
                      label="Closing Date"
                      columnKey="closingDate"
                      sortConfig={sortConfig}
                      onSort={handleColumnSort}
                    />
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedDeals.map((deal) => {
                    const stageColor = STAGE_COLORS[deal.stage] || {
                      bg: "bg-gray-50",
                      text: "text-gray-700",
                      dot: "bg-gray-500",
                    };

                    return (
                      <tr
                        key={deal.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150 group"
                      >
                        {/* Deal Log ID */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-sm font-mono font-medium text-gray-700">
                            {deal.dealLogId}
                          </span>
                        </td>

                        {/* Logged On */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {formatDate(deal.createdAt)}
                          </span>
                        </td>

                        {/* Deal Name */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/deals/${deal.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            {deal.dealName}
                          </Link>
                        </td>

                        {/* Account Name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {deal.account?.accountName ? (
                            <Link
                              to={`/accounts/${deal.account.id}`}
                              className="text-sm text-gray-900 hover:text-blue-600 transition-colors"
                            >
                              {deal.account.accountName}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Product Group */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {deal.productGroup || (
                              <span className="text-gray-400">—</span>
                            )}
                          </span>
                        </td>

                        {/* Stage Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stageColor.bg} ${stageColor.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${stageColor.dot}`}
                            />
                            {formatLabel(deal.stage)}
                          </span>
                        </td>

                        {/* Person In Charge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {deal.personInCharge || (
                              <span className="text-gray-400">—</span>
                            )}
                          </span>
                        </td>

                        {/* Weightage */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {deal.weightage ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {formatLabel(deal.weightage)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Closing Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {formatDate(deal.closingDate)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/deals/${deal.id}`)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Deal"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/deals/${deal.id}/edit`)}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                              title="Edit Deal"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  id: deal.id,
                                  name: deal.dealName,
                                })
                              }
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Deal"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 10, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  deals
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (pagination.pages <= 7) return true;
                        if (p === 1 || p === pagination.pages) return true;
                        if (Math.abs(p - page) <= 1) return true;
                        return false;
                      })
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <div key={p} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setPage(p)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                page === p
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {p}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={page === pagination.pages}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() =>
                setDeleteModal({ open: false, id: null, name: "" })
              }
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Deal
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-700">
                    "{deleteModal.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, id: null, name: "" })
                  }
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Deal"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealList;
