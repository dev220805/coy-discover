import { NavLink } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const tabs = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/discover', label: 'Discover', icon: Compass },
];

const BottomNav = () => {
  return (
    <nav className="shrink-0 border-t border-slate-200/80 bg-white/90 px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md">
      <div className="flex items-center justify-around">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl px-6 py-2 transition-colors ${
                isActive ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[11px] font-semibold tracking-wide">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
