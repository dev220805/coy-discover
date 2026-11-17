import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const MatchesPanel = ({ open, onClose, matches, loading }) => {
  if (!open) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="absolute inset-0 z-30 flex flex-col bg-white"
    >
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900">Matches</h2>
          <p className="text-xs text-slate-500">Mutual connections only</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <LoadingSpinner label="Loading matches…" />
        ) : matches.length === 0 ? (
          <EmptyState
            title="No matches yet"
            description="When someone you like has already liked you, they will show up here."
          />
        ) : (
          <ul className="divide-y divide-slate-100 px-2 py-2">
            {matches.map((match) => (
              <li key={match.id} className="flex items-center gap-3 rounded-2xl px-3 py-3">
                <img
                  src={match.profile.photo}
                  alt={match.profile.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-rose-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {match.profile.name}, {match.profile.age}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                    <MapPin size={12} />
                    {match.profile.city}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">{match.profile.bio}</p>
                </div>
                <Users size={16} className="shrink-0 text-rose-400" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default MatchesPanel;
