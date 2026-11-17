import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EmptyState = ({
  title = 'No more profiles',
  description = 'You have seen everyone for now. Check back later for new people.',
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center px-8 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-sky-100 shadow-inner">
        <Sparkles className="text-rose-500" size={32} />
      </div>
      <h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
