import { useCallback, useEffect, useState } from 'react';
import { getFeed, postSwipe } from '../services/api';
import { useApp } from '../context/AppContext';

export const useFeed = () => {
  const { showToast } = useApp();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed();
      setProfiles(data.profiles || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load profiles';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const swipe = useCallback(
    async (profileId, action) => {
      if (swiping) return null;

      setSwiping(true);
      try {
        const result = await postSwipe(profileId, action);
        setProfiles((prev) => prev.filter((p) => p._id !== profileId));

        if (result.matched && result.match) {
          setMatchResult(result.match);
        } else if (action === 'like') {
          showToast('Liked!', 'success');
        } else {
          showToast('Passed', 'info');
        }

        return result;
      } catch (err) {
        const message = err.response?.data?.message || 'Swipe failed';
        showToast(message, 'error');
        // Refresh feed to stay in sync if swipe was actually saved
        await loadFeed();
        return null;
      } finally {
        setSwiping(false);
      }
    },
    [swiping, showToast, loadFeed]
  );

  const clearMatch = useCallback(() => setMatchResult(null), []);

  return {
    profiles,
    current: profiles[0] || null,
    next: profiles[1] || null,
    loading,
    swiping,
    error,
    matchResult,
    clearMatch,
    swipe,
    reload: loadFeed,
  };
};
