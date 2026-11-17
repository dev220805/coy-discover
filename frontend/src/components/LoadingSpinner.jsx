import { motion } from 'framer-motion';

const LoadingSpinner = ({ label = 'Loading…' }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-slate-500">
      <motion.div
        className="h-10 w-10 rounded-full border-[3px] border-rose-200 border-t-rose-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
