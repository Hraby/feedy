'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { fetchUsers, deleteUser, searchUsers, User, updateUserRole } from '@/app/actions/adminAction';
import { useAuth } from '@/contexts/AuthProvider';

export interface AdminSidebarProps {
    activePath: string;
}

const roles = ['Admin', 'User'] as const;

const AdminUsers = () => {
    const pathname = usePathname();
    const [users, setUsers] = useState<User[]>([]);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { accessToken } = useAuth()

    useEffect(() => {
        const loadUsers = async () => {
            if (!accessToken) return;
            
            setLoading(true);
            try {
                const data = await fetchUsers(accessToken);
                setUsers(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load users:', err);
                setError('Nepodařilo se načíst uživatele');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [accessToken]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ((event.target as HTMLElement).closest('.dropdown') === null) {
                setEditingUserId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleSearch = async () => {
            if (!accessToken) return;
            
            try {
                const results = await searchUsers(searchQuery, accessToken);
                setUsers(results);
            } catch (err) {
                console.error('Search failed:', err);
            }
        };

        const timer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, accessToken]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}-${month}-${year}`;
    };    

    const handleRoleChange = async (id: string, role: string) => {
        const user = users.find(u => u.id === id);
        if (!user || !accessToken) return;
    
        let updatedRoles = [...user.role];
    
        if (role === 'Admin' || role === 'Customer') {
            updatedRoles = updatedRoles.filter(r => r !== 'Admin' && r !== 'Customer');
            updatedRoles.push(role);
        } else {
            updatedRoles = updatedRoles.includes(role)
                ? updatedRoles.filter(r => r !== role)
                : [...updatedRoles, role];
        }
    
        setUsers(users.map(u => u.id === id ? { ...u, role: updatedRoles } : u));
    
        try {
            await updateUserRole(id, updatedRoles, accessToken);
        } catch (err) {
            console.error('Role update failed:', err);
            alert('Nepodařilo se aktualizovat roli uživatele.');
        }
    };
    
      

    const handleDeleteUser = (id: string) => {
        setDeleteUserId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (deleteUserId === null || !accessToken) return;

        try {
            setUsers(users.filter(user => user.id !== deleteUserId));
            
            await deleteUser(deleteUserId, accessToken);
            
            setDeleteUserId(null);
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('User deletion failed:', err);
            const loadUsers = async () => {
                try {
                    const data = await fetchUsers(accessToken);
                    setUsers(data);
                } catch (loadErr) {
                    console.error('Failed to reload users:', loadErr);
                }
            };
            loadUsers();
            alert('Nepodařilo se odstranit uživatele.');
        }
    };

    const cancelDeleteUser = () => {
        setDeleteUserId(null);
        setIsDeleteModalOpen(false);
    };

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
                    {loading ? (
                        <div className="text-center py-8">
                            <p>Načítání uživatelů...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-20">
                                <tr className="border-b">
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Jméno</th>
                                    <th className="p-4">Příjmení</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Registrace</th>
                                    <th className="p-4">Poslední přihlášení</th>
                                    <th className="p-4 w-1/8 text-right">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-100">
                                        <td className="p-4">{user.id}</td>
                                        <td className="p-4">{user.firstName}</td>
                                        <td className="p-4">{user.lastName}</td>
                                        <td className="p-4">
                                        {user.role.map((role) => (
                                            <span key={role} className={`px-3 py-1 rounded-xl text-white mr-1 ${role === 'Admin' ? 'bg-red-500' : role === 'Courier' ? 'bg-green-500' : role === 'Restaurant' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                                                {role}
                                            </span>
                                        ))}
                                        </td>
                                        <td className="p-4">{formatDate(user.createdAt)}</td>
                                        <td className="p-4">{formatDate(user.updatedAt)}</td>
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
                                                className="text-gray-700 group pt-2"
                                            >
                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-red-600">
                                                    <FaTrash size={20} className="text-gray-700 group-hover:text-white" />
                                                </div>
                                            </button>

                                            {editingUserId === user.id && (
                                                <div className="dropdown absolute right-0 mt-2 bg-white border p-4 rounded-xl shadow-lg z-10">
                                                    <h4 className="text-lg text-center font-semibold mb-4">Role</h4>
                                                    {['Admin', 'Customer', 'Courier', 'Restaurant'].map((role) => (
                                                        <label key={role} className="flex items-center gap-3 mb-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name={`role-${user.id}-${role}`}
                                                                value={role}
                                                                checked={user.role.includes(role)}
                                                                onChange={() => handleRoleChange(user.id, role)}
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
                    )}
                </div>
            </main>

            <Modal isOpen={isDeleteModalOpen} onClose={cancelDeleteUser}>
                <h2 className="text-lg font-semibold mb-2">Odstranit uživatele</h2>
                <p className="text-gray-600">Opravdu chcete odstranit tohoto uživatele?</p>
                <p className="text-red-600 mb-4">Tato akce nelze vrátit zpět!</p>
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