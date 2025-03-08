'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';

export interface AdminSidebarProps {
    activePath: string;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string;
    roles: ('User' | 'Admin' | 'Courier' | 'Restaurant')[];
    registeredAt: string;
    lastLogin: string;
}

const roles = ['Admin', 'Restaurant', 'Courier', 'User'] as const;

const initialUsers: User[] = [
    { id: 1, firstName: 'Jan', lastName: 'Novák', avatar: '/img/avatar.png', roles: ['User'], registeredAt: '2023-01-15', lastLogin: '2024-03-01' },
    { id: 2, firstName: 'Petr', lastName: 'Dvořák', avatar: '/img/avatar.png', roles: ['Admin'], registeredAt: '2022-12-10', lastLogin: '2024-02-28' },
    { id: 3, firstName: 'Eva', lastName: 'Kučerová', avatar: '/img/avatar.png', roles: ['Courier'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 4, firstName: 'Karel', lastName: 'Svoboda', avatar: '/img/avatar.png', roles: ['User'], registeredAt: '2023-01-15', lastLogin: '2024-03-01' },
    { id: 5, firstName: 'Jana', lastName: 'Černá', avatar: '/img/avatar.png', roles: ['Admin'], registeredAt: '2022-12-10', lastLogin: '2024-02-28' },
    { id: 6, firstName: 'Tomáš', lastName: 'Procházka', avatar: '/img/avatar.png', roles: ['Courier'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 7, firstName: 'Lucie', lastName: 'Veselá', avatar: '/img/avatar.png', roles: ['Restaurant'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 8, firstName: 'David', lastName: 'Horák', avatar: '/img/avatar.png', roles: ['User'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 9, firstName: 'Tereza', lastName: 'Nováková', avatar: '/img/avatar.png', roles: ['Admin'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 10, firstName: 'Martin', lastName: 'Dvořáček', avatar: '/img/avatar.png', roles: ['Courier'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
    { id: 11, firstName: 'Lenka', lastName: 'Kratochvílová', avatar: '/img/avatar.png', roles: ['Restaurant'], registeredAt: '2023-06-22', lastLogin: '2024-02-25' },
];

const AdminUsers = () => {
    const pathname = usePathname();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.dropdown') === null) {
                setEditingUserId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRoleToggle = (id: number, role: User['roles'][number]) => {
        setUsers(users.map(user => {
            if (user.id === id) {
                const updatedRoles = user.roles.includes(role)
                    ? user.roles.filter(r => r !== role)
                    : [...user.roles, role];
                return { ...user, roles: updatedRoles.sort((a, b) => roles.indexOf(a) - roles.indexOf(b)) };
            }
            return user;
        }));
    };

    const handleDeleteUser = (id: number) => {
        setDeleteUserId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = () => {
        if (deleteUserId !== null) {
            setUsers(users.filter(user => user.id !== deleteUserId));
            setDeleteUserId(null);
            setIsDeleteModalOpen(false);
        }
    };

    const cancelDeleteUser = () => {
        setDeleteUserId(null);
        setIsDeleteModalOpen(false);
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <div className="w-64 fixed top-0 left-0 h-screen">
                <AdminSidebar activePath={pathname} />

            </div>


            <main className="flex-1 p-8 ml-64 min-h-screen">
                <h2 className="text-4xl font-bold mb-2">Správa uživatelů</h2>
                <p className="text-gray-600 mb-8">Spravujte uživatele z jednoho místa.</p>

                <input
                    type="text"
                    placeholder="Hledat uživatele..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-4 mb-6 w-full rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />

                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-20">
                            <tr className="border-b">
                                <th className="p-4">ID</th>
                                <th className="p-4">Jméno</th>
                                <th className="p-4">Příjmení</th>
                                <th className="p-4 w-2/6">Role</th>
                                <th className="p-4">Registrace</th>
                                <th className="p-4">Poslední přihlášení</th>
                                <th className="p-4 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.firstName}</td>
                                    <td className="p-4">{user.lastName}</td>
                                    <td className="p-4 w-72">
                                        {user.roles.map((role) => (
                                            <span key={role} className={`px-3 py-1 rounded-xl text-white mr-1 ${role === 'Admin' ? 'bg-red-500' : role === 'Courier' ? 'bg-green-500' : role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                                                {role}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="p-4">{user.registeredAt}</td>
                                    <td className="p-4">{user.lastLogin}</td>
                                    <td className="p-4 text-right space-x-4 relative">
                                        <button
                                            type="button"
                                            onClick={() => setEditingUserId(user.id)}
                                            className="text-gray-700 group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                                                <FaCog size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-gray-700 group"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                                <FaTrash size={20} className="text-gray-700 group-hover:text-white" />
                                            </div>
                                        </button>

                                        {editingUserId === user.id && (
                                            <div className="dropdown absolute right-0 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                <h4 className="text-lg text-center font-semibold mb-4">Role</h4>
                                                {roles.map((role) => (
                                                    <label key={role} className="flex items-center gap-3 mb-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            value={role}
                                                            checked={user.roles.includes(role)}
                                                            onChange={() => handleRoleToggle(user.id, role)}
                                                            className="w-5 h-5 rounded-2xl accent-[var(--primary)]"
                                                        />
                                                        <span>{role}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteUser}>
                <h2 className="text-lg font-semibold mb-2">Opravdu chcete odstranit uživatele?</h2>
                <p className="text-gray-600 mb-4">Toto rozhodnutí nelze vrátit zpět.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={cancelDeleteUser}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Zrušit
                    </button>
                    <button
                        onClick={confirmDeleteUser}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Odstranit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;