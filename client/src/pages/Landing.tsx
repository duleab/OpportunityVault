import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Bell, Brain, Table2, ArrowRight, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Extraction',
    desc: 'Paste raw text from any source. AI extracts deadlines, requirements, links, and more in seconds.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: Bell,
    title: 'Deadline Notifications',
    desc: 'Never miss a deadline. Get push notifications via ntfy.sh at custom intervals before each deadline.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Table2,
    title: 'Smart Dashboard',
    desc: 'Track all your scholarships, jobs, internships and fellowships in one beautiful dashboard.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: Zap,
    title: 'Multiple AI Providers',
    desc: 'Use Groq, Gemini, Mistral, or your own Ollama model. Switch anytime in settings.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Your data is yours. Self-hostable, open source, and built with privacy in mind.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    icon: Sparkles,
    title: 'Bulk Processing',
    desc: 'Paste a list of multiple opportunities at once. AI extracts and previews each one for review.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
];

const stats = [
  { value: '10x', label: 'Faster tracking' },
  { value: '100%', label: 'AI-powered' },
  { value: '0', label: 'Missed deadlines' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-base overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm shadow-glow">
            OV
          </div>
          <span className="font-semibold text-white text-sm">OpportunityVault</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
            Log in
          </Link>
          <Link to="/register">
            <button className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition shadow-glow">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-36">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[400px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered opportunity tracker — free forever
          </div>

          <h1 className="font-bold text-4xl leading-tight text-white md:text-6xl md:leading-[1.1]">
            Never miss a{' '}
            <span className="gradient-text">scholarship, job,</span>
            <br />or internship again
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 leading-relaxed">
            Paste raw text from any source — AI extracts structured data, tracks deadlines, and sends urgent notifications before you miss them.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <button className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition shadow-glow">
                Start for free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/login">
              <button className="rounded-lg border border-white/10 bg-surface px-6 py-3 text-sm font-semibold text-white hover:border-white/20 transition">
                Sign in →
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex justify-center gap-8 md:gap-16">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white gradient-text">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Everything you need</h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Built for students, researchers, and professionals who apply to multiple opportunities at once.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-xl border p-5 ${bg} backdrop-blur-sm`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/20 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-10">
          <h2 className="text-xl font-bold text-white mb-3">Ready to stay organized?</h2>
          <p className="text-sm text-gray-400 mb-6">Join for free. No credit card. No limits.</p>
          <Link to="/register">
            <button className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition shadow-glow">
              Create your free account →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
