import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const MatchOverlay = ({ match, onContinue }) => {
  const { demoUser } = useApp();

  if (!match?.profile) return null;

  const other = match.profile;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 px-6 text-center text-white backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="mb-2"
      >
        <p className="font-display text-4xl font-extrabold tracking-tight text-rose-400">
          It&apos;s a Match!
        </p>
        <p className="mt-2 text-sm text-slate-300">
          You and {other.name} liked each other
        </p>
      </motion.div>

      <div className="relative mt-10 flex items-center justify-center">
        <motion.img
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          src={demoUser?.photo}
          alt={demoUser?.name || 'You'}
          className="relative z-[1] h-28 w-28 rounded-full border-4 border-rose-400 object-cover shadow-xl"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: 'spring' }}
          className="relative z-20 -mx-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 shadow-lg"
        >
          <Heart size={22} fill="white" className="text-white" />
        </motion.div>

        <motion.img
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          src={other.photo}
          alt={other.name}
          className="relative z-[1] h-28 w-28 rounded-full border-4 border-sky-400 object-cover shadow-xl"
        />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-8 flex gap-8 text-sm font-semibold"
      >
        <span>{demoUser?.name || 'You'}</span>
        <span>{other.name}</span>
      </motion.div>

      <motion.button
        type="button"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        onClick={onContinue}
        className="mt-12 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-rose-50"
      >
        Keep Exploring
      </motion.button>
    </motion.div>
  );
};

export default MatchOverlay;
