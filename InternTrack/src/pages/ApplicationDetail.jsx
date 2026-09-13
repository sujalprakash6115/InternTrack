import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationStorage, interviewStorage } from '../services/storage';
import { ArrowLeft, Pencil, Trash2, Calendar } from 'lucide-react';

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

const STATUSES = ['SAVED', 'APPLIED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'];

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [interviewForm, setInterviewForm] = useState({ interviewDate: '', interviewType: 'TECHNICAL', meetingLink: '', interviewerName: '', notes: '' });
  const [showInterview, setShowInterview] = useState(false);

  const load = () => {
    try {
      setApp(applicationStorage.getById(id, user.id));
    } catch {
      navigate('/applications');
    }
  };

  useEffect(() => {
    if (user) load();
  }, [id, user]);

  const updateStatus = (status) => {
    try {
      const updated = applicationStorage.updateStatus(id, user.id, status);
      setApp(updated);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = () => {
    try {
      applicationStorage.delete(id, user.id);
      navigate('/applications');
    } catch {
      alert('Failed to delete');
    }
  };

  const scheduleInterview = (e) => {
    e.preventDefault();
    try {
      interviewStorage.create(user.id, {
        applicationId: Number(id),
        interviewDate: interviewForm.interviewDate,
        interviewType: interviewForm.interviewType,
        meetingLink: interviewForm.meetingLink || null,
        interviewerName: interviewForm.interviewerName || null,
        notes: interviewForm.notes || null,
      });
      setShowInterview(false);
      load();
      alert('Interview scheduled!');
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    }
  };

  if (!app) return <div className="animate-pulse h-64 bg-slate-200 rounded-xl" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <button onClick={() => navigate('/applications')} className="btn-ghost p-2">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{app.companyName}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[app.status]}`}>{app.status}</span>
          </div>
          <p className="text-slate-600">{app.jobTitle}</p>
        </div>
        <Link to={`/applications/${id}/edit`} className="btn-secondary">
          <Pencil size={16} /> Edit
        </Link>
        <button onClick={() => setShowDelete(true)} className="btn-danger">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Type:</span> <span className="ml-2 font-medium">{app.jobType?.replace('_', ' ')}</span></div>
          <div><span className="text-slate-500">Location:</span> <span className="ml-2 font-medium">{app.location || '—'}</span></div>
          <div><span className="text-slate-500">Salary:</span> <span className="ml-2 font-medium">{app.salary || '—'}</span></div>
          <div><span className="text-slate-500">Priority:</span> <span className="ml-2 font-medium">{app.priority}</span></div>
          <div><span className="text-slate-500">Applied:</span> <span className="ml-2 font-medium">{app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : '—'}</span></div>
          <div><span className="text-slate-500">Deadline:</span> <span className="ml-2 font-medium">{app.deadline ? new Date(app.deadline).toLocaleDateString() : '—'}</span></div>
        </div>
        {app.jobUrl && (
          <div>
            <span className="text-slate-500 text-sm">Job URL:</span>
            <a href={app.jobUrl} target="_blank" rel="noreferrer" className="ml-2 text-primary-600 text-sm hover:underline break-all">{app.jobUrl}</a>
          </div>
        )}
        {app.description && (
          <div>
            <p className="text-slate-500 text-sm mb-1">Description</p>
            <p className="text-slate-700 whitespace-pre-wrap">{app.description}</p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-3">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                app.status === s ? statusColors[s] + ' ring-2 ring-offset-1 ring-primary-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Schedule Interview</h2>
          <button onClick={() => setShowInterview(!showInterview)} className="btn-secondary text-sm">
            <Calendar size={16} /> {showInterview ? 'Cancel' : 'Schedule'}
          </button>
        </div>
        {showInterview && (
          <form onSubmit={scheduleInterview} className="space-y-3 mt-4">
            <div>
              <label className="label">Date & Time *</label>
              <input type="datetime-local" className="input" required
                value={interviewForm.interviewDate}
                onChange={e => setInterviewForm({...interviewForm, interviewDate: e.target.value})} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Type</label>
                <select className="input" value={interviewForm.interviewType}
                  onChange={e => setInterviewForm({...interviewForm, interviewType: e.target.value})}>
                  {['ONLINE','OFFLINE','PHONE','TECHNICAL','HR','MANAGERIAL'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Interviewer</label>
                <input className="input" value={interviewForm.interviewerName}
                  onChange={e => setInterviewForm({...interviewForm, interviewerName: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="label">Meeting Link</label>
              <input className="input" value={interviewForm.meetingLink}
                onChange={e => setInterviewForm({...interviewForm, meetingLink: e.target.value})} />
            </div>
            <button type="submit" className="btn-primary">Schedule Interview</button>
          </form>
        )}
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-sm w-full">
            <h3 className="font-semibold text-lg">Delete Application?</h3>
            <p className="text-slate-600 text-sm mt-2">Are you sure you want to delete your {app.companyName} application? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
