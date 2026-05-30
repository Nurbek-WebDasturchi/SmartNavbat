import { Link, useLocation } from 'react-router-dom';
import { Home, Building2 } from 'lucide-react';

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/60 pb-safe">
      <div className="flex items-center">
        <MobileNavItem to="/" icon={<Home className="w-5 h-5" />} label="Bosh sahifa" active={pathname === '/'} />
        <MobileNavItem to="/clinics" icon={<Building2 className="w-5 h-5" />} label="Klinikalar" active={pathname.startsWith('/clinics')} />
      </div>
    </div>
  );
}

function MobileNavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
        active ? 'text-brand-600' : 'text-slate-400'
      }`}
    >
      {icon}
      <span className="text-xs font-semibold">{label}</span>
      {active && (
        <span className="absolute bottom-0 w-8 h-0.5 bg-brand-500 rounded-full" />
      )}
    </Link>
  );
}
