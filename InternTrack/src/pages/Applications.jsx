import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationStorage } from '../services/storage';
import { Plus, Search, Filter } from 'lucide-react';

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

const STATUSES = ['ALL', 'SAVED', 'APPLIED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'];

export default function Applications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = (q = '') => {
    if (!user) return;
    setApps(applicationStorage.getAll(user.id, q));
  };

  useEffect(() => { load(); }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const filtered = statusFilter === 'ALL' ? apps : apps.filter(a => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Applications</h1>
        <Link to="/applications/new" className="btn-primary self-start">
          <Plus size={18} /> Add Application
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Search company, role, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary">Search</button>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 text-lg">No applications found.</p>
          <p className="text-slate-400 text-sm mt-1">Start tracking your job search today.</p>
          <Link to="/applications/new" className="btn-primary mt-4 inline-flex">Add Your First Application</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(app => (
            <Link key={app.id} to={`/applications/${app.id}`} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg text-slate-900">{app.companyName}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{app.jobTitle}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                    {app.location && <span>{app.location}</span>}
                    {app.jobType && <span>· {app.jobType.replace('_', ' ')}</span>}
                    {app.salary && <span>· {app.salary}</span>}
                    {app.applicationDate && <span>· Applied {new Date(app.applicationDate).toLocaleDateString()}</span>}
                  </div>
                </div>
                <span className="text-sm text-primary-600 font-medium">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
