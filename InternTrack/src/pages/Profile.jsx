import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold">{user?.name}</p>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Role</span>
            <span className="font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">User ID</span>
            <span className="font-medium">{user?.id}</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          All data is stored locally in your browser (localStorage). No backend required.
        </p>
      </div>
    </div>
  );
}
