// // src\features\tasks\TaskDetail.jsx
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../api/axios";
// import dayjs from "dayjs";

// const statusColor = {
//   COMPLETED: "bg-green-100 text-green-700",
//   IN_PROGRESS: "bg-blue-100 text-blue-700",
//   NOT_STARTED: "bg-gray-100 text-gray-600",
//   DEFERRED: "bg-yellow-100 text-yellow-700",
//   WAITING: "bg-purple-100 text-purple-700",
// };

// const priorityColor = {
//   HIGH: "bg-red-100 text-red-700",
//   NORMAL: "bg-blue-100 text-blue-700",
//   LOW: "bg-gray-100 text-gray-600",
// };

// const TaskDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [task, setTask] = useState(null);
//   const [tab, setTab] = useState("overview");

//   useEffect(() => {
//     API.get(`/tasks/${id}`).then((res) => setTask(res.data.data));
//   }, [id]);

//   if (!task) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 space-y-6">

//       {/* 🔷 HEADER */}
//       <div className="flex justify-between items-start">

//         <div>
//           <button
//             onClick={() => navigate(-1)}
//             className="text-sm text-gray-500 hover:underline"
//           >
//             ← Back to Tasks
//           </button>

//           <h1 className="text-2xl font-semibold mt-2">{task.subject}</h1>

//           <div className="flex gap-2 mt-2">
//             <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[task.status]}`}>
//               {task.status.replace("_", " ")}
//             </span>

//             <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor[task.priority]}`}>
//               {task.priority}
//             </span>
//           </div>
//         </div>

//         <div className="flex gap-3">
//           <button className="btn-secondary">Close Task</button>

//           <button
//             onClick={() => navigate(`/tasks/${id}/edit`)}
//             className="btn-primary"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       {/* 🔷 TABS */}
//       <div className="flex gap-6 border-b text-sm">
//         {["overview", "timeline"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t)}
//             className={`pb-3 capitalize ${
//               tab === t
//                 ? "border-b-2 border-blue-600 font-medium text-blue-600"
//                 : "text-gray-500"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {tab === "overview" && (
//         <div className="grid lg:grid-cols-3 gap-6">

//           {/* ================= LEFT ================= */}
//           <div className="lg:col-span-2 space-y-6">

//             {/* SUMMARY CARDS */}
//             <div className="grid md:grid-cols-4 gap-4">

//               <SummaryCard
//                 label="Due Date"
//                 value={formatDate(task.dueDate)}
//               />

//               <SummaryCard
//                 label="Owner"
//                 value={task.owner?.name}
//               />

//               <SummaryCard
//                 label="Reminder"
//                 value={task.reminders?.length ? "Enabled" : "—"}
//               />

//               <SummaryCard
//                 label="Repeat"
//                 value={task.repeat ? "Yes" : "No"}
//               />
//             </div>

//             {/* INFORMATION */}
//             <div className="bg-white rounded-xl border p-6 space-y-4">

//               <h3 className="font-semibold">Task Information</h3>

//               <Info label="Subject" value={task.subject} />
//               <Info label="Status" value={task.status} />
//               <Info label="Priority" value={task.priority} />
//               <Info label="Due Date" value={formatDate(task.dueDate)} />

//               <Info
//                 label="Contact"
//                 value={
//                   task.contact
//                     ? `${task.contact.firstName} ${task.contact.lastName || ""}`
//                     : "-"
//                 }
//               />

//               <Info
//                 label="Account"
//                 value={task.account?.accountName}
//               />

//               <Info
//                 label="Created Time"
//                 value={formatDateTime(task.createdAt)}
//               />
//             </div>

//             {/* DESCRIPTION */}
//             {task.description && (
//               <div className="bg-white rounded-xl border p-6">
//                 <h3 className="font-semibold mb-2">Description</h3>
//                 <p className="text-sm text-gray-600">{task.description}</p>
//               </div>
//             )}
//           </div>

//           {/* ================= RIGHT ================= */}
//           <div className="space-y-6">

//             {/* CONTACT CARD */}
//             {task.contact && (
//               <SideCard title="Contact">
//                 <p className="font-medium">
//                   {task.contact.firstName} {task.contact.lastName}
//                 </p>

//                 <button className="btn-primary w-full text-sm mt-2">
//                   Send Email
//                 </button>
//               </SideCard>
//             )}

//             {/* DEAL CARD */}
//             {task.deal && (
//               <SideCard title="Deal">
//                 {task.deal.dealName}
//               </SideCard>
//             )}

//             {/* ACTIVITY */}
//             <SideCard title="Open Activities">
//               <Activity label="Tasks" count={3} />
//               <Activity label="Calls" count={0} />
//               <Activity label="Meetings" count={0} />
//             </SideCard>

//           </div>
//         </div>
//       )}

//       {/* ================= TIMELINE ================= */}
//       {tab === "timeline" && (
//         <div className="bg-white rounded-xl border p-6 text-sm text-gray-600">
//           <p>Task created on {formatDateTime(task.createdAt)}</p>
//           <p>Last updated on {formatDateTime(task.updatedAt)}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetail;

// /* ================= UI COMPONENTS ================= */

// const SummaryCard = ({ label, value }) => (
//   <div className="bg-white border rounded-lg p-4 text-sm">
//     <p className="text-gray-500">{label}</p>
//     <p className="font-semibold mt-1">{value || "-"}</p>
//   </div>
// );

// const SideCard = ({ title, children }) => (
//   <div className="bg-white border rounded-xl p-5 space-y-2 text-sm">
//     <h3 className="font-semibold">{title}</h3>
//     {children}
//   </div>
// );

// const Info = ({ label, value }) => (
//   <div className="grid grid-cols-3 text-sm">
//     <p className="text-gray-500">{label}</p>
//     <p className="col-span-2 font-medium">{value || "-"}</p>
//   </div>
// );

// const Activity = ({ label, count }) => (
//   <div className="flex justify-between py-1">
//     <span>{label}</span>
//     <span className="bg-gray-100 px-2 rounded">{count}</span>
//   </div>
// );

// const formatDate = (d) =>
//   d ? dayjs(d).format("DD MMM YYYY") : "-";

// const formatDateTime = (d) =>
//   d ? dayjs(d).format("DD MMM YYYY hh:mm A") : "-";

//===============================================================================================================================================
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { getTask, deleteTask, clearTask } from "./taskSlice";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import {
//   PencilSquareIcon,
//   TrashIcon,
//   CheckCircleIcon,
// } from "@heroicons/react/24/outline";

// const badge = (color) =>
//   `px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`;

// const statusColor = {
//   COMPLETED: "bg-green-100 text-green-700 border-green-200",
//   IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
//   DEFERRED: "bg-yellow-100 text-yellow-700 border-yellow-200",
//   WAITING: "bg-purple-100 text-purple-700 border-purple-200",
//   NOT_STARTED: "bg-gray-100 text-gray-600 border-gray-200",
// };

// const priorityColor = {
//   HIGH: "bg-red-100 text-red-700 border-red-200",
//   NORMAL: "bg-blue-100 text-blue-700 border-blue-200",
//   LOW: "bg-gray-100 text-gray-600 border-gray-200",
// };

// const TaskDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { task, loading } = useSelector((s) => s.tasks);

//   useEffect(() => {
//     dispatch(getTask(id));
//     return () => dispatch(clearTask());
//   }, [id]);

//   const handleDelete = async () => {
//     if (!window.confirm("Delete this task?")) return;

//     await dispatch(deleteTask(id));
//     toast.success("Task deleted");
//     navigate("/tasks");
//   };

//   if (loading || !task)
//     return <div className="p-10 text-gray-500">Loading task...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">

//       {/* 🔷 TOP ACTION BAR */}
//       <div className="flex justify-between items-center bg-white border rounded-xl px-6 py-4 shadow-sm">
//         <h1 className="text-xl font-semibold">{task.subject}</h1>

//         <div className="flex gap-3">
//           <button
//             onClick={() => navigate(`/tasks/${id}/edit`)}
//             className="btn-secondary flex gap-1 items-center"
//           >
//             <PencilSquareIcon className="w-4" />
//             Edit
//           </button>

//           <button
//             onClick={handleDelete}
//             className="btn-secondary text-red-600 flex gap-1 items-center"
//           >
//             <TrashIcon className="w-4" />
//             Delete
//           </button>

//           <button className="btn-primary flex gap-1 items-center">
//             <CheckCircleIcon className="w-4" />
//             Mark Complete
//           </button>
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* 🟢 LEFT PANEL */}
//         <div className="lg:col-span-2 space-y-6">

//           {/* TASK INFO */}
//           <div className="bg-white border rounded-xl p-6 space-y-4">

//             <div className="flex gap-3 flex-wrap">
//               <span className={badge(statusColor[task.status])}>
//                 {task.status.replace("_", " ")}
//               </span>

//               <span className={badge(priorityColor[task.priority])}>
//                 {task.priority}
//               </span>
//             </div>

//             <Info label="Due Date" value={
//               task.dueDate
//                 ? dayjs(task.dueDate).format("DD MMM YYYY")
//                 : "—"
//             } />

//             <Info label="Owner" value={task.owner?.name || "—"} />

//           </div>

//           {/* DESCRIPTION */}
//           <div className="bg-white border rounded-xl p-6">
//             <h2 className="font-semibold mb-2">Description</h2>
//             <p className="text-gray-600 whitespace-pre-line">
//               {task.description || "No description"}
//             </p>
//           </div>

//           {/* REMINDER */}
//           {task.reminders?.length > 0 && (
//             <div className="bg-white border rounded-xl p-6">
//               <h2 className="font-semibold mb-3">Reminder</h2>

//               {task.reminders.map((r) => (
//                 <div key={r.id} className="text-sm text-gray-600">
//                   🔔 {dayjs(r.remindAt).format("DD MMM YYYY hh:mm A")}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ACTIVITY TIMELINE (UI READY) */}
//           <div className="bg-white border rounded-xl p-6">
//             <h2 className="font-semibold mb-3">Activity</h2>
//             <p className="text-gray-400 text-sm">
//               No activity yet
//             </p>
//           </div>
//         </div>

//         {/* 🔵 RIGHT SIDEBAR */}
//         <div className="space-y-6">

//           {/* CONTACT */}
//           <SideCard
//             title="Contact"
//             value={
//               task.contact
//                 ? `${task.contact.firstName} ${task.contact.lastName || ""}`
//                 : "None"
//             }
//           />

//           {/* ACCOUNT */}
//           <SideCard
//             title="Account"
//             value={task.account?.accountName || "None"}
//           />

//           {/* DEAL */}
//           <SideCard
//             title="Deal"
//             value={task.deal?.dealName || "None"}
//           />

//         </div>
//       </div>
//     </div>
//   );
// };

// const Info = ({ label, value }) => (
//   <div>
//     <p className="text-xs text-gray-400">{label}</p>
//     <p className="font-medium text-gray-800">{value}</p>
//   </div>
// );

// const SideCard = ({ title, value }) => (
//   <div className="bg-white border rounded-xl p-5">
//     <p className="text-xs text-gray-400 mb-1">{title}</p>
//     <p className="font-medium text-gray-800">{value}</p>
//   </div>
// );

// export default TaskDetail;

// src/features/tasks/TaskDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import dayjs from "dayjs";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  BellIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ClockIcon,
  BriefcaseIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const STATUS_STYLES = {
  COMPLETED: {
    bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500",
  },
  IN_PROGRESS: {
    bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-500",
  },
  NOT_STARTED: {
    bg: "bg-slate-100", text: "text-slate-600", ring: "ring-slate-200", dot: "bg-slate-400",
  },
  DEFERRED: {
    bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500",
  },
  WAITING: {
    bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200", dot: "bg-violet-500",
  },
};

const PRIORITY_STYLES = {
  HIGH: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-200", dot: "bg-orange-400" },
  URGENT: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-200", dot: "bg-red-500" },
  NORMAL: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-200", dot: "bg-sky-400" },
  LOW: { bg: "bg-slate-100", text: "text-slate-500", ring: "ring-slate-200", dot: "bg-slate-400" },
};

const formatLabel = (str) => {
  if (!str) return "-";
  return str.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (d) => (d ? dayjs(d).format("DD MMM YYYY") : "-");
const formatDateTime = (d) => (d ? dayjs(d).format("DD MMM YYYY · hh:mm A") : "-");

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    API.get(`/tasks/${id}`).then((res) => setTask(res.data.data));
  }, [id]);

  if (!task)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-gray-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-400">Loading task…</p>
        </div>
      </div>
    );

  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED;
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.NORMAL;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors duration-150 mb-4 group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to Tasks
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 leading-snug">
                {task.subject}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {formatLabel(task.status)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.ring}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                  {formatLabel(task.priority)} Priority
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all duration-150 shadow-sm">
                <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                Close Task
              </button>
              <button
                onClick={() => navigate(`/tasks/${id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 rounded-xl active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-200"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 border-b border-gray-200">
          {["overview", "timeline"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize transition-all duration-150 border-b-2 -mb-px ${
                tab === t
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* SUMMARY CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SummaryCard
                  icon={<CalendarDaysIcon className="w-4 h-4 text-indigo-500" />}
                  label="Due Date"
                  value={formatDate(task.dueDate)}
                />
                <SummaryCard
                  icon={<UserIcon className="w-4 h-4 text-blue-500" />}
                  label="Owner"
                  value={task.owner?.name}
                />
                <SummaryCard
                  icon={<BellIcon className="w-4 h-4 text-amber-500" />}
                  label="Reminder"
                  value={task.reminders?.length ? "Enabled" : "—"}
                />
                <SummaryCard
                  icon={<ArrowPathIcon className="w-4 h-4 text-emerald-500" />}
                  label="Repeat"
                  value={task.repeat ? "Yes" : "No"}
                />
              </div>

              {/* TASK INFORMATION */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Task Information</h3>
                </div>
                <div className="p-6 space-y-0 divide-y divide-gray-50">
                  <Info label="Subject" value={task.subject} />
                  <Info label="Status" value={formatLabel(task.status)} />
                  <Info label="Priority" value={formatLabel(task.priority)} />
                  <Info label="Due Date" value={formatDate(task.dueDate)} />
                  <Info
                    label="Contact"
                    value={
                      task.contact
                        ? `${task.contact.firstName} ${task.contact.lastName || ""}`
                        : "-"
                    }
                  />
                  <Info label="Account" value={task.account?.accountName} />
                  <Info label="Created Time" value={formatDateTime(task.createdAt)} />
                </div>
              </div>

              {/* DESCRIPTION */}
              {task.description && (
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900">Description</h3>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">

              {/* CONTACT CARD */}
              {task.contact && (
                <SideCard
                  title="Contact"
                  icon={<UserIcon className="w-4 h-4 text-gray-400" />}
                >
                  <div className="flex items-center gap-3 py-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-indigo-600">
                        {task.contact.firstName?.[0]}{task.contact.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {task.contact.firstName} {task.contact.lastName}
                      </p>
                      {task.contact.email && (
                        <p className="text-xs text-gray-400">{task.contact.email}</p>
                      )}
                    </div>
                  </div>
                  <button className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all duration-150">
                    <EnvelopeIcon className="w-4 h-4" />
                    Send Email
                  </button>
                </SideCard>
              )}

              {/* ACCOUNT CARD */}
              {task.account && (
                <SideCard
                  title="Account"
                  icon={<BuildingOfficeIcon className="w-4 h-4 text-gray-400" />}
                >
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <BuildingOfficeIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{task.account.accountName}</p>
                  </div>
                </SideCard>
              )}

              {/* DEAL CARD */}
              {task.deal && (
                <SideCard
                  title="Deal"
                  icon={<BriefcaseIcon className="w-4 h-4 text-gray-400" />}
                >
                  <div className="flex items-center justify-between py-1">
                    <p className="text-sm font-semibold text-gray-900">{task.deal.dealName}</p>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                  </div>
                </SideCard>
              )}

              {/* OPEN ACTIVITIES */}
              <SideCard
                title="Open Activities"
                icon={<ClockIcon className="w-4 h-4 text-gray-400" />}
              >
                <div className="space-y-1 pt-1">
                  <Activity label="Tasks" count={3} color="bg-indigo-100 text-indigo-600" />
                  <Activity label="Calls" count={0} color="bg-gray-100 text-gray-500" />
                  <Activity label="Meetings" count={0} color="bg-gray-100 text-gray-500" />
                </div>
              </SideCard>

            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {tab === "timeline" && (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Activity Timeline</h3>
            </div>
            <div className="p-6">
              <div className="relative space-y-6">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-100" />

                <TimelineItem
                  icon={<ClockIcon className="w-3.5 h-3.5 text-gray-500" />}
                  iconBg="bg-gray-100"
                  title="Task created"
                  time={formatDateTime(task.createdAt)}
                />
                <TimelineItem
                  icon={<ArrowPathIcon className="w-3.5 h-3.5 text-blue-500" />}
                  iconBg="bg-blue-50"
                  title="Last updated"
                  time={formatDateTime(task.updatedAt)}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskDetail;

/* ─── UI COMPONENTS ─────────────────────────────────────── */

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 space-y-2.5">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-400">{label}</p>
    </div>
    <p className="text-sm font-bold text-gray-900">{value || "—"}</p>
  </div>
);

const SideCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="grid grid-cols-3 py-3 text-sm">
    <p className="text-gray-400 font-medium">{label}</p>
    <p className="col-span-2 font-semibold text-gray-800">{value || "—"}</p>
  </div>
);

const Activity = ({ label, count, color }) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors duration-100">
    <span className="text-sm text-gray-600 font-medium">{label}</span>
    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${color}`}>{count}</span>
  </div>
);

const TimelineItem = ({ icon, iconBg, title, time }) => (
  <div className="flex items-start gap-4 pl-0">
    <div className={`relative z-10 w-8 h-8 rounded-full ${iconBg} border border-gray-200 flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div className="pt-1">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{time}</p>
    </div>
  </div>
);