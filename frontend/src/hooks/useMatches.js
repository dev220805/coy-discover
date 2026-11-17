import { useCallback, useEffect, useState } from 'react';
import { getMatches } from '../services/api';
import { useApp } from '../context/AppContext';

export const useMatches = (enabled = true) => {
  const { showToast } = useApp();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMatches();
      setMatches(data.matches || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load matches';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (enabled) {
      loadMatches();
    }
  }, [enabled, loadMatches]);

  return { matches, loading, error, reload: loadMatches };
};
