
// // src/features/accounts/AccountList.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchAccounts, deleteAccount } from "./accountSlice";
// import { useDebounce } from "../../hooks/useDebounce";
// import { formatCurrency } from "../../constants";
// import toast from "react-hot-toast";
// import {
//   PlusIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   MagnifyingGlassIcon,
//   XMarkIcon,
//   ExclamationTriangleIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   PhoneIcon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   BuildingOfficeIcon,
// } from "@heroicons/react/24/outline";
// import { BuildingOffice2Icon } from "@heroicons/react/24/solid";

// // Rating Colors with dots
// const RATING_COLORS = {
//   HOT: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
//   WARM: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
//   COLD: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
//   ACTIVE: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
//   INACTIVE: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
// };

// // Industry Colors
// const INDUSTRY_COLORS = {
//   TECHNOLOGY: { bg: "bg-violet-50", text: "text-violet-700" },
//   HEALTHCARE: { bg: "bg-pink-50", text: "text-pink-700" },
//   FINANCE: { bg: "bg-emerald-50", text: "text-emerald-700" },
//   MANUFACTURING: { bg: "bg-amber-50", text: "text-amber-700" },
//   RETAIL: { bg: "bg-blue-50", text: "text-blue-700" },
//   EDUCATION: { bg: "bg-indigo-50", text: "text-indigo-700" },
//   REAL_ESTATE: { bg: "bg-teal-50", text: "text-teal-700" },
//   CONSULTING: { bg: "bg-cyan-50", text: "text-cyan-700" },
//   OTHER: { bg: "bg-gray-50", text: "text-gray-700" },
// };

// const AccountList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { accounts, pagination, loading } = useSelector((s) => s.accounts);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     id: null,
//     name: "",
//   });

//   const debouncedSearch = useDebounce(search);

//   useEffect(() => {
//     dispatch(fetchAccounts({ page, limit: 10, search: debouncedSearch }));
//   }, [dispatch, page, debouncedSearch]);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await dispatch(deleteAccount(deleteModal.id)).unwrap();
//       toast.success("Account deleted successfully");
//       setDeleteModal({ open: false, id: null, name: "" });
//     } catch (err) {
//       toast.error(err || "Failed to delete");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setPage(1);
//   };

//   const hasFilters = search;

//   const formatLabel = (str) => {
//     if (!str) return "";
//     return str
//       .replace(/_/g, " ")
//       .toLowerCase()
//       .replace(/\b\w/g, (c) => c.toUpperCase());
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage your business accounts and organizations
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/accounts/new")}
//           className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
//         >
//           <PlusIcon className="w-5 h-5 mr-2" />
//           New Account
//         </button>
//       </div>

//       {/* Search & Filters */}
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
//               placeholder="Search by name, phone, or account number..."
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//             />
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

//         {/* Results Count */}
//         <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
//           <BuildingOfficeIcon className="w-4 h-4" />
//           <span>
//             {pagination?.total || 0} account{pagination?.total !== 1 ? "s" : ""}{" "}
//             found
//           </span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//               <p className="text-sm text-gray-500">Loading accounts...</p>
//             </div>
//           </div>
//         ) : accounts.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <BuildingOffice2Icon className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               No accounts found
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               {hasFilters
//                 ? "Try adjusting your search"
//                 : "Get started by creating your first account"}
//             </p>
//             {!hasFilters && (
//               <button
//                 onClick={() => navigate("/accounts/new")}
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <PlusIcon className="w-4 h-4 mr-1.5" />
//                 Create Account
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Account
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Industry
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Rating
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Owner
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Contacts
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Deals
//                     </th>
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {accounts.map((account) => {
//                     const ratingColor = RATING_COLORS[account.rating] || {
//                       bg: "bg-gray-50",
//                       text: "text-gray-700",
//                       dot: "bg-gray-500",
//                     };
//                     const industryColor = INDUSTRY_COLORS[account.industry] || {
//                       bg: "bg-gray-50",
//                       text: "text-gray-700",
//                     };

//                     return (
//                       <tr
//                         key={account.id}
//                         className="hover:bg-gray-50/50 transition-colors duration-150"
//                       >
//                         {/* Account Name */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
//                               <span className="text-white font-semibold text-sm">
//                                 {account.accountName?.charAt(0)?.toUpperCase()}
//                               </span>
//                             </div>
//                             <div>
//                               <Link
//                                 to={`/accounts/${account.id}`}
//                                 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
//                               >
//                                 {account.accountName}
//                               </Link>
//                               {account.accountNumber && (
//                                 <p className="text-xs text-gray-500 mt-0.5">
//                                   #{account.accountNumber}
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Phone */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {account.phone ? (
//                             <div className="flex items-center gap-2">
//                               <PhoneIcon className="w-4 h-4 text-gray-400" />
//                               <a
//                                 href={`tel:${account.phone}`}
//                                 className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
//                               >
//                                 {account.phone}
//                               </a>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">—</span>
//                           )}
//                         </td>

//                         {/* Industry */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {account.industry ? (
//                             <span
//                               className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${industryColor.bg} ${industryColor.text}`}
//                             >
//                               {formatLabel(account.industry)}
//                             </span>
//                           ) : (
//                             <span className="text-sm text-gray-400">—</span>
//                           )}
//                         </td>

//                         {/* Rating */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {account.rating ? (
//                             <span
//                               className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ratingColor.bg} ${ratingColor.text}`}
//                             >
//                               <span
//                                 className={`w-1.5 h-1.5 rounded-full ${ratingColor.dot}`}
//                               />
//                               {formatLabel(account.rating)}
//                             </span>
//                           ) : (
//                             <span className="text-sm text-gray-400">—</span>
//                           )}
//                         </td>

//                         {/* Owner */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {account.owner ? (
//                             <div className="flex items-center gap-2">
//                               <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
//                                 <span className="text-xs font-medium text-gray-600">
//                                   {account.owner.name?.charAt(0)?.toUpperCase()}
//                                 </span>
//                               </div>
//                               <span className="text-sm text-gray-700">
//                                 {account.owner.name}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-400">—</span>
//                           )}
//                         </td>

//                         {/* Contacts Count */}
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
//                             {account._count?.contacts || 0}
//                           </span>
//                         </td>

//                         {/* Deals Count */}
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
//                             {account._count?.deals || 0}
//                           </span>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center justify-end gap-1">
//                             <button
//                               onClick={() => navigate(`/accounts/${account.id}`)}
//                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
//                               title="View Account"
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 navigate(`/accounts/${account.id}/edit`)
//                               }
//                               className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
//                               title="Edit Account"
//                             >
//                               <PencilSquareIcon className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 setDeleteModal({
//                                   open: true,
//                                   id: account.id,
//                                   name: account.accountName,
//                                 })
//                               }
//                               className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
//                               title="Delete Account"
//                             >
//                               <TrashIcon className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Card View */}
//             <div className="lg:hidden divide-y divide-gray-200">
//               {accounts.map((account) => {
//                 const ratingColor = RATING_COLORS[account.rating] || {
//                   bg: "bg-gray-50",
//                   text: "text-gray-700",
//                   dot: "bg-gray-500",
//                 };

//                 return (
//                   <div key={account.id} className="p-4 space-y-4">
//                     {/* Header */}
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
//                           <span className="text-white font-bold text-lg">
//                             {account.accountName?.charAt(0)?.toUpperCase()}
//                           </span>
//                         </div>
//                         <div>
//                           <Link
//                             to={`/accounts/${account.id}`}
//                             className="font-semibold text-gray-900 hover:text-blue-600"
//                           >
//                             {account.accountName}
//                           </Link>
//                           {account.accountNumber && (
//                             <p className="text-xs text-gray-500 mt-0.5">
//                               #{account.accountNumber}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                       {account.rating && (
//                         <span
//                           className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ratingColor.bg} ${ratingColor.text}`}
//                         >
//                           <span
//                             className={`w-1.5 h-1.5 rounded-full ${ratingColor.dot}`}
//                           />
//                           {formatLabel(account.rating)}
//                         </span>
//                       )}
//                     </div>

//                     {/* Details */}
//                     <div className="space-y-2">
//                       {account.phone && (
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <PhoneIcon className="w-4 h-4 text-gray-400" />
//                           <a
//                             href={`tel:${account.phone}`}
//                             className="hover:text-blue-600"
//                           >
//                             {account.phone}
//                           </a>
//                         </div>
//                       )}
//                       {account.industry && (
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
//                           <span>{formatLabel(account.industry)}</span>
//                         </div>
//                       )}
//                       {account.owner && (
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <UserGroupIcon className="w-4 h-4 text-gray-400" />
//                           <span>Owner: {account.owner.name}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Footer */}
//                     <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                       <div className="flex items-center gap-2">
//                         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
//                           {account._count?.contacts || 0} contacts
//                         </span>
//                         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
//                           {account._count?.deals || 0} deals
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <button
//                           onClick={() => navigate(`/accounts/${account.id}`)}
//                           className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                         >
//                           <EyeIcon className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() =>
//                             navigate(`/accounts/${account.id}/edit`)
//                           }
//                           className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                         >
//                           <PencilSquareIcon className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() =>
//                             setDeleteModal({
//                               open: true,
//                               id: account.id,
//                               name: account.accountName,
//                             })
//                           }
//                           className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {pagination?.pages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
//                 <p className="text-sm text-gray-600">
//                   Showing{" "}
//                   <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
//                   <span className="font-medium">
//                     {Math.min(page * 10, pagination.total)}
//                   </span>{" "}
//                   of <span className="font-medium">{pagination.total}</span>{" "}
//                   accounts
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
//                         const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
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
//               onClick={() =>
//                 setDeleteModal({ open: false, id: null, name: "" })
//               }
//             />

//             {/* Modal */}
//             <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
//               <div className="flex items-start gap-4">
//                 <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//                   <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Delete Account
//                   </h3>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Are you sure you want to delete{" "}
//                     <span className="font-medium text-gray-900">
//                       "{deleteModal.name}"
//                     </span>
//                     ? All associated contacts and deals will also be removed.
//                     This action cannot be undone.
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
//                     "Delete Account"
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

// export default AccountList;
// src/features/accounts/AccountList.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchAccounts, deleteAccount } from "./accountSlice";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

// Rating badge styles
const RATING_STYLES = {
  HOT: "bg-red-50 text-red-600 ring-red-500/20",
  WARM: "bg-orange-50 text-orange-600 ring-orange-500/20",
  COLD: "bg-sky-50 text-sky-600 ring-sky-500/20",
  ACTIVE: "bg-emerald-50 text-emerald-600 ring-emerald-500/20",
  INACTIVE: "bg-gray-50 text-gray-500 ring-gray-500/20",
};

const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const AccountList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, pagination, loading } = useSelector((s) => s.accounts);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchAccounts({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteAccount(deleteModal.id)).unwrap();
      toast.success("Account deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your business accounts
          </p>
        </div>
        <button
          onClick={() => navigate("/accounts/new")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search accounts..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Clear Button */}
          {search && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            {pagination?.total || 0} accounts found
          </span>
          {search && (
            <span className="text-xs text-gray-400">
              · Searching "{search}"
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BuildingOfficeIcon className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {search ? "No results found" : "No accounts yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {search
                ? "Try adjusting your search terms"
                : "Get started by creating your first account"}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/accounts/new")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Create Account
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Account
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Phone
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Industry
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Rating
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Owner
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Contacts
                    </th>
                    <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Deals
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.map((account, index) => (
                    <tr
                      key={account.id}
                      className="group hover:bg-indigo-50/30 transition-colors"
                    >
                      {/* Account Name */}
                      <td className="px-5 py-4">
                        <div>
                          <Link
                            to={`/accounts/${account.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {account.accountName}
                          </Link>
                          {account.accountNumber && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              #{account.accountNumber}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        {account.phone ? (
                          <a
                            href={`tel:${account.phone}`}
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                          >
                            <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                            {account.phone}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>

                      {/* Industry */}
                      <td className="px-5 py-4">
                        {account.industry ? (
                          <span className="text-sm text-gray-600">
                            {formatLabel(account.industry)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        {account.rating ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${
                              RATING_STYLES[account.rating] ||
                              "bg-gray-50 text-gray-600 ring-gray-500/20"
                            }`}
                          >
                            {formatLabel(account.rating)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="px-5 py-4">
                        {account.owner?.name ? (
                          <span className="text-sm text-gray-600">
                            {account.owner.name}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>

                      {/* Contacts */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          {account._count?.contacts || 0}
                        </span>
                      </td>

                      {/* Deals */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                          {account._count?.deals || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/accounts/${account.id}`)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/accounts/${account.id}/edit`)
                            }
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: account.id,
                                name: account.accountName,
                              })
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/accounts/${account.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {account.accountName}
                      </Link>
                      {account.accountNumber && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          #{account.accountNumber}
                        </p>
                      )}
                    </div>
                    {account.rating && (
                      <span
                        className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${
                          RATING_STYLES[account.rating] ||
                          "bg-gray-50 text-gray-600 ring-gray-500/20"
                        }`}
                      >
                        {formatLabel(account.rating)}
                      </span>
                    )}
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-3">
                    {account.phone && (
                      <a
                        href={`tel:${account.phone}`}
                        className="inline-flex items-center gap-1 hover:text-indigo-600"
                      >
                        <PhoneIcon className="w-3.5 h-3.5" />
                        {account.phone}
                      </a>
                    )}
                    {account.industry && (
                      <span>{formatLabel(account.industry)}</span>
                    )}
                    {account.owner?.name && (
                      <span className="text-gray-400">
                        Owner: {account.owner.name}
                      </span>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {account._count?.contacts || 0}
                        </span>
                        contacts
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {account._count?.deals || 0}
                        </span>
                        deals
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/accounts/${account.id}`)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/accounts/${account.id}/edit`)
                        }
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            id: account.id,
                            name: account.accountName,
                          })
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {(page - 1) * 10 + 1}
                  </span>
                  {" - "}
                  <span className="font-medium text-gray-700">
                    {Math.min(page * 10, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {pagination.total}
                  </span>
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>

                  <div className="hidden sm:flex items-center gap-1 mx-1">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (pagination.pages <= 5) return true;
                        if (p === 1 || p === pagination.pages) return true;
                        return Math.abs(p - page) <= 1;
                      })
                      .map((p, idx, arr) => {
                        const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <span key={p} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-1.5 text-gray-300">•••</span>
                            )}
                            <button
                              onClick={() => setPage(p)}
                              className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
                                page === p
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "text-gray-600 hover:bg-white hover:border-gray-200 border border-transparent"
                              }`}
                            >
                              {p}
                            </button>
                          </span>
                        );
                      })}
                  </div>

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={page === pagination.pages}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
          />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-700">
                  "{deleteModal.name}"
                </span>
                ? This will remove all associated contacts and deals.
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
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;