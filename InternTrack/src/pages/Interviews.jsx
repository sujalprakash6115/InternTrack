import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewStorage } from '../services/storage';
import { Calendar, Trash2 } from 'lucide-react';

export default function Interviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);

  const load = () => {
    if (user) setInterviews(interviewStorage.getAll(user.id));
  };

  useEffect(() => { load(); }, [user]);

  const handleDelete = (id) => {
    if (!confirm('Delete this interview?')) return;
    interviewStorage.delete(id, user.id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Interviews</h1>
      {interviews.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          <Calendar size={40} className="mx-auto mb-3 text-slate-300" />
          <p>No interviews scheduled yet.</p>
          <p className="text-sm mt-1">Schedule one from an application detail page.</p>
          <Link to="/applications" className="text-primary-600 text-sm mt-3 inline-block hover:underline">Go to Applications</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {interviews.map(int => (
            <div key={int.id} className="card p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold">{int.companyName}</p>
                <p className="text-sm text-slate-600">{int.jobTitle}</p>
                <p className="text-sm text-primary-600 mt-1">
                  {new Date(int.interviewDate).toLocaleString()}
                  {int.interviewType && ` · ${int.interviewType}`}
                  {int.interviewerName && ` · ${int.interviewerName}`}
                </p>
                {int.meetingLink && (
                  <a href={int.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline mt-1 inline-block">
                    Meeting Link
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">{int.status}</span>
                <button onClick={() => handleDelete(int.id)} className="btn-ghost p-2 text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
