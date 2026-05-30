import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Clock, Users, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Clinic } from '../../types';
import { useAppStore } from '../../store/useAppStore';

// Fix default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createClinicIcon(isOpen: boolean) {
  const color = isOpen ? '#1da87f' : '#94a3b8';
  const svg = `
    <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.77 18 26 18 26s18-13.23 18-26C36 8.06 27.94 0 18 0z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="18" cy="18" r="10" fill="white" opacity="0.9"/>
      <path d="M18 12v12M12 18h12" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  if (center) {
    map.setView(center, 15, { animate: true });
  }
  return null;
}

interface ClinicMapProps {
  clinics: Clinic[];
  focusClinic?: Clinic | null;
}

export default function ClinicMap({ clinics, focusClinic }: ClinicMapProps) {
  const { queueLengths } = useAppStore();

  return (
    <MapContainer
      center={[41.3, 69.26]}
      zoom={12}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {focusClinic && (
        <MapController center={[focusClinic.lat, focusClinic.lng]} />
      )}

      {clinics.map((clinic) => {
        const totalQueue = clinic.doctors
          ? clinic.doctors.reduce((sum, d) => sum + (queueLengths[d.id] ?? d.queue), 0)
          : clinic.totalQueue ?? 0;

        return (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lng]}
            icon={createClinicIcon(clinic.isOpen)}
          >
            <Popup>
              <div className="p-4 min-w-[220px]">
                {/* Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    clinic.isOpen
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {clinic.isOpen ? '● Ochiq' : '● Yopiq'}
                  </span>
                  <span className="text-xs text-slate-400">{clinic.district}</span>
                </div>

                {/* Name */}
                <h4 className="font-display font-600 text-slate-900 text-sm leading-snug mb-3">
                  {clinic.name}
                </h4>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    <span>{clinic.workHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-400" />
                    <span className="font-semibold text-slate-700">{totalQueue} kishi navbatda</span>
                  </div>
                </div>

                <Link
                  to={`/clinics/${clinic.id}`}
                  className="flex items-center justify-center gap-1 w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                >
                  Navbat olish <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
