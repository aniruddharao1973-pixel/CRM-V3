// src/features/users/Users.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../auth/authSlice";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Role styles
const ROLE_STYLES = {
  ADMIN: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-500/20",
    icon: ShieldCheckIcon,
    label: "Admin",
  },
  MANAGER: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-500/20",
    icon: UserGroupIcon,
    label: "Manager",
  },
  SALES_REP: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-500/20",
    icon: UserIcon,
    label: "Sales Rep",
  },
};

// Status styles
const STATUS_STYLES = {
  active: {
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-500/20",
    dot: "bg-green-500",
    icon: CheckCircleIcon,
  },
  inactive: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-500/20",
    dot: "bg-red-500",
    icon: XCircleIcon,
  },
};

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, user: currentUser } = useSelector((state) => state.auth);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteUser(deleteModal.id)).unwrap();
      toast.success("User deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const managerCount = users.filter((u) => u.role === "MANAGER").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage team members and their access levels
          </p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Add User
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              <p className="text-sm text-gray-500">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-50 rounded-lg">
              <ShieldCheckIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{managerCount}</p>
              <p className="text-sm text-gray-500">Managers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserGroupIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by creating your first user
            </p>
            <Link
              to="/users/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1.5" />
              Create User
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th> */}
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => {
                    const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
                    const RoleIcon = roleStyle.icon;
                    const statusStyle = user.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
                    const isCurrentUser = currentUser?.id === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150 group"
                      >
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900">
                                  {user.name}
                                </p>
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded uppercase">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">
                                ID: {user.id?.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                            <a
                              href={`mailto:${user.email}`}
                              className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                              {user.email}
                            </a>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${roleStyle.bg} ${roleStyle.text} ${roleStyle.ring}`}
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleStyle.label}
                          </span>
                        </td>

                        {/* Status */}
                        {/* <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td> */}

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/users/${user.id}`}
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                              title="Edit User"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  id: user.id,
                                  name: user.name,
                                })
                              }
                              disabled={isCurrentUser}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                isCurrentUser
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                              }`}
                              title={isCurrentUser ? "Cannot delete yourself" : "Delete User"}
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
              {users.map((user) => {
                const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
                const RoleIcon = roleStyle.icon;
                const statusStyle = user.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
                const isCurrentUser = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-bold text-lg">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </p>
                            {isCurrentUser && (
                              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded uppercase">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        {roleStyle.label}
                      </span>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModal({
                              open: true,
                              id: user.id,
                              name: user.name,
                            })
                          }
                          disabled={isCurrentUser}
                          className={`p-2 rounded-lg transition-all ${
                            isCurrentUser
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    "{deleteModal.name}"
                  </span>
                  ? This will permanently remove their account and all associated data.
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
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
                    "Delete User"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}