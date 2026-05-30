import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin, List, X } from 'lucide-react';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import ClinicCard from '../components/Clinic/ClinicCard';
import ClinicMap from '../components/Map/ClinicMap';
import { SkeletonCard } from '../components/UI/Skeleton';
import { Clinic } from '../types';

const SPECIALIZATIONS = ['Terapevt', 'Kardiolog', 'Pediatr', 'Nevrolog', 'Jarroh', 'Ginekolog', 'Endokrinolog', 'Oftalmolog'];

type View = 'list' | 'map';

export default function ClinicsPage() {
  const { clinics, setClinics, searchQuery, setSearchQuery, selectedSpecialization, setSelectedSpecialization } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);

  const fetchClinics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getClinics({ search: searchQuery, specialization: selectedSpecialization });
      setClinics(data);
      setFilteredClinics(data);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSpecialization, setClinics]);

  useEffect(() => {
    const t = setTimeout(fetchClinics, 300);
    return () => clearTimeout(t);
  }, [fetchClinics]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('');
  };

  const hasFilters = searchQuery || selectedSpecialization;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-700 text-slate-900 mb-1">Klinikalar</h1>
        <p className="text-slate-500">Toshkentdagi {filteredClinics.length} ta klinika topildi</p>
      </motion.div>

      {/* Search + Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 space-y-3"
      >
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Klinika nomi, tuman yoki manzil bo'yicha qidiring..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-900 placeholder:text-slate-400 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Mutaxassislik:
          </div>
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpecialization(selectedSpecialization === s ? '' : s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                selectedSpecialization === s
                  ? 'bg-brand-500 text-white shadow-glow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Tozalash
            </button>
          )}
        </div>
      </motion.div>

      {/* View toggle + count */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm text-slate-500">
          {loading ? 'Yuklanmoqda...' : `${filteredClinics.length} ta klinika`}
          {selectedSpecialization && (
            <span className="ml-2 text-brand-600 font-medium">· {selectedSpecialization}</span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <ViewBtn icon={<List className="w-4 h-4" />} label="Ro'yxat" active={view === 'list'} onClick={() => setView('list')} />
          <ViewBtn icon={<MapPin className="w-4 h-4" />} label="Xarita" active={view === 'map'} onClick={() => setView('map')} />
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[600px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 mb-6"
        >
          <ClinicMap clinics={filteredClinics} />
        </motion.div>
      )}

      {/* List view */}
      {view === 'list' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClinics.map((clinic, i) => (
                <ClinicCard key={clinic.id} clinic={clinic} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState query={searchQuery} />
          )}
        </>
      )}
    </div>
  );
}

function ViewBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
        active ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="text-5xl mb-4">🏥</div>
      <h3 className="font-display text-xl text-slate-700 mb-2">Klinika topilmadi</h3>
      <p className="text-slate-500 text-sm">
        {query ? `"${query}" bo'yicha klinika topilmadi.` : 'Filterni tozalang va qayta urinib ko\'ring.'}
      </p>
    </motion.div>
  );
}
