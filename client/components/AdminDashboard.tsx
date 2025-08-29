import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { api } from '../lib/api';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [categoryData, setCategoryData] = useState<any>({});
  const [monthlyData, setMonthlyData] = useState<any>({});
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch stats, category breakdown, monthly, and top products
      const [productStats, serviceStats, userStats, quoteStats] = await Promise.all([
        api.products.getAll(),
        api.services.getAll(),
        api.users.getAll(),
        api.quotes.getAll(),
      ]);
      setStats({
        products: productStats.data.length,
        services: serviceStats.data.length,
        users: userStats.data.length,
        quotes: quoteStats.data.length,
      });
      // Category breakdown
      const catMap: Record<string, number> = {};
      productStats.data.forEach((p: any) => {
        if (p.category) catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      setCategoryData({
        labels: Object.keys(catMap),
        datasets: [{ data: Object.values(catMap), backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa'] }],
      });
      // Monthly new products (dummy data for now)
      setMonthlyData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{ label: 'New Products', data: [2, 3, 5, 4, 6, 7, 3, 2, 4, 5, 6, 7], borderColor: '#60a5fa', backgroundColor: '#dbeafe' }],
      });
      // Top 5 products by quotes (dummy data)
      setTopProducts(productStats.data.slice(0, 5));
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Services" value={stats.services} />
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Quotes" value={stats.quotes} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-bold mb-4">Product Category Distribution</h3>
          <Pie data={categoryData} />
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-bold mb-4">Monthly New Products</h3>
          <Line data={monthlyData} />
        </div>
      </div>
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="font-bold mb-4">Top 5 Products</h3>
        <Bar data={{
          labels: topProducts.map(p => p.name),
          datasets: [{ label: 'Quotes', data: topProducts.map(() => Math.floor(Math.random() * 20)), backgroundColor: '#60a5fa' }],
        }} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-slate-500">{label}</div>
    </div>
  );
}
