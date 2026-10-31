const defaultEvents = [
  {
    id: 1,
    title: "WebDev Hackathon 2026",
    category: "Technical",
    desc: "A 24-hour sprint to build full-stack web solutions for real-world campus problems. Win prizes & certificates.",
    date: "November 15, 2026",
    venue: "Main Seminar Hall",
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Annual Music Fest",
    category: "Cultural",
    desc: "An electric evening of live band battles, instrumental solos, and beatboxing under the stars.",
    date: "November 20, 2026",
    venue: "Open Air Amphitheatre",
    banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    title: "Inter-College Cricket Cup",
    category: "Sports",
    desc: "8 teams, one championship trophy. Join the cheer or register your departmental squad.",
    date: "December 02, 2026",
    venue: "University Sports Ground",
    banner: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    title: "AI & ML Workshop",
    category: "Technical",
    desc: "Hands-on masterclass on Prompt Engineering and training open-source machine learning models.",
    date: "December 10, 2026",
    venue: "Computer Lab 3",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  }
];

let events = JSON.parse(localStorage.getItem("eventify_events")) || defaultEvents;
let registrations = JSON.parse(localStorage.getItem("eventify_registrations")) || [];

let activeCategory = 'all';
let currentRegisteringEvent = null;

window.addEventListener("DOMContentLoaded", () => {
  renderEvents(events);
});

function renderEvents(items) {
  const container = document.getElementById("eventsGrid");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = `<p style="color: #94a3b8; grid-column: 1/-1; text-align: center; padding: 2rem;">No events found.</p>`;
    return;
  }

  items.forEach(ev => {
    const card = document.createElement("div");
    card.className = "event-card";
    const bannerUrl = ev.banner || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80";

    card.innerHTML = `
      <img src="${bannerUrl}" alt="${ev.title}" class="card-banner" />
      <div class="card-content">
        <span class="card-category-badge">${ev.category}</span>
        <h3>${ev.title}</h3>
        <p>${ev.desc}</p>
        <div class="card-meta">
          <span>📅 ${ev.date}</span>
          <span>📍 ${ev.venue}</span>
        </div>
        <button class="btn-primary" onclick="initiateRegistration(${ev.id})">Register & Get Pass</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setCategory(category, button) {
  activeCategory = category;
  document.querySelectorAll(".controls-section .tab").forEach(tab => tab.classList.remove("active"));
  button.classList.add("active");
  filterEvents();
}

function filterEvents() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = events.filter(ev => {
    const matchCategory = activeCategory === 'all' || ev.category.toLowerCase() === activeCategory.toLowerCase();
    const matchQuery = ev.title.toLowerCase().includes(query) || ev.venue.toLowerCase().includes(query);
    return matchCategory && matchQuery;
  });
  renderEvents(filtered);
}

function initiateRegistration(eventId) {
  currentRegisteringEvent = events.find(e => e.id === eventId);
  document.getElementById("modalEventTitle").innerText = currentRegisteringEvent.title;
  document.getElementById("registrationModal").style.display = "flex";
}

function handleRegistration(e) {
  e.preventDefault();

  const name = document.getElementById("userName").value;
  const email = document.getElementById("userEmail").value;
  const roll = document.getElementById("userRoll").value;

  const newAttendee = {
    eventName: currentRegisteringEvent.title,
    name: name,
    email: email,
    roll: roll,
    registeredAt: new Date().toLocaleDateString()
  };

  registrations.push(newAttendee);
  localStorage.setItem("eventify_registrations", JSON.stringify(registrations));

  closeModal('registrationModal');

  document.getElementById("tktEventTitle").innerText = currentRegisteringEvent.title;
  document.getElementById("tktName").innerText = name;
  document.getElementById("tktRoll").innerText = roll;
  document.getElementById("tktDate").innerText = currentRegisteringEvent.date;
  document.getElementById("tktVenue").innerText = currentRegisteringEvent.venue;

  document.getElementById("ticketModal").style.display = "flex";
  showToast("Registration Confirmed! Pass Generated.");

  document.getElementById("regForm").reset();
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function openAdminModal() {
  document.getElementById("adminModal").style.display = "flex";
  switchAdminTab('add');
}

function switchAdminTab(tab) {
  const addForm = document.getElementById("addEventForm");
  const attendeesView = document.getElementById("attendeesSection");
  const addBtn = document.getElementById("tabAddBtn");
  const viewBtn = document.getElementById("tabViewBtn");

  if (tab === 'add') {
    addForm.style.display = "block";
    attendeesView.style.display = "none";
    addBtn.classList.add("active");
    viewBtn.classList.remove("active");
  } else {
    addForm.style.display = "none";
    attendeesView.style.display = "block";
    viewBtn.classList.add("active");
    addBtn.classList.remove("active");
    loadAttendeesTable();
  }
}

function handleCreateEvent(e) {
  e.preventDefault();

  const newEvent = {
    id: Date.now(),
    title: document.getElementById("newEventTitle").value,
    category: document.getElementById("newEventCategory").value,
    date: document.getElementById("newEventDate").value,
    venue: document.getElementById("newEventVenue").value,
    desc: document.getElementById("newEventDesc").value,
    banner: document.getElementById("newEventBanner").value || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80"
  };

  events.unshift(newEvent);
  localStorage.setItem("eventify_events", JSON.stringify(events));

  renderEvents(events);
  document.getElementById("addEventForm").reset();
  closeModal('adminModal');
  showToast("🎉 Event published successfully!");
}

function loadAttendeesTable() {
  const tbody = document.getElementById("attendeesTableBody");
  tbody.innerHTML = "";

  if (registrations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#94a3b8;">No registrations yet.</td></tr>`;
    return;
  }

  registrations.slice().reverse().forEach(reg => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${reg.eventName}</strong></td>
      <td>${reg.name}</td>
      <td>${reg.roll}</td>
    `;
    tbody.appendChild(tr);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 3000);
  }
}

function downloadPass() {
  window.print();
}
// Export Attendees to CSV (Excel format)
function exportAttendeesCSV() {
  if (registrations.length === 0) {
    alert("Koi registrations nahi hain download karne ke liye!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Event Name,Student Name,Roll Number,Email,Date\n";

  registrations.forEach(r => {
    csvContent += `"${r.eventName}","${r.name}","${r.roll}","${r.email}","${r.registeredAt}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Eventify_Attendees_List.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}