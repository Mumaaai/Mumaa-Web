import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Command } from 'lucide-react';

export default function OpsMoved() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://sumit7739.github.io/ops/';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans items-center justify-center px-6 selection:bg-orange-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] text-center"
      >
        <div className="w-16 h-16 bg-white border border-stone-100 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Command className="text-stone-900" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-3">OpsBoard Has Moved</h1>
        <p className="text-stone-500 font-medium text-sm mb-8 leading-relaxed">
          The operations dashboard has been migrated to a standalone project. You will be redirected automatically in 5 seconds.
        </p>

        <a
          href="https://sumit7739.github.io/ops/"
          className="gradient-peach w-full flex items-center justify-center gap-2 rounded-2xl text-orange-900 font-bold text-lg py-4 hover:shadow-xl hover:-translate-y-1 transition-all shadow-md"
        >
          Go to OpsBoard <ExternalLink size={18} />
        </a>

        <p className="text-stone-400 text-xs mt-6 font-medium">
          Please update your bookmarks to the new URL.
        </p>
      </motion.div>
    </div>
  );
}
