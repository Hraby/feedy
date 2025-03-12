'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import Modal from '@/components/Modal';
import { FaCog } from 'react-icons/fa';
import { fetchCouriers, fetchRestaurants, updateCourierStatus, updateRestaurantStatus } from '@/app/actions/adminAction';
import { useAuth } from '@/contexts/AuthProvider';

interface Request {
  id: string;
  type: 'restaurant' | 'courier';
  firstName: string;
  lastName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  details: Record<string, any>;
}

const AdminRequests = () => {
  const pathname = usePathname();
  const [requests, setRequests] = useState<Request[]>([]);
  const [viewingRequest, setViewingRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);

  const {accessToken} = useAuth();

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      if (!accessToken) return;

      try {
        const [couriers, restaurants] = await Promise.all([
          fetchCouriers(accessToken),
          fetchRestaurants(accessToken),
        ]);

        const filteredRequests: Request[] = [
          ...couriers
            .filter((c: any) => c.approvalStatus === 'Pending')
            .map((c: any) => ({
              id: c.id,
              type: 'courier',
              firstName: c.user.firstName,
              lastName: c.user.lastName,
              status: c.approvalStatus,
              details: { Email: c.user.email, City: c.city },
            })),
          ...restaurants
            .filter((r: any) => r.status === 'Pending')
            .map((r: any) => ({
              id: r.id,
              type: 'restaurant',
              firstName: r.owner.firstName,
              lastName: r.owner.lastName,
              status: r.status,
              details: { Name: r.name, Phone: r.phone },
            })),
        ];
        setRequests(filteredRequests);
        setLoading(false)
      } catch (error) {
        console.error('Chyba při načítání žádostí:', error);
      }
    };

    loadRequests();
  }, [accessToken]);

  const handleStatusChange = async (id: string, type: 'restaurant' | 'courier', status: 'Approved' | 'Rejected') => {
    if (!accessToken) return;
    try {
      if (type === 'restaurant') {
        await updateRestaurantStatus(id, accessToken, status);
      } else {
        await updateCourierStatus(id, accessToken, status);
      }

      setRequests(requests.filter(request => request.id !== id));
      setViewingRequest(null);
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
    }
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
        {loading ? (
          <div className="text-center py-8">
              <p>Načítání žádostí...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-20">
              <tr className="border-b">
                <th className="p-4">ID</th>
                <th className="p-4">Typ</th>
                <th className="p-4">Jméno</th>
                <th className="p-4">Příjmení</th>
                <th className="p-4 text-right">Akce</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-100">
                    <td className="p-4">{request.id}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-xl text-white ${request.type === 'restaurant' ? 'bg-purple-500' : 'bg-green-500'}`}>
                        {request.type === 'restaurant' ? 'Restaurace' : 'Kurýr'}
                      </span>
                    </td>
                    <td className="p-4">{request.firstName}</td>
                    <td className="p-4">{request.lastName}</td>
                    <td className="p-4 text-right">
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Žádné nové žádosti k vyřízení.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
                onClick={() => handleStatusChange(viewingRequest.id, viewingRequest.type, 'Rejected')}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                {loading ? 'Zamítání...' : 'Zamítnout'}
              </button>
              <button
                onClick={() => handleStatusChange(viewingRequest.id, viewingRequest.type, 'Approved')}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Schvalování...' : 'Schválit'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminRequests;