
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import {
//   createDeal,
//   updateDeal,
//   fetchDeal,
//   clearCurrentDeal,
// } from "./dealSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { fetchAccountsDropdown } from "../accounts/accountSlice";
// import { fetchContactsDropdown } from "../contacts/contactSlice";
// import { DEAL_STAGES, LEAD_SOURCES, DEAL_TYPES, formatLabel } from "../../constants";
// import Spinner from "../../components/Spinner";
// import toast from "react-hot-toast";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// const initialForm = {
//   dealName: "",
//   amount: "",
//   expectedRevenue: "",
//   closingDate: "",
//   stage: "QUALIFICATION",
//   type: "",
//   nextStep: "",
//   leadSource: "",
//   campaignSource: "",
//   description: "",
//   dealOwnerId: "",
//   accountId: "",
//   contactId: "",
// };

// const DealForm = () => {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const isEdit = Boolean(id);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accountDropdown } = useSelector((s) => s.accounts);
//   const { dropdown: contactDropdown } = useSelector((s) => s.contacts);

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchAccountsDropdown());
//     if (isEdit) dispatch(fetchDeal(id));
//     return () => dispatch(clearCurrentDeal());
//   }, [dispatch, id, isEdit]);

//   useEffect(() => {
//     if (form.accountId) {
//       dispatch(fetchContactsDropdown({ accountId: form.accountId }));
//     }
//   }, [dispatch, form.accountId]);

//   useEffect(() => {
//     if (isEdit && deal) {
//       const formData = {};
//       Object.keys(initialForm).forEach((key) => {
//         if (key === "closingDate" && deal[key]) {
//           formData[key] = new Date(deal[key]).toISOString().split("T")[0];
//         } else {
//           formData[key] = deal[key] ?? "";
//         }
//       });
//       setForm(formData);
//     } else if (!isEdit) {
//       setForm((prev) => ({
//         ...prev,
//         dealOwnerId: user?.id || "",
//         accountId: searchParams.get("accountId") || "",
//         contactId: searchParams.get("contactId") || "",
//       }));
//     }
//   }, [deal, isEdit, user, searchParams]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (name === "accountId") {
//       setForm((prev) => ({ ...prev, contactId: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {};
//       Object.entries(form).forEach(([k, v]) => {
//         payload[k] = v === "" ? null : v;
//       });
//       payload.dealName = form.dealName;
//       payload.closingDate = form.closingDate;
//       payload.stage = form.stage;
//       payload.accountId = form.accountId;
//       payload.dealOwnerId = form.dealOwnerId || user.id;

//       if (isEdit) {
//         await dispatch(updateDeal({ id, ...payload })).unwrap();
//         toast.success("Deal updated successfully");
//       } else {
//         await dispatch(createDeal(payload)).unwrap();
//         toast.success("Deal created successfully");
//       }
//       navigate("/deals");
//     } catch (err) {
//       toast.error(err || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isEdit && detailLoading) {
//     return <Spinner className="py-20" />;
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => navigate("/deals")}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//         </button>
//         <h1 className="page-title">{isEdit ? "Edit Deal" : "Create Deal"}</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Deal Information */}
//         <div className="card">
//           <h2 className="section-title mb-4">Deal Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="label">
//                 Deal Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="dealName"
//                 value={form.dealName}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label className="label">Deal Owner</label>
//               <select
//                 name="dealOwnerId"
//                 value={form.dealOwnerId}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Owner</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.id}>
//                     {u.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">
//                 Account <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="accountId"
//                 value={form.accountId}
//                 onChange={handleChange}
//                 className="select-field"
//                 required
//               >
//                 <option value="">Select Account</option>
//                 {accountDropdown.map((a) => (
//                   <option key={a.id} value={a.id}>
//                     {a.accountName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Contact</label>
//               <select
//                 name="contactId"
//                 value={form.contactId}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Contact</option>
//                 {contactDropdown.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.firstName} {c.lastName || ""}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Amount (₹)</label>
//               <input
//                 name="amount"
//                 type="number"
//                 step="0.01"
//                 value={form.amount}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g., 500000"
//               />
//             </div>
//             <div>
//               <label className="label">Expected Revenue (₹)</label>
//               <input
//                 name="expectedRevenue"
//                 type="number"
//                 step="0.01"
//                 value={form.expectedRevenue}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">
//                 Closing Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="closingDate"
//                 type="date"
//                 value={form.closingDate}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label className="label">
//                 Stage <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="stage"
//                 value={form.stage}
//                 onChange={handleChange}
//                 className="select-field"
//                 required
//               >
//                 {DEAL_STAGES.map((s) => (
//                   <option key={s} value={s}>
//                     {formatLabel(s)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Type</label>
//               <select
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Type</option>
//                 {DEAL_TYPES.map((t) => (
//                   <option key={t.value} value={t.value}>
//                     {t.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Lead Source</label>
//               <select
//                 name="leadSource"
//                 value={form.leadSource}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Source</option>
//                 {LEAD_SOURCES.map((s) => (
//                   <option key={s.value} value={s.value}>
//                     {s.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Next Step</label>
//               <input
//                 name="nextStep"
//                 value={form.nextStep}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g., Schedule demo"
//               />
//             </div>
//             <div>
//               <label className="label">Campaign Source</label>
//               <input
//                 name="campaignSource"
//                 value={form.campaignSource}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="card">
//           <h2 className="section-title mb-4">Description</h2>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className="input-field"
//             rows={4}
//             placeholder="Additional details about this deal..."
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pb-4">
//           <button
//             type="button"
//             onClick={() => navigate("/deals")}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//           <button type="submit" disabled={submitting} className="btn-primary">
//             {submitting
//               ? "Saving..."
//               : isEdit
//               ? "Update Deal"
//               : "Create Deal"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DealForm;
// src/features/deals/DealForm.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDeal,
  updateDeal,
  fetchDeal,
  clearCurrentDeal,
} from "./dealSlice";
import { fetchUsers } from "../auth/authSlice";
import { fetchAccountsDropdown } from "../accounts/accountSlice";
import { fetchContactsDropdown } from "../contacts/contactSlice";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  PhoneIcon,
  BanknotesIcon,
  FlagIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  CurrencyDollarIcon as CurrencyDollarSolid,
} from "@heroicons/react/24/solid";

/* ═══════════════════ CONSTANTS ═══════════════════ */

const STAGES = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "REGRETTED",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
];

const STAGE_COLORS = {
  RFQ: "bg-gray-100 text-gray-700 border-gray-300",
  VISIT_MEETING: "bg-blue-100 text-blue-700 border-blue-300",
  PREVIEW: "bg-indigo-100 text-indigo-700 border-indigo-300",
  REGRETTED: "bg-red-100 text-red-700 border-red-300",
  TECHNICAL_PROPOSAL: "bg-purple-100 text-purple-700 border-purple-300",
  COMMERCIAL_PROPOSAL: "bg-yellow-100 text-yellow-700 border-yellow-300",
  REVIEW_FEEDBACK: "bg-orange-100 text-orange-700 border-orange-300",
  MOVED_TO_PURCHASE: "bg-cyan-100 text-cyan-700 border-cyan-300",
  NEGOTIATION: "bg-amber-100 text-amber-700 border-amber-300",
  CLOSED_WON: "bg-green-100 text-green-700 border-green-300",
  CLOSED_LOST: "bg-red-100 text-red-700 border-red-300",
  CLOSED_LOST_TO_COMPETITION: "bg-rose-100 text-rose-700 border-rose-300",
};

const PRODUCT_GROUPS = [
  "MTS_PRO",
  "MTS_STANDARD",
  "FACTEYES",
  "MTS_ASSEMBLY",
];

const WEIGHTAGES = [
  "PROBABILITY",
  "BALLPARK_OFFER",
  "BUDGETARY_OFFER",
  "DETAIL_L1",
  "DETAIL_L2",
  "FIRM_AFTER_PRICE_FINALIZATION",
  "TECHNICAL_ONLY",
];

const initialForm = {
  dealName: "",
  amount: "",
  expectedRevenue: "",
  closingDate: "",
  stage: "RFQ",
  dealOwnerId: "",
  personInCharge: "",
  accountId: "",
  contactId: "",
  productGroup: "",
  weightage: "",
  nextStep: "",
  description: "",
};

/* ═══════════════════ REUSABLE SUB‑COMPONENTS ═══════════════════ */

const SectionHeader = ({ icon: Icon, title, subtitle, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-violet-600",
    amber: "from-amber-500 to-orange-600",
    gray: "from-gray-500 to-gray-600",
  };

  return (
    <div className="flex items-center gap-3 mb-5">
      <div
        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  icon: Icon,
  required: req,
  hint,
  error,
  prefix,
  ...props
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {label}
      {req && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        {...props}
        className={`
          w-full rounded-xl border bg-white text-sm text-gray-900 font-medium
          placeholder:text-gray-400 placeholder:font-normal
          transition-all duration-200
          focus:ring-2 focus:ring-blue-100 focus:border-blue-400
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${prefix ? "pl-8" : "pl-3.5"} pr-3.5 py-2.5
          ${error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200 hover:border-gray-300"}
        `}
      />
    </div>
    {hint && !error && (
      <p className="text-[11px] text-gray-400 flex items-center gap-1">
        <InformationCircleIcon className="w-3 h-3" />
        {hint}
      </p>
    )}
    {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
  </div>
);

const FormSelect = ({
  label,
  icon: Icon,
  options = [],
  required: req,
  hint,
  placeholder = "Select an option",
  ...props
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {label}
      {req && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        className={`
          w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-900 font-medium
          pl-3.5 pr-10 py-2.5 appearance-none cursor-pointer
          transition-all duration-200
          hover:border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400
          ${!props.value ? "text-gray-400 font-normal" : ""}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name ||
              o.accountName ||
              `${o.firstName || ""} ${o.lastName || ""}`}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {hint && (
      <p className="text-[11px] text-gray-400 flex items-center gap-1">
        <InformationCircleIcon className="w-3 h-3" />
        {hint}
      </p>
    )}
  </div>
);

const FormSelectSimple = ({
  label,
  icon: Icon,
  options,
  required: req,
  hint,
  placeholder = "Select an option",
  ...props
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
      {label}
      {req && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        className={`
          w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-900 font-medium
          pl-3.5 pr-10 py-2.5 appearance-none cursor-pointer
          transition-all duration-200
          hover:border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400
          ${!props.value ? "text-gray-400 font-normal" : ""}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replaceAll("_", " ")}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {hint && (
      <p className="text-[11px] text-gray-400 flex items-center gap-1">
        <InformationCircleIcon className="w-3 h-3" />
        {hint}
      </p>
    )}
  </div>
);

/* ═══════════════════ STAGE SELECTOR ═══════════════════ */

const StageSelector = ({ value, onChange }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
      <FlagIcon className="w-3.5 h-3.5 text-gray-400" />
      Deal Stage
    </label>
    <div className="flex flex-wrap gap-1.5">
      {STAGES.map((stage) => {
        const isActive = value === stage;
        return (
          <button
            key={stage}
            type="button"
            onClick={() =>
              onChange({ target: { name: "stage", value: stage } })
            }
            className={`
              inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border
              transition-all duration-200
              ${
                isActive
                  ? `${STAGE_COLORS[stage]} ring-2 ring-offset-1 ring-current/20 shadow-sm`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {isActive && <CheckIcon className="w-3 h-3" />}
            {stage.replaceAll("_", " ")}
          </button>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════ PROGRESS INDICATOR ═══════════════════ */

const FormProgress = ({ form }) => {
  const fields = [
    { key: "dealName", label: "Deal Name" },
    { key: "accountId", label: "Account" },
    { key: "amount", label: "Amount" },
    { key: "closingDate", label: "Closing Date" },
    { key: "stage", label: "Stage" },
    { key: "productGroup", label: "Product Group" },
  ];

  const filled = fields.filter((f) => form[f.key]).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Completion
        </h4>
        <span
          className={`text-sm font-extrabold ${
            pct === 100
              ? "text-green-600"
              : pct >= 50
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        >
          {pct}%
        </span>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            pct === 100
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : "bg-gradient-to-r from-blue-400 to-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="space-y-2">
        {fields.map((f) => {
          const done = Boolean(form[f.key]);
          return (
            <div key={f.key} className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  done
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <CheckIcon className="w-3 h-3" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  done ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {f.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

const DealForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accounts } = useSelector((s) => s.accounts);
  const { dropdown: contacts } = useSelector((s) => s.contacts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ── load ── */

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchDeal(id));
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  useEffect(() => {
    if (form.accountId) {
      dispatch(fetchContactsDropdown({ accountId: form.accountId }));
    }
  }, [dispatch, form.accountId]);

  /* ── prefill ── */

  useEffect(() => {
    if (isEdit && deal) {
      setForm({
        ...initialForm,
        ...deal,
        personInCharge: deal.personInCharge || "",
        closingDate: deal.closingDate?.slice(0, 10),
      });
      if (deal.accountId) {
        dispatch(fetchContactsDropdown({ accountId: deal.accountId }));
      }
    } else if (user) {
      setForm((prev) => ({ ...prev, dealOwnerId: user.id }));
    }
  }, [deal, isEdit, user, dispatch]);

  /* ── change ── */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "accountId" && { contactId: "" }),
    }));
  };

  /* ── submit ── */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v || null])
      );
      if (isEdit) {
        await dispatch(updateDeal({ id, ...payload })).unwrap();
        toast.success("Deal updated successfully");
      } else {
        await dispatch(createDeal(payload)).unwrap();
        toast.success("Deal created successfully");
      }
      navigate("/deals");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) return <Spinner className="py-20" />;

  /* ═══════════════════ RENDER ═══════════════════ */

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/deals")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                isEdit
                  ? "bg-gradient-to-br from-amber-500 to-orange-600"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            >
              {isEdit ? (
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              ) : (
                <RocketLaunchIcon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {isEdit ? "Edit Deal" : "Create New Deal"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEdit
                  ? `Updating ${deal?.dealLogId || "deal"}`
                  : "Fill in the details to create a new deal"}
              </p>
            </div>
          </div>
        </div>

        {/* top actions (visible on desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/deals")}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="deal-form"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                {isEdit ? "Update Deal" : "Create Deal"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── FORM GRID ─── */}
      <form
        id="deal-form"
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-4 gap-6"
      >
        {/* ══════ LEFT COLUMN (3/4) ══════ */}
        <div className="lg:col-span-3 space-y-6">
          {/* ── DEAL INFO SECTION ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={BriefcaseIcon}
              title="Deal Information"
              subtitle="Basic details about the deal"
              color="blue"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              {isEdit && (
                <FormInput
                  label="Deal Log ID"
                  icon={ClipboardDocumentListIcon}
                  value={deal?.dealLogId || ""}
                  disabled
                  hint="Auto-generated identifier"
                />
              )}

              <FormInput
                name="dealName"
                label="Deal Name"
                icon={SparklesIcon}
                value={form.dealName}
                onChange={handleChange}
                required
                placeholder="Enter deal name"
                hint="Give this deal a descriptive name"
              />

              <FormSelect
                name="dealOwnerId"
                label="Deal Owner"
                icon={ShieldCheckIcon}
                value={form.dealOwnerId}
                onChange={handleChange}
                options={users}
                placeholder="Select owner"
              />

              <FormInput
                name="personInCharge"
                label="Person In Charge"
                icon={UserIcon}
                value={form.personInCharge}
                onChange={handleChange}
                placeholder="Enter person name"
              />
            </div>
          </div>

          {/* ── ACCOUNT & CONTACT ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={BuildingOfficeIcon}
              title="Account & Contact"
              subtitle="Link this deal to an account and contact"
              color="purple"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <FormSelect
                name="accountId"
                label="Account"
                icon={BuildingOfficeIcon}
                value={form.accountId}
                onChange={handleChange}
                options={accounts}
                required
                placeholder="Select account"
                hint="Contacts will load based on selected account"
              />

              <FormSelect
                name="contactId"
                label="Contact"
                icon={UserCircleIcon}
                value={form.contactId}
                onChange={handleChange}
                options={contacts}
                placeholder={
                  form.accountId
                    ? "Select contact"
                    : "Select an account first"
                }
                hint={
                  !form.accountId
                    ? "Choose an account to see contacts"
                    : undefined
                }
              />
            </div>
          </div>

          {/* ── FINANCIALS ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={BanknotesIcon}
              title="Financial Details"
              subtitle="Deal value and revenue expectations"
              color="green"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <FormInput
                name="amount"
                label="Deal Amount"
                icon={CurrencyDollarIcon}
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                prefix="₹"
                hint="Total value of the deal"
              />

              <FormInput
                name="expectedRevenue"
                label="Expected Revenue"
                icon={ArrowTrendingUpIcon}
                type="number"
                value={form.expectedRevenue}
                onChange={handleChange}
                placeholder="0"
                prefix="₹"
                hint="Projected revenue from this deal"
              />

              <FormInput
                name="closingDate"
                label="Closing Date"
                icon={CalendarDaysIcon}
                type="date"
                value={form.closingDate}
                onChange={handleChange}
                required
                hint="Expected date to close this deal"
              />
            </div>
          </div>

          {/* ── STAGE SELECTOR ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={FlagIcon}
              title="Pipeline Stage"
              subtitle="Current position in your sales pipeline"
              color="amber"
            />

            <StageSelector value={form.stage} onChange={handleChange} />
          </div>

          {/* ── CLASSIFICATION ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={TagIcon}
              title="Classification"
              subtitle="Categorize and prioritize this deal"
              color="purple"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <FormSelectSimple
                name="productGroup"
                label="Product Group"
                icon={TagIcon}
                value={form.productGroup}
                onChange={handleChange}
                options={PRODUCT_GROUPS}
                placeholder="Select product group"
              />

              <FormSelectSimple
                name="weightage"
                label="Weightage"
                icon={ChartBarIcon}
                value={form.weightage}
                onChange={handleChange}
                options={WEIGHTAGES}
                placeholder="Select weightage"
                hint="How firm is this deal's pricing?"
              />

              <FormInput
                name="nextStep"
                label="Next Step"
                icon={ArrowTrendingUpIcon}
                value={form.nextStep}
                onChange={handleChange}
                placeholder="e.g., Schedule demo, Send proposal"
                hint="What's the next action for this deal?"
              />
            </div>
          </div>

          {/* ── DESCRIPTION ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <SectionHeader
              icon={DocumentTextIcon}
              title="Additional Notes"
              subtitle="Any extra information about this deal"
              color="gray"
            />

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <DocumentTextIcon className="w-3.5 h-3.5 text-gray-400" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add any notes, context, or special requirements for this deal..."
                className="w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-900 font-medium placeholder:text-gray-400 placeholder:font-normal pl-3.5 pr-3.5 py-2.5 transition-all duration-200 hover:border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          {/* ── MOBILE ACTIONS ── */}
          <div className="flex sm:hidden items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/deals")}
              className="flex-1 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-200 transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══════ RIGHT SIDEBAR (1/4) ══════ */}
        <div className="space-y-6">
          {/* form progress */}
          <FormProgress form={form} />

          {/* stage preview */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Current Stage
            </h4>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold border ${
                STAGE_COLORS[form.stage] || "bg-gray-100 text-gray-600"
              }`}
            >
              <FlagIcon className="w-4 h-4" />
              {form.stage.replaceAll("_", " ")}
            </div>
          </div>



          </div>
      </form>
    </div>
  );
};

export default DealForm;
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createDeal,
//   updateDeal,
//   fetchDeal,
//   clearCurrentDeal,
// } from "./dealSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { fetchAccountsDropdown } from "../accounts/accountSlice";
// import { fetchContactsDropdown } from "../contacts/contactSlice";
// import Spinner from "../../components/Spinner";
// import toast from "react-hot-toast";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// /* ================= CONSTANTS ================= */

// const STAGES = [
//   "RFQ",
//   "VISIT_MEETING",
//   "PREVIEW",
//   "REGRETTED",
//   "TECHNICAL_PROPOSAL",
//   "COMMERCIAL_PROPOSAL",
//   "REVIEW_FEEDBACK",
//   "MOVED_TO_PURCHASE",
//   "NEGOTIATION",
//   "CLOSED_WON",
//   "CLOSED_LOST",
//   "CLOSED_LOST_TO_COMPETITION",
// ];

// const PRODUCT_GROUPS = [
//   "MTS_PRO",
//   "MTS_STANDARD",
//   "FACTEYES",
//   "MTS_ASSEMBLY",
// ];

// const WEIGHTAGES = [
//   "PROBABILITY",
//   "BALLPARK_OFFER",
//   "BUDGETARY_OFFER",
//   "DETAIL_L1",
//   "DETAIL_L2",
//   "FIRM_AFTER_PRICE_FINALIZATION",
//   "TECHNICAL_ONLY",
// ];

// /* ================= INITIAL STATE ================= */

// const initialForm = {
//   dealName: "",
//   amount: "",
//   expectedRevenue: "",
//   closingDate: "",
//   stage: "RFQ",

//   dealOwnerId: "",
//   personInCharge: "", // ✅ TEXT FIELD

//   accountId: "",
//   contactId: "",

//   productGroup: "",
//   weightage: "",

//   nextStep: "",
//   description: "",
// };

// /* ================= COMPONENT ================= */

// const DealForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { deal, detailLoading } = useSelector((s) => s.deals);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accounts } = useSelector((s) => s.accounts);
//   const { dropdown: contacts } = useSelector((s) => s.contacts);

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);

//   /* ================= LOAD ================= */

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchAccountsDropdown());

//     if (isEdit) dispatch(fetchDeal(id));

//     return () => dispatch(clearCurrentDeal());
//   }, [dispatch, id]);

//   /* ✅ LOAD CONTACTS WHEN ACCOUNT CHANGES */

//   useEffect(() => {
//     if (form.accountId) {
//       dispatch(fetchContactsDropdown({ accountId: form.accountId }));
//     }
//   }, [dispatch, form.accountId]);

//   /* ================= PREFILL ================= */

//   useEffect(() => {
//     if (isEdit && deal) {
//       setForm({
//         ...initialForm,
//         ...deal,
//         personInCharge: deal.personInCharge || "",
//         closingDate: deal.closingDate?.slice(0, 10),
//       });

//       // ✅ Load contacts for existing account in edit
//       if (deal.accountId) {
//         dispatch(fetchContactsDropdown({ accountId: deal.accountId }));
//       }
//     } else if (user) {
//       setForm((prev) => ({
//         ...prev,
//         dealOwnerId: user.id,
//       }));
//     }
//   }, [deal, isEdit, user, dispatch]);

//   /* ================= CHANGE ================= */

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === "accountId" && { contactId: "" }),
//     }));
//   };

//   /* ================= SUBMIT ================= */

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const payload = Object.fromEntries(
//         Object.entries(form).map(([k, v]) => [k, v || null])
//       );

//       if (isEdit) {
//         await dispatch(updateDeal({ id, ...payload })).unwrap();
//         toast.success("Deal updated");
//       } else {
//         await dispatch(createDeal(payload)).unwrap();
//         toast.success("Deal created");
//       }

//       navigate("/deals");
//     } catch {
//       toast.error("Failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isEdit && detailLoading) return <Spinner className="py-20" />;

//   /* ================= UI ================= */

//   return (
//     <div className="max-w-5xl mx-auto">

//       {/* HEADER */}
//       <div className="flex items-center gap-3 mb-6">
//         <ArrowLeftIcon
//           onClick={() => navigate("/deals")}
//           className="w-5 h-5 cursor-pointer text-gray-500"
//         />
//         <h1 className="text-2xl font-semibold">
//           {isEdit ? "Edit Deal" : "Create Deal"}
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">

//         <div className="bg-white p-6 rounded-xl border grid md:grid-cols-2 gap-4">

//           {isEdit && (
//             <Input
//               label="Deal Log ID"
//               value={deal?.dealLogId || ""}
//               disabled
//             />
//           )}

//           <Input name="dealName" label="Deal Name *" value={form.dealName} onChange={handleChange} required />

//           <Select
//             name="dealOwnerId"
//             label="Deal Owner"
//             value={form.dealOwnerId}
//             onChange={handleChange}
//             options={users}
//           />

//           {/* ✅ TEXT INPUT */}
//           <Input
//             name="personInCharge"
//             label="Person In Charge"
//             value={form.personInCharge}
//             onChange={handleChange}
//             placeholder="Enter person name"
//           />

//           <Select
//             name="accountId"
//             label="Account *"
//             value={form.accountId}
//             onChange={handleChange}
//             options={accounts}
//             required
//           />

//           {/* ✅ CONTACT WORKS LIKE BEFORE */}
//           <Select
//             name="contactId"
//             label="Contact"
//             value={form.contactId}
//             onChange={handleChange}
//             options={contacts}
//           />

//           <Input name="amount" label="Amount" type="number" value={form.amount} onChange={handleChange} />

//           <Input name="expectedRevenue" label="Expected Revenue" type="number" value={form.expectedRevenue} onChange={handleChange} />

//           <Input name="closingDate" label="Closing Date *" type="date" value={form.closingDate} onChange={handleChange} required />

//           <SelectSimple name="stage" label="Stage" value={form.stage} onChange={handleChange} options={STAGES} />

//           <SelectSimple name="productGroup" label="Product Group" value={form.productGroup} onChange={handleChange} options={PRODUCT_GROUPS} />

//           <SelectSimple name="weightage" label="Weightage" value={form.weightage} onChange={handleChange} options={WEIGHTAGES} />

//           <Input name="nextStep" label="Next Step" value={form.nextStep} onChange={handleChange} />

//         </div>

//         <div className="bg-white p-6 rounded-xl border">
//           <label className="label">Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             className="input-field"
//           />
//         </div>

//         <div className="flex justify-end gap-3">
//           <button type="button" onClick={() => navigate("/deals")} className="btn-secondary">
//             Cancel
//           </button>
//           <button className="btn-primary" disabled={submitting}>
//             {submitting ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
//           </button>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default DealForm;

// /* ================= REUSABLE ================= */

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="label">{label}</label>
//     <input {...props} className="input-field" />
//   </div>
// );

// const Select = ({ label, options = [], ...props }) => (
//   <div>
//     <label className="label">{label}</label>
//     <select {...props} className="select-field">
//       <option value="">Select</option>
//       {options.map((o) => (
//         <option key={o.id} value={o.id}>
//           {o.name || o.accountName || `${o.firstName || ""} ${o.lastName || ""}`}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const SelectSimple = ({ label, options, ...props }) => (
//   <div>
//     <label className="label">{label}</label>
//     <select {...props} className="select-field">
//       <option value="">Select</option>
//       {options.map((o) => (
//         <option key={o} value={o}>
//           {o.replaceAll("_", " ")}
//         </option>
//       ))}
//     </select>
//   </div>
// );