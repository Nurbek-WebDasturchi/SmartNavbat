# 🏥 SmartQueue — Online Navbat Tizimi

<div align="center">

![SmartQueue Banner](https://img.shields.io/badge/SmartQueue-v1.0.0-1da87f?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xIDEzSDExdi02aDJ2NnptMC00SDExVjloMnYyeiIvPjwvc3ZnPg==)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Toshkentdagi davlat klinikalari uchun zamonaviy online navbat tizimi**

[Demo](#) · [Screenshots](#screenshots) · [Installation](#installation) · [API Docs](#api-routes)

</div>

---

## 📋 Loyiha haqida

**SmartQueue** — Toshkentdagi davlat klinikalarida navbat kutishni minimallashtirishga mo'ljallangan to'liq stack web ilovasi. Foydalanuvchilar registratsiyasiz, xarita orqali yaqin klinikani topib, shifokorga online navbat olishlari mumkin.

> 💡 **Portfolio project** sifatida yaratilgan. Real-time navbat tizimi, interaktiv xarita va premium UI dizayn ko'rsatilgan.

---

## ✨ Asosiy xususiyatlar

| Xususiyat                 | Tavsif                                           |
| ------------------------- | ------------------------------------------------ |
| 🗺️ **Interaktiv xarita**  | Leaflet.js asosida Toshkent klinikalari xaritasi |
| ⚡ **Real-time navbat**   | Socket.io orqali jonli navbat yangilanishi       |
| 🚫 **Registratsiyasiz**   | Faqat ism kiritib navbat olish imkoniyati        |
| 🔍 **Qidiruv & Filtr**    | Klinika va mutaxassislik bo'yicha filtrlash      |
| 📱 **Mobile-first**       | Barcha qurilmalarga moslashgan responsive dizayn |
| 💎 **Premium UI**         | Glassmorphism, Framer Motion animatsiyalar       |
| 🦴 **Skeleton Loading**   | Smooth loading holatlari                         |
| 🔔 **Toast xabarnomalar** | Amal natijalari uchun zamonaviy xabarnomalar     |

---

## 🖼️ Screenshots

```
📸 Screenshots qo'yish joyi:

1. Home page — hero section + interaktiv xarita
2. Clinics page — klinikalar ro'yxati + filtrlar
3. Clinic detail — shifokorlar va navbat holati
4. Queue modal — navbat olish forma + ticket
5. Mobile view — bottom navigation
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18** + **TypeScript** — UI framework
- **Vite** — Ultra-fast build tool
- **TailwindCSS** — Utility-first CSS
- **Framer Motion** — Production-grade animations
- **React Leaflet** — Interactive maps
- **Zustand** — Lightweight state management
- **Socket.io-client** — Real-time WebSocket
- **React Hot Toast** — Toast notifications
- **Lucide React** — Beautiful icons
- **Clash Display + Satoshi** — Premium typography

### Backend

- **Node.js** + **Express** — REST API server
- **Socket.io** — WebSocket server for real-time
- **In-memory store** — Lightweight data storage (no DB setup needed)

---

## 📁 Folder Structure

```
smart-queue/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Clinic/          # ClinicCard, DoctorCard
│   │   │   ├── Map/             # ClinicMap (Leaflet)
│   │   │   ├── Queue/           # QueueBadge, QueueModal
│   │   │   └── UI/              # Navbar, MobileNav, Skeleton
│   │   ├── hooks/               # useSocket
│   │   ├── pages/               # HomePage, ClinicsPage, ClinicDetailPage
│   │   ├── store/               # Zustand store
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # API utility functions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── data/
│   │   ├── clinics.js           # Mock data (6 clinics, 22 doctors)
│   │   └── queueStore.js        # In-memory queue management
│   ├── routes/
│   │   └── api.js               # All REST endpoints
│   ├── server.js                # Express + Socket.io server
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Talablar

- Node.js 18+
- npm yoki yarn

### 1. Repository'ni clone qilish

```bash
git clone https://github.com/yourusername/smart-queue.git
cd smart-queue
```

### 2. Backend o'rnatish

```bash
cd backend
npm install
```

### 3. Frontend o'rnatish

```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Setup

### Backend `.env` (ixtiyoriy)

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (ixtiyoriy)

```env
VITE_API_URL=/api
VITE_SOCKET_URL=http://localhost:3001
```

> **Eslatma:** Default sozlamalar bilan `.env` faylsiz ham ishlaydi.

---

## 🏃 Run Locally

### Backend ishga tushirish

```bash
cd backend
npm run dev      # nodemon bilan (development)
# yoki
npm start        # production
```

Backend `http://localhost:3001` da ishlaydi.

### Frontend ishga tushirish

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:5173` da ochiladi.

---

## 🔌 API Routes

### Clinics

| Method | Endpoint                                | Tavsif                       |
| ------ | --------------------------------------- | ---------------------------- |
| `GET`  | `/api/clinics`                          | Barcha klinikalar ro'yxati   |
| `GET`  | `/api/clinics?search=yunusobod`         | Qidiruv bo'yicha filtr       |
| `GET`  | `/api/clinics?specialization=Kardiolog` | Mutaxassislik bo'yicha filtr |
| `GET`  | `/api/clinics/:id`                      | Klinika + shifokorlar        |

### Doctors

| Method | Endpoint                  | Tavsif                       |
| ------ | ------------------------- | ---------------------------- |
| `GET`  | `/api/doctors`            | Barcha shifokorlar           |
| `GET`  | `/api/doctors?clinicId=1` | Klinika bo'yicha shifokorlar |

### Queue

| Method | Endpoint                        | Tavsif        |
| ------ | ------------------------------- | ------------- |
| `POST` | `/api/queue`                    | Navbat olish  |
| `GET`  | `/api/queue/status?doctorId=d1` | Navbat holati |

### Stats

| Method | Endpoint     | Tavsif            |
| ------ | ------------ | ----------------- |
| `GET`  | `/api/stats` | Umumiy statistika |

#### POST `/api/queue` — Request body:

```json
{
  "doctorId": "d1",
  "name": "Alisher Toshmatov",
  "phone": "+998901234567"
}
```

#### Response:

```json
{
  "success": true,
  "ticket": {
    "id": "d1-5-1703000000000",
    "ticketNumber": 5,
    "position": 5,
    "estimatedWait": 60,
    "doctor": { "name": "Akmal Karimov", "specialization": "Jarroh" },
    "clinic": {
      "name": "1-sonli Shahar Ko'p Tarmoqli Klinikasi",
      "address": "..."
    }
  }
}
```

### Real-time (Socket.io)

```javascript
// Navbat yangilanishlarini tinglash
socket.on("queue_update", (lengths) => {
  // { 'd1': 9, 'd2': 6, ... }
});
```

---

## 🗺️ Mock Data

Loyihada **6 ta haqiqiy Toshkent klinikasi** va **22 ta shifokor** mock data'si mavjud:

- 1-sonli Shahar Ko'p Tarmoqli Klinikasi (Mirzo Ulug'bek)
- Ibn Sino Nomidagi RMDK (Yakkasaroy)
- Yunusobod Tumani Markaziy Poliklinikasi
- Chilonzor 15-son Poliklinikasi
- Sergeli Tumani Markaziy Poliklinikasi
- Shayxontohur Tumani Ko'p Tarmoqli Klinikasi

---

## 🔮 Future Improvements

- [ ] 📲 Push notifications (navbat yaqinlashganda)
- [ ] 🗓️ Muayyan kun/vaqtga navbat olish
- [ ] 🔐 Klinika admin paneli (doctor CRUD)
- [ ] 📊 Analytics dashboard
- [ ] 🌐 PWA (Progressive Web App) support
- [ ] 🗺️ Leaflet marker clustering
- [ ] 🔎 ElasticSearch integratsiyasi
- [ ] 📱 React Native mobile app
- [ ] 💬 SMS xabarnoma integratsiyasi
- [ ] 🏥 Ko'proq klinika va shifokorlar

---

## 👨‍💻 Author

Yaratuvchi: **Nurbek**  
Portfolio project — Toshkent, O'zbekiston 🇺🇿

---

## 📄 License

MIT License. Bepul foydalaning va o'zgartiring.

---

<div align="center">
  <strong>SmartNavbat</strong> — Sog'liqni saqlashni digitallashtirish yo'lida ✨
</div>
