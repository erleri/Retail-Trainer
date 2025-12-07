import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { operatorApi } from '../../services/operatorApi';
import { useOperatorAction } from '../../hooks/useOperatorAction';
import { Search, Filter, MoreVertical, Shield, User, Award, Mail, Lock, Plus, Trash2, Edit2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // --- Data Fetching ---
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await operatorApi.getUsers();
            return res.data?.users || [];
        }
    });

    const filteredUsers = usersData ? usersData.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    }) : [];

    // --- Actions ---
    const deleteAction = useOperatorAction({
        mutationFn: (id) => operatorApi.deleteUser(id),
        invalidateKeys: [['users']],
        successMessage: "User deleted successfully."
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) deleteAction.mutate(id);
    };

    const openCreate = () => {
        setSelectedUser(null);
        setIsDrawerOpen(true);
    };

    const openEdit = (user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage access, roles, and account status.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                >
                    <Plus size={18} /> Invite User
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Trainee">Trainee</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Operator">Operator</option>
                        <option value="Super Admin">Super Admin</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 pl-6 text-xs font-bold text-slate-500 uppercase">User Info</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Region</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Joined</th>
                            <th className="p-4 pr-6 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading users...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">No users found.</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                                <Mail size={10} /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border",
                                        user.role === 'Super Admin' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                            user.role === 'Operator' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                user.role === 'Trainer' ? "bg-green-50 text-green-700 border-green-100" :
                                                    "bg-slate-50 text-slate-700 border-slate-200"
                                    )}>
                                        {user.role === 'Super Admin' && <Shield size={10} />}
                                        {user.role === 'Operator' && <User size={10} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-600 font-medium">{user.region || "Global"}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            "w-2 h-2 rounded-full",
                                            user.status === 'Active' ? "bg-green-500 shadow-green-200 shadow-[0_0_8px]" : "bg-slate-300"
                                        )} />
                                        <span className="text-sm text-slate-600">{user.status}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{user.joined}</td>
                                <td className="p-4 pr-6 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(user)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Drawer */}
            {isDrawerOpen && (
                <UserDrawer
                    user={selectedUser}
                    onClose={() => setIsDrawerOpen(false)}
                />
            )}
        </div>
    );
}

// --- Sub-component: User Drawer ---
const UserDrawer = ({ user, onClose }) => {
    const isEditing = !!user;
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "Trainee",
        region: user?.region || "Seoul",
        status: user?.status || "Active"
    });

    const mutation = useOperatorAction({
        mutationFn: (data) => isEditing
            ? operatorApi.updateUser(user.id, data)
            : operatorApi.createUser(data),
        invalidateKeys: [['users']],
        successMessage: isEditing ? "User updated." : "User invited.",
        onCloseDrawer: onClose
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEditing ? "Edit User" : "Invite User"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">Close</button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="Trainee">Trainee</option>
                                <option value="Trainer">Trainer</option>
                                <option value="Operator">Operator</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Region</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-200 transition-all disabled:opacity-50 font-bold"
                    >
                        {mutation.isPending ? "Saving..." : isEditing ? "Update User" : "Send Invite"}
                    </button>
                </div>
            </div>
        </div>
    );
};
