import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 12) return toast.error('Password must be at least 12 characters');
    setLoading(true);
    try {
      await register(email, password, name || undefined);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-white border-r border-[#e5e7eb] p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">OV</div>
          <span className="font-semibold text-[#111827] text-sm">OpportunityVault</span>
        </div>

        <div className="max-w-xs">
          <h1 className="text-3xl font-extrabold text-[#111827] mb-4 leading-tight">
            Start tracking<br />smarter today.
          </h1>
          <p className="text-[#6b7280] text-sm leading-relaxed mb-8">
            Join students and professionals who use OpportunityVault to organize their opportunities and never miss a deadline.
          </p>
          <div className="space-y-3">
            {[
              'Paste any text — AI extracts all details automatically',
              'Get push notifications before deadlines',
              'Track every opportunity in one dashboard',
              'Export to CSV, JSON, or Notion',
            ].map((f) => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                <span className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669] text-[10px] font-bold">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#d1d5db]">© 2026 OpportunityVault</p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">OV</div>
            <span className="font-semibold text-[#111827]">OpportunityVault</span>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-1">Create your account</h2>
          <p className="text-sm text-[#6b7280] mb-8">Free forever. No credit card required.</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Your name <span className="text-[#9ca3af] font-normal">(optional)</span></label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Patel"
                className="input-base"
                autoComplete="name"
              />
            </div>
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
                placeholder="Min. 12 characters"
                minLength={12}
                maxLength={128}
                className="input-base"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9ca3af]">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
