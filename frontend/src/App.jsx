import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import { useApp } from './context/AppContext';
import { getMe } from './services/api';

function App() {
  const { setDemoUser, showToast } = useApp();

  useEffect(() => {
    const loadMe = async () => {
      try {
        const data = await getMe();
        setDemoUser(data.user);
      } catch (err) {
        showToast(err.response?.data?.message || 'Could not load demo user', 'error');
      }
    };

    loadMe();
  }, [setDemoUser, showToast]);

  return (
    <div className="app-shell">
      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="*" element={<Navigate to="/discover" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <Toast />
    </div>
  );
}

export default App;
