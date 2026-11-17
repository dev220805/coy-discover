import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [demoUser, setDemoUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({
      demoUser,
      setDemoUser,
      toast,
      showToast,
      clearToast,
    }),
    [demoUser, toast, showToast, clearToast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
};
