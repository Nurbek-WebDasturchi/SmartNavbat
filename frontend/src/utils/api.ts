const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Something went wrong');
  }
  return res.json();
}

export const api = {
  getClinics: (params?: { search?: string; specialization?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.specialization) qs.set('specialization', params.specialization);
    const q = qs.toString();
    return fetchJson<import('../types').Clinic[]>(`${BASE_URL}/clinics${q ? `?${q}` : ''}`);
  },

  getClinic: (id: string) =>
    fetchJson<import('../types').Clinic>(`${BASE_URL}/clinics/${id}`),

  getDoctors: (clinicId?: string) =>
    fetchJson<import('../types').Doctor[]>(
      `${BASE_URL}/doctors${clinicId ? `?clinicId=${clinicId}` : ''}`
    ),

  joinQueue: (doctorId: string, name: string, phone?: string) =>
    fetchJson<{ success: boolean; ticket: import('../types').QueueTicket }>(`${BASE_URL}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorId, name, phone }),
    }),

  getStats: () => fetchJson<import('../types').Stats>(`${BASE_URL}/stats`),
};
