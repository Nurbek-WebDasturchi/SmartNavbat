import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Phone, Star, Users, Stethoscope, Search, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import { Clinic } from '../types';
import DoctorCard from '../components/Clinic/DoctorCard';
import ClinicMap from '../components/Map/ClinicMap';
import { SkeletonDoctorCard } from '../components/UI/Skeleton';

const SPECIALIZATIONS = ['Barchasi', 'Terapevt', 'Kardiolog', 'Pediatr', 'Nevrolog', 'Jarroh', 'Ginekolog', 'Endokrinolog', 'Oftalmolog'];

export default function ClinicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { queueLengths } = useAppStore();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('Barchasi');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getClinic(id)
      .then(setClinic)
      .catch(() => setClinic(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState />;
  if (!clinic) return <NotFoundState />;

  const doctors = clinic.doctors || [];
  const filtered = doctors.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = specFilter === 'Barchasi' || d.specialization === specFilter;
    return matchesSearch && matchesSpec;
  });

  const totalQueue = doctors.reduce((sum, d) => sum + (queueLengths[d.id] ?? d.queue), 0);
  const availableSpecs = ['Barchasi', ...new Set(doctors.map(d => d.specialization))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Back */}
      <Link
        to="/clinics"
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-semibold mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Barcha klinikalar
      </Link>

      {/* Clinic hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white mb-6 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  clinic.isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {clinic.isOpen ? '● Ochiq' : '● Yopiq'}
                </span>
                <span className="text-slate-400 text-sm">{clinic.district} tumani</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-700 leading-tight">{clinic.name}</h1>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-2xl px-4 py-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-lg">{clinic.rating}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <InfoChip icon={<MapPin className="w-4 h-4" />} text={clinic.address} />
            <InfoChip icon={<Clock className="w-4 h-4" />} text={`${clinic.workHours} · ${clinic.workDays}`} />
            <InfoChip icon={<Phone className="w-4 h-4" />} text={clinic.phone} />
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2.5">
              <Stethoscope className="w-4 h-4 text-brand-300" />
              <span className="font-semibold text-sm">{doctors.length} shifokor</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2.5">
              <Users className="w-4 h-4 text-brand-300" />
              <span className="font-semibold text-sm">{totalQueue} kishi navbatda</span>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mt-4">
            {clinic.specializations.map(s => (
              <span key={s} className="bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Map toggle */}
      <button
        onClick={() => setShowMap(v => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-5 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        {showMap ? 'Xaritani yopish' : 'Xaritada ko\'rsatish'}
        <ChevronRight className={`w-4 h-4 transition-transform ${showMap ? 'rotate-90' : ''}`} />
      </button>

      {showMap && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 300, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-6"
        >
          <ClinicMap clinics={[clinic]} focusClinic={clinic} />
        </motion.div>
      )}

      {/* Doctors section */}
      <div>
        <h2 className="font-display text-xl font-700 text-slate-900 mb-4">Shifokorlar</h2>

        {/* Search + spec filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Shifokor ismini qidiring..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-sm"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {availableSpecs.map(s => (
              <button
                key={s}
                onClick={() => setSpecFilter(s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  specFilter === s
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <SkeletonDoctorCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((doctor, i) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                clinicName={clinic.name}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">👨‍⚕️</div>
            <p className="text-slate-500">Shifokor topilmadi. Filterni tozalang.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 bg-white/10 rounded-2xl px-3.5 py-2.5 text-sm text-white/80">
      <span className="text-brand-300 mt-0.5 shrink-0">{icon}</span>
      <span className="leading-snug">{text}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="skeleton h-8 rounded-xl w-40 mb-6" />
      <div className="skeleton h-48 rounded-3xl mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1,2,3].map(i => <SkeletonDoctorCard key={i} />)}
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-2xl text-slate-700 mb-3">Klinika topilmadi</h2>
      <Link to="/clinics" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Orqaga qaytish
      </Link>
    </div>
  );
}
