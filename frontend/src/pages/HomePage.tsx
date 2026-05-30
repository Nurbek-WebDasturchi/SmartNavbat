import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Clock, Shield, Zap, Building2, ArrowRight, TrendingUp, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import { useAppStore } from '../store/useAppStore';
import ClinicMap from '../components/Map/ClinicMap';
import ClinicCard from '../components/Clinic/ClinicCard';
import { SkeletonCard, SkeletonStat } from '../components/UI/Skeleton';
import { Clinic, Stats } from '../types';

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}

export default function HomePage() {
  const { clinics, setClinics, stats, setStats } = useAppStore();
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [localStats, setLocalStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.getClinics().then((data) => {
      setClinics(data);
      setLoadingClinics(false);
    }).catch(() => setLoadingClinics(false));

    api.getStats().then((data) => {
      setStats(data);
      setLocalStats(data);
      setLoadingStats(false);
    }).catch(() => setLoadingStats(false));
  }, [setClinics, setStats]);

  const displayStats = localStats || stats;

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 min-h-[80vh] flex items-center">
        {/* Bg decorations */}
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
                Toshkent uchun maxsus yaratilgan
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-700 text-white leading-tight mb-6">
                Klinikaga
                <br />
                <span className="gradient-text">online navbat</span>
                <br />
                oling
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                Toshkentdagi davlat klinikalarida navbat kutishga chek qo'ying. Uydan navbat oling va faqat kerak vaqtda boring.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/clinics" className="btn-primary flex items-center gap-2 text-base">
                  Klinika tanlash <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#map" className="btn-ghost flex items-center gap-2 text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <MapPin className="w-4 h-4" /> Xaritada ko'rish
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right stats card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <div className="glass rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">
                Bugungi statistika
              </div>
              {loadingStats ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
                </div>
              ) : displayStats ? (
                <div className="space-y-3">
                  <StatRow icon={<Building2 className="w-5 h-5 text-brand-500" />} label="Faol klinikalar" value={<AnimatedNumber value={displayStats.openClinics} />} sublabel={`Jami ${displayStats.totalClinics} ta`} />
                  <StatRow icon={<Users className="w-5 h-5 text-brand-500" />} label="Hozirgi navbat" value={<AnimatedNumber value={displayStats.currentQueue} />} sublabel="Kutayotgan" />
                  <StatRow icon={<CheckCircle className="w-5 h-5 text-brand-500" />} label="Bugun qabul qilindi" value={<AnimatedNumber value={displayStats.todayServed} />} sublabel="bemor" />
                </div>
              ) : null}

              {/* Live indicator */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
                <span className="text-xs text-slate-500 font-medium">Real vaqtda yangilanib turadi</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20V60Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Live Stats strip */}
      <section className="bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingStats ? (
              [1,2,3,4].map(i => <SkeletonStat key={i} />)
            ) : displayStats ? (
              <>
                <StatCard icon="🏥" value={displayStats.totalClinics} label="Jami klinikalar" color="brand" />
                <StatCard icon="👨‍⚕️" value={displayStats.totalDoctors} label="Shifokorlar" color="blue" />
                <StatCard icon="⏳" value={displayStats.currentQueue} label="Navbatda" color="amber" />
                <StatCard icon="✅" value={displayStats.todayServed} label="Bugun qabul" color="emerald" />
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Map section */}
      <section id="map" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="📍 Xarita"
            title="Klinikalarni xaritada toping"
            subtitle="Yaqin atrofdagi klinikani tanlang va navbat oling"
          />

          <div className="mt-8 h-[450px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <ClinicMap clinics={clinics} />
          </div>
        </div>
      </section>

      {/* Top Clinics */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              badge="⭐ Top klinikalar"
              title="Eng yaxshi klinikalar"
              subtitle="Reyting va sifat bo'yicha"
            />
            <Link to="/clinics" className="hidden sm:flex items-center gap-1 text-brand-600 font-semibold hover:gap-2 transition-all text-sm">
              Barchasini ko'rish <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingClinics
              ? [1,2,3].map(i => <SkeletonCard key={i} />)
              : clinics.slice(0, 3).map((c, i) => <ClinicCard key={c.id} clinic={c} index={i} />)
            }
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link to="/clinics" className="btn-primary inline-flex items-center gap-2">
              Barcha klinikalar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="🚀 Qanday ishlaydi"
            title="3 ta oddiy qadam"
            subtitle="Registratsiyasiz, tez va oson"
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <MapPin className="w-7 h-7" />, title: 'Klinikani tanlang', desc: 'Xaritada yoki ro\'yxatdan yaqin atrofingizdagi klinikani toping.' },
              { step: '02', icon: <Users className="w-7 h-7" />, title: 'Shifokor tanlang', desc: 'Mutaxassislik va navbat holatiga qarab qulay shifokorni tanlang.' },
              { step: '03', icon: <CheckCircle className="w-7 h-7" />, title: 'Navbat oling', desc: 'Faqat ismingizni kiriting va navbat raqamingizni oling.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white rounded-3xl p-7 border border-slate-100 shadow-sm group hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-6 right-6 font-mono text-5xl font-black text-slate-100 leading-none select-none">
                  {item.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mb-5 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-600 text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader
            badge="✨ Imkoniyatlar"
            title="Nima uchun SmartQueue?"
            subtitle="Navbat kutishni iloji boricha osonlashtirdik"
            light
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap className="w-6 h-6" />, title: 'Registratsiyasiz', desc: 'Hech qanday akkaunt kerak emas. Darhol ishlating.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Real-time navbat", desc: "Navbat soni jonli ravishda yangilanib turadi." },
              { icon: <MapPin className="w-6 h-6" />, title: 'Interaktiv xarita', desc: "Toshkentdagi barcha klinikalar bir xaritada." },
              { icon: <Shield className="w-6 h-6" />, title: 'Ishonchli tizim', desc: "Klinika ma'lumotlari doim dolzarb." },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white/10 border border-white/20 rounded-3xl p-6 text-white hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display font-600 text-base mb-2">{f.title}</h3>
                <p className="text-brand-100 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10"
          >
            <div className="text-4xl mb-4">🏥</div>
            <h2 className="font-display text-3xl text-slate-900 mb-3">
              Bugun navbat oling
            </h2>
            <p className="text-slate-500 mb-7">
              Toshkentdagi 6 ta klinika va 22+ shifokor sizni kutmoqda.
            </p>
            <Link to="/clinics" className="btn-primary inline-flex items-center gap-2 text-base px-8">
              Boshlash <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function StatRow({ icon, label, value, sublabel }: { icon: React.ReactNode; label: string; value: React.ReactNode; sublabel: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-display font-700 text-slate-900 text-lg leading-tight">{value}</div>
      </div>
      <div className="text-xs text-slate-400">{sublabel}</div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5"
    >
      <div className={`w-11 h-11 rounded-2xl ${colors[color]} flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <div className="font-display font-700 text-2xl text-slate-900 tabular-nums">
        <AnimatedNumber value={value} />
      </div>
      <div className="text-slate-500 text-sm mt-0.5">{label}</div>
    </motion.div>
  );
}

function SectionHeader({ badge, title, subtitle, light }: { badge: string; title: string; subtitle: string; light?: boolean }) {
  return (
    <div>
      <div className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 ${light ? 'bg-white/20 text-white/80' : 'bg-brand-50 text-brand-600'}`}>
        {badge}
      </div>
      <h2 className={`font-display text-2xl sm:text-3xl font-700 mb-2 ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <p className={`text-base ${light ? 'text-brand-100' : 'text-slate-500'}`}>{subtitle}</p>
    </div>
  );
}
