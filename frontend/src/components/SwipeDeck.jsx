import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import ProfileCard from './ProfileCard';

const SWIPE_THRESHOLD = 120;

const SwipeDeck = ({ current, next, disabled, onSwipe }) => {
  const lockRef = useRef(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -40], [1, 0]);

  const finishSwipe = async (direction) => {
    if (disabled || !current || lockRef.current) return;

    lockRef.current = true;
    const action = direction === 'right' ? 'like' : 'pass';
    const target = direction === 'right' ? 520 : -520;

    try {
      await animate(x, target, { duration: 0.28, ease: 'easeOut' });
      await onSwipe(current._id, action);
    } finally {
      x.set(0);
      lockRef.current = false;
    }
  };

  const handleDragEnd = (_, info) => {
    if (disabled || lockRef.current) return;

    if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 700) {
      finishSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -700) {
      finishSwipe('left');
    }
  };

  const overlay = (
    <>
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-5 top-8 z-10 rotate-[-12deg] rounded-xl border-4 border-emerald-400 bg-emerald-400/20 px-4 py-2"
      >
        <div className="flex items-center gap-2 text-emerald-300">
          <Heart fill="currentColor" size={22} />
          <span className="font-display text-2xl font-extrabold tracking-wider">LIKE</span>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-5 top-8 z-10 rotate-[12deg] rounded-xl border-4 border-rose-400 bg-rose-400/20 px-4 py-2"
      >
        <div className="flex items-center gap-2 text-rose-300">
          <X size={22} strokeWidth={3} />
          <span className="font-display text-2xl font-extrabold tracking-wider">PASS</span>
        </div>
      </motion.div>
    </>
  );

  const busy = disabled || lockRef.current;

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative mx-4 mt-2 flex-1">
        {next && (
          <div className="absolute inset-0 scale-[0.96] opacity-60">
            <ProfileCard profile={next} />
          </div>
        )}

        {current && (
          <motion.div
            key={current._id}
            className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
            style={{ x, rotate }}
            drag={busy ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
          >
            <ProfileCard profile={current} overlay={overlay} />
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-center gap-8 py-5">
        <button
          type="button"
          aria-label="Pass"
          disabled={busy || !current}
          onClick={() => finishSwipe('left')}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-[0_10px_30px_rgba(244,63,94,0.2)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={30} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          aria-label="Like"
          disabled={busy || !current}
          onClick={() => finishSwipe('right')}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.22)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Heart size={28} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default SwipeDeck;
