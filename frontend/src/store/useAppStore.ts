import { create } from 'zustand';
import { Clinic, Doctor, Stats } from '../types';

interface AppStore {
  // Clinics
  clinics: Clinic[];
  setClinics: (clinics: Clinic[]) => void;
  selectedClinic: Clinic | null;
  setSelectedClinic: (clinic: Clinic | null) => void;

  // Doctors
  doctors: Doctor[];
  setDoctors: (doctors: Doctor[]) => void;

  // Queue realtime
  queueLengths: Record<string, number>;
  setQueueLengths: (lengths: Record<string, number>) => void;
  updateQueueLength: (doctorId: string, length: number) => void;

  // Stats
  stats: Stats | null;
  setStats: (stats: Stats) => void;

  // UI
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (s: string) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  clinics: [],
  setClinics: (clinics) => set({ clinics }),
  selectedClinic: null,
  setSelectedClinic: (clinic) => set({ selectedClinic: clinic }),

  doctors: [],
  setDoctors: (doctors) => set({ doctors }),

  queueLengths: {},
  setQueueLengths: (queueLengths) => set({ queueLengths }),
  updateQueueLength: (doctorId, length) =>
    set((state) => ({
      queueLengths: { ...state.queueLengths, [doctorId]: length },
    })),

  stats: null,
  setStats: (stats) => set({ stats }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectedSpecialization: '',
  setSelectedSpecialization: (selectedSpecialization) => set({ selectedSpecialization }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
