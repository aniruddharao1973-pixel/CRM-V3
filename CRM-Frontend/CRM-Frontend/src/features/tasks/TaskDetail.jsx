import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import dayjs from "dayjs";

const statusColor = {
  COMPLETED: "bg-green-100 text-green-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  NOT_STARTED: "bg-gray-100 text-gray-600",
  DEFERRED: "bg-yellow-100 text-yellow-700",
  WAITING: "bg-purple-100 text-purple-700",
};

const priorityColor = {
  HIGH: "bg-red-100 text-red-700",
  NORMAL: "bg-blue-100 text-blue-700",
  LOW: "bg-gray-100 text-gray-600",
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    API.get(`/tasks/${id}`).then((res) => setTask(res.data.data));
  }, [id]);

  if (!task) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Tasks
          </button>

          <h1 className="text-2xl font-semibold mt-2">{task.subject}</h1>

          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[task.status]}`}>
              {task.status.replace("_", " ")}
            </span>

            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary">Close Task</button>

          <button
            onClick={() => navigate(`/tasks/${id}/edit`)}
            className="btn-primary"
          >
            Edit
          </button>
        </div>
      </div>

      {/* 🔷 TABS */}
      <div className="flex gap-6 border-b text-sm">
        {["overview", "timeline"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 capitalize ${
              tab === t
                ? "border-b-2 border-blue-600 font-medium text-blue-600"
                : "text-gray-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2 space-y-6">

            {/* SUMMARY CARDS */}
            <div className="grid md:grid-cols-4 gap-4">

              <SummaryCard
                label="Due Date"
                value={formatDate(task.dueDate)}
              />

              <SummaryCard
                label="Owner"
                value={task.owner?.name}
              />

              <SummaryCard
                label="Reminder"
                value={task.reminders?.length ? "Enabled" : "—"}
              />

              <SummaryCard
                label="Repeat"
                value={task.repeat ? "Yes" : "No"}
              />
            </div>

            {/* INFORMATION */}
            <div className="bg-white rounded-xl border p-6 space-y-4">

              <h3 className="font-semibold">Task Information</h3>

              <Info label="Subject" value={task.subject} />
              <Info label="Status" value={task.status} />
              <Info label="Priority" value={task.priority} />
              <Info label="Due Date" value={formatDate(task.dueDate)} />

              <Info
                label="Contact"
                value={
                  task.contact
                    ? `${task.contact.firstName} ${task.contact.lastName || ""}`
                    : "-"
                }
              />

              <Info
                label="Account"
                value={task.account?.accountName}
              />

              <Info
                label="Created Time"
                value={formatDateTime(task.createdAt)}
              />
            </div>

            {/* DESCRIPTION */}
            {task.description && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            )}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6">

            {/* CONTACT CARD */}
            {task.contact && (
              <SideCard title="Contact">
                <p className="font-medium">
                  {task.contact.firstName} {task.contact.lastName}
                </p>

                <button className="btn-primary w-full text-sm mt-2">
                  Send Email
                </button>
              </SideCard>
            )}

            {/* DEAL CARD */}
            {task.deal && (
              <SideCard title="Deal">
                {task.deal.dealName}
              </SideCard>
            )}

            {/* ACTIVITY */}
            <SideCard title="Open Activities">
              <Activity label="Tasks" count={3} />
              <Activity label="Calls" count={0} />
              <Activity label="Meetings" count={0} />
            </SideCard>

          </div>
        </div>
      )}

      {/* ================= TIMELINE ================= */}
      {tab === "timeline" && (
        <div className="bg-white rounded-xl border p-6 text-sm text-gray-600">
          <p>Task created on {formatDateTime(task.createdAt)}</p>
          <p>Last updated on {formatDateTime(task.updatedAt)}</p>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;

/* ================= UI COMPONENTS ================= */

const SummaryCard = ({ label, value }) => (
  <div className="bg-white border rounded-lg p-4 text-sm">
    <p className="text-gray-500">{label}</p>
    <p className="font-semibold mt-1">{value || "-"}</p>
  </div>
);

const SideCard = ({ title, children }) => (
  <div className="bg-white border rounded-xl p-5 space-y-2 text-sm">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div className="grid grid-cols-3 text-sm">
    <p className="text-gray-500">{label}</p>
    <p className="col-span-2 font-medium">{value || "-"}</p>
  </div>
);

const Activity = ({ label, count }) => (
  <div className="flex justify-between py-1">
    <span>{label}</span>
    <span className="bg-gray-100 px-2 rounded">{count}</span>
  </div>
);

const formatDate = (d) =>
  d ? dayjs(d).format("DD MMM YYYY") : "-";

const formatDateTime = (d) =>
  d ? dayjs(d).format("DD MMM YYYY hh:mm A") : "-";
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