// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createTask,
//   updateTask,
//   getTask,
//   clearTask,
// } from "./taskSlice";
// import { fetchContacts } from "../contacts/contactSlice";
// import ContactLookupModal from "./ContactLookupModal";

// const TaskForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { contacts } = useSelector((s) => s.contacts);
//   const { task, loading } = useSelector((s) => s.tasks);

//   const [showContactModal, setShowContactModal] = useState(false);

//   const [form, setForm] = useState({
//     subject: "",
//     dueDate: "",
//     status: "NOT_STARTED",
//     priority: "NORMAL",
//     contactId: "",
//     accountId: "",
//     description: "",
//   });

//   const [contactName, setContactName] = useState("");
//   const [accountName, setAccountName] = useState("");

//   /* ---------------- REMINDER ---------------- */

//   const [reminderOn, setReminderOn] = useState(false);
//   const [reminder, setReminder] = useState({
//     date: "",
//     time: "",
//     notify: "EMAIL",
//   });

//   /* ---------------- LOAD DATA ---------------- */

//   useEffect(() => {
//     dispatch(fetchContacts({ page: 1, limit: 100 }));

//     if (isEdit) dispatch(getTask(id));

//     return () => dispatch(clearTask());
//   }, [id]);

//   /* ---------------- PREFILL EDIT ---------------- */

//   useEffect(() => {
//     if (!task || !isEdit) return;

//     setForm({
//       subject: task.subject,
//       dueDate: task.dueDate?.slice(0, 10),
//       status: task.status,
//       priority: task.priority,
//       contactId: task.contactId || "",
//       accountId: task.accountId || "",
//       description: task.description || "",
//     });

//     if (task.contact) {
//       setContactName(
//         `${task.contact.firstName} ${task.contact.lastName || ""}`
//       );
//     }

//     if (task.account) {
//       setAccountName(task.account.accountName);
//     }

//     /* PREFILL REMINDER */
//     if (task.reminders?.length) {
//       const r = task.reminders[0];

//       setReminderOn(true);

//       const d = new Date(r.remindAt);

//       setReminder({
//         date: d.toISOString().slice(0, 10),
//         time: d.toTimeString().slice(0, 5),
//         notify:
//           r.emailBefore !== null && r.popupBefore !== null
//             ? "BOTH"
//             : r.emailBefore !== null
//             ? "EMAIL"
//             : "POPUP",
//       });
//     }
//   }, [task]);

//   /* ---------------- CONTACT SELECT ---------------- */

//   const handleContactSelect = (contact) => {
//     setForm((p) => ({
//       ...p,
//       contactId: contact.id,
//       accountId: contact.account?.id || "",
//     }));

//     setContactName(`${contact.firstName} ${contact.lastName || ""}`);
//     setAccountName(contact.account?.accountName || "");
//     setShowContactModal(false);
//   };

//   /* ---------------- SUBMIT ---------------- */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let payload = { ...form };

//     if (reminderOn && reminder.date && reminder.time) {
//       const remindAt = new Date(`${reminder.date}T${reminder.time}`);

//       payload.reminder = {
//         remindAt,
//         emailBefore:
//           reminder.notify === "EMAIL" || reminder.notify === "BOTH"
//             ? 0
//             : null,
//         popupBefore:
//           reminder.notify === "POPUP" || reminder.notify === "BOTH"
//             ? 0
//             : null,
//       };
//     }

//     if (isEdit) {
//       await dispatch(updateTask({ id, formData: payload }));
//     } else {
//       await dispatch(createTask(payload));
//     }

//     navigate("/tasks");
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="p-6 max-w-5xl mx-auto">

//       <h1 className="text-2xl font-semibold mb-6">
//         {isEdit ? "Edit Task" : "Create Task"}
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="grid md:grid-cols-2 gap-6"
//       >
//         {/* LEFT COLUMN */}
//         <div className="space-y-5 bg-white p-6 rounded-xl border">

//           <input
//             className="input"
//             placeholder="Subject"
//             value={form.subject}
//             onChange={(e) =>
//               setForm({ ...form, subject: e.target.value })
//             }
//             required
//           />

//           <input
//             type="date"
//             className="input"
//             value={form.dueDate}
//             onChange={(e) =>
//               setForm({ ...form, dueDate: e.target.value })
//             }
//           />

//           <div
//             onClick={() => setShowContactModal(true)}
//             className="input cursor-pointer"
//           >
//             {contactName || "Select Contact"}
//           </div>

//           <div className="input bg-gray-100">
//             {accountName || "Account auto-fills"}
//           </div>

//           <textarea
//             rows={4}
//             className="input"
//             placeholder="Description"
//             value={form.description}
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-5 bg-white p-6 rounded-xl border">

//           <select
//             className="input"
//             value={form.status}
//             onChange={(e) =>
//               setForm({ ...form, status: e.target.value })
//             }
//           >
//             <option value="NOT_STARTED">Not Started</option>
//             <option value="IN_PROGRESS">In Progress</option>
//             <option value="COMPLETED">Completed</option>
//           </select>

//           <select
//             className="input"
//             value={form.priority}
//             onChange={(e) =>
//               setForm({ ...form, priority: e.target.value })
//             }
//           >
//             <option value="HIGH">High</option>
//             <option value="NORMAL">Normal</option>
//             <option value="LOW">Low</option>
//           </select>

//           {/* REMINDER */}
//           <div className="flex justify-between items-center">
//             <label className="font-medium">Reminder</label>
//             <input
//               type="checkbox"
//               checked={reminderOn}
//               onChange={() => setReminderOn(!reminderOn)}
//             />
//           </div>

//           {reminderOn && (
//             <div className="border rounded-lg p-4 space-y-3 bg-gray-50">

//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   className="input"
//                   value={reminder.date}
//                   onChange={(e) =>
//                     setReminder({ ...reminder, date: e.target.value })
//                   }
//                 />

//                 <input
//                   type="time"
//                   className="input"
//                   value={reminder.time}
//                   onChange={(e) =>
//                     setReminder({ ...reminder, time: e.target.value })
//                   }
//                 />
//               </div>

//               <select
//                 className="input"
//                 value={reminder.notify}
//                 onChange={(e) =>
//                   setReminder({ ...reminder, notify: e.target.value })
//                 }
//               >
//                 <option value="EMAIL">Email</option>
//                 <option value="POPUP">Pop Up</option>
//                 <option value="BOTH">Both</option>
//               </select>
//             </div>
//           )}

//         </div>

//         {/* ACTION BAR */}
//         <div className="md:col-span-2 flex justify-end gap-3 border-t pt-4">
//           <button
//             type="button"
//             className="btn-secondary"
//             onClick={() => navigate("/tasks")}
//           >
//             Cancel
//           </button>

//           <button className="btn-primary" disabled={loading}>
//             {loading
//               ? "Saving..."
//               : isEdit
//               ? "Update Task"
//               : "Create Task"}
//           </button>
//         </div>
//       </form>

//       <ContactLookupModal
//         open={showContactModal}
//         onClose={() => setShowContactModal(false)}
//         contacts={contacts}
//         onSelect={handleContactSelect}
//       />
//     </div>
//   );
// };

// export default TaskForm;

// // src/features/tasks/TaskForm.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import { createTask, updateTask, getTask, clearTask } from "./taskSlice";
// import { fetchContacts } from "../contacts/contactSlice";
// import ContactLookupModal from "./ContactLookupModal";
// import toast from "react-hot-toast";
// import {
//   ArrowLeftIcon,
//   ClipboardDocumentListIcon,
//   CalendarDaysIcon,
//   BellIcon,
//   UserIcon,
//   BuildingOfficeIcon,
//   ChevronRightIcon,
//   CheckIcon,
//   ClockIcon,
//   FlagIcon,
//   DocumentTextIcon,
//   MagnifyingGlassIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// // Reusable Form Components
// const FormSection = ({ title, subtitle, icon: Icon, children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//     <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
//       <div className="flex items-center gap-3">
//         {Icon && (
//           <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
//             <Icon className="w-4 h-4 text-indigo-600" />
//           </div>
//         )}
//         <div>
//           <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
//           {subtitle && (
//             <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
//           )}
//         </div>
//       </div>
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// const FormField = ({ label, required, children, className = "", hint }) => (
//   <div className={className}>
//     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//       {label}
//       {required && <span className="text-red-500 ml-0.5">*</span>}
//     </label>
//     {children}
//     {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
//   </div>
// );

// const Input = ({
//   name,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   required,
//   icon: Icon,
//   disabled,
//   ...props
// }) => (
//   <div className="relative">
//     {Icon && (
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//     )}
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       disabled={disabled}
//       className={`
//         w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg
//         placeholder:text-gray-400
//         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
//         disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
//         transition-all duration-200
//         ${Icon ? "pl-10" : ""}
//       `}
//       {...props}
//     />
//   </div>
// );

// const Select = ({
//   name,
//   value,
//   onChange,
//   options,
//   placeholder,
//   required,
//   icon: Icon,
// }) => (
//   <div className="relative">
//     {Icon && (
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
//     )}
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className={`
//         w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg
//         appearance-none cursor-pointer
//         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
//         transition-all duration-200
//         ${Icon ? "pl-10" : ""}
//       `}
//     >
//       {placeholder && <option value="">{placeholder}</option>}
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
//   </div>
// );

// const TextArea = ({ name, value, onChange, placeholder, rows = 4 }) => (
//   <textarea
//     name={name}
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     rows={rows}
//     className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
//   />
// );

// const LookupField = ({ value, placeholder, onClick, icon: Icon }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-left"
//   >
//     {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
//     <span className={value ? "text-gray-900" : "text-gray-400"}>
//       {value || placeholder}
//     </span>
//     <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 ml-auto" />
//   </button>
// );

// const ReadOnlyField = ({ value, placeholder, icon: Icon }) => (
//   <div className="w-full flex items-center gap-3 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg">
//     {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
//     <span className={value ? "text-gray-700" : "text-gray-400"}>
//       {value || placeholder}
//     </span>
//   </div>
// );

// const Toggle = ({ checked, onChange, label }) => (
//   <label className="inline-flex items-center gap-3 cursor-pointer group">
//     <div className="relative">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="sr-only peer"
//       />
//       <div className="w-11 h-6 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition-colors duration-200" />
//       <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform duration-200" />
//     </div>
//     <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
//       {label}
//     </span>
//   </label>
// );

// // Status options
// const STATUS_OPTIONS = [
//   { value: "NOT_STARTED", label: "Not Started" },
//   { value: "IN_PROGRESS", label: "In Progress" },
//   { value: "COMPLETED", label: "Completed" },
//   { value: "DEFERRED", label: "Deferred" },
//   { value: "WAITING", label: "Waiting" },
// ];

// // Priority options
// const PRIORITY_OPTIONS = [
//   { value: "LOW", label: "Low" },
//   { value: "NORMAL", label: "Normal" },
//   { value: "HIGH", label: "High" },
//   { value: "URGENT", label: "Urgent" },
// ];

// // Notification options
// const NOTIFY_OPTIONS = [
//   { value: "EMAIL", label: "Email" },
//   { value: "POPUP", label: "Pop Up" },
//   { value: "BOTH", label: "Both" },
// ];

// const TaskForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { contacts } = useSelector((s) => s.contacts);
//   const { task, loading } = useSelector((s) => s.tasks);

//   const [showContactModal, setShowContactModal] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   const [form, setForm] = useState({
//     subject: "",
//     dueDate: "",
//     status: "NOT_STARTED",
//     priority: "NORMAL",
//     contactId: "",
//     accountId: "",
//     description: "",
//   });

//   const [contactName, setContactName] = useState("");
//   const [accountName, setAccountName] = useState("");

//   // Reminder state
//   const [reminderOn, setReminderOn] = useState(false);
//   const [reminder, setReminder] = useState({
//     date: "",
//     time: "",
//     notify: "EMAIL",
//   });

//   // Load data
//   useEffect(() => {
//     dispatch(fetchContacts({ page: 1, limit: 100 }));
//     if (isEdit) dispatch(getTask(id));
//     return () => dispatch(clearTask());
//   }, [dispatch, id, isEdit]);

//   // Prefill on edit
//   useEffect(() => {
//     if (!task || !isEdit) return;

//     setForm({
//       subject: task.subject || "",
//       dueDate: task.dueDate?.slice(0, 10) || "",
//       status: task.status || "NOT_STARTED",
//       priority: task.priority || "NORMAL",
//       contactId: task.contactId || "",
//       accountId: task.accountId || "",
//       description: task.description || "",
//     });

//     if (task.contact) {
//       setContactName(
//         `${task.contact.firstName} ${task.contact.lastName || ""}`,
//       );
//     }

//     if (task.account) {
//       setAccountName(task.account.accountName);
//     }

//     // Prefill reminder
//     if (task.reminders?.length) {
//       const r = task.reminders[0];
//       setReminderOn(true);
//       const d = new Date(r.remindAt);
//       setReminder({
//         date: d.toISOString().slice(0, 10),
//         time: d.toTimeString().slice(0, 5),
//         notify:
//           r.emailBefore !== null && r.popupBefore !== null
//             ? "BOTH"
//             : r.emailBefore !== null
//               ? "EMAIL"
//               : "POPUP",
//       });
//     }
//   }, [task, isEdit]);

//   // Handle contact select
//   const handleContactSelect = (contact) => {
//     setForm((p) => ({
//       ...p,
//       contactId: contact.id,
//       accountId: contact.account?.id || "",
//     }));
//     setContactName(`${contact.firstName} ${contact.lastName || ""}`);
//     setAccountName(contact.account?.accountName || "");
//     setShowContactModal(false);
//   };

//   // Clear contact
//   const handleClearContact = () => {
//     setForm((p) => ({ ...p, contactId: "", accountId: "" }));
//     setContactName("");
//     setAccountName("");
//   };

//   // Handle form change
//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Handle reminder change
//   const handleReminderChange = (e) => {
//     setReminder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       let payload = { ...form };

//       if (reminderOn && reminder.date && reminder.time) {
//         const remindAt = new Date(`${reminder.date}T${reminder.time}`);
//         payload.reminder = {
//           remindAt,
//           emailBefore:
//             reminder.notify === "EMAIL" || reminder.notify === "BOTH"
//               ? 0
//               : null,
//           popupBefore:
//             reminder.notify === "POPUP" || reminder.notify === "BOTH"
//               ? 0
//               : null,
//         };
//       }

//       if (isEdit) {
//         await dispatch(updateTask({ id, formData: payload })).unwrap();
//         toast.success("Task updated successfully");
//       } else {
//         await dispatch(createTask(payload)).unwrap();
//         toast.success("Task created successfully");
//       }

//       navigate("/tasks");
//     } catch (err) {
//       toast.error(err || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isEdit && loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="text-sm text-gray-500 mt-3">Loading task...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 text-sm mb-6">
//         <Link
//           to="/tasks"
//           className="text-gray-500 hover:text-gray-700 transition-colors"
//         >
//           Tasks
//         </Link>
//         <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//         <span className="text-gray-900 font-medium">
//           {isEdit ? "Edit Task" : "New Task"}
//         </span>
//       </nav>

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/tasks")}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
//           >
//             <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">
//               {isEdit ? "Edit Task" : "Create New Task"}
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {isEdit
//                 ? "Update task details"
//                 : "Add a new task to track your work"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Column - Task Details */}
//           <div className="space-y-6">
//             <FormSection
//               title="Task Details"
//               subtitle="Basic task information"
//               icon={ClipboardDocumentListIcon}
//             >
//               <div className="space-y-5">
//                 <FormField label="Subject" required>
//                   <Input
//                     name="subject"
//                     value={form.subject}
//                     onChange={handleChange}
//                     placeholder="Enter task subject"
//                     required
//                   />
//                 </FormField>

//                 <FormField label="Due Date">
//                   <Input
//                     type="date"
//                     name="dueDate"
//                     value={form.dueDate}
//                     onChange={handleChange}
//                     icon={CalendarDaysIcon}
//                   />
//                 </FormField>

//                 <FormField
//                   label="Description"
//                   hint="Optional details about the task"
//                 >
//                   <TextArea
//                     name="description"
//                     value={form.description}
//                     onChange={handleChange}
//                     placeholder="Enter task description..."
//                     rows={4}
//                   />
//                 </FormField>
//               </div>
//             </FormSection>

//             {/* Related Records */}
//             <FormSection
//               title="Related To"
//               subtitle="Link to contact and account"
//               icon={UserIcon}
//             >
//               <div className="space-y-5">
//                 <FormField label="Contact">
//                   <div className="flex gap-2">
//                     <div className="flex-1">
//                       <LookupField
//                         value={contactName}
//                         placeholder="Search and select contact"
//                         onClick={() => setShowContactModal(true)}
//                         icon={UserIcon}
//                       />
//                     </div>
//                     {contactName && (
//                       <button
//                         type="button"
//                         onClick={handleClearContact}
//                         className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-300 transition-all"
//                       >
//                         <XMarkIcon className="w-4 h-4" />
//                       </button>
//                     )}
//                   </div>
//                 </FormField>

//                 <FormField label="Account" hint="Auto-filled from contact">
//                   <ReadOnlyField
//                     value={accountName}
//                     placeholder="Select a contact to auto-fill"
//                     icon={BuildingOfficeIcon}
//                   />
//                 </FormField>
//               </div>
//             </FormSection>
//           </div>

//           {/* Right Column - Status & Reminder */}
//           <div className="space-y-6">
//             {/* Status & Priority */}
//             <FormSection
//               title="Status & Priority"
//               subtitle="Track progress and importance"
//               icon={FlagIcon}
//             >
//               <div className="space-y-5">
//                 <FormField label="Status">
//                   <Select
//                     name="status"
//                     value={form.status}
//                     onChange={handleChange}
//                     options={STATUS_OPTIONS}
//                     icon={ClockIcon}
//                   />
//                 </FormField>

//                 <FormField label="Priority">
//                   <Select
//                     name="priority"
//                     value={form.priority}
//                     onChange={handleChange}
//                     options={PRIORITY_OPTIONS}
//                     icon={FlagIcon}
//                   />
//                 </FormField>
//               </div>
//             </FormSection>

//             {/* Reminder */}
//             <FormSection
//               title="Reminder"
//               subtitle="Get notified before due date"
//               icon={BellIcon}
//             >
//               <div className="space-y-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">
//                     Enable reminder notification
//                   </span>
//                   <Toggle
//                     checked={reminderOn}
//                     onChange={() => setReminderOn(!reminderOn)}
//                     label=""
//                   />
//                 </div>

//                 {reminderOn && (
//                   <div className="pt-4 border-t border-gray-100 space-y-4">
//                     <div className="grid grid-cols-2 gap-3">
//                       <FormField label="Date">
//                         <Input
//                           type="date"
//                           name="date"
//                           value={reminder.date}
//                           onChange={handleReminderChange}
//                         />
//                       </FormField>
//                       <FormField label="Time">
//                         <Input
//                           type="time"
//                           name="time"
//                           value={reminder.time}
//                           onChange={handleReminderChange}
//                         />
//                       </FormField>
//                     </div>

//                     <FormField label="Notification Type">
//                       <Select
//                         name="notify"
//                         value={reminder.notify}
//                         onChange={handleReminderChange}
//                         options={NOTIFY_OPTIONS}
//                         icon={BellIcon}
//                       />
//                     </FormField>

//                     {reminder.date && reminder.time && (
//                       <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-lg">
//                         <BellIcon className="w-4 h-4 text-indigo-600" />
//                         <span className="text-sm text-indigo-700">
//                           Reminder set for{" "}
//                           {new Date(
//                             `${reminder.date}T${reminder.time}`,
//                           ).toLocaleString()}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </FormSection>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-3 pt-4 pb-8 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={() => navigate("/tasks")}
//             className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
//           >
//             {submitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : isEdit ? (
//               "Update Task"
//             ) : (
//               "Create Task"
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Contact Lookup Modal */}
//       <ContactLookupModal
//         open={showContactModal}
//         onClose={() => setShowContactModal(false)}
//         contacts={contacts}
//         onSelect={handleContactSelect}
//       />
//     </div>
//   );
// };

// export default TaskForm;

// src/features/tasks/TaskForm.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createTask, updateTask, getTask, clearTask } from "./taskSlice";
import { fetchContacts } from "../contacts/contactSlice";
import ContactLookupModal from "./ContactLookupModal";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  BellIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* ─── REUSABLE FORM COMPONENTS ───────────────────────────── */

const FormSection = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const FormField = ({ label, required, children, className = "", hint }) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
  </div>
);

const Input = ({
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  icon: Icon,
  disabled,
  ...props
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`
        w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
        text-gray-900 placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 focus:bg-white
        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
        transition-all duration-150
        ${Icon ? "pl-10" : ""}
      `}
      {...props}
    />
  </div>
);

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  icon: Icon,
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl
        text-gray-900 appearance-none cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 focus:bg-white
        transition-all duration-150
        ${Icon ? "pl-10" : ""}
      `}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
  </div>
);

const TextArea = ({ name, value, onChange, placeholder, rows = 4 }) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 focus:bg-white transition-all duration-150 resize-none"
  />
);

const LookupField = ({ value, placeholder, onClick, icon: Icon }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 transition-all duration-150 text-left"
  >
    {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
    <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
      {value || placeholder}
    </span>
    <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
  </button>
);

const ReadOnlyField = ({ value, placeholder, icon: Icon }) => (
  <div className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm bg-gray-100/60 border border-gray-200 rounded-xl">
    {Icon && <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
    <span className={value ? "text-gray-700 font-medium" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-3 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-blue-500 rounded-full transition-all duration-200 shadow-inner" />
      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform duration-200" />
    </div>
    {label && (
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    )}
  </label>
);

/* ─── OPTIONS ────────────────────────────────────────────── */

const STATUS_OPTIONS = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DEFERRED", label: "Deferred" },
  { value: "WAITING", label: "Waiting" },
];

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

const NOTIFY_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "POPUP", label: "Pop Up" },
  { value: "BOTH", label: "Both" },
];

/* ─── MAIN COMPONENT ─────────────────────────────────────── */

const TaskForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contacts } = useSelector((s) => s.contacts);
  const { task, loading } = useSelector((s) => s.tasks);

  const [showContactModal, setShowContactModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    dueDate: "",
    status: "NOT_STARTED",
    priority: "NORMAL",
    contactId: "",
    accountId: "",
    description: "",
  });

  const [contactName, setContactName] = useState("");
  const [accountName, setAccountName] = useState("");

  const [reminderOn, setReminderOn] = useState(false);
  const [reminder, setReminder] = useState({
    date: "",
    time: "",
    notify: "EMAIL",
  });

  useEffect(() => {
    dispatch(fetchContacts({ page: 1, limit: 100 }));
    if (isEdit) dispatch(getTask(id));
    return () => dispatch(clearTask());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (!task || !isEdit) return;

    setForm({
      subject: task.subject || "",
      dueDate: task.dueDate?.slice(0, 10) || "",
      status: task.status || "NOT_STARTED",
      priority: task.priority || "NORMAL",
      contactId: task.contactId || "",
      accountId: task.accountId || "",
      description: task.description || "",
    });

    if (task.contact) {
      setContactName(
        `${task.contact.firstName} ${task.contact.lastName || ""}`,
      );
    }
    if (task.account) {
      setAccountName(task.account.accountName);
    }

    if (task.reminders?.length) {
      const r = task.reminders[0];
      setReminderOn(true);
      const d = new Date(r.remindAt);
      setReminder({
        date: d.toISOString().slice(0, 10),
        time: d.toTimeString().slice(0, 5),
        notify:
          r.emailBefore !== null && r.popupBefore !== null
            ? "BOTH"
            : r.emailBefore !== null
              ? "EMAIL"
              : "POPUP",
      });
    }
  }, [task, isEdit]);

  const handleContactSelect = (contact) => {
    setForm((p) => ({
      ...p,
      contactId: contact.id,
      accountId: contact.account?.id || "",
    }));
    setContactName(`${contact.firstName} ${contact.lastName || ""}`);
    setAccountName(contact.account?.accountName || "");
    setShowContactModal(false);
  };

  const handleClearContact = () => {
    setForm((p) => ({ ...p, contactId: "", accountId: "" }));
    setContactName("");
    setAccountName("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReminderChange = (e) => {
    setReminder((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let payload = { ...form };

      if (reminderOn && reminder.date && reminder.time) {
        const remindAt = new Date(`${reminder.date}T${reminder.time}`);
        payload.reminder = {
          remindAt,
          emailBefore:
            reminder.notify === "EMAIL" || reminder.notify === "BOTH"
              ? 0
              : null,
          popupBefore:
            reminder.notify === "POPUP" || reminder.notify === "BOTH"
              ? 0
              : null,
        };
      }

      if (isEdit) {
        await dispatch(updateTask({ id, formData: payload })).unwrap();
        toast.success("Task updated successfully");
      } else {
        await dispatch(createTask(payload)).unwrap();
        toast.success("Task created successfully");
      }

      navigate("/tasks");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── LOADING STATE ──────────────────────────────────────── */
  if (isEdit && loading) {
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
  }

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-6">
          <Link
            to="/tasks"
            className="text-gray-400 hover:text-gray-700 font-medium transition-colors duration-150"
          >
            Tasks
          </Link>
          <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-900 font-semibold">
            {isEdit ? "Edit Task" : "New Task"}
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/tasks")}
            className="p-2 rounded-xl hover:bg-white hover:border-gray-200 border border-transparent transition-all duration-150 text-gray-400 hover:text-gray-700 hover:shadow-sm lg:hidden"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-sm shadow-indigo-200 flex-shrink-0">
              <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-950">
                {isEdit ? "Edit Task" : "Create New Task"}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {isEdit
                  ? "Update the details for this task"
                  : "Fill in the details to create a new task"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ── LEFT COLUMN ── */}
            <div className="space-y-6">
              {/* Task Details */}
              <FormSection
                title="Task Details"
                subtitle="Basic information about the task"
                icon={ClipboardDocumentListIcon}
              >
                <div className="space-y-5">
                  <FormField label="Subject" required>
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="e.g. Follow up with client"
                      required
                    />
                  </FormField>

                  <FormField label="Due Date">
                    <Input
                      type="date"
                      name="dueDate"
                      value={form.dueDate}
                      onChange={handleChange}
                      icon={CalendarDaysIcon}
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    hint="Optional — add context or notes about this task"
                  >
                    <TextArea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter any relevant details…"
                      rows={4}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Related Records */}
              <FormSection
                title="Related To"
                subtitle="Link this task to a contact or account"
                icon={UserIcon}
              >
                <div className="space-y-5">
                  <FormField label="Contact">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <LookupField
                          value={contactName}
                          placeholder="Search and select a contact"
                          onClick={() => setShowContactModal(true)}
                          icon={UserIcon}
                        />
                      </div>
                      {contactName && (
                        <button
                          type="button"
                          onClick={handleClearContact}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-all duration-150"
                          title="Clear contact"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </FormField>

                  <FormField
                    label="Account"
                    hint="Auto-filled when a contact is selected"
                  >
                    <ReadOnlyField
                      value={accountName}
                      placeholder="Auto-filled from contact"
                      icon={BuildingOfficeIcon}
                    />
                  </FormField>
                </div>
              </FormSection>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-6">
              {/* Status & Priority */}
              <FormSection
                title="Status & Priority"
                subtitle="Track progress and urgency"
                icon={FlagIcon}
              >
                <div className="space-y-5">
                  <FormField label="Status">
                    <Select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      options={STATUS_OPTIONS}
                      icon={ClockIcon}
                    />
                  </FormField>

                  <FormField label="Priority">
                    <Select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      options={PRIORITY_OPTIONS}
                      icon={FlagIcon}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* Reminder */}
              <FormSection
                title="Reminder"
                subtitle="Get notified before the due date"
                icon={BellIcon}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Enable reminder
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Get notified at a set time
                      </p>
                    </div>
                    <Toggle
                      checked={reminderOn}
                      onChange={() => setReminderOn(!reminderOn)}
                      label=""
                    />
                  </div>

                  {reminderOn && (
                    <div className="space-y-4 pt-1">
                      <div className="grid grid-cols-2 gap-3">
                        <FormField label="Date">
                          <Input
                            type="date"
                            name="date"
                            value={reminder.date}
                            onChange={handleReminderChange}
                          />
                        </FormField>
                        <FormField label="Time">
                          <Input
                            type="time"
                            name="time"
                            value={reminder.time}
                            onChange={handleReminderChange}
                          />
                        </FormField>
                      </div>

                      <FormField label="Notification Type">
                        <Select
                          name="notify"
                          value={reminder.notify}
                          onChange={handleReminderChange}
                          options={NOTIFY_OPTIONS}
                          icon={BellIcon}
                        />
                      </FormField>

                      {reminder.date && reminder.time && (
                        <div className="flex items-start gap-3 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
                          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <BellIcon className="w-3.5 h-3.5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-indigo-700">
                              Reminder scheduled
                            </p>
                            <p className="text-xs text-indigo-500 mt-0.5">
                              {new Date(
                                `${reminder.date}T${reminder.time}`,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </FormSection>
            </div>
          </div>

          {/* ── FORM ACTIONS ── */}
          <div className="flex items-center justify-between pt-6 pb-8 border-t border-gray-200/80">
            <p className="text-xs text-gray-400 hidden sm:block">
              {isEdit
                ? "Changes will be saved immediately."
                : "Fields marked * are required."}
            </p>
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => navigate("/tasks")}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 active:scale-[0.97] transition-all duration-150 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] transition-all duration-150 shadow-sm shadow-indigo-200"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    {isEdit ? "Update Task" : "Create Task"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Contact Lookup Modal */}
        <ContactLookupModal
          open={showContactModal}
          onClose={() => setShowContactModal(false)}
          contacts={contacts}
          onSelect={handleContactSelect}
        />
      </div>
    </div>
  );
};

export default TaskForm;
