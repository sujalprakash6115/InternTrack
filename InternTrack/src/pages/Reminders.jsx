import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reminderStorage } from '../services/storage';
import { Bell, Plus, Check, Trash2 } from 'lucide-react';

export default function Reminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', reminderDate: '' });

  const load = () => {
    if (user) setReminders(reminderStorage.getAll(user.id));
  };

  useEffect(() => { load(); }, [user]);

  const handleCreate = (e) => {
    e.preventDefault();
    reminderStorage.create(user.id, form);
    setForm({ title: '', description: '', reminderDate: '' });
    setShowForm(false);
    load();
  };

  const complete = (id) => {
    reminderStorage.complete(id, user.id);
    load();
  };

  const remove = (id) => {
    if (!confirm('Delete this reminder?')) return;
    reminderStorage.delete(id, user.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus size={18} /> Add Reminder
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-5 space-y-3">
          <div>
            <label className="label">Title *</label>
            <input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Follow up with Google recruiter" />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="label">Date & Time *</label>
            <input type="datetime-local" className="input" required value={form.reminderDate} onChange={e => setForm({...form, reminderDate: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Create</button>
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {reminders.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <Bell size={40} className="mx-auto mb-3 text-slate-300" />
          <p>No reminders yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(r => (
            <div key={r.id} className={`card p-4 flex items-center gap-4 ${r.isCompleted ? 'opacity-60' : ''}`}>
              <button onClick={() => !r.isCompleted && complete(r.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${r.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-primary-500'}`}>
                {r.isCompleted && <Check size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${r.isCompleted ? 'line-through' : ''}`}>{r.title}</p>
                {r.description && <p className="text-sm text-slate-500">{r.description}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{new Date(r.reminderDate).toLocaleString()}</p>
              </div>
              <button onClick={() => remove(r.id)} className="btn-ghost p-2 text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
