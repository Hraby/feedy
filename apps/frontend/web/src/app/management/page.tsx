'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import ManagementSidebar from '@/components/ManagementSidebar';
import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useAuth } from '@/contexts/AuthProvider';
import { fetchRestaurantId } from '../actions/adminAction';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface ManagementSidebarProps {
  activePath: string
}

const processOrdersData = (orders: any): any => {
  if (!orders || orders.length === 0) return {
    ordersByDate: [],
    revenueByDate: [],
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    mostPopularItem: ''
  };

  const ordersByDateMap: Map<string, number> = new Map();
  const revenueByDateMap: Map<string, number> = new Map();
  const itemPopularity: any = {};
  let pendingOrders = 0;
  let totalRevenue = 0;

  orders.forEach((order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit'
    }).replace(/\./g, '').replace(/\s/g, '.');

    if (order.status === 'Pending' || order.status === 'CourierPickup') {
      pendingOrders++;
    }

    let orderRevenue = 0;
    order.orderItems.forEach((item: any) => {
      orderRevenue += item.price * item.quantity;

      const itemName = item.menuItem.name;
      if (!itemPopularity[itemName]) {
        itemPopularity[itemName] = 0;
      }

      itemPopularity[itemName] += item.quantity;
    });

    totalRevenue += orderRevenue;
    ordersByDateMap.set(date, (ordersByDateMap.get(date) || 0) + 1);
    revenueByDateMap.set(date, (revenueByDateMap.get(date) || 0) + orderRevenue);
  });

  const ordersByDate = Array.from(ordersByDateMap.entries()).map(([date, count]) => ({
    date,
    count
  }));

  const revenueByDate = Array.from(revenueByDateMap.entries()).map(([date, amount]) => ({
    date,
    amount
  }));

  let mostPopularItem = '';
  let highestCount = 0;

  Object.entries(itemPopularity).forEach(([itemName, count]: any) => {
    if (count > highestCount) {
      mostPopularItem = itemName;
      highestCount = count;
    }
  });

  return {
    ordersByDate,
    revenueByDate,
    totalOrders: orders.length,
    pendingOrders,
    totalRevenue,
    mostPopularItem
  };
};

const SkeletonKPI = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

const SkeletonPrimaryKPI = () => {
  return (
    <div className="bg-gradient-to-r from-purple-200 to-purple-300 p-6 rounded-2xl shadow-sm animate-pulse">
      <div className="h-4 bg-white bg-opacity-40 rounded w-3/4 mb-4"></div>
      <div className="h-10 bg-white bg-opacity-50 rounded w-1/2"></div>
    </div>
  );
};

const SkeletonLargeKPI = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/5 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-2/5"></div>
    </div>
  );
};

const SkeletonChart = () => {
  return (
    <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
      <div className="h-64 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

const ManagementDashboard = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();
  const restaurantId = searchParams.get("restaurantId");
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState(null);
  const [processedData, setProcessedData] = useState<any>({
    ordersByDate: [],
    revenueByDate: [],
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    mostPopularItem: ''
  });

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!accessToken || !restaurantId) return;

      try {
        setIsLoading(true);
        const data = await fetchRestaurantId(restaurantId, accessToken);

        if (data) {
          setRestaurantData(data);
          const processed = processOrdersData(data.orders);
          setProcessedData(processed);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurantData();
  }, [accessToken, restaurantId]);

  const ordersChartData = {
    labels: processedData.ordersByDate.map((entry: any) => entry.date),
    datasets: [
      {
        label: 'Objednávky',
        data: processedData.ordersByDate.map((entry: any) => entry.count),
        borderColor: 'rgb(123, 44, 191)',
        backgroundColor: 'rgba(123, 44, 191, 0.5)',
        pointStyle: 'circle',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const ordersChartOptions: ChartOptions<"line"> = {
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
  };

  const revenueChartData = {
    labels: processedData.revenueByDate.map((entry: any) => entry.date),
    datasets: [
      {
        label: 'Finanční obrat (Kč)',
        data: processedData.revenueByDate.map((entry: any) => entry.amount),
        backgroundColor: 'rgba(123, 44, 191, 0.5)'
      }
    ]
  };

  const revenueChartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
        },
    },
};

  const renderSkeletons = () => (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SkeletonPrimaryKPI />
      <SkeletonKPI />
      <SkeletonLargeKPI />
      <SkeletonChart />
      <SkeletonChart />
    </div>
  );

  const renderData = () => (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-gradient-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] p-6 rounded-2xl text-white">
        <p>Počet aktuálních objednávek:</p>
        <h3 className="text-4xl font-bold">{processedData.pendingOrders}</h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <p>Celkový počet objednávek:</p>
        <h3 className="text-4xl font-bold">{processedData.totalOrders}</h3>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">
        <p>Nejoblíbenější produkt:</p>
        <h3 className="text-4xl font-bold">{processedData.mostPopularItem || 'Žádná data'}</h3>
      </div>

      <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
        <div className="w-full h-full">
          <h3 className="text-xl font-semibold">Graf objednávek</h3>
          {processedData.ordersByDate.length > 0 ? (
            <Line
              className="pb-3"
              data={ordersChartData}
              options={ordersChartOptions}
            />
          ) : (
            <div className="flex items-center justify-center h-3/4">
              <p className="text-gray-500">Žádná data pro zobrazení grafu</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl col-span-2 shadow-sm w-full h-96 flex items-center">
        <div className="w-full h-full">
          <h3 className="text-xl font-semibold mb-4">Finanční obrat</h3>
          {processedData.revenueByDate.length > 0 ? (
            <Bar
              className="pb-6"
              data={revenueChartData}
              options={revenueChartOptions}
            />
          ) : (
            <div className="flex items-center justify-center h-3/4">
              <p className="text-gray-500">Žádná data pro zobrazení grafu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <ManagementSidebar activePath={pathname} />
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
        <p className="text-gray-600 mb-8">Spravujte váš podnik z jednoho místa.</p>

        {isLoading ? renderSkeletons() : renderData()}
      </main>
    </div>
  );
};

export default ManagementDashboard;