import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

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
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(email, password, name || undefined);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-white/10 bg-surface p-8">
        <h1 className="font-display text-2xl font-bold text-white">Create account</h1>
        <label className="mt-6 block">
          <span className="mb-1 block text-sm text-gray-400">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-white" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm text-gray-400">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-white" />
        </label>
        <label className="mt-4 block">
          <span className="mb-1 block text-sm text-gray-400">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-base px-3 py-2 text-white" />
        </label>
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Register'}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-400">
          Have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
