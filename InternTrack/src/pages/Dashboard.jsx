import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationStorage, interviewStorage, analyticsStorage } from '../services/storage';
import { Briefcase, Calendar, CheckCircle, XCircle, Plus } from 'lucide-react';

const statusColors = {
  SAVED: 'bg-slate-100 text-slate-700',
  APPLIED: 'bg-blue-100 text-blue-700',
  VIEWED: 'bg-indigo-100 text-indigo-700',
  SHORTLISTED: 'bg-purple-100 text-purple-700',
  INTERVIEW: 'bg-amber-100 text-amber-700',
  SELECTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  WITHDRAWN: 'bg-slate-100 text-slate-500',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    if (!user) return;
    setOverview(analyticsStorage.getOverview(user.id));
    setRecent(applicationStorage.getAll(user.id).slice(0, 5));
    setUpcoming(interviewStorage.getUpcoming(user.id).slice(0, 3));
  }, [user]);

  const stats = [
    { label: 'Total', value: overview?.totalApplications ?? 0, icon: Briefcase, color: 'text-primary-600 bg-primary-50' },
    { label: 'Interviews', value: overview?.interviews ?? 0, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
    { label: 'Selected', value: overview?.selected ?? 0, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: overview?.rejected ?? 0, icon: XCircle, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-600 mt-1">Here's your job search overview</p>
        </div>
        <Link to="/applications/new" className="btn-primary">
          <Plus size={18} /> Add Application
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {overview && overview.totalApplications > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5">
            <p className="text-sm text-slate-500">Interview Rate</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{overview.interviewRate}%</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-500">Selection Rate</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{overview.selectionRate}%</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-slate-500">Rejection Rate</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{overview.rejectionRate}%</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold">Recent Applications</h2>
            <Link to="/applications" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recent.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No applications yet.</p>
                <Link to="/applications/new" className="text-primary-600 text-sm mt-2 inline-block hover:underline">Add your first application</Link>
              </div>
            ) : recent.map(app => (
              <Link key={app.id} to={`/applications/${app.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900">{app.companyName}</p>
                  <p className="text-sm text-slate-500">{app.jobTitle}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status] || 'bg-slate-100'}`}>
                  {app.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Interviews</h2>
            <Link to="/interviews" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming interviews</div>
            ) : upcoming.map(int => (
              <div key={int.id} className="p-4">
                <p className="font-medium">{int.companyName}</p>
                <p className="text-sm text-slate-500">{int.jobTitle}</p>
                <p className="text-xs text-primary-600 mt-1">
                  {new Date(int.interviewDate).toLocaleString()}
                  {int.interviewType && ` · ${int.interviewType}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
