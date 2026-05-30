// In-memory queue store
const queues = {}; // doctorId -> [{ticketNumber, name, phone, timestamp}]
const queueCounters = {}; // doctorId -> lastTicketNumber

// Initialize from doctors data
function initQueues(doctors) {
  doctors.forEach((doc) => {
    queues[doc.id] = [];
    queueCounters[doc.id] = doc.queue;
    // Simulate existing queue entries
    for (let i = 1; i <= doc.queue; i++) {
      queues[doc.id].push({
        ticketNumber: i,
        name: "Kutayotgan bemor",
        phone: null,
        timestamp: Date.now() - (doc.queue - i) * doc.avgTime * 60000,
        served: false,
      });
    }
  });
}

function getQueue(doctorId) {
  return queues[doctorId] || [];
}

function getQueueLength(doctorId) {
  return (queues[doctorId] || []).filter((t) => !t.served).length;
}

function addToQueue(doctorId, name, phone) {
  if (!queues[doctorId]) queues[doctorId] = [];
  if (!queueCounters[doctorId]) queueCounters[doctorId] = 0;
  queueCounters[doctorId]++;
  const ticket = {
    id: `${doctorId}-${queueCounters[doctorId]}-${Date.now()}`,
    ticketNumber: queueCounters[doctorId],
    name,
    phone: phone || null,
    timestamp: Date.now(),
    served: false,
  };
  queues[doctorId].push(ticket);
  return ticket;
}

// Fake real-time: every 30s randomly serve one or add one
function startFakeRealtime(io) {
  setInterval(() => {
    const doctorIds = Object.keys(queues);
    if (!doctorIds.length) return;
    const randomDoc = doctorIds[Math.floor(Math.random() * doctorIds.length)];
    const active = queues[randomDoc].filter((t) => !t.served);
    const roll = Math.random();

    if (roll < 0.5 && active.length > 0) {
      // Serve first in queue
      queues[randomDoc].find((t) => !t.served).served = true;
    } else if (roll < 0.75) {
      // Add new random person
      if (!queueCounters[randomDoc]) queueCounters[randomDoc] = 0;
      queueCounters[randomDoc]++;
      queues[randomDoc].push({
        id: `${randomDoc}-auto-${Date.now()}`,
        ticketNumber: queueCounters[randomDoc],
        name: "Yangi bemor",
        phone: null,
        timestamp: Date.now(),
        served: false,
      });
    }

    // Emit update
    const lengths = {};
    doctorIds.forEach((id) => {
      lengths[id] = queues[id].filter((t) => !t.served).length;
    });
    io.emit("queue_update", lengths);
  }, 8000); // every 8 seconds for more lively feel
}

module.exports = { initQueues, getQueue, getQueueLength, addToQueue, startFakeRealtime };
