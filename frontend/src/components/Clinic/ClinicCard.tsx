import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ChevronRight, Stethoscope } from 'lucide-react';
import { Clinic } from '../../types';

interface ClinicCardProps {
  clinic: Clinic;
  index?: number;
}

export default function ClinicCard({ clinic, index = 0 }: ClinicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/clinics/${clinic.id}`}
        className="block bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-brand-500/10" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-brand-500/20" />

          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  clinic.isOpen
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {clinic.isOpen ? '● Ochiq' : '● Yopiq'}
                </span>
                <span className="text-slate-500 text-xs">{clinic.district}</span>
              </div>
              <h3 className="font-display font-600 text-white text-base leading-snug group-hover:text-brand-300 transition-colors">
                {clinic.name}
              </h3>
            </div>
            <div className="ml-3 flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-1.5 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-bold">{clinic.rating}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-2 text-slate-600 text-sm">
            <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{clinic.address}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="w-4 h-4 text-brand-400 shrink-0" />
            <span>{clinic.workHours} · {clinic.workDays}</span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Stethoscope className="w-4 h-4 text-brand-400" />
              {clinic.totalDoctors} shifokor
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Users className="w-4 h-4 text-brand-400" />
              {clinic.totalQueue ?? '—'} navbat
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {clinic.specializations.slice(0, 3).map((s) => (
              <span key={s} className="text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1 rounded-full">
                {s}
              </span>
            ))}
            {clinic.specializations.length > 3 && (
              <span className="text-xs bg-brand-50 text-brand-600 font-medium px-2.5 py-1 rounded-full">
                +{clinic.specializations.length - 3}
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-end">
            <span className="flex items-center gap-1 text-brand-500 text-sm font-semibold group-hover:gap-2 transition-all">
              Shifokorlarni ko'rish <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
