import { Link } from 'react-router-dom';
import { Briefcase, Bell, BarChart3, FileText, Calendar, CheckCircle } from 'lucide-react';

const features = [
  { icon: Briefcase, title: 'Application Tracking', desc: 'Track every job and internship application in one place.' },
  { icon: Bell, title: 'Smart Reminders', desc: 'Never miss a deadline or interview follow-up again.' },
  { icon: BarChart3, title: 'Career Analytics', desc: 'Understand your success rate and improve your strategy.' },
  { icon: FileText, title: 'Resume Management', desc: 'Store and manage multiple resume versions easily.' },
  { icon: Calendar, title: 'Interview Tracking', desc: 'Schedule and prepare for interviews with confidence.' },
  { icon: CheckCircle, title: 'Status Pipeline', desc: 'Move applications from Saved → Applied → Interview → Offer.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">InternTrack</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Take control of your<br />
          <span className="text-primary-600">career journey.</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Track every application. Never miss an interview. Understand your job search with powerful analytics.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base px-6 py-3">Get Started Free</Link>
          <Link to="/login" className="btn-secondary text-base px-6 py-3">Sign In</Link>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Everything you need to land your dream role</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 InternTrack. Built for students & freshers.
      </footer>
    </div>
  );
}
