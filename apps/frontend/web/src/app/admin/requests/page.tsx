'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';
import { FaTrash, FaCog } from 'react-icons/fa';
import Modal from '@/components/Modal';

interface Request {
  id: number;
  type: 'restaurant' | 'courier';
  firstName: string;
  lastName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  details: Record<string, any>;
}

const statuses = ['Pending', 'Approved', 'Rejected'] as const;

const initialRequests: Request[] = [
  { id: 1, type: 'courier', firstName: 'Jan', lastName: 'Novák', status: 'Pending', details: { Email: 'jan@example.com', City: 'Brno' } },
  { id: 2, type: 'restaurant', firstName: 'Michaela', lastName: 'Veselá', status: 'Approved', details: { Name: 'Kavárna Slunce', City: 'Praha' } },
];

const AdminRequests = () => {
  const pathname = usePathname();
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [viewingRequest, setViewingRequest] = useState<Request | null>(null);

  const handleStatusChange = (id: number, status: Request['status']) => {
    setRequests(requests.map(request => (
      request.id === id ? { ...request, status } : request
    )));
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-64 fixed top-0 left-0 h-screen">
        <AdminSidebar activePath={pathname} />
      </div>

      <main className="flex-1 p-8 ml-64 min-h-screen">
        <h2 className="text-4xl font-bold mb-2">Správa žádostí</h2>
        <p className="text-gray-600 mb-8">Spravujte žádosti o spolupráci.</p>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-20">
              <tr className="border-b">
                <th className="p-4">ID</th>
                <th className="p-4">Typ žádosti</th>
                <th className="p-4">Jméno</th>
                <th className="p-4">Příjmení</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="border-b hover:bg-gray-100">
                  <td className="p-4">#{request.id}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-xl text-white ${request.type === 'restaurant' ? 'bg-purple-500' : 'bg-green-500'}`}>
                      {request.type === 'restaurant' ? 'Restaurace' : 'Kurýr'}
                    </span>
                  </td>
                  <td className="p-4">{request.firstName}</td>
                  <td className="p-4">{request.lastName}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-xl text-white ${request.status === 'Pending' ? 'bg-gray-500' : request.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-4">
                    <button
                      type="button"
                      onClick={() => setViewingRequest(request)}
                      className="text-gray-700 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 transition-colors group-hover:bg-blue-600">
                        <FaCog size={20} className="text-gray-700 group-hover:text-white" />
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Modal isOpen={!!viewingRequest} onClose={() => setViewingRequest(null)}>
        {viewingRequest && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Detail žádosti</h2>
            <p><strong>Jméno:</strong> {viewingRequest.firstName}</p>
            <p><strong>Příjmení:</strong> {viewingRequest.lastName}</p>
            {Object.entries(viewingRequest.details).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleStatusChange(viewingRequest.id, 'Rejected')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Zamítnout
              </button>
              <button
                onClick={() => handleStatusChange(viewingRequest.id, 'Approved')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Schválit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminRequests;