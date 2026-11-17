import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-slate-800 text-white',
};

const Toast = () => {
  const { toast, clearToast } = useApp();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(clearToast, 2200);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  const Icon = toast ? icons[toast.type] || Info : Info;

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          className={`pointer-events-none absolute bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-lg ${styles[toast.type] || styles.info}`}
        >
          <Icon size={16} />
          <span>{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
