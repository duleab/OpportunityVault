import { Link } from 'react-router-dom';
import { Sparkles, Bell, Brain, Table2, ArrowRight, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Extraction',
    desc: 'Paste raw text from any source. AI extracts deadlines, requirements, links, and more in seconds.',
  },
  {
    icon: Bell,
    title: 'Deadline Notifications',
    desc: 'Never miss a deadline. Get push notifications via ntfy.sh at custom intervals before each deadline.',
  },
  {
    icon: Table2,
    title: 'Smart Dashboard',
    desc: 'Track all your scholarships, jobs, internships and fellowships in one clean dashboard.',
  },
  {
    icon: Zap,
    title: 'Multiple AI Providers',
    desc: 'Use Groq, Gemini, Mistral, GLM (Z.ai), or your own Ollama model. Switch anytime in settings.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Your data is yours. Self-hostable, open source, and built with privacy in mind.',
  },
  {
    icon: Sparkles,
    title: 'Bulk Processing',
    desc: 'Paste multiple opportunities at once. AI extracts and previews each one for review before saving.',
  },
];

const stats = [
  { value: '10x', label: 'Faster tracking' },
  { value: '5',   label: 'AI providers' },
  { value: '0',   label: 'Missed deadlines' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white font-bold text-sm">
              OV
            </div>
            <span className="font-semibold text-[#111827] text-sm">OpportunityVault</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded px-4 py-2 text-sm font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-1.5 text-xs font-medium text-[#1d4ed8]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered opportunity tracker — free forever
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-[#111827] md:text-5xl">
            Never miss a scholarship,<br />job, or internship again
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#6b7280] leading-relaxed">
            Paste raw text from any source — AI extracts structured data, tracks deadlines,
            and sends urgent notifications before you miss them.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="rounded border border-[#e5e7eb] bg-white px-6 py-3 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6] hover:border-[#d1d5db] transition-colors"
            >
              Sign in →
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-14 flex justify-center gap-12 md:gap-20">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-accent">{value}</p>
                <p className="mt-1 text-sm text-[#9ca3af]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#111827]">Everything you need</h2>
          <p className="text-[#6b7280] max-w-lg mx-auto">
            Built for students, researchers, and professionals who apply to multiple opportunities at once.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-[#e5e7eb] bg-white p-6 hover:border-[#d1d5db] hover:shadow-sm transition-all"
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-[#f9fafb] text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-[#111827]">{title}</h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#e5e7eb] bg-[#fafafa]">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h2 className="mb-3 text-xl font-bold text-[#111827]">Ready to stay organized?</h2>
          <p className="mb-8 text-[#6b7280]">Join for free. No credit card. No limits.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded bg-accent px-8 py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
          <p className="text-xs text-[#9ca3af]">© 2026 OpportunityVault. Open source.</p>
          <div className="flex items-center gap-4 text-xs text-[#9ca3af]">
            <a href="https://github.com/duleab/OpportunityVault" target="_blank" rel="noopener noreferrer" className="hover:text-[#374151]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
