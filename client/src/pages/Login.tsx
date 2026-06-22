import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-base">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-sidebar-bg border-r border-white/[0.06] p-12">
        <div className="max-w-sm text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white font-bold text-2xl shadow-glow">
              OV
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">OpportunityVault</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your AI-powered hub for tracking scholarships, fellowships, jobs, and internships. Never miss a deadline again.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            {[
              { emoji: '🤖', title: 'AI Extraction', desc: 'Paste any text, AI does the rest' },
              { emoji: '⏰', title: 'Smart Deadlines', desc: 'Never miss an opportunity' },
              { emoji: '📊', title: 'Dashboard', desc: 'Track your pipeline' },
              { emoji: '🔔', title: 'Notifications', desc: 'Push alerts before deadlines' },
            ].map(f => (
              <div key={f.title} className="rounded-xl border border-white/[0.06] bg-surface p-3">
                <div className="text-xl mb-1">{f.emoji}</div>
                <p className="text-xs font-semibold text-white">{f.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">OV</div>
            <span className="font-semibold text-white">OpportunityVault</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-base"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition disabled:opacity-50 mt-2 shadow-glow"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
