const express = require("express");
const router = express.Router();
const { clinics, doctors } = require("../data/clinics");
const { getQueueLength, addToQueue, getQueue } = require("../data/queueStore");

// GET /api/clinics
router.get("/clinics", (req, res) => {
  const { search, specialization } = req.query;
  let result = clinics.map((c) => ({
    ...c,
    totalQueue: doctors
      .filter((d) => d.clinicId === c.id)
      .reduce((sum, d) => sum + getQueueLength(d.id), 0),
  }));

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }
  if (specialization) {
    result = result.filter((c) =>
      c.specializations.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))
    );
  }

  res.json(result);
});

// GET /api/clinics/:id
router.get("/clinics/:id", (req, res) => {
  const clinic = clinics.find((c) => c.id === req.params.id);
  if (!clinic) return res.status(404).json({ error: "Klinika topilmadi" });

  const clinicDoctors = doctors
    .filter((d) => d.clinicId === clinic.id)
    .map((d) => ({ ...d, queue: getQueueLength(d.id) }));

  res.json({ ...clinic, doctors: clinicDoctors });
});

// GET /api/doctors
router.get("/doctors", (req, res) => {
  const { clinicId, specialization } = req.query;
  let result = doctors.map((d) => ({ ...d, queue: getQueueLength(d.id) }));

  if (clinicId) result = result.filter((d) => d.clinicId === clinicId);
  if (specialization)
    result = result.filter((d) =>
      d.specialization.toLowerCase().includes(specialization.toLowerCase())
    );

  res.json(result);
});

// POST /api/queue
router.post("/queue", (req, res) => {
  const { doctorId, name, phone } = req.body;
  if (!doctorId || !name) {
    return res.status(400).json({ error: "doctorId va ism majburiy" });
  }

  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return res.status(404).json({ error: "Shifokor topilmadi" });

  const clinic = clinics.find((c) => c.id === doctor.clinicId);
  const ticket = addToQueue(doctorId, name.trim(), phone);
  const position = getQueueLength(doctorId);
  const waitMinutes = (position - 1) * doctor.avgTime;

  res.json({
    success: true,
    ticket: {
      ...ticket,
      position,
      estimatedWait: waitMinutes,
      doctor: { name: doctor.name, specialization: doctor.specialization },
      clinic: { name: clinic?.name, address: clinic?.address },
    },
  });
});

// GET /api/queue/status
router.get("/queue/status", (req, res) => {
  const { doctorId } = req.query;
  if (!doctorId) return res.status(400).json({ error: "doctorId kerak" });

  const queueLength = getQueueLength(doctorId);
  const doctor = doctors.find((d) => d.id === doctorId);
  res.json({ doctorId, queueLength, avgTime: doctor?.avgTime || 15 });
});

// GET /api/stats
router.get("/stats", (req, res) => {
  const totalQueue = doctors.reduce((sum, d) => sum + getQueueLength(d.id), 0);
  const openClinics = clinics.filter((c) => c.isOpen).length;
  const activeDoctors = doctors.filter((d) => getQueueLength(d.id) > 0).length;

  // Simulate today's served count
  const todayServed = Math.floor(Math.random() * 100) + 200;

  res.json({
    totalClinics: clinics.length,
    openClinics,
    totalDoctors: doctors.length,
    activeDoctors,
    currentQueue: totalQueue,
    todayServed,
  });
});

module.exports = router;
