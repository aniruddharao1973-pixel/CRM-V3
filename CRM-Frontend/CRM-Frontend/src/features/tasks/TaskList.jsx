// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTasks, deleteTask } from "./taskSlice";
// import { useNavigate } from "react-router-dom";
// import { getPriorityColor } from "../../utils/priorityColor";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import {
//   PencilSquareIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// const getStatusColor = (status) => {
//   switch (status) {
//     case "COMPLETED":
//       return "bg-green-100 text-green-700 border-green-200";
//     case "IN_PROGRESS":
//       return "bg-blue-100 text-blue-700 border-blue-200";
//     case "DEFERRED":
//       return "bg-yellow-100 text-yellow-700 border-yellow-200";
//     case "WAITING":
//       return "bg-purple-100 text-purple-700 border-purple-200";
//     default:
//       return "bg-gray-100 text-gray-600 border-gray-200";
//   }
// };

// const TaskList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { tasks, loading } = useSelector((state) => state.tasks);

//   useEffect(() => {
//     dispatch(fetchTasks());
//   }, [dispatch]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this task?")) return;

//     try {
//       await dispatch(deleteTask(id)).unwrap();
//       toast.success("Task deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center py-20 text-gray-500">
//         Loading tasks...
//       </div>
//     );

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>

//         <button
//           onClick={() => navigate("/tasks/new")}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
//         >
//           + Create Task
//         </button>
//       </div>

//       {/* EMPTY STATE */}
//       {tasks.length === 0 ? (
//         <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
//           No tasks found
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-gray-600">
//               <tr>
//                 <th className="p-3 text-left">Subject</th>
//                 <th>Due Date</th>
//                 <th>Status</th>
//                 <th>Priority</th>
//                 <th>Account</th>
//                 <th>Contact</th>
//                 <th className="text-right pr-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {tasks.map((task) => (
//                 <tr
//                   key={task.id}
//                   onClick={() => navigate(`/tasks/${task.id}`)}
//                   className="border-t hover:bg-gray-50 cursor-pointer group transition"
//                 >
//                   {/* SUBJECT */}
//                   <td className="p-3 font-medium text-gray-800">
//                     {task.subject}
//                   </td>

//                   {/* DUE DATE */}
//                   <td>
//                     {task.dueDate
//                       ? dayjs(task.dueDate).format("DD MMM YYYY")
//                       : "—"}
//                   </td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
//                         task.status
//                       )}`}
//                     >
//                       {task.status.replace("_", " ")}
//                     </span>
//                   </td>

//                   {/* PRIORITY */}
//                   <td className="text-center">
//                     <span
//                       className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
//                         task.priority
//                       )}`}
//                     >
//                       {task.priority.replace("_", " ")}
//                     </span>
//                   </td>

//                   {/* ACCOUNT */}
//                   <td>{task.account?.accountName || "—"}</td>

//                   {/* CONTACT */}
//                   <td>
//                     {task.contact
//                       ? `${task.contact.firstName} ${task.contact.lastName || ""}`
//                       : "—"}
//                   </td>

//                   {/* ACTIONS */}
//                   <td
//                     className="pr-4"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition">
//                       <button
//                         onClick={() =>
//                           navigate(`/tasks/${task.id}/edit`)
//                         }
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         <PencilSquareIcon className="w-4 h-4" />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(task.id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         <TrashIcon className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskList;

// // src/features/tasks/TaskList.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTasks, deleteTask } from "./taskSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { useDebounce } from "../../hooks/useDebounce";
// import dayjs from "dayjs";
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
//   ClipboardDocumentListIcon,
//   CalendarDaysIcon,
//   UserIcon,
//   BuildingOfficeIcon,
//   CheckCircleIcon,
//   ClockIcon,
// } from "@heroicons/react/24/outline";

// // Status styles
// const STATUS_STYLES = {
//   NOT_STARTED: {
//     bg: "bg-gray-50",
//     text: "text-gray-600",
//     ring: "ring-gray-500/20",
//     icon: ClockIcon,
//   },
//   IN_PROGRESS: {
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     ring: "ring-blue-500/20",
//     icon: ClockIcon,
//   },
//   COMPLETED: {
//     bg: "bg-green-50",
//     text: "text-green-700",
//     ring: "ring-green-500/20",
//     icon: CheckCircleIcon,
//   },
//   DEFERRED: {
//     bg: "bg-amber-50",
//     text: "text-amber-700",
//     ring: "ring-amber-500/20",
//     icon: ClockIcon,
//   },
//   WAITING: {
//     bg: "bg-purple-50",
//     text: "text-purple-700",
//     ring: "ring-purple-500/20",
//     icon: ClockIcon,
//   },
// };

// // Priority styles
// const PRIORITY_STYLES = {
//   LOW: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
//   NORMAL: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
//   HIGH: { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-400" },
//   URGENT: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
// };

// const formatLabel = (str) => {
//   if (!str) return "";
//   return str
//     .replace(/_/g, " ")
//     .toLowerCase()
//     .replace(/\b\w/g, (c) => c.toUpperCase());
// };

// const getDueDateStatus = (dueDate) => {
//   if (!dueDate) return null;
//   const today = dayjs().startOf("day");
//   const due = dayjs(dueDate).startOf("day");
//   const diff = due.diff(today, "day");

//   if (diff < 0) return { label: "Overdue", class: "text-red-600 bg-red-50" };
//   if (diff === 0)
//     return { label: "Today", class: "text-amber-600 bg-amber-50" };
//   if (diff === 1)
//     return { label: "Tomorrow", class: "text-blue-600 bg-blue-50" };
//   return null;
// };

// const TaskList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { tasks, loading, pagination } = useSelector((state) => state.tasks);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     id: null,
//     subject: "",
//   });

//   const debouncedSearch = useDebounce(search);

//   useEffect(() => {
//     dispatch(
//       fetchTasks({
//         page,
//         limit: 10,
//         search: debouncedSearch,
//         status: statusFilter,
//       }),
//     );
//   }, [dispatch, page, debouncedSearch, statusFilter]);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await dispatch(deleteTask(deleteModal.id)).unwrap();
//       toast.success("Task deleted successfully");
//       setDeleteModal({ open: false, id: null, subject: "" });
//     } catch {
//       toast.error("Failed to delete task");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setStatusFilter("");
//     setPage(1);
//   };

//   const hasFilters = search || statusFilter;

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             Manage and track your tasks
//           </p>
//         </div>
//         <button
//           onClick={() => navigate("/tasks/new")}
//           className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm"
//         >
//           <PlusIcon className="w-4 h-4" />
//           Add Task
//         </button>
//       </div>

//       {/* Filters Bar */}
//       <div className="bg-white rounded-xl border border-gray-200 p-3">
//         <div className="flex flex-col sm:flex-row gap-3">
//           {/* Search */}
//           <div className="relative flex-1">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               placeholder="Search tasks..."
//               className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
//             />
//           </div>

//           {/* Status Filter */}
//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setPage(1);
//             }}
//             className="px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
//           >
//             <option value="">All Status</option>
//             <option value="NOT_STARTED">Not Started</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="COMPLETED">Completed</option>
//             <option value="DEFERRED">Deferred</option>
//             <option value="WAITING">Waiting</option>
//           </select>

//           {/* Clear Button */}
//           {hasFilters && (
//             <button
//               onClick={clearFilters}
//               className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <XMarkIcon className="w-4 h-4" />
//               Clear
//             </button>
//           )}
//         </div>

//         {/* Results Info */}
//         <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//           <span className="text-xs font-medium text-gray-500">
//             {pagination?.total || tasks.length} tasks found
//           </span>
//           {search && (
//             <span className="text-xs text-gray-400">
//               · Searching "{search}"
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
//             <p className="text-sm text-gray-500 mt-3">Loading tasks...</p>
//           </div>
//         ) : tasks.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <ClipboardDocumentListIcon className="w-7 h-7 text-gray-400" />
//             </div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-1">
//               {hasFilters ? "No results found" : "No tasks yet"}
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               {hasFilters
//                 ? "Try adjusting your filters"
//                 : "Get started by creating your first task"}
//             </p>
//             {!hasFilters && (
//               <button
//                 onClick={() => navigate("/tasks/new")}
//                 className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//               >
//                 <PlusIcon className="w-4 h-4" />
//                 Create Task
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50/80">
//                     <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Task
//                     </th>
//                     <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Due Date
//                     </th>
//                     <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Status
//                     </th>
//                     <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Priority
//                     </th>
//                     <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Related To
//                     </th>
//                     <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-5 py-3.5">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {tasks.map((task) => {
//                     const statusStyle =
//                       STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED;
//                     const priorityStyle =
//                       PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.NORMAL;
//                     const dueDateStatus = getDueDateStatus(task.dueDate);

//                     return (
//                       <tr
//                         key={task.id}
//                         className="group hover:bg-indigo-50/30 transition-colors"
//                       >
//                         {/* Subject */}
//                         <td className="px-5 py-4">
//                           <Link
//                             to={`/tasks/${task.id}`}
//                             className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
//                           >
//                             {task.subject}
//                           </Link>
//                           {task.description && (
//                             <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
//                               {task.description}
//                             </p>
//                           )}
//                         </td>

//                         {/* Due Date */}
//                         <td className="px-5 py-4">
//                           {task.dueDate ? (
//                             <div className="flex flex-col">
//                               <span className="text-sm text-gray-700">
//                                 {dayjs(task.dueDate).format("DD MMM YYYY")}
//                               </span>
//                               {dueDateStatus && (
//                                 <span
//                                   className={`inline-flex w-fit mt-1 px-1.5 py-0.5 text-xs font-medium rounded ${dueDateStatus.class}`}
//                                 >
//                                   {dueDateStatus.label}
//                                 </span>
//                               )}
//                             </div>
//                           ) : (
//                             <span className="text-sm text-gray-300">—</span>
//                           )}
//                         </td>

//                         {/* Status */}
//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
//                           >
//                             <statusStyle.icon className="w-3 h-3" />
//                             {formatLabel(task.status)}
//                           </span>
//                         </td>

//                         {/* Priority */}
//                         <td className="px-5 py-4">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}
//                           >
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}
//                             />
//                             {formatLabel(task.priority)}
//                           </span>
//                         </td>

//                         {/* Related To */}
//                         <td className="px-5 py-4">
//                           <div className="space-y-1">
//                             {task.account && (
//                               <Link
//                                 to={`/accounts/${task.account.id}`}
//                                 className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
//                               >
//                                 <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400" />
//                                 {task.account.accountName}
//                               </Link>
//                             )}
//                             {task.contact && (
//                               <Link
//                                 to={`/contacts/${task.contact.id}`}
//                                 className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
//                               >
//                                 <UserIcon className="w-3.5 h-3.5 text-gray-400" />
//                                 {task.contact.firstName}{" "}
//                                 {task.contact.lastName || ""}
//                               </Link>
//                             )}
//                             {!task.account && !task.contact && (
//                               <span className="text-sm text-gray-300">—</span>
//                             )}
//                           </div>
//                         </td>

//                         {/* Actions */}
//                         <td className="px-5 py-4">
//                           <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                               onClick={() => navigate(`/tasks/${task.id}`)}
//                               className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                               title="View"
//                             >
//                               <EyeIcon className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => navigate(`/tasks/${task.id}/edit`)}
//                               className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                               title="Edit"
//                             >
//                               <PencilSquareIcon className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 setDeleteModal({
//                                   open: true,
//                                   id: task.id,
//                                   subject: task.subject,
//                                 })
//                               }
//                               className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                               title="Delete"
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
//             <div className="lg:hidden divide-y divide-gray-100">
//               {tasks.map((task) => {
//                 const statusStyle =
//                   STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED;
//                 const priorityStyle =
//                   PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.NORMAL;
//                 const dueDateStatus = getDueDateStatus(task.dueDate);

//                 return (
//                   <div
//                     key={task.id}
//                     className="p-4 hover:bg-gray-50/50 transition-colors"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between gap-3 mb-3">
//                       <div className="min-w-0 flex-1">
//                         <Link
//                           to={`/tasks/${task.id}`}
//                           className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
//                         >
//                           {task.subject}
//                         </Link>
//                         {task.description && (
//                           <p className="text-xs text-gray-400 mt-0.5 truncate">
//                             {task.description}
//                           </p>
//                         )}
//                       </div>
//                       <span
//                         className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${priorityStyle.bg} ${priorityStyle.text}`}
//                       >
//                         <span
//                           className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}
//                         />
//                         {formatLabel(task.priority)}
//                       </span>
//                     </div>

//                     {/* Info Row */}
//                     <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
//                       <span
//                         className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
//                       >
//                         <statusStyle.icon className="w-3 h-3" />
//                         {formatLabel(task.status)}
//                       </span>

//                       {task.dueDate && (
//                         <span className="inline-flex items-center gap-1 text-gray-500">
//                           <CalendarDaysIcon className="w-3.5 h-3.5" />
//                           {dayjs(task.dueDate).format("DD MMM")}
//                           {dueDateStatus && (
//                             <span
//                               className={`px-1.5 py-0.5 rounded ${dueDateStatus.class}`}
//                             >
//                               {dueDateStatus.label}
//                             </span>
//                           )}
//                         </span>
//                       )}
//                     </div>

//                     {/* Related To */}
//                     <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
//                       {task.account && (
//                         <span className="inline-flex items-center gap-1">
//                           <BuildingOfficeIcon className="w-3.5 h-3.5" />
//                           {task.account.accountName}
//                         </span>
//                       )}
//                       {task.contact && (
//                         <span className="inline-flex items-center gap-1">
//                           <UserIcon className="w-3.5 h-3.5" />
//                           {task.contact.firstName} {task.contact.lastName || ""}
//                         </span>
//                       )}
//                     </div>

//                     {/* Footer Row */}
//                     <div className="flex items-center justify-end pt-3 border-t border-gray-100">
//                       <div className="flex items-center gap-1">
//                         <button
//                           onClick={() => navigate(`/tasks/${task.id}`)}
//                           className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                         >
//                           <EyeIcon className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => navigate(`/tasks/${task.id}/edit`)}
//                           className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                         >
//                           <PencilSquareIcon className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() =>
//                             setDeleteModal({
//                               open: true,
//                               id: task.id,
//                               subject: task.subject,
//                             })
//                           }
//                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         >
//                           <TrashIcon className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Pagination */}
//             {pagination?.pages > 1 && (
//               <div className="flex items-center justify-between px-5 py-3 bg-gray-50/50 border-t border-gray-100">
//                 <p className="text-xs text-gray-500">
//                   Showing{" "}
//                   <span className="font-medium text-gray-700">
//                     {(page - 1) * 10 + 1}
//                   </span>
//                   {" - "}
//                   <span className="font-medium text-gray-700">
//                     {Math.min(page * 10, pagination.total)}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-medium text-gray-700">
//                     {pagination.total}
//                   </span>
//                 </p>

//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                     className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronLeftIcon className="w-4 h-4" />
//                   </button>

//                   <div className="hidden sm:flex items-center gap-1 mx-1">
//                     {Array.from({ length: pagination.pages }, (_, i) => i + 1)
//                       .filter((p) => {
//                         if (pagination.pages <= 5) return true;
//                         if (p === 1 || p === pagination.pages) return true;
//                         return Math.abs(p - page) <= 1;
//                       })
//                       .map((p, idx, arr) => {
//                         const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
//                         return (
//                           <span key={p} className="flex items-center">
//                             {showEllipsis && (
//                               <span className="px-1.5 text-gray-300">•••</span>
//                             )}
//                             <button
//                               onClick={() => setPage(p)}
//                               className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-all ${
//                                 page === p
//                                   ? "bg-indigo-600 text-white shadow-sm"
//                                   : "text-gray-600 hover:bg-white hover:border-gray-200 border border-transparent"
//                               }`}
//                             >
//                               {p}
//                             </button>
//                           </span>
//                         );
//                       })}
//                   </div>

//                   <button
//                     onClick={() =>
//                       setPage((p) => Math.min(pagination.pages, p + 1))
//                     }
//                     disabled={page === pagination.pages}
//                     className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//                   >
//                     <ChevronRightIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Delete Modal */}
//       {deleteModal.open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div
//             className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
//             onClick={() =>
//               setDeleteModal({ open: false, id: null, subject: "" })
//             }
//           />
//           <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
//             <div className="text-center">
//               <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
//                 <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                 Delete Task
//               </h3>
//               <p className="text-sm text-gray-500 mb-6">
//                 Are you sure you want to delete{" "}
//                 <span className="font-medium text-gray-700">
//                   "{deleteModal.subject}"
//                 </span>
//                 ? This action cannot be undone.
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() =>
//                   setDeleteModal({ open: false, id: null, subject: "" })
//                 }
//                 disabled={deleting}
//                 className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={deleting}
//                 className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center"
//               >
//                 {deleting ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
//                     Deleting...
//                   </>
//                 ) : (
//                   "Delete"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskList;

// src/features/tasks/TaskList.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask } from "./taskSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import dayjs from "dayjs";
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
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

// Status styles
const STATUS_STYLES = {
  NOT_STARTED: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
    icon: ClockIcon,
  },
  IN_PROGRESS: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-blue-500",
    icon: ClockIcon,
  },
  COMPLETED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircleIcon,
  },
  DEFERRED: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
    icon: ClockIcon,
  },
  WAITING: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
    dot: "bg-violet-500",
    icon: ClockIcon,
  },
};

// Priority styles
const PRIORITY_STYLES = {
  LOW: {
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
    label: "Low",
  },
  NORMAL: {
    bg: "bg-sky-50",
    text: "text-sky-600",
    dot: "bg-sky-400",
    label: "Normal",
  },
  HIGH: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-400",
    label: "High",
  },
  URGENT: {
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
    label: "Urgent",
  },
};

const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getDueDateStatus = (dueDate) => {
  if (!dueDate) return null;
  const today = dayjs().startOf("day");
  const due = dayjs(dueDate).startOf("day");
  const diff = due.diff(today, "day");

  if (diff < 0)
    return {
      label: `${Math.abs(diff)}d overdue`,
      class: "text-red-600 bg-red-50 ring-red-200",
    };
  if (diff === 0)
    return {
      label: "Due today",
      class: "text-amber-600 bg-amber-50 ring-amber-200",
    };
  if (diff === 1)
    return { label: "Tomorrow", class: "text-sky-600 bg-sky-50 ring-sky-200" };
  return null;
};

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tasks, loading, pagination } = useSelector((state) => state.tasks);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    subject: "",
  });

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(
      fetchTasks({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
      }),
    );
  }, [dispatch, page, debouncedSearch, statusFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteTask(deleteModal.id)).unwrap();
      toast.success("Task deleted successfully");
      setDeleteModal({ open: false, id: null, subject: "" });
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const hasFilters = search || statusFilter;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">
              Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pagination?.total || tasks.length} total tasks across your
              workspace
            </p>
          </div>
          <button
            onClick={() => navigate("/tasks/new")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-600 active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-200 self-start"
          >
            <PlusIcon className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search tasks by subject or description…"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 focus:bg-white transition-all duration-150"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 focus:bg-white appearance-none cursor-pointer transition-all duration-150 min-w-[160px]"
              >
                <option value="">All Statuses</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="DEFERRED">Deferred</option>
                <option value="WAITING">Waiting</option>
              </select>
            </div>

            {/* Clear Button */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-150 border border-transparent hover:border-gray-200"
              >
                <XMarkIcon className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Active filter indicators */}
          {hasFilters && (
            <div className="px-4 pb-3 flex items-center gap-2">
              <span className="text-xs text-gray-400">Active:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                  "{search}"
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                  {formatLabel(statusFilter)}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {pagination?.total || tasks.length} result
                {(pagination?.total || tasks.length) !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
                <div className="absolute inset-0 rounded-full border-[3px] border-gray-800 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                Loading tasks…
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                {hasFilters ? "No matching tasks" : "No tasks yet"}
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                {hasFilters
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Create your first task to get started tracking your work."}
              </p>
              {!hasFilters ? (
                <button
                  onClick={() => navigate("/tasks/new")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.97] transition-all duration-150 shadow-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create first task
                </button>
              ) : (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-150"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">
                        Task
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-4 py-4">
                        Due Date
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-4 py-4">
                        Status
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-4 py-4">
                        Priority
                      </th>
                      <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-4 py-4">
                        Related To
                      </th>
                      <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-widest px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tasks.map((task) => {
                      const statusStyle =
                        STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED;
                      const priorityStyle =
                        PRIORITY_STYLES[task.priority] ||
                        PRIORITY_STYLES.NORMAL;
                      const dueDateStatus = getDueDateStatus(task.dueDate);

                      return (
                        <tr
                          key={task.id}
                          className="group hover:bg-gray-50/70 transition-colors duration-100"
                        >
                          {/* Subject */}
                          <td className="px-6 py-4 max-w-xs">
                            <Link
                              to={`/tasks/${task.id}`}
                              className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-150 leading-snug line-clamp-1"
                            >
                              {task.subject}
                            </Link>
                            {task.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate leading-relaxed">
                                {task.description}
                              </p>
                            )}
                          </td>

                          {/* Due Date */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            {task.dueDate ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-sm text-gray-700 font-medium">
                                  {dayjs(task.dueDate).format("DD MMM YYYY")}
                                </span>
                                {dueDateStatus && (
                                  <span
                                    className={`inline-flex w-fit items-center px-2 py-0.5 text-[11px] font-semibold rounded-lg ring-1 ring-inset ${dueDateStatus.class}`}
                                  >
                                    {dueDateStatus.label}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-300">—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                              />
                              {formatLabel(task.status)}
                            </span>
                          </td>

                          {/* Priority */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ${priorityStyle.bg} ${priorityStyle.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}
                              />
                              {priorityStyle.label ||
                                formatLabel(task.priority)}
                            </span>
                          </td>

                          {/* Related To */}
                          <td className="px-4 py-4">
                            <div className="space-y-1.5">
                              {task.account && (
                                <Link
                                  to={`/accounts/${task.account.id}`}
                                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 group/link"
                                >
                                  <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate max-w-[140px] group-hover/link:underline underline-offset-2">
                                    {task.account.accountName}
                                  </span>
                                </Link>
                              )}
                              {task.contact && (
                                <Link
                                  to={`/contacts/${task.contact.id}`}
                                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors duration-150 group/link"
                                >
                                  <UserIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate max-w-[140px] group-hover/link:underline underline-offset-2">
                                    {task.contact.firstName}{" "}
                                    {task.contact.lastName || ""}
                                  </span>
                                </Link>
                              )}
                              {!task.account && !task.contact && (
                                <span className="text-sm text-gray-300">—</span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <button
                                onClick={() => navigate(`/tasks/${task.id}`)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150"
                                title="View task"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/tasks/${task.id}/edit`)
                                }
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150"
                                title="Edit task"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    id: task.id,
                                    subject: task.subject,
                                  })
                                }
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                                title="Delete task"
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

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {tasks.map((task) => {
                  const statusStyle =
                    STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED;
                  const priorityStyle =
                    PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.NORMAL;
                  const dueDateStatus = getDueDateStatus(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="p-4 hover:bg-gray-50/60 transition-colors duration-100"
                    >
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors leading-snug"
                          >
                            {task.subject}
                          </Link>
                          {task.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-lg ${priorityStyle.bg} ${priorityStyle.text}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`}
                          />
                          {priorityStyle.label || formatLabel(task.priority)}
                        </span>
                      </div>

                      {/* Badge Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-lg ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {formatLabel(task.status)}
                        </span>

                        {task.dueDate && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                            <CalendarDaysIcon className="w-3.5 h-3.5 text-gray-400" />
                            {dayjs(task.dueDate).format("DD MMM")}
                          </span>
                        )}

                        {dueDateStatus && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-lg ring-1 ring-inset ${dueDateStatus.class}`}
                          >
                            {dueDateStatus.label}
                          </span>
                        )}
                      </div>

                      {/* Relations Row */}
                      {(task.account || task.contact) && (
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {task.account && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400" />
                              {task.account.accountName}
                            </span>
                          )}
                          {task.contact && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                              {task.contact.firstName}{" "}
                              {task.contact.lastName || ""}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Row */}
                      <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/tasks/${task.id}`)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-150"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/tasks/${task.id}/edit`)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: task.id,
                                subject: task.subject,
                              })
                            }
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {pagination?.pages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/40">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">
                      {(page - 1) * 10 + 1}–
                      {Math.min(page * 10, pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-700">
                      {pagination.total}
                    </span>{" "}
                    tasks
                  </p>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shadow-none hover:shadow-sm"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter((p) => {
                          if (pagination.pages <= 5) return true;
                          if (p === 1 || p === pagination.pages) return true;
                          return Math.abs(p - page) <= 1;
                        })
                        .map((p, idx, arr) => {
                          const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                          return (
                            <span key={p} className="flex items-center gap-1">
                              {showEllipsis && (
                                <span className="px-1 text-gray-300 text-xs select-none">
                                  ···
                                </span>
                              )}
                              <button
                                onClick={() => setPage(p)}
                                className={`min-w-[34px] h-8 text-xs font-semibold rounded-lg transition-all duration-150 ${
                                  page === p
                                    ? "bg-gray-900 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-white hover:border-gray-200 border border-transparent hover:shadow-sm"
                                }`}
                              >
                                {p}
                              </button>
                            </span>
                          );
                        })}
                    </div>

                    {/* Mobile page indicator */}
                    <span className="sm:hidden text-xs font-medium text-gray-500 px-2">
                      {page} / {pagination.pages}
                    </span>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(pagination.pages, p + 1))
                      }
                      disabled={page === pagination.pages}
                      className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shadow-none hover:shadow-sm"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]"
            onClick={() =>
              !deleting &&
              setDeleteModal({ open: false, id: null, subject: "" })
            }
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-950/20 max-w-sm w-full p-6 border border-gray-200/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1.5">
                Delete task?
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                <span className="font-semibold text-gray-700">
                  "{deleteModal.subject}"
                </span>{" "}
                will be permanently deleted. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() =>
                  setDeleteModal({ open: false, id: null, subject: "" })
                }
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-150 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-150 disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-sm"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete task"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
