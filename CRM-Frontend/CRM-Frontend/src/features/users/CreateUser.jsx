// src/features/users/CreateUser.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, fetchUsers } from "../auth/authSlice";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Form Section Component
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

// Form Field Component
const FormField = ({ label, required, children, error, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
  </div>
);

// Input Component
const Input = ({
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  icon: Icon,
  rightElement,
  error,
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
        w-full px-3 py-2.5 text-sm bg-white border rounded-lg
        placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
        transition-all duration-200
        ${Icon ? "pl-10" : ""}
        ${rightElement ? "pr-10" : ""}
        ${error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300"}
      `}
    />
    {rightElement && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {rightElement}
      </div>
    )}
  </div>
);

// Role options with descriptions
const ROLE_OPTIONS = [
  {
    value: "SALES_REP",
    label: "Sales Rep",
    description: "Can manage their own deals, contacts, and tasks",
    icon: BriefcaseIcon,
    color: "blue",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description: "Can view and manage team's data and reports",
    icon: UserGroupIcon,
    color: "purple",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Full access to all features, users, and settings",
    icon: ShieldCheckIcon,
    color: "red",
  },
];

// Role Card Component
const RoleCard = ({ option, selected, onSelect }) => {
  const colorClasses = {
    blue: {
      selected: "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20",
      icon: "bg-blue-100 text-blue-600",
      check: "border-blue-600 bg-blue-600",
    },
    purple: {
      selected: "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20",
      icon: "bg-purple-100 text-purple-600",
      check: "border-purple-600 bg-purple-600",
    },
    red: {
      selected: "border-red-500 bg-red-50 ring-2 ring-red-500/20",
      icon: "bg-red-100 text-red-600",
      check: "border-red-600 bg-red-600",
    },
  };

  const colors = colorClasses[option.color];

  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`
        w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selected ? colors.selected : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
      `}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}
      >
        <option.icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${selected ? "text-gray-900" : "text-gray-700"}`}>
          {option.label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          selected ? colors.check : "border-gray-300"
        }`}
      >
        {selected && <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
};

export default function CreateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "SALES_REP",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      };

      const res = await dispatch(registerUser(payload));

      if (!res.error) {
        toast.success("User created successfully");
        dispatch(fetchUsers());
        navigate("/users");
      } else {
        toast.error(res.payload || "Failed to create user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/users"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Users
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Create User</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/users")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create New User</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Add a new team member to the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          subtitle="User's name and contact details"
          icon={UserIcon}
        >
          <div className="space-y-5">
            <FormField label="Full Name" required error={errors.name}>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                icon={UserIcon}
                error={errors.name}
                required
              />
            </FormField>

            <FormField label="Email Address" required error={errors.email}>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                icon={EnvelopeIcon}
                error={errors.email}
                required
              />
            </FormField>
          </div>
        </FormSection>

        {/* Password Section */}
        <FormSection
          title="Set Password"
          subtitle="Create a secure password for the user"
          icon={LockClosedIcon}
        >
          <div className="space-y-5">
            <FormField
              label="Password"
              required
              error={errors.password}
              hint="Minimum 6 characters"
            >
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                icon={LockClosedIcon}
                error={errors.password}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </FormField>

            <FormField
              label="Confirm Password"
              required
              error={errors.confirmPassword}
            >
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                icon={LockClosedIcon}
                error={errors.confirmPassword}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                }
              />
            </FormField>
          </div>
        </FormSection>

        {/* Role Selection */}
        <FormSection
          title="User Role"
          subtitle="Select the access level for this user"
          icon={ShieldCheckIcon}
        >
          <div className="space-y-3">
            {ROLE_OPTIONS.map((option) => (
              <RoleCard
                key={option.value}
                option={option}
                selected={form.role === option.value}
                onSelect={handleRoleChange}
              />
            ))}
          </div>
        </FormSection>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 pb-8 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/users")}
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
                Creating...
              </>
            ) : (
              <>
                <UserIcon className="w-4 h-4" />
                Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}