import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsStorage } from '../services/storage';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#64748b'];

export default function Analytics() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    if (user) setOverview(analyticsStorage.getOverview(user.id));
  }, [user]);

  if (!overview) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl" />;

  const pieData = [
    { name: 'Applied', value: overview.applied },
    { name: 'Interviews', value: overview.interviews },
    { name: 'Selected', value: overview.selected },
    { name: 'Rejected', value: overview.rejected },
    { name: 'Shortlisted', value: overview.shortlisted },
  ].filter(d => d.value > 0);

  const rateData = [
    { name: 'Interview Rate', value: overview.interviewRate },
    { name: 'Selection Rate', value: overview.selectionRate },
    { name: 'Rejection Rate', value: overview.rejectionRate },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: overview.totalApplications },
          { label: 'Applied', value: overview.applied },
          { label: 'Interviews', value: overview.interviews },
          { label: 'Selected', value: overview.selected },
          { label: 'Rejected', value: overview.rejected },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {overview.totalApplications === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          Add some applications to see analytics.
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Status Distribution</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-12">No status data yet</p>
            )}
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Success Rates (%)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
