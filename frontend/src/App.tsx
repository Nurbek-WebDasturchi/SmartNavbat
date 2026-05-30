import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSocket } from './hooks/useSocket';
import Navbar from './components/UI/Navbar';
import HomePage from './pages/HomePage';
import ClinicsPage from './pages/ClinicsPage';
import ClinicDetailPage from './pages/ClinicDetailPage';
import MobileNav from './components/UI/MobileNav';

function AppInner() {
  useSocket();
  return (
    <div className="min-h-screen bg-slate-50 dot-grid">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clinics" element={<ClinicsPage />} />
        <Route path="/clinics/:id" element={<ClinicDetailPage />} />
      </Routes>
      <MobileNav />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: 'Satoshi, sans-serif',
            fontWeight: 500,
            borderRadius: '1rem',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: { primary: '#1da87f', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
