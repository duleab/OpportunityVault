import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  'Reading opportunity details...',
  'Extracting deadline information...',
  'Classifying opportunity type...',
  'Identifying countries and requirements...',
  'Finalizing extraction...',
];

export function ExtractionLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-surface p-12">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
        <Loader2 className="h-10 w-10 text-accent" />
      </motion.div>
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm text-gray-400"
      >
        {MESSAGES[index]}
      </motion.p>
    </div>
  );
}
