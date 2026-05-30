import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ChevronRight } from 'lucide-react';
import { Doctor } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import QueueBadge from '../Queue/QueueBadge';
import QueueModal from '../Queue/QueueModal';

const SPECIALIZATION_ICONS: Record<string, string> = {
  'Terapevt': '🩺',
  'Kardiolog': '❤️',
  'Nevrolog': '🧠',
  'Jarroh': '🔪',
  'Pediatr': '👶',
  'Onkolog': '🔬',
  'Ginekolog': '🌸',
  'Oftalmolog': '👁️',
  'Endokrinolog': '⚗️',
  'Ortoped': '🦴',
  'Stomatolog': '🦷',
};

interface DoctorCardProps {
  doctor: Doctor;
  clinicName: string;
  index?: number;
}

export default function DoctorCard({ doctor, clinicName, index = 0 }: DoctorCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { queueLengths } = useAppStore();
  const liveQueue = queueLengths[doctor.id] ?? doctor.queue;
  const icon = SPECIALIZATION_ICONS[doctor.specialization] || '👨‍⚕️';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
      >
        {/* Top color band */}
        <div className="h-1.5 bg-gradient-to-r from-brand-400 to-brand-600" />

        <div className="p-6">
          {/* Doctor info */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-100 flex items-center justify-center text-2xl shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-600 text-slate-900 text-base leading-tight truncate">
                {doctor.name}
              </h3>
              <div className="text-brand-600 text-sm font-semibold mt-0.5">{doctor.specialization}</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-500 font-medium">{doctor.experience} yillik tajriba</span>
              </div>
            </div>
          </div>

          {/* Queue stats */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1">Hozirgi navbat</div>
              <QueueBadge count={liveQueue} size="md" />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-1">Taxminiy kutish</div>
              <div className="flex items-center gap-1 text-slate-700 font-semibold text-sm">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                ~{liveQueue * doctor.avgTime} daqiqa
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold py-3 rounded-2xl transition-all duration-200 hover:shadow-glow group-hover:shadow-glow"
          >
            Navbat olish
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {showModal && (
        <QueueModal
          doctor={{ ...doctor, queue: liveQueue }}
          clinicName={clinicName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
