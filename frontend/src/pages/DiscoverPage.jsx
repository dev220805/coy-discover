import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw } from 'lucide-react';
import { useFeed } from '../hooks/useFeed';
import { useMatches } from '../hooks/useMatches';
import SwipeDeck from '../components/SwipeDeck';
import MatchOverlay from '../components/MatchOverlay';
import MatchesPanel from '../components/MatchesPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const DiscoverPage = () => {
  const [showMatches, setShowMatches] = useState(false);
  const {
    current,
    next,
    profiles,
    loading,
    swiping,
    error,
    matchResult,
    clearMatch,
    swipe,
    reload,
  } = useFeed();

  const { matches, loading: matchesLoading, reload: reloadMatches } = useMatches(showMatches);

  const openMatches = () => {
    setShowMatches(true);
    reloadMatches();
  };

  const handleContinueAfterMatch = () => {
    clearMatch();
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between px-5 pb-1 pt-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-400">
            Coy
          </p>
          <h1 className="font-display text-2xl font-bold text-slate-900">Discover</h1>
        </div>

        <button
          type="button"
          onClick={openMatches}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:text-rose-500"
        >
          <Heart size={16} className="text-rose-500" fill="currentColor" />
          Matches
        </button>
      </header>

      {loading ? (
        <LoadingSpinner label="Finding people nearby…" />
      ) : error && profiles.length === 0 ? (
        <EmptyState
          title="Something went wrong"
          description={error}
          actionLabel="Try again"
          onAction={reload}
        />
      ) : !current ? (
        <EmptyState
          title="No more profiles available"
          description="You have swiped through everyone in your feed. Matches stay saved — check them anytime."
          actionLabel="Refresh feed"
          onAction={reload}
        />
      ) : (
        <SwipeDeck current={current} next={next} disabled={swiping} onSwipe={swipe} />
      )}

      {!loading && current && (
        <button
          type="button"
          onClick={reload}
          className="absolute right-4 top-[4.5rem] rounded-full bg-white/80 p-2 text-slate-400 shadow-sm backdrop-blur hover:text-slate-600"
          aria-label="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      )}

      <AnimatePresence>
        {matchResult && (
          <MatchOverlay match={matchResult} onContinue={handleContinueAfterMatch} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMatches && (
          <MatchesPanel
            open={showMatches}
            onClose={() => setShowMatches(false)}
            matches={matches}
            loading={matchesLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverPage;
