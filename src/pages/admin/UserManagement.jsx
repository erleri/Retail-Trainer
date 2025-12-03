import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit2, Trash2, Shield, Mail, User } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Imjun Koo', email: 'imjun@example.com', role: 'Admin', status: 'Active', department: 'HQ' },
    { id: 2, name: 'Kim Minji', email: 'minji@example.com', role: 'User', status: 'Active', department: 'Sales' },
    { id: 3, name: 'Lee Junho', email: 'junho@example.com', role: 'User', status: 'Inactive', department: 'Marketing' },
    { id: 4, name: 'Park Sooyoung', email: 'joy@example.com', role: 'Manager', status: 'Active', department: 'Sales' },
    { id: 5, name: 'Choi Woosik', email: 'woosik@example.com', role: 'User', status: 'Active', department: 'Support' },
];

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
                    <p className="text-text-secondary">Manage user access and roles.</p>
                </div>
                <button className="btn-primary shadow-lg">
                    + Add New User
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-xl border border-white/20 bg-white/50 backdrop-blur-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-2xl border border-white/20 bg-white/50 backdrop-blur-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-500">User</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Role</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Status</th>
                            <th className="p-4 text-sm font-bold text-gray-500">Department</th>
                            <th className="p-4 text-sm font-bold text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-primary">{user.name}</p>
                                            <p className="text-xs text-text-secondary flex items-center gap-1">
                                                <Mail size={12} /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        <Shield size={10} />
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-text-secondary">
                                    {user.department}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
