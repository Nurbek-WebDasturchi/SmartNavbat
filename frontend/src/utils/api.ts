import { Clinic, Doctor, QueueTicket, Stats } from '../types';
import { MOCK_CLINICS, MOCK_DOCTORS, MOCK_STATS } from './mockData';

// In-memory queue store (frontend-only, resets on page refresh)
const queueCounters: Record<string, number> = {};
const queueLengths: Record<string, number> = {};

// Initialize
MOCK_DOCTORS.forEach((d) => {
  queueLengths[d.id] = d.queue;
  queueCounters[d.id] = d.queue;
});

// Simulate async delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const api = {
  getClinics: async (params?: { search?: string; specialization?: string }): Promise<Clinic[]> => {
    await delay();
    let result = MOCK_CLINICS.map((c) => ({
      ...c,
      totalQueue: MOCK_DOCTORS.filter((d) => d.clinicId === c.id)
        .reduce((sum, d) => sum + (queueLengths[d.id] ?? d.queue), 0),
    }));

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    if (params?.specialization) {
      result = result.filter((c) =>
        c.specializations.some((s) =>
          s.toLowerCase().includes(params.specialization!.toLowerCase())
        )
      );
    }
    return result;
  },

  getClinic: async (id: string): Promise<Clinic> => {
    await delay();
    const clinic = MOCK_CLINICS.find((c) => c.id === id);
    if (!clinic) throw new Error('Klinika topilmadi');
    const doctors = MOCK_DOCTORS.filter((d) => d.clinicId === id).map((d) => ({
      ...d,
      queue: queueLengths[d.id] ?? d.queue,
    }));
    return { ...clinic, doctors };
  },

  getDoctors: async (clinicId?: string): Promise<Doctor[]> => {
    await delay();
    let result = MOCK_DOCTORS.map((d) => ({ ...d, queue: queueLengths[d.id] ?? d.queue }));
    if (clinicId) result = result.filter((d) => d.clinicId === clinicId);
    return result;
  },

  joinQueue: async (
    doctorId: string,
    name: string,
    phone?: string
  ): Promise<{ success: boolean; ticket: QueueTicket }> => {
    await delay(600);
    const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
    if (!doctor) throw new Error('Shifokor topilmadi');
    const clinic = MOCK_CLINICS.find((c) => c.id === doctor.clinicId);

    queueCounters[doctorId] = (queueCounters[doctorId] ?? doctor.queue) + 1;
    queueLengths[doctorId] = (queueLengths[doctorId] ?? doctor.queue) + 1;

    const ticketNumber = queueCounters[doctorId];
    const position = queueLengths[doctorId];

    const ticket: QueueTicket = {
      id: `${doctorId}-${ticketNumber}-${Date.now()}`,
      ticketNumber,
      name,
      phone: phone || null,
      timestamp: Date.now(),
      position,
      estimatedWait: (position - 1) * doctor.avgTime,
      doctor: { name: doctor.name, specialization: doctor.specialization },
      clinic: { name: clinic?.name ?? '', address: clinic?.address ?? '' },
    };
    return { success: true, ticket };
  },

  getStats: async (): Promise<Stats> => {
    await delay(200);
    return {
      ...MOCK_STATS,
      currentQueue: MOCK_DOCTORS.reduce((s, d) => s + (queueLengths[d.id] ?? d.queue), 0),
    };
  },

  // Expose for fake realtime simulation
  _queueLengths: queueLengths,
};
