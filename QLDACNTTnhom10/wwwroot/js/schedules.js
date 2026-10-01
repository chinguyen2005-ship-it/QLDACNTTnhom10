/**
 * schedules.js - Logic & Mock Data for FitManage Class Timetable & Booking
 * Weekly Grid, Week Shift, Discipline Filtering, Booking Flow, Real-time Slot Updates
 */

// =============================================================================
// 1. MOCK DATA: LỊCH HỌC TUẦN (WEEKLY CLASS SLOTS)
// =============================================================================
let mockClasses = [
  // --- THỨ HAI (MON) ---
  {
    id: "cls-mon-01",
    day: "mon",
    shift: "morning",
    time: "07:00 - 08:00",
    name: "Vinyasa Flow Yoga",
    discipline: "Yoga Flow",
    studio: "Studio 01",
    trainer: "HLV Thu Trang",
    capacity: 7,
    maxCapacity: 15,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },
  {
    id: "cls-mon-02",
    day: "mon",
    shift: "morning",
    time: "09:30 - 10:30",
    name: "Pilates Reformer Core",
    discipline: "Pilates Reformer",
    studio: "Studio Pilates",
    trainer: "HLV Thu Trang",
    capacity: 5,
    maxCapacity: 6,
    waitlist: 0,
    colorScheme: "purple",
    icon: "fitness_center"
  },
  {
    id: "cls-mon-03",
    day: "mon",
    shift: "afternoon",
    time: "15:00 - 16:00",
    name: "Reformer Rehab Back",
    discipline: "Pilates Reformer",
    studio: "Studio Pilates",
    trainer: "HLV Thu Trang",
    capacity: 4,
    maxCapacity: 6,
    waitlist: 0,
    colorScheme: "purple",
    icon: "healing"
  },
  {
    id: "cls-mon-04",
    day: "mon",
    shift: "evening",
    time: "18:30 - 19:30",
    name: "Power Core HIIT 45m",
    discipline: "HIIT & Cardio",
    studio: "Studio GroupX",
    trainer: "HLV Minh Quân",
    capacity: 20,
    maxCapacity: 20,
    waitlist: 3,
    colorScheme: "rose",
    icon: "electric_bolt"
  },
  {
    id: "cls-mon-05",
    day: "mon",
    shift: "evening",
    time: "19:45 - 20:45",
    name: "Yin Yoga Thư Giãn Sâu",
    discipline: "Yoga Flow",
    studio: "Studio 01",
    trainer: "HLV Ngọc Anh",
    capacity: 17,
    maxCapacity: 18,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "bedtime"
  },

  // --- THỨ BA (TUE) ---
  {
    id: "cls-tue-01",
    day: "tue",
    shift: "morning",
    time: "06:30 - 07:30",
    name: "Ashtanga Morning Kick",
    discipline: "Yoga Flow",
    studio: "Studio 02",
    trainer: "HLV Hoàng Nam",
    capacity: 10,
    maxCapacity: 18,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },
  {
    id: "cls-tue-02",
    day: "tue",
    shift: "afternoon",
    time: "16:30 - 17:30",
    name: "Zumba Energy Blast",
    discipline: "Zumba Dance",
    studio: "Studio GroupX",
    trainer: "HLV Minh Quân",
    capacity: 14,
    maxCapacity: 25,
    waitlist: 0,
    colorScheme: "emerald",
    icon: "directions_run"
  },
  {
    id: "cls-tue-03",
    day: "tue",
    shift: "evening",
    time: "18:30 - 19:30",
    name: "Les Mills BodyCombat",
    discipline: "HIIT & Cardio",
    studio: "Studio GroupX",
    trainer: "HLV David Trần",
    capacity: 22,
    maxCapacity: 22,
    waitlist: 2,
    colorScheme: "red",
    icon: "sports_kabaddi"
  },

  // --- THỨ TƯ (WED) ---
  {
    id: "cls-wed-01",
    day: "wed",
    shift: "morning",
    time: "07:00 - 08:00",
    name: "BodyPump Strength",
    discipline: "BodyPump",
    studio: "Studio GroupX",
    trainer: "HLV David Trần",
    capacity: 19,
    maxCapacity: 20,
    waitlist: 0,
    colorScheme: "indigo",
    icon: "fitness_center"
  },
  {
    id: "cls-wed-02",
    day: "wed",
    shift: "evening",
    time: "19:00 - 20:00",
    name: "Vinyasa Sunset Flow",
    discipline: "Yoga Flow",
    studio: "Studio 02",
    trainer: "HLV Hoàng Nam",
    capacity: 11,
    maxCapacity: 18,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },

  // --- THỨ NĂM (THU) ---
  {
    id: "cls-thu-01",
    day: "thu",
    shift: "afternoon",
    time: "15:30 - 16:30",
    name: "Yoga Trị Liệu Vai Gáy",
    discipline: "Yoga Flow",
    studio: "Studio 01",
    trainer: "HLV Hoàng Nam",
    capacity: 13,
    maxCapacity: 15,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },
  {
    id: "cls-thu-02",
    day: "thu",
    shift: "evening",
    time: "18:30 - 19:30",
    name: "HIIT Tabata Fat Burn",
    discipline: "HIIT & Cardio",
    studio: "Studio GroupX",
    trainer: "HLV Minh Quân",
    capacity: 16,
    maxCapacity: 22,
    waitlist: 0,
    colorScheme: "orange",
    icon: "local_fire_department"
  },

  // --- THỨ SÁU (FRI) ---
  {
    id: "cls-fri-01",
    day: "fri",
    shift: "morning",
    time: "08:30 - 09:30",
    name: "Hatha Yoga Cơ Bản",
    discipline: "Yoga Flow",
    studio: "Studio 01",
    trainer: "HLV Ngọc Anh",
    capacity: 12,
    maxCapacity: 20,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },
  {
    id: "cls-fri-02",
    day: "fri",
    shift: "evening",
    time: "18:30 - 19:45",
    name: "Gentle Flow & Thiền",
    discipline: "Yoga Flow",
    studio: "Studio 01",
    trainer: "HLV Ngọc Anh",
    capacity: 14,
    maxCapacity: 20,
    waitlist: 0,
    colorScheme: "cyan",
    icon: "self_improvement"
  },

  // --- THỨ BẢY (SAT) ---
  {
    id: "cls-sat-01",
    day: "sat",
    shift: "morning",
    time: "08:00 - 09:00",
    name: "Pilates Foam Roller",
    discipline: "Pilates Reformer",
    studio: "Studio Pilates",
    trainer: "HLV Thu Trang",
    capacity: 6,
    maxCapacity: 6,
    waitlist: 1,
    colorScheme: "purple",
    icon: "fitness_center"
  },
  {
    id: "cls-sat-02",
    day: "sat",
    shift: "afternoon",
    time: "16:00 - 17:15",
    name: "Kickboxing Circuit",
    discipline: "HIIT & Cardio",
    studio: "Boxing Ring",
    trainer: "HLV Minh Quân",
    capacity: 18,
    maxCapacity: 20,
    waitlist: 0,
    colorScheme: "red",
    icon: "sports_mma"
  },

  // --- CHỦ NHẬT (SUN) ---
  {
    id: "cls-sun-01",
    day: "sun",
    shift: "morning",
    time: "09:00 - 10:15",
    name: "Sound Bath & Yin Yoga",
    discipline: "Yoga Flow",
    studio: "Studio VIP",
    trainer: "HLV Ngọc Anh",
    capacity: 15,
    maxCapacity: 15,
    waitlist: 4,
    colorScheme: "pink",
    icon: "spa"
  }
];

// =============================================================================
// 2. STATE & FILTERS
// =============================================================================
let activeDiscipline = "all"; // "all" | "Yoga Flow" | "BodyPump" | "Pilates Reformer" | "Zumba Dance" | "HIIT & Cardio"
let selectedStudio = "all";
let selectedTrainer = "all";
let currentWeekOffset = 0; // 0 = current week

const baseStartDate = new Date(2026, 9, 5); // 05/10/2026 (Monday)

function getWeekDateRange(offset = 0) {
  const start = new Date(baseStartDate);
  start.setDate(start.getDate() + offset * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const format = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  return `${format(start)} - ${format(end)}`;
}

// =============================================================================
// 3. RENDER TIMETABLE & FILTERING
// =============================================================================
function getFilteredClasses() {
  return mockClasses.filter(c => {
    // 1. Discipline Filter
    if (activeDiscipline !== "all" && c.discipline !== activeDiscipline) {
      return false;
    }

    // 2. Studio Filter
    if (selectedStudio !== "all" && !c.studio.toLowerCase().includes(selectedStudio.toLowerCase())) {
      return false;
    }

    // 3. Trainer Filter
    if (selectedTrainer !== "all" && !c.trainer.toLowerCase().includes(selectedTrainer.toLowerCase())) {
      return false;
    }

    return true;
  });
}

function renderTimetable() {
  const filtered = getFilteredClasses();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const shifts = ["morning", "afternoon", "evening"];

  shifts.forEach(shift => {
    days.forEach(day => {
      const cellId = `cell-${day}-${shift}`;
      const cellEl = document.getElementById(cellId);
      if (!cellEl) return;

      const slotClasses = filtered.filter(c => c.day === day && c.shift === shift);

      if (slotClasses.length === 0) {
        // Render Empty state cell
        cellEl.innerHTML = renderEmptyCell(day, shift);
      } else {
        // Render class slot cards
        cellEl.innerHTML = `
          <div class="flex flex-col gap-2">
            ${slotClasses.map(c => renderClassCard(c)).join("")}
          </div>
        `;
      }
    });
  });

  updateScheduleKpis();
}

function renderClassCard(c) {
  const isFull = c.capacity >= c.maxCapacity;
  const isAlmostFull = !isFull && c.capacity >= Math.floor(c.maxCapacity * 0.8);

  // Border Color
  let borderBorder = "border-l-cyan-500";
  let timeTextColor = "text-cyan-700";
  let iconColor = "text-cyan-600";

  if (c.colorScheme === "purple" || c.discipline.includes("Pilates")) {
    borderBorder = "border-l-purple-600";
    timeTextColor = "text-purple-700";
    iconColor = "text-purple-600";
  } else if (c.colorScheme === "indigo" || c.discipline.includes("BodyPump")) {
    borderBorder = "border-l-indigo-600";
    timeTextColor = "text-indigo-700";
    iconColor = "text-indigo-600";
  } else if (c.colorScheme === "emerald" || c.discipline.includes("Zumba")) {
    borderBorder = "border-l-emerald-500";
    timeTextColor = "text-emerald-700";
    iconColor = "text-emerald-600";
  } else if (c.colorScheme === "rose" || c.colorScheme === "orange" || c.discipline.includes("HIIT")) {
    borderBorder = "border-l-rose-500";
    timeTextColor = "text-rose-700";
    iconColor = "text-rose-600";
  } else if (c.colorScheme === "pink") {
    borderBorder = "border-l-pink-500";
    timeTextColor = "text-pink-700";
    iconColor = "text-pink-600";
  }

  // Capacity Badge
  let badgeHtml = "";
  if (isFull) {
    badgeHtml = `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> ${c.capacity}/${c.maxCapacity} chỗ (Đầy${c.waitlist > 0 ? ` · Chờ: ${c.waitlist}` : ''})
      </span>
    `;
  } else if (isAlmostFull) {
    badgeHtml = `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> ${c.capacity}/${c.maxCapacity} chỗ (Sắp đầy)
      </span>
    `;
  } else {
    badgeHtml = `
      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm font-semibold">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${c.capacity}/${c.maxCapacity} chỗ (Còn trống)
      </span>
    `;
  }

  return `
    <div class="class-slot-card group relative p-2.5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${borderBorder}"
         onclick="openBookingModal('${c.id}')">
      <div class="flex items-center justify-between text-secondary">
        <span class="font-label-sm text-label-sm font-bold ${timeTextColor}">${c.time}</span>
        <span class="material-symbols-outlined text-[16px] ${iconColor}">${c.icon}</span>
      </div>
      <div class="font-title-md text-title-md font-bold text-on-surface mt-1 group-hover:text-primary transition-colors truncate">
        ${c.name}
      </div>
      <div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm mt-1 truncate">
        <span class="material-symbols-outlined text-[14px]">meeting_room</span> ${c.studio}
        <span>•</span>
        <span class="truncate">${c.trainer}</span>
      </div>
      <div class="mt-2 flex items-center justify-between gap-1">
        ${badgeHtml}
        <button class="opacity-0 group-hover:opacity-100 p-1 rounded bg-[#0B2238] text-white hover:bg-primary transition-all shrink-0" title="Đặt chỗ lớp này">
          <span class="material-symbols-outlined text-[14px]">bookmark_add</span>
        </button>
      </div>
    </div>
  `;
}

function renderEmptyCell(day, shift) {
  if (day === "sun" && shift === "evening") {
    return `
      <div class="h-24 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant flex items-center justify-center text-outline font-label-sm text-label-sm text-center p-2">
        Nghỉ Chủ Nhật
      </div>
    `;
  }
  if (day === "sat" && shift === "evening") {
    return `
      <div class="h-24 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant flex items-center justify-center text-outline font-label-sm text-label-sm text-center p-2">
        Đóng cửa vệ sinh UV
      </div>
    `;
  }
  if (day === "thu" && shift === "morning") {
    return `
      <div class="h-24 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant flex flex-col items-center justify-center text-center p-2 text-secondary">
        <span class="material-symbols-outlined text-[18px] opacity-40">build_circle</span>
        <span class="font-label-sm text-label-sm text-outline mt-0.5">Bảo dưỡng Studio</span>
      </div>
    `;
  }
  if (day === "fri" && shift === "afternoon") {
    return `
      <div class="h-24 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant flex items-center justify-center text-outline font-label-sm text-label-sm text-center p-2">
        Workshop HLV Nội Bộ
      </div>
    `;
  }
  return `
    <div class="h-24 rounded-xl bg-surface-container-low/30 border border-dashed border-outline-variant flex items-center justify-center text-outline font-label-sm text-label-sm text-center p-2">
      Trống khung giờ
    </div>
  `;
}

function updateScheduleKpis() {
  const totalClasses = mockClasses.length;
  let totalBooked = 0;
  let totalMax = 0;
  let fullClassesCount = 0;

  mockClasses.forEach(c => {
    totalBooked += c.capacity;
    totalMax += c.maxCapacity;
    if (c.capacity >= c.maxCapacity) fullClassesCount++;
  });

  const rate = totalMax > 0 ? ((totalBooked / totalMax) * 100).toFixed(1) : 0;

  const kpiTotal = document.getElementById("kpiTotalClasses");
  const kpiRate = document.getElementById("kpiFillRate");
  const kpiFull = document.getElementById("kpiFullClasses");

  if (kpiTotal) kpiTotal.innerText = totalClasses;
  if (kpiRate) kpiRate.innerText = `${rate}%`;
  if (kpiFull) kpiFull.innerText = fullClassesCount;
}

// =============================================================================
// 4. WEEK NAVIGATION
// =============================================================================
function shiftWeek(direction) {
  currentWeekOffset += direction;
  const weekLabel = document.getElementById("currentWeekLabel");
  if (weekLabel) {
    weekLabel.innerText = `Tuần: ${getWeekDateRange(currentWeekOffset)}`;
  }
  renderTimetable();
}

function resetToToday() {
  currentWeekOffset = 0;
  const weekLabel = document.getElementById("currentWeekLabel");
  if (weekLabel) {
    weekLabel.innerText = `Tuần này: ${getWeekDateRange(0)}`;
  }
  renderTimetable();
}

// =============================================================================
// 5. BOOKING MODAL & INTERACTION
// =============================================================================
let currentBookingClassId = null;

function openBookingModal(classId) {
  const classItem = mockClasses.find(c => c.id === classId);
  if (!classItem) return;
  currentBookingClassId = classId;

  const modal = document.getElementById("bookingModal");
  const box = document.getElementById("modalBox");
  if (!modal || !box) return;

  const remaining = classItem.maxCapacity - classItem.capacity;
  const isFull = remaining <= 0;

  document.getElementById("modalClassTitle").innerText = `Đặt chỗ lớp: ${classItem.name}`;
  document.getElementById("modalClassTime").innerText = `${classItem.time} · ${classItem.discipline}`;
  document.getElementById("modalStudio").innerText = classItem.studio;
  document.getElementById("modalTrainer").innerText = classItem.trainer;

  const capEl = document.getElementById("modalCapacity");
  if (capEl) {
    if (isFull) {
      capEl.innerText = `Đã đầy (${classItem.capacity}/${classItem.maxCapacity}) · Đăng ký Waitlist`;
      capEl.className = "flex items-center gap-1.5 text-amber-600 font-bold";
    } else {
      capEl.innerText = `Còn ${remaining}/${classItem.maxCapacity} chỗ trống`;
      capEl.className = "flex items-center gap-1.5 text-emerald-700 font-bold";
    }
  }

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  box.classList.remove("scale-95");
  box.classList.add("scale-100");
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  const box = document.getElementById("modalBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.remove("scale-100");
  box.classList.add("scale-95");
}

function confirmBooking() {
  const classItem = mockClasses.find(c => c.id === currentBookingClassId);
  const memberSearchInput = document.getElementById("modalMemberSearch");
  const memberName = memberSearchInput && memberSearchInput.value ? memberSearchInput.value : "Sarah Mitchel";

  if (classItem) {
    if (classItem.capacity < classItem.maxCapacity) {
      classItem.capacity += 1;
      showToast("Đặt chỗ thành công!", `Đã xác nhận chỗ lớp ${classItem.name} (${classItem.time}) cho hội viên ${memberName}!`, "success");
    } else {
      classItem.waitlist += 1;
      showToast("Thêm vào Waitlist!", `Lớp đã đầy. Đã ghi nhận ${memberName} vào danh sách chờ vị trí #${classItem.waitlist}!`, "info");
    }
    renderTimetable();
  }

  closeBookingModal();
}

// =============================================================================
// 6. CREATE CLASS MODAL (+ Mở lớp mới)
// =============================================================================
function openCreateClassModal() {
  const modal = document.getElementById("createClassModal");
  const box = document.getElementById("createClassBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  box.classList.remove("scale-95");
  box.classList.add("scale-100");
}

function closeCreateClassModal() {
  const modal = document.getElementById("createClassModal");
  const box = document.getElementById("createClassBox");
  if (!modal || !box) return;

  modal.classList.remove("opacity-100");
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.remove("scale-100");
  box.classList.add("scale-95");
}

function handleSaveNewClass(event) {
  event.preventDefault();
  const name = document.getElementById("newClassName")?.value || "Lớp Tập Mới";
  const discipline = document.getElementById("newClassDiscipline")?.value || "Yoga Flow";
  const day = document.getElementById("newClassDay")?.value || "mon";
  const shift = document.getElementById("newClassShift")?.value || "morning";
  const time = document.getElementById("newClassTime")?.value || "08:00 - 09:00";
  const studio = document.getElementById("newClassStudio")?.value || "Studio 01";
  const trainer = document.getElementById("newClassTrainer")?.value || "HLV Thu Trang";
  const maxCap = parseInt(document.getElementById("newClassCapacity")?.value || "15", 10);

  const newId = `cls-${day}-${Date.now().toString().slice(-4)}`;
  const newClass = {
    id: newId,
    day: day,
    shift: shift,
    time: time,
    name: name,
    discipline: discipline,
    studio: studio,
    trainer: trainer,
    capacity: 0,
    maxCapacity: maxCap,
    waitlist: 0,
    colorScheme: discipline.includes("Pilates") ? "purple" : discipline.includes("BodyPump") ? "indigo" : "cyan",
    icon: discipline.includes("Pilates") ? "fitness_center" : "self_improvement"
  };

  mockClasses.push(newClass);
  renderTimetable();
  closeCreateClassModal();
  showToast("Mở lớp thành công!", `Đã thêm ca lớp "${name}" vào thời khóa biểu ngày ${day.toUpperCase()}.`, "success");
}

// =============================================================================
// 7. AI RECOMMENDER TOAST
// =============================================================================
function triggerAiRecommendation() {
  const aiToast = document.getElementById("aiToast");
  if (!aiToast) return;

  aiToast.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
  aiToast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    hideAiToast();
  }, 6000);
}

function hideAiToast() {
  const aiToast = document.getElementById("aiToast");
  if (aiToast) {
    aiToast.classList.remove("translate-y-0", "opacity-100");
    aiToast.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
  }
}

// =============================================================================
// 8. GLOBAL TOAST HELPER
// =============================================================================
function showToast(title, message, type = "success") {
  const toast = document.getElementById("appToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastMessage = document.getElementById("toastMessage");
  const toastIcon = document.getElementById("toastIcon");

  if (!toast || !toastTitle || !toastMessage) return;

  toastTitle.innerText = title;
  toastMessage.innerText = message;
  if (toastIcon) {
    toastIcon.innerText = type === "info" ? "info" : "check_circle";
  }

  toast.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    hideToast();
  }, 4500);
}

function hideToast() {
  const toast = document.getElementById("appToast");
  if (toast) {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
  }
}

// =============================================================================
// 9. EVENT LISTENERS INITIALIZATION
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderTimetable();

  // Discipline Filter Pills
  const pillButtons = document.querySelectorAll(".filter-pill");
  pillButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      pillButtons.forEach(b => {
        b.classList.remove("bg-[#0B2238]", "text-white", "font-bold");
        b.classList.add("bg-surface-container-low", "text-on-surface-variant");
      });
      btn.classList.remove("bg-surface-container-low", "text-on-surface-variant");
      btn.classList.add("bg-[#0B2238]", "text-white", "font-bold");

      activeDiscipline = btn.getAttribute("data-discipline") || "all";
      renderTimetable();
    });
  });

  // Studio Filter
  const studioSelect = document.getElementById("filterStudio");
  if (studioSelect) {
    studioSelect.addEventListener("change", (e) => {
      selectedStudio = e.target.value;
      renderTimetable();
    });
  }

  // Trainer Filter
  const trainerSelect = document.getElementById("filterTrainer");
  if (trainerSelect) {
    trainerSelect.addEventListener("change", (e) => {
      selectedTrainer = e.target.value;
      renderTimetable();
    });
  }

  // AI Recommender Button
  const btnAi = document.getElementById("btnAiRecommend");
  if (btnAi) {
    btnAi.addEventListener("click", triggerAiRecommendation);
  }
});

function handleNavFeature(name) {
  showToast(name, `Tính năng "${name}" đang được kết nối với module hệ thống trong phiên bản kế tiếp.`, "info");
}
