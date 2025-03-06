'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';

export interface AdminSidebarProps {
    activePath: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    role: 'User' | 'Admin' | 'Courier' | 'Restaurant';
    registeredAt: string;
    lastLogin: string;
}

const roles = ['User', 'Admin', 'Courier', 'Restaurant'] as const;

const initialUsers: User[] = [
    { id: 1, firstName: 'Jan', lastName: 'Novák', avatar: '/img/avatar.png', role: 'User', registeredAt: '2023-01-15', lastLogin: '2024-03-01' },
    { id: 2, firstName: 'Petr', lastName: 'Dvořák', avatar: '/img/avatar.png', role: 'Admin', registeredAt: '2022-12-10', lastLogin: '2024-02-28' },
    { id: 3, firstName: 'Eva', lastName: 'Kučerová', avatar: '/img/avatar.png', role: 'Courier', registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
];

const AdminUsers = () => {
    const pathname = usePathname();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

    const handleRoleChange = (id: number, newRole: User['role']) => {
        setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
        setEditingUserId(null);
    };

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar activePath={pathname} />

            <main className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-2">Správa uživatelů</h2>
                <p className="text-gray-600 mb-8">Spravujte uživatele z jednoho místa.</p>

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4">Jméno</th>
                                <th className="p-4">Příjmení</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Registrace</th>
                                <th className="p-4">Poslední přihlášení</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.firstName}</td>
                                    <td className="p-4">{user.lastName}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-xl text-white ${user.role === 'Admin' ? 'bg-red-500' : user.role === 'Courier' ? 'bg-green-500' : user.role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">{user.registeredAt}</td>
                                    <td className="p-4">{user.lastLogin}</td>
                                    <td className="p-4 text-right space-x-4 relative">
                                        <button
                                            type="button"
                                            onClick={() => setEditingUserId(user.id)}
                                            className="text-gray-700 hover:text-blue-600"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                                                <FaCog size={20} />
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-gray-700 hover:text-red-600"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
                                                <FaTrash size={20} />
                                            </div>
                                        </button>

                                        {editingUserId === user.id && (
                                            <div className="dropdown absolute right-0 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                <h4 className="text-lg font-semibold mb-4">Změnit roli</h4>
                                                {roles.map((role) => (
                                                    <label key={role} className="block mb-2">
                                                        <input
                                                            type="radio"
                                                            value={role}
                                                            checked={user.role === role}
                                                            onChange={() => handleRoleChange(user.id, role)}
                                                        />
                                                        <span className="ml-2">{role}</span>
                                                    </label>
                                                ))}
                                                <button
                                                    onClick={() => setEditingUserId(null)}
                                                    className="mt-4 text-gray-600 hover:underline"
                                                >
                                                    Zavřít
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
