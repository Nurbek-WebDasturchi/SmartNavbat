import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, MapPin, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 glass border-b border-white/60 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-display font-700 text-lg text-slate-900 tracking-tight">
                Smart<span className="text-brand-500">Queue</span>
              </span>
              <div className="text-[10px] text-slate-400 font-body leading-none -mt-0.5">
                Online navbat tizimi
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={pathname === '/'}>
              <MapPin className="w-4 h-4" /> Bosh sahifa
            </NavLink>
            <NavLink to="/clinics" active={pathname.startsWith('/clinics')}>
              <Stethoscope className="w-4 h-4" /> Klinikalar
            </NavLink>
          </nav>

          {/* Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            Jonli tizim
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-brand-50 text-brand-600'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  );
}
