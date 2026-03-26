// // src/features/contacts/ContactList.jsx
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchContacts, deleteContact } from "./contactSlice";
// import { useDebounce } from "../../hooks/useDebounce";
// import { formatLabel } from "../../constants";
// import PageHeader from "../../components/PageHeader";
// import SearchBar from "../../components/SearchBar";
// import Pagination from "../../components/Pagination";
// import DeleteConfirm from "../../components/DeleteConfirm";
// import Spinner from "../../components/Spinner";
// import EmptyState from "../../components/EmptyState";
// import Avatar from "../../components/Avatar";
// import toast from "react-hot-toast";
// import { getPriorityColor } from "../../utils/priorityColor";
// import {
//   PlusIcon,
//   UserIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// const ContactList = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { contacts, pagination, loading } = useSelector((s) => s.contacts);

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
//     dispatch(fetchContacts({ page, limit: 10, search: debouncedSearch }));
//   }, [dispatch, page, debouncedSearch]);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await dispatch(deleteContact(deleteModal.id)).unwrap();
//       toast.success("Contact deleted successfully");
//       setDeleteModal({ open: false, id: null, name: "" });
//     } catch (err) {
//       toast.error(err || "Failed to delete");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//     });

//  return (
//   <div className="space-y-6">
//     <PageHeader
//       title="Contacts"
//       subtitle={`${pagination?.total || 0} total contacts`}
//     >
//       <button
//         onClick={() => navigate("/contacts/new")}
//         className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
//       >
//         <PlusIcon className="w-5 h-5" />
//         New Contact
//       </button>
//     </PageHeader>

//     <SearchBar
//       value={search}
//       onChange={(val) => {
//         setSearch(val);
//         setPage(1);
//       }}
//       placeholder="Search contacts..."
//     />

//     <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//       {loading ? (
//         <Spinner className="py-24" />
//       ) : contacts.length === 0 ? (
//         <EmptyState
//           icon={UserIcon}
//           title="No contacts found"
//           description="Create your first contact to get started."
//         />
//       ) : (
//         <>
//           {/* DESKTOP TABLE */}
//           <div className="hidden lg:block overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-50 sticky top-0 z-10">
//                 <tr className="text-gray-600">
//                   <th className="table-header text-center">Task</th>
//                   <th className="table-header">Name</th>
//                   <th className="table-header">Email</th>
//                   <th className="table-header">Phone</th>
//                   <th className="table-header">Account</th>
//                   <th className="table-header">Source</th>
//                   <th className="table-header text-center">Deals</th>
//                   <th className="table-header text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">
//                 {contacts.map((contact, i) => (
//                   <tr
//                     key={contact.id}
//                     className="group hover:bg-indigo-50/40 transition"
//                   >
//                     {/* TASK */}
//                     <td className="table-cell text-center">
//                       {contact.upcomingTask ? (
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(
//                             contact.upcomingTask.priority
//                           )}`}
//                         >
//                           {formatDate(contact.upcomingTask.dueDate)}
//                         </span>
//                       ) : (
//                         "—"
//                       )}
//                     </td>

//                     {/* NAME */}
//                     <td className="table-cell">
//                       <div className="flex items-center gap-3">
//                         <Avatar
//                           name={contact.firstName}
//                           secondName={contact.lastName}
//                           size="sm"
//                           image={contact.image}
//                         />
//                         <Link
//                           to={`/contacts/${contact.id}`}
//                           className="font-semibold text-gray-800 hover:text-indigo-600"
//                         >
//                           {contact.firstName} {contact.lastName}
//                         </Link>
//                       </div>
//                     </td>

//                     <td className="table-cell text-gray-500">
//                       {contact.email}
//                     </td>

//                     <td className="table-cell text-gray-500">
//                       {contact.phone || "—"}
//                     </td>

//                     <td className="table-cell">
//                       <Link
//                         to={`/accounts/${contact.account?.id}`}
//                         className="text-indigo-600 hover:underline"
//                       >
//                         {contact.account?.accountName || "—"}
//                       </Link>
//                     </td>

//                     <td className="table-cell text-gray-500">
//                       {contact.leadSource
//                         ? formatLabel(contact.leadSource)
//                         : "—"}
//                     </td>

//                     <td className="table-cell text-center">
//                       <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
//                         {contact._count?.deals || 0}
//                       </span>
//                     </td>

//                     {/* ACTIONS */}
//                     <td className="table-cell">
//                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
//                         <button
//                           onClick={() =>
//                             navigate(`/contacts/${contact.id}`)
//                           }
//                           className="icon-btn hover:text-indigo-600"
//                         >
//                           <EyeIcon className="w-4.5 h-4.5" />
//                         </button>

//                         <button
//                           onClick={() =>
//                             navigate(`/contacts/${contact.id}/edit`)
//                           }
//                           className="icon-btn hover:text-amber-500"
//                         >
//                           <PencilSquareIcon className="w-4.5 h-4.5" />
//                         </button>

//                         <button
//                           onClick={() =>
//                             setDeleteModal({
//                               open: true,
//                               id: contact.id,
//                               name: `${contact.firstName} ${contact.lastName}`,
//                             })
//                           }
//                           className="icon-btn hover:text-rose-600"
//                         >
//                           <TrashIcon className="w-4.5 h-4.5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* 📱 MOBILE CARD VIEW */}
//           <div className="lg:hidden divide-y">
//             {contacts.map((contact) => (
//               <div key={contact.id} className="p-4 space-y-3">
//                 <div className="flex items-center gap-3">
//                   <Avatar
//                     name={contact.firstName}
//                     secondName={contact.lastName}
//                     size="sm"
//                     image={contact.image}
//                   />
//                   <div className="font-semibold">
//                     {contact.firstName} {contact.lastName}
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-500">
//                   {contact.email || "—"}
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-xs text-gray-400">
//                     Deals: {contact._count?.deals || 0}
//                   </span>

//                   <div className="flex gap-3">
//                     <EyeIcon
//                       onClick={() =>
//                         navigate(`/contacts/${contact.id}`)
//                       }
//                       className="w-5 text-indigo-600"
//                     />
//                     <PencilSquareIcon
//                       onClick={() =>
//                         navigate(`/contacts/${contact.id}/edit`)
//                       }
//                       className="w-5 text-amber-500"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {pagination?.pages > 1 && (
//             <div className="border-t bg-gray-50 px-6 py-4">
//               <Pagination pagination={pagination} onPageChange={setPage} />
//             </div>
//           )}
//         </>
//       )}
//     </div>

//     <DeleteConfirm
//       open={deleteModal.open}
//       onClose={() =>
//         setDeleteModal({ open: false, id: null, name: "" })
//       }
//       onConfirm={handleDelete}
//       loading={deleting}
//     />
//   </div>
// );}

// export default ContactList;

// src/features/contacts/ContactList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchContacts, deleteContact } from "./contactSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { formatLabel } from "../../constants";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
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
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import SendCampaignModal from "../email/components/SendCampaignModal";
import CampaignInbox from "../email/components/CampaignInbox";
import EmailTemplateManager from "../email/components/EmailTemplateManager";

// Lead Source Colors
const LEAD_SOURCE_COLORS = {
  WEBSITE: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  REFERRAL: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  LINKEDIN: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  COLD_CALL: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  TRADE_SHOW: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  ADVERTISEMENT: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },
  EMAIL_CAMPAIGN: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  PARTNER: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  OTHER: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
};

// Priority Colors for Tasks
const getPriorityStyles = (priority) => {
  const styles = {
    HIGH: "bg-red-100 text-red-700 border-red-200",
    MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
    LOW: "bg-green-100 text-green-700 border-green-200",
  };
  return styles[priority] || "bg-gray-100 text-gray-700 border-gray-200";
};

const ContactList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts, pagination, loading } = useSelector((s) => s.contacts);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchContacts({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteContact(deleteModal.id)).unwrap();
      toast.success("Contact deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasFilters = search;

  const prepareExportData = () => {
    return contacts.map((c) => ({
      Name: `${c.firstName} ${c.lastName}`,
      Email: c.email || "",
      Phone: c.phone || "",
      Account: c.account?.accountName || "",
      LeadSource: c.leadSource || "",
      Deals: c._count?.deals || 0,
      CreatedAt: c.createdAt
        ? new Date(c.createdAt).toLocaleDateString("en-GB")
        : "",
    }));
  };

  const exportCSV = () => {
    const data = prepareExportData();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `contacts_export_${Date.now()}.csv`);

    setShowExportDropdown(false);
  };

  const exportExcel = () => {
    const data = prepareExportData();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `contacts_export_${Date.now()}.xlsx`);

    setShowExportDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your contact database and relationships
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* SEND CAMPAIGN */}
          <button
            onClick={() => setShowCampaignModal(true)}
            disabled={!selectedContacts.length}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-40"
          >
            Send Campaign
          </button>

          {/* INBOX */}
          <button
            onClick={() => setShowInbox(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            Inbox
          </button>

          {/* TEMPLATE */}
          <button
            onClick={() => setShowTemplateManager(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            + Template
          </button>

          {/* NEW CONTACT */}
          <button
            onClick={() => navigate("/contacts/new")}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            <PlusIcon className="w-5 h-5" />
            New Contact
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          {/* TOP ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            {/* SEARCH */}
            <div className="relative w-full sm:flex-1 sm:min-w-0">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              {/* EXPORT */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={!contacts.length}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportDropdown && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      <button
                        onClick={exportExcel}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Export as Excel
                      </button>

                      <button
                        onClick={exportCSV}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
                      >
                        Export as CSV
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* CLEAR */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <XMarkIcon className="w-4 h-4 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* RESULTS COUNT */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserGroupIcon className="w-4 h-4" />
            <span>
              {pagination?.total || 0} contact
              {pagination?.total !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading contacts...</p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No contacts found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {hasFilters
                ? "Try adjusting your search"
                : "Get started by creating your first contact"}
            </p>
            {!hasFilters && (
              <button
                onClick={() => navigate("/contacts/new")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create Contact
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts(contacts.map((c) => c.id));
                          } else {
                            setSelectedContacts([]);
                          }
                        }}
                      />
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Upcoming Task
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lead Source
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deals
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => {
                    const sourceColor = LEAD_SOURCE_COLORS[
                      contact.leadSource
                    ] || {
                      bg: "bg-gray-50",
                      text: "text-gray-700",
                      dot: "bg-gray-500",
                    };

                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts([
                                  ...selectedContacts,
                                  contact.id,
                                ]);
                              } else {
                                setSelectedContacts(
                                  selectedContacts.filter(
                                    (id) => id !== contact.id,
                                  ),
                                );
                              }
                            }}
                          />
                        </td>
                        {/* Upcoming Task */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.upcomingTask ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(
                                contact.upcomingTask.priority,
                              )}`}
                            >
                              {formatDate(contact.upcomingTask.dueDate)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Contact Name with Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={contact.firstName}
                              secondName={contact.lastName}
                              size="sm"
                              image={contact.image}
                            />
                            <div>
                              <Link
                                to={`/contacts/${contact.id}`}
                                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                              >
                                {contact.firstName} {contact.lastName}
                              </Link>
                              {contact.title && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {contact.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.email ? (
                            <div className="flex items-center gap-2">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {contact.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.phone ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Account */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.account ? (
                            <div className="flex items-center gap-2">
                              <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                              <Link
                                to={`/accounts/${contact.account.id}`}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {contact.account.accountName}
                              </Link>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Lead Source */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.leadSource ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sourceColor.bg} ${sourceColor.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${sourceColor.dot}`}
                              />
                              {formatLabel(contact.leadSource)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Deals Count */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            {contact._count?.deals || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(`/contacts/${contact.id}`)
                              }
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Contact"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/contacts/${contact.id}/edit`)
                              }
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                              title="Edit Contact"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  id: contact.id,
                                  name: `${contact.firstName} ${contact.lastName}`,
                                })
                              }
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete Contact"
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
            <div className="lg:hidden divide-y divide-gray-200">
              {contacts.map((contact) => {
                const sourceColor = LEAD_SOURCE_COLORS[contact.leadSource] || {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  dot: "bg-gray-500",
                };

                return (
                  <div key={contact.id} className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={contact.firstName}
                          secondName={contact.lastName}
                          size="md"
                          image={contact.image}
                        />
                        <div>
                          <Link
                            to={`/contacts/${contact.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {contact.title && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {contact.title}
                            </p>
                          )}
                        </div>
                      </div>
                      {contact.upcomingTask && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityStyles(
                            contact.upcomingTask.priority,
                          )}`}
                        >
                          {formatDate(contact.upcomingTask.dueDate)}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-blue-600"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-blue-600"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.account && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                          <Link
                            to={`/accounts/${contact.account.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.account.accountName}
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {contact.leadSource && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sourceColor.bg} ${sourceColor.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sourceColor.dot}`}
                            />
                            {formatLabel(contact.leadSource)}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {contact._count?.deals || 0} deals
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/contacts/${contact.id}/edit`)
                          }
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              id: contact.id,
                              name: `${contact.firstName} ${contact.lastName}`,
                            })
                          }
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  contacts
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
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() =>
                setDeleteModal({ open: false, id: null, name: "" })
              }
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Contact
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-900">
                      "{deleteModal.name}"
                    </span>
                    ? This action cannot be undone and will remove all
                    associated data.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, id: null, name: "" })
                  }
                  disabled={deleting}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Contact"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SEND CAMPAIGN MODAL */}
      {showCampaignModal && (
        <SendCampaignModal
          contacts={contacts.filter((c) => selectedContacts.includes(c.id))}
          onClose={() => setShowCampaignModal(false)}
        />
      )}

      {/* CAMPAIGN INBOX */}
      {showInbox && <CampaignInbox onClose={() => setShowInbox(false)} />}

      {/* TEMPLATE MANAGER */}
      {showTemplateManager && (
        <EmailTemplateManager onClose={() => setShowTemplateManager(false)} />
      )}
    </div>
  );
};

export default ContactList;
