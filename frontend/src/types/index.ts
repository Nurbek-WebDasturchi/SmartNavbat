export interface Clinic {
  id: string;
  name: string;
  shortName: string;
  address: string;
  district: string;
  lat: number;
  lng: number;
  phone: string;
  workHours: string;
  workDays: string;
  totalDoctors: number;
  rating: number;
  specializations: string[];
  isOpen: boolean;
  totalQueue?: number;
  doctors?: Doctor[];
}

export interface Doctor {
  id: string;
  clinicId: string;
  name: string;
  specialization: string;
  experience: number;
  photo: string | null;
  queue: number;
  avgTime: number;
}

export interface QueueTicket {
  id: string;
  ticketNumber: number;
  name: string;
  phone: string | null;
  timestamp: number;
  position: number;
  estimatedWait: number;
  doctor: { name: string; specialization: string };
  clinic: { name: string; address: string };
}

export interface Stats {
  totalClinics: number;
  openClinics: number;
  totalDoctors: number;
  activeDoctors: number;
  currentQueue: number;
  todayServed: number;
}
