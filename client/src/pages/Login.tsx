import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Clock, BarChart2, Bell } from 'lucide-react';
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
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-white border-r border-[#e5e7eb] p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">OV</div>
          <span className="font-semibold text-[#111827] text-sm">OpportunityVault</span>
        </div>

        <div className="max-w-xs">
          <h1 className="text-3xl font-extrabold text-[#111827] mb-4 leading-tight">
            Track every opportunity.<br />Miss nothing.
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed mb-8">
            Your AI-powered hub for scholarships, fellowships, jobs, and internships. Never miss a deadline again.
          </p>
          <div className="space-y-3">
            {[
              { icon: Sparkles, title: 'AI Extraction', desc: 'Paste any text, AI does the rest' },
              { icon: Clock, title: 'Smart Deadlines', desc: 'Never miss an opportunity' },
              { icon: BarChart2, title: 'Live Dashboard', desc: 'Track your full pipeline' },
              { icon: Bell, title: 'Push Alerts', desc: 'Notifications before deadlines' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">{f.title}</p>
                    <p className="text-xs text-[#9ca3af]">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-[#d1d5db]">© 2026 OpportunityVault</p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">OV</div>
            <span className="font-semibold text-[#111827]">OpportunityVault</span>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-1">Welcome back</h2>
          <p className="text-sm text-[#6b7280] mb-8">Sign in to your account to continue</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Email address</label>
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
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
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
              className="w-full rounded bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9ca3af]">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
