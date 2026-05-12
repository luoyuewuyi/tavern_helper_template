import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface GlassModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function GlassModal({ title, subtitle, onClose, children }: GlassModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="west-modal relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-amber-100/15 bg-[rgba(18,12,10,0.92)] shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-amber-100/10 px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <h2 className="font-display text-3xl tracking-[0.12em] text-stone-50">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-stone-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-amber-100/10 p-2 text-stone-400 transition-colors hover:bg-stone-100/8 hover:text-stone-100"
          >
            <X size={22} />
          </button>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto p-6 sm:p-8">{children}</div>
      </motion.div>
    </motion.div>
  );
}
