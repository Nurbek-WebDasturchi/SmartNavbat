import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, CheckCircle, Clock, MapPin, Ticket } from 'lucide-react';
import { Doctor, QueueTicket } from '../../types';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

interface QueueModalProps {
  doctor: Doctor;
  clinicName: string;
  onClose: () => void;
}

type Step = 'form' | 'success';

export default function QueueModal({ doctor, clinicName, onClose }: QueueModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<QueueTicket | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Ism kiriting');
      return;
    }
    setLoading(true);
    try {
      const res = await api.joinQueue(doctor.id, name, phone);
      setTicket(res.ticket);
      setStep('success');
      toast.success("Navbatga muvaffaqiyatli qo'shildingiz!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-sm font-medium text-brand-100 mb-1">{clinicName}</div>
            <h3 className="font-display text-xl font-600">{doctor.name}</h3>
            <div className="text-brand-100 text-sm mt-0.5">{doctor.specialization}</div>

            <div className="mt-4 flex items-center gap-2 bg-white/15 rounded-2xl px-4 py-2.5 w-fit">
              <Clock className="w-4 h-4 text-brand-100" />
              <span className="text-sm font-semibold">
                Hozir {doctor.queue} kishi kutmoqda · ~{doctor.queue * doctor.avgTime} daqiqa
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 'form' ? (
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">
                  Navbat olish uchun ismingizni kiriting. Telefon raqam ixtiyoriy.
                </p>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Ism Familiya *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masalan: Alisher Toshmatov"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Telefon <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !name.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    "Navbat olish"
                  )}
                </button>
              </div>
            ) : ticket ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Success icon */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center"
                  >
                    <CheckCircle className="w-9 h-9 text-emerald-500" />
                  </motion.div>
                  <div>
                    <h4 className="font-display text-xl text-slate-900">Navbat olindi!</h4>
                    <p className="text-slate-500 text-sm mt-1">Sizning navbat raqamingiz</p>
                  </div>
                </div>

                {/* Ticket card */}
                <div className="bg-gradient-to-br from-brand-50 to-emerald-50 border-2 border-brand-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <Ticket className="w-5 h-5 text-brand-500" />
                    <span className="text-xs font-mono text-brand-400">#{ticket.id?.slice(-6)}</span>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-6xl font-700 text-brand-600 tabular-nums leading-none">
                      {ticket.ticketNumber}
                    </div>
                    <div className="text-brand-500 text-sm font-semibold mt-1">Navbat raqami</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-200 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-slate-500 text-xs">Kutish vaqti</div>
                      <div className="font-semibold text-slate-800">~{ticket.estimatedWait} daqiqa</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Navbatda</div>
                      <div className="font-semibold text-slate-800">{ticket.position} kishi</div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>{ticket.clinic?.address}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="btn-primary w-full"
                >
                  Yopish
                </button>
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
