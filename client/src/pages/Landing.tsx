import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Bell, Brain, Table2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  { icon: Brain, title: 'AI Extraction', desc: 'Paste any text — AI extracts deadlines, links, and requirements.' },
  { icon: Bell, title: 'Deadline Alerts', desc: 'ntfy.sh push notifications before deadlines hit.' },
  { icon: Table2, title: 'Smart Dashboard', desc: 'Track scholarships, jobs, internships, and more in one place.' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-base">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-xl font-bold text-white">OpportunityVault</span>
        <div className="flex gap-3">
          <Link to="/login"><Button variant="ghost">Log in</Button></Link>
          <Link to="/register"><Button>Get Started</Button></Link>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-sm text-accent">
            <Sparkles className="h-4 w-4" /> AI-powered opportunity tracker
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Never miss a scholarship, job, or internship again
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Paste raw text from any source. AI extracts structured data, tracks deadlines, and sends urgent notifications.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register"><Button size="lg">Start Free →</Button></Link>
            <Link to="/login"><Button size="lg" variant="secondary">Log in</Button></Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-surface p-6"
          >
            <Icon className="mb-3 h-8 w-8 text-accent" />
            <h3 className="font-display font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-400">{desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
