import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationStorage } from '../services/storage';

const JOB_TYPES = ['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'FREELANCE', 'CONTRACT'];
const STATUSES = ['SAVED', 'APPLIED', 'VIEWED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function ApplicationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '', jobTitle: '', jobType: 'INTERNSHIP', location: '', salary: '',
    jobUrl: '', description: '', applicationDate: '', deadline: '', status: 'APPLIED', priority: 'MEDIUM'
  });

  useEffect(() => {
    if (isEdit && user) {
      try {
        const a = applicationStorage.getById(id, user.id);
        setForm({
          companyName: a.companyName || '',
          jobTitle: a.jobTitle || '',
          jobType: a.jobType || 'INTERNSHIP',
          location: a.location || '',
          salary: a.salary || '',
          jobUrl: a.jobUrl || '',
          description: a.description || '',
          applicationDate: a.applicationDate || '',
          deadline: a.deadline || '',
          status: a.status || 'APPLIED',
          priority: a.priority || 'MEDIUM',
        });
      } catch {
        setError('Failed to load application');
      }
    }
  }, [id, isEdit, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        applicationDate: form.applicationDate || null,
        deadline: form.deadline || null,
      };
      if (isEdit) {
        applicationStorage.update(id, user.id, payload);
      } else {
        applicationStorage.create(user.id, payload);
      }
      navigate('/applications');
    } catch (err) {
      setError(err.message || 'Failed to save application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Application' : 'Add Application'}</h1>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Company Name *</label>
            <input name="companyName" className="input" value={form.companyName} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Job Title *</label>
            <input name="jobTitle" className="input" value={form.jobTitle} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Type *</label>
            <select name="jobType" className="input" value={form.jobType} onChange={handleChange}>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" className="input" value={form.status} onChange={handleChange}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Location</label>
            <input name="location" className="input" value={form.location} onChange={handleChange} placeholder="Bangalore" />
          </div>
          <div>
            <label className="label">Salary</label>
            <input name="salary" className="input" value={form.salary} onChange={handleChange} placeholder="₹40,000/month" />
          </div>
        </div>
        <div>
          <label className="label">Job URL</label>
          <input name="jobUrl" type="url" className="input" value={form.jobUrl} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Application Date</label>
            <input name="applicationDate" type="date" className="input" value={form.applicationDate} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Deadline</label>
            <input name="deadline" type="date" className="input" value={form.deadline} onChange={handleChange} />
          </div>
          <div>
            <label className="label">Priority</label>
            <select name="priority" className="input" value={form.priority} onChange={handleChange}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description / Notes</label>
          <textarea name="description" className="input" rows={3} value={form.description} onChange={handleChange} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
