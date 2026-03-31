// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createAccount,
//   updateAccount,
//   fetchAccount,
//   clearCurrentAccount,
//   fetchAccountsDropdown,
// } from "./accountSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { INDUSTRIES, ACCOUNT_TYPES, ACCOUNT_RATINGS } from "../../constants";
// import Spinner from "../../components/Spinner";
// import ImageUpload from "../../components/ImageUpload";
// import toast from "react-hot-toast";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// const initialForm = {
//   accountName: "",
//   accountOwnerId: "",
//   parentAccountId: "",
//   accountType: "",
//   industry: "",
//   annualRevenue: "",
//   employees: "",
//   rating: "",
//   phone: "",
//   website: "",
//   ownership: "",
//   image: "",
//   billingStreet: "",
//   billingCity: "",
//   billingState: "",
//   billingPincode: "",
//   billingCountry: "",
//   shippingStreet: "",
//   shippingCity: "",
//   shippingState: "",
//   shippingPincode: "",
//   shippingCountry: "",
// };

// const AccountForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { account, detailLoading } = useSelector((s) => s.accounts);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);
//   const [copyBilling, setCopyBilling] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchAccountsDropdown());
//     if (isEdit) dispatch(fetchAccount(id));
//     return () => dispatch(clearCurrentAccount());
//   }, [dispatch, id, isEdit]);

//   useEffect(() => {
//     if (isEdit && account) {
//       const formData = {};
//       Object.keys(initialForm).forEach((key) => {
//         formData[key] = account[key] ?? "";
//       });
//       setForm(formData);
//     } else if (!isEdit && user) {
//       setForm((prev) => ({ ...prev, accountOwnerId: user.id }));
//     }
//   }, [account, isEdit, user]);

//   useEffect(() => {
//     if (copyBilling) {
//       setForm((prev) => ({
//         ...prev,
//         shippingStreet: prev.billingStreet,
//         shippingCity: prev.billingCity,
//         shippingState: prev.billingState,
//         shippingPincode: prev.billingPincode,
//         shippingCountry: prev.billingCountry,
//       }));
//     }
//   }, [copyBilling]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleImageChange = (imageData) => {
//     setForm((prev) => ({ ...prev, image: imageData }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {};
//       Object.entries(form).forEach(([key, val]) => {
//         payload[key] = val === "" ? null : val;
//       });
//       payload.accountName = form.accountName;
//       payload.accountOwnerId = form.accountOwnerId || user.id;

//       if (isEdit) {
//         await dispatch(updateAccount({ id, ...payload })).unwrap();
//         toast.success("Account updated successfully");
//       } else {
//         await dispatch(createAccount(payload)).unwrap();
//         toast.success("Account created successfully");
//       }
//       navigate("/accounts");
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
//           onClick={() => navigate("/accounts")}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//         </button>
//         <h1 className="page-title">{isEdit ? "Edit Account" : "Create Account"}</h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Account Image */}
//         <div className="card">
//           <h2 className="section-title mb-4">Account Logo</h2>
//           <ImageUpload
//             value={form.image}
//             onChange={handleImageChange}
//             label="Company Logo"
//             shape="square"
//           />
//         </div>

//         {/* Account Info */}
//         <div className="card">
//           <h2 className="section-title mb-4">Account Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="label">
//                 Account Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 name="accountName"
//                 value={form.accountName}
//                 onChange={handleChange}
//                 className="input-field"
//                 required
//               />
//             </div>
//             <div>
//               <label className="label">
//                 Account Owner <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="accountOwnerId"
//                 value={form.accountOwnerId}
//                 onChange={handleChange}
//                 className="select-field"
//                 required
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
//               <label className="label">Parent Account</label>
//               <select
//                 name="parentAccountId"
//                 value={form.parentAccountId}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">None</option>
//                 {accountDropdown
//                   .filter((a) => a.id !== id)
//                   .map((a) => (
//                     <option key={a.id} value={a.id}>
//                       {a.accountName}
//                     </option>
//                   ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Account Type</label>
//               <select
//                 name="accountType"
//                 value={form.accountType}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Type</option>
//                 {ACCOUNT_TYPES.map((t) => (
//                   <option key={t} value={t}>
//                     {t.replace(/_/g, " ")}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Industry</label>
//               <select
//                 name="industry"
//                 value={form.industry}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Industry</option>
//                 {INDUSTRIES.map((i) => (
//                   <option key={i} value={i}>
//                     {i}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Rating</label>
//               <select
//                 name="rating"
//                 value={form.rating}
//                 onChange={handleChange}
//                 className="select-field"
//               >
//                 <option value="">Select Rating</option>
//                 {ACCOUNT_RATINGS.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label">Annual Revenue (₹)</label>
//               <input
//                 name="annualRevenue"
//                 type="number"
//                 value={form.annualRevenue}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="e.g., 10000000"
//               />
//             </div>
//             <div>
//               <label className="label">Employees</label>
//               <input
//                 name="employees"
//                 type="number"
//                 value={form.employees}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">Phone</label>
//               <input
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="+91 98765 43210"
//               />
//             </div>
//             <div>
//               <label className="label">Website</label>
//               <input
//                 name="website"
//                 value={form.website}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="https://example.com"
//               />
//             </div>
//             <div>
//               <label className="label">Ownership</label>
//               <input
//                 name="ownership"
//                 value={form.ownership}
//                 onChange={handleChange}
//                 className="input-field"
//                 placeholder="Private / Public"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Billing Address */}
//         <div className="card">
//           <h2 className="section-title mb-4">Billing Address</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <label className="label">Street</label>
//               <input
//                 name="billingStreet"
//                 value={form.billingStreet}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">City</label>
//               <input
//                 name="billingCity"
//                 value={form.billingCity}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">State</label>
//               <input
//                 name="billingState"
//                 value={form.billingState}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">Pincode</label>
//               <input
//                 name="billingPincode"
//                 value={form.billingPincode}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">Country</label>
//               <input
//                 name="billingCountry"
//                 value={form.billingCountry}
//                 onChange={handleChange}
//                 className="input-field"
//                 defaultValue="India"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Shipping Address */}
//         <div className="card">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="section-title">Shipping Address</h2>
//             <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
//               <input
//                 type="checkbox"
//                 checked={copyBilling}
//                 onChange={(e) => setCopyBilling(e.target.checked)}
//                 className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               />
//               Same as billing
//             </label>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <label className="label">Street</label>
//               <input
//                 name="shippingStreet"
//                 value={form.shippingStreet}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">City</label>
//               <input
//                 name="shippingCity"
//                 value={form.shippingCity}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">State</label>
//               <input
//                 name="shippingState"
//                 value={form.shippingState}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">Pincode</label>
//               <input
//                 name="shippingPincode"
//                 value={form.shippingPincode}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//             <div>
//               <label className="label">Country</label>
//               <input
//                 name="shippingCountry"
//                 value={form.shippingCountry}
//                 onChange={handleChange}
//                 className="input-field"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pb-4">
//           <button
//             type="button"
//             onClick={() => navigate("/accounts")}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//           <button type="submit" disabled={submitting} className="btn-primary">
//             {submitting
//               ? "Saving..."
//               : isEdit
//               ? "Update Account"
//               : "Create Account"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AccountForm;
// src/features/accounts/AccountForm.jsx

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createAccount,
  updateAccount,
  fetchAccount,
  clearCurrentAccount,
  fetchAccountsDropdown,
} from "./accountSlice";
import { fetchUsers } from "../auth/authSlice";
import { INDUSTRIES, ACCOUNT_TYPES, ACCOUNT_RATINGS } from "../../constants";
import Spinner from "../../components/Spinner";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  UserIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  ChevronRightIcon,
  CheckIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const initialForm = {
  accountName: "",
  accountOwnerId: "",
  parentAccountId: "",
  accountType: "",
  industry: "",
  annualRevenue: "",
  employees: "",
  rating: "",
  phone: "",
  website: "",
  ownership: "",
  image: "",
  lifecycle: "PROSPECT",
  billingStreet: "",
  billingCity: "",
  billingState: "",
  billingPincode: "",
  billingCountry: "",
  shippingStreet: "",
  shippingCity: "",
  shippingState: "",
  shippingPincode: "",
  shippingCountry: "",
};

// Reusable Form Components
const FormSection = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Icon className="w-4 h-4 text-indigo-600" />
          </div>
        )}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const FormField = ({ label, required, children, className = "", hint }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
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
  ...props
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`
        w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg
        placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        transition-all duration-200
        ${Icon ? "pl-10" : ""}
      `}
      {...props}
    />
  </div>
);

const Select = ({ name, value, onChange, options, placeholder, required }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const AccountForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account, detailLoading } = useSelector((s) => s.accounts);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [copyBilling, setCopyBilling] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && account) {
      const formData = {};
      Object.keys(initialForm).forEach((key) => {
        formData[key] = account[key] ?? "";
      });
      setForm(formData);
    } else if (!isEdit && user) {
      setForm((prev) => ({ ...prev, accountOwnerId: user.id }));
    }
  }, [account, isEdit, user]);

  useEffect(() => {
    if (copyBilling) {
      setForm((prev) => ({
        ...prev,
        shippingStreet: prev.billingStreet,
        shippingCity: prev.billingCity,
        shippingState: prev.billingState,
        shippingPincode: prev.billingPincode,
        shippingCountry: prev.billingCountry,
      }));
    }
  }, [
    copyBilling,
    form.billingStreet,
    form.billingCity,
    form.billingState,
    form.billingPincode,
    form.billingCountry,
  ]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (imageData) => {
    setForm((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([key, val]) => {
        payload[key] = val === "" ? null : val;
      });
      payload.accountName = form.accountName;
      payload.accountOwnerId = form.accountOwnerId || user.id;

      if (isEdit) {
        await dispatch(updateAccount({ id, ...payload })).unwrap();
        toast.success("Account updated successfully");
      } else {
        await dispatch(createAccount(payload)).unwrap();
        toast.success("Account created successfully");
      }
      navigate("/accounts");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/accounts"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Accounts
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">
          {isEdit ? "Edit Account" : "New Account"}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/accounts")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Account" : "Create New Account"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Update account information"
                : "Add a new business account to your CRM"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Logo */}
        <FormSection
          title="Account Logo"
          subtitle="Upload your company logo (optional)"
          icon={BuildingOffice2Icon}
        >
          <ImageUpload
            value={form.image}
            onChange={handleImageChange}
            label="Company Logo"
            shape="square"
          />
        </FormSection>

        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          subtitle="Primary account details"
          icon={BuildingOffice2Icon}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Account Name" required>
              <Input
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
                placeholder="Enter account name"
                required
              />
            </FormField>

            <FormField label="Account Owner" required>
              <Select
                name="accountOwnerId"
                value={form.accountOwnerId}
                onChange={handleChange}
                placeholder="Select owner"
                required
                options={users.map((u) => ({ value: u.id, label: u.name }))}
              />
            </FormField>

            <FormField label="Parent Account">
              <Select
                name="parentAccountId"
                value={form.parentAccountId}
                onChange={handleChange}
                placeholder="Select parent account"
                options={accountDropdown
                  .filter((a) => a.id !== id)
                  .map((a) => ({ value: a.id, label: a.accountName }))}
              />
            </FormField>

            <FormField label="Account Type">
              <Select
                name="accountType"
                value={form.accountType}
                onChange={handleChange}
                placeholder="Select type"
                options={ACCOUNT_TYPES.map((t) => ({
                  value: t,
                  label: t.replace(/_/g, " "),
                }))}
              />
            </FormField>

            <FormField label="Industry">
              <Select
                name="industry"
                value={form.industry}
                onChange={handleChange}
                placeholder="Select industry"
                options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
              />
            </FormField>

            <FormField label="Rating">
              <Select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Select rating"
                options={ACCOUNT_RATINGS.map((r) => ({ value: r, label: r }))}
              />
            </FormField>

            <FormField label="Account Status">
              <Select
                name="lifecycle"
                value={form.lifecycle}
                onChange={handleChange}
                placeholder="Select status"
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                  { value: "PROSPECT", label: "Prospect" },
                  { value: "DEACTIVATED", label: "Deactivated" },
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Business Details */}
        <FormSection
          title="Business Details"
          subtitle="Financial and contact information"
          icon={GlobeAltIcon}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Annual Revenue" hint="Enter amount in INR">
              <Input
                name="annualRevenue"
                type="number"
                value={form.annualRevenue}
                onChange={handleChange}
                placeholder="e.g., 10000000"
              />
            </FormField>

            <FormField label="Number of Employees">
              <Input
                name="employees"
                type="number"
                value={form.employees}
                onChange={handleChange}
                placeholder="e.g., 50"
              />
            </FormField>

            <FormField label="Phone">
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                icon={PhoneIcon}
              />
            </FormField>

            <FormField label="Website">
              <Input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
                icon={GlobeAltIcon}
              />
            </FormField>

            <FormField label="Ownership" className="md:col-span-2">
              <Input
                name="ownership"
                value={form.ownership}
                onChange={handleChange}
                placeholder="e.g., Private, Public, Partnership"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Billing Address */}
        <FormSection
          title="Billing Address"
          subtitle="Primary billing location"
          icon={MapPinIcon}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Street Address" className="md:col-span-2">
              <Input
                name="billingStreet"
                value={form.billingStreet}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </FormField>

            <FormField label="City">
              <Input
                name="billingCity"
                value={form.billingCity}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </FormField>

            <FormField label="State">
              <Input
                name="billingState"
                value={form.billingState}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </FormField>

            <FormField label="Pincode">
              <Input
                name="billingPincode"
                value={form.billingPincode}
                onChange={handleChange}
                placeholder="Enter pincode"
              />
            </FormField>

            <FormField label="Country">
              <Input
                name="billingCountry"
                value={form.billingCountry}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Shipping Address */}
        <FormSection
          title="Shipping Address"
          subtitle="Product delivery location"
          icon={MapPinIcon}
        >
          {/* Copy Checkbox */}
          <div className="mb-5">
            <label className="inline-flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={copyBilling}
                  onChange={(e) => setCopyBilling(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all duration-200">
                  {copyBilling && (
                    <CheckIcon className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-1.5">
                <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
                Copy from billing address
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Street Address" className="md:col-span-2">
              <Input
                name="shippingStreet"
                value={form.shippingStreet}
                onChange={handleChange}
                placeholder="Enter street address"
              />
            </FormField>

            <FormField label="City">
              <Input
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </FormField>

            <FormField label="State">
              <Input
                name="shippingState"
                value={form.shippingState}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </FormField>

            <FormField label="Pincode">
              <Input
                name="shippingPincode"
                value={form.shippingPincode}
                onChange={handleChange}
                placeholder="Enter pincode"
              />
            </FormField>

            <FormField label="Country">
              <Input
                name="shippingCountry"
                value={form.shippingCountry}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-8">
          <button
            type="button"
            onClick={() => navigate("/accounts")}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Account"
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
