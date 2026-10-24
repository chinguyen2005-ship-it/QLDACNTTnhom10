// ==========================================================================
// class-booking.js - Xử lý logic Đăng ký lớp tập cho hội viên
// FitManage GYM & YOGA SUITE
// ==========================================================================

// 1. DỮ LIỆU MOCK HỘI VIÊN (MOCK MEMBERS)
const mockMembers = [
  {
    id: "HV-9021",
    name: "Sarah Mitchell",
    vip: "★ VIP Diamond",
    vipClass: "bg-primary-fixed text-on-primary-fixed",
    package: "Yoga Unlimited VIP · Chi nhánh Trung Sơn",
    phone: "081-234-5678",
    email: "sarah.mitchell@fitmanage.vn",
    rfid: "#8892-004-912",
    daysLeft: 32,
    sessionsLeft: 15,
    parQ: true,
    attendance: "4 buổi/tuần",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    allowedDisciplines: ["all"],
    notes: "Hội viên có chấn thương nhẹ ở cổ chân trái (khởi động kỹ trước ca tập)."
  },
  {
    id: "HV-8812",
    name: "Trần Hoàng Nam",
    vip: "★ Gold Member",
    vipClass: "bg-amber-100 text-amber-900 border border-amber-300",
    package: "Gym & Cardio Full-Time · Landmark 81",
    phone: "090-888-1234",
    email: "nam.tran@fitmanage.vn",
    rfid: "#8812-441-209",
    daysLeft: 60,
    sessionsLeft: 24,
    parQ: true,
    attendance: "3 buổi/tuần",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    allowedDisciplines: ["Cardio HIIT", "Zumba Dance", "Pilates Reformer"],
    notes: "Mục tiêu giảm mỡ bụng, tăng sức bền tim mạch. Tránh gánh tạ quá nặng vùng khớp gối."
  },
  {
    id: "HV-7540",
    name: "Lê Thảo Linh",
    vip: "Silver Member",
    vipClass: "bg-slate-200 text-slate-800",
    package: "Pilates & Yoga 10 Buổi · Quận 1",
    phone: "093-456-7890",
    email: "thaolinh.le@fitmanage.vn",
    rfid: "#7540-112-984",
    daysLeft: 14,
    sessionsLeft: 3,
    parQ: true,
    attendance: "2 buổi/tuần",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    allowedDisciplines: ["Hatha Yoga", "Vinyasa Flow", "Pilates Reformer", "Sound Healing"],
    notes: "Người mới bắt đầu (cần HLV hướng dẫn kỹ thuật thở và giữ thăng bằng)."
  },
  {
    id: "HV-6209",
    name: "Vũ Quốc Bảo",
    vip: "Standard Gym",
    vipClass: "bg-surface-container text-secondary",
    package: "Gym Cơ Bản Không Lớp · Landmark 81",
    phone: "098-765-4321",
    email: "bao.vu@fitmanage.vn",
    rfid: "#6209-556-331",
    daysLeft: 90,
    sessionsLeft: 0,
    parQ: false,
    attendance: "1 buổi/tuần",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    allowedDisciplines: [],
    notes: "Chưa kích hoạt gói lớp nhóm. Đặt chỗ sẽ tính phí vé lẻ 150.000 đ/buổi."
  }
];

// 2. DÃY 7 NGÀY (HORIZONTAL DATE STRIP)
const mockDays = [
  { date: "2026-09-30", label: "Thứ 4", dayNum: "30", monthYear: "09/2026", isToday: false },
  { date: "2026-10-01", label: "Thứ 5", dayNum: "01", monthYear: "10/2026", isToday: true },
  { date: "2026-10-02", label: "Thứ 6", dayNum: "02", monthYear: "10/2026", isToday: false },
  { date: "2026-10-03", label: "Thứ 7", dayNum: "03", monthYear: "10/2026", isToday: false },
  { date: "2026-10-04", label: "Chủ nhật", dayNum: "04", monthYear: "10/2026", isToday: false },
  { date: "2026-10-05", label: "Thứ 2", dayNum: "05", monthYear: "10/2026", isToday: false },
  { date: "2026-10-06", label: "Thứ 3", dayNum: "06", monthYear: "10/2026", isToday: false }
];

// 3. DANH SÁCH BỘ MÔN (CATEGORY CHIPS)
const mockCategories = [
  { name: "Tất cả bộ môn", count: 6 },
  { name: "Hatha Yoga", count: 1 },
  { name: "Vinyasa Flow", count: 1 },
  { name: "Pilates Reformer", count: 1 },
  { name: "Cardio HIIT", count: 1 },
  { name: "Zumba Dance", count: 1 },
  { name: "Sound Healing", count: 1 }
];

// 4. DANH SÁCH CA HỌC MẪU (MOCK CLASSES)
let mockClasses = [
  {
    id: "CLS-101",
    title: "Vinyasa Flow Detox & Vitality",
    category: "Vinyasa Flow",
    time: "07:00 - 08:15",
    duration: "75 phút",
    shift: "SÁNG",
    shiftBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    room: "Yoga Studio 01 · Tầng 2",
    description: "Tập trung nhịp thở chuyển động, kéo giãn cơ sâu và đào thải độc tố cơ thể buổi sáng sớm.",
    trainer: {
      name: "HLV Thu Trang",
      rating: 4.9,
      reviews: 128,
      cert: "Master Yoga Alliance 500h",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 15,
    booked: 6, // 9/15 chỗ trống (Còn nhiều chỗ)
    amenities: "Miễn phí nước Detox · Thảm Lululemon có sẵn",
    matDefault: "Vị trí #08 (Cạnh cửa sổ)",
    date: "2026-10-01",
    timeUntil: "Sau 14 tiếng 15 phút"
  },
  {
    id: "CLS-102",
    title: "Core Power Pilates Reformer",
    category: "Pilates Reformer",
    time: "17:30 - 18:30",
    duration: "60 phút",
    shift: "CHIỀU",
    shiftBg: "bg-secondary-fixed text-on-secondary-fixed",
    room: "Studio Pilates Reformer · Tầng 3",
    description: "Kích hoạt nhóm cơ cốt lõi, thon gọn vùng bụng và cải thiện tư thế chuẩn trên máy Reformer Allegro 2.",
    trainer: {
      name: "HLV Minh Đức",
      rating: 4.85,
      reviews: 94,
      cert: "Senior Pilates PT",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 15,
    booked: 14, // 1/15 chỗ trống (Sắp đầy)
    amenities: "Trang bị vớ chống trượt · Đo InBody miễn phí trước buổi tập",
    matDefault: "Máy Reformer #03",
    date: "2026-10-01",
    timeUntil: "Sau 24 tiếng 30 phút"
  },
  {
    id: "CLS-103",
    title: "HIIT Burn & Sweat Fat Loss",
    category: "Cardio HIIT",
    time: "19:00 - 20:00",
    duration: "60 phút",
    shift: "TỐI",
    shiftBg: "bg-surface-container text-secondary",
    room: "Khu Gym Main Stage · Tầng 1",
    description: "Bài tập ngắt quãng cường độ cao tiêu hao 600-800 calo với tạ chuông Kettlebell và dây Battle Rope.",
    trainer: {
      name: "HLV Quốc Huy",
      rating: 4.9,
      reviews: 210,
      cert: "Elite Bodybuilding",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 15,
    booked: 15, // Đã đầy 100%
    waitlistCount: 3,
    amenities: "Kèm đo nhịp tim Myzone · Nước điện giải Isotonic",
    matDefault: "Khu vực bục tập A",
    date: "2026-10-01",
    timeUntil: "Sau 26 tiếng"
  },
  {
    id: "CLS-104",
    title: "Hatha Yoga Gentle Alignment",
    category: "Hatha Yoga",
    time: "08:30 - 09:30",
    duration: "60 phút",
    shift: "SÁNG",
    shiftBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    room: "Yoga Studio 02 · Tầng 2",
    description: "Căn chỉnh cột sống chuẩn xác, giảm căng thẳng thắt lưng và tăng tính dẻo dai cho cơ thể.",
    trainer: {
      name: "HLV Sarah Mai",
      rating: 4.95,
      reviews: 142,
      cert: "YACEP Yoga Therapist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 18,
    booked: 10, // 8/18 chỗ trống
    amenities: "Dụng cụ gạch Yoga Block & Dây kháng lực cao cấp",
    matDefault: "Vị trí #02",
    date: "2026-10-01",
    timeUntil: "Sau 15 tiếng 30 phút"
  },
  {
    id: "CLS-105",
    title: "Zumba Dance Energy Carnival",
    category: "Zumba Dance",
    time: "18:00 - 19:00",
    duration: "60 phút",
    shift: "CHIỀU",
    shiftBg: "bg-secondary-fixed text-on-secondary-fixed",
    room: "Dance Studio Vibrant · Tầng 4",
    description: "Hòa mình vào vũ điệu Latinh sôi động, giải phóng năng lượng và đốt mỡ toàn thân tự nhiên.",
    trainer: {
      name: "HLV Carlos Minh",
      rating: 4.88,
      reviews: 186,
      cert: "Zumba International Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 25,
    booked: 18, // 7/25 chỗ trống
    amenities: "Hệ thống âm thanh vòm JBL Pro & Khăn lạnh miễn phí",
    matDefault: "Vị trí tự do trên sàn",
    date: "2026-10-01",
    timeUntil: "Sau 25 tiếng"
  },
  {
    id: "CLS-106",
    title: "Sound Healing & Tibetan Singing Bowls",
    category: "Sound Healing",
    time: "20:15 - 21:15",
    duration: "60 phút",
    shift: "TỐI",
    shiftBg: "bg-surface-container text-secondary",
    room: "Zen Sanctuary · Tầng 5",
    description: "Thư giãn sâu bằng tần số chuông xoay Tây Tạng, chữa lành giấc ngủ và tái tạo trạng thái an yên.",
    trainer: {
      name: "HLV Tuệ Lâm",
      rating: 4.98,
      reviews: 75,
      cert: "Himalayan Sound Healer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
    },
    capacity: 12,
    booked: 11, // 1/12 chỗ trống
    amenities: "Tinh dầu Oải hương hữu cơ · Mắt kính che thảo mộc",
    matDefault: "Đệm thiền #05",
    date: "2026-10-01",
    timeUntil: "Sau 27 tiếng 15 phút"
  }
];

// STATE TOÀN CỤC CỦA TRANG
let currentSelectedMember = mockMembers[0]; // Sarah Mitchell
let currentSelectedDate = "2026-10-01";     // Thứ 5, 01/10
let currentSelectedCategory = "Tất cả bộ môn";
let currentSelectedClassId = "CLS-101";     // Vinyasa Flow

// ==========================================================================
// 5. KHỞI TẠO KHI TẢI TRANG (INIT)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  renderMemberProfile(currentSelectedMember);
  renderDateStrip();
  renderCategoryChips();
  renderClasses(currentSelectedDate, currentSelectedCategory);
  updateStickySummaryPanel(currentSelectedClassId);
  initMemberSearchAutocomplete();
  startHoldTimer();
});

// ==========================================================================
// 6. RENDER DÃY NGÀY (HORIZONTAL DATE STRIP)
// ==========================================================================
function renderDateStrip() {
  const container = document.getElementById("dateStripContainer");
  if (!container) return;

  container.innerHTML = mockDays.map(day => {
    const isActive = day.date === currentSelectedDate;
    if (isActive) {
      return `
        <button type="button" onclick="selectDate('${day.date}')"
          class="date-picker-btn active-date flex flex-col items-center justify-center p-2.5 rounded-lg text-center relative overflow-hidden">
          <span class="text-[11px] font-semibold text-[#4cd7f6]">${day.isToday ? 'Hôm nay' : day.label}</span>
          <span class="text-3xl font-bold leading-none my-0.5">${day.dayNum}</span>
          <div class="flex items-center gap-1 text-[11px] text-slate-300">
            <span class="w-1.5 h-1.5 rounded-full bg-[#4cd7f6] animate-pulse"></span>
            <span>${day.label}</span>
          </div>
        </button>
      `;
    } else {
      return `
        <button type="button" onclick="selectDate('${day.date}')"
          class="date-picker-btn flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-low hover:bg-slate-200 text-center transition-all group">
          <span class="text-[11px] text-secondary group-hover:text-on-surface">${day.label}</span>
          <span class="text-base text-on-surface font-semibold mt-0.5">${day.dayNum}</span>
          <span class="text-[11px] text-slate-400 mt-0.5">${day.monthYear}</span>
        </button>
      `;
    }
  }).join("");
}

function selectDate(dateStr) {
  currentSelectedDate = dateStr;
  renderDateStrip();
  renderClasses(currentSelectedDate, currentSelectedCategory);
  showToast(`Đã chuyển lịch sang ngày ${dateStr}`, 'info');
}

// ==========================================================================
// 7. RENDER CATEGORY CHIPS
// ==========================================================================
function renderCategoryChips() {
  const container = document.getElementById("categoryChipsContainer");
  if (!container) return;

  container.innerHTML = mockCategories.map(cat => {
    const isActive = cat.name === currentSelectedCategory;
    const activeClass = isActive 
      ? "active-chip bg-[#0B2238] text-white shadow-sm" 
      : "bg-surface-container-lowest text-secondary hover:bg-slate-200";
    
    return `
      <button type="button" onclick="selectCategory('${cat.name}')"
        class="filter-chip px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-xs transition-colors ${activeClass}">
        ${cat.name} (${cat.count})
      </button>
    `;
  }).join("");
}

function selectCategory(categoryName) {
  currentSelectedCategory = categoryName;
  renderCategoryChips();
  renderClasses(currentSelectedDate, currentSelectedCategory);
}

// ==========================================================================
// 8. RENDER DANH SÁCH CA HỌC (CLASS CARDS STACK)
// ==========================================================================
function renderClasses(filterDate, filterCategory) {
  const container = document.getElementById("classListContainer");
  if (!container) return;

  let filtered = mockClasses;
  if (filterCategory && filterCategory !== "Tất cả bộ môn") {
    filtered = filtered.filter(c => c.category === filterCategory);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-surface-container-lowest rounded-xl p-8 text-center text-secondary border border-outline-variant/30">
        <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
        <p class="font-semibold text-base text-on-surface">Không tìm thấy ca học phù hợp</p>
        <p class="text-xs text-slate-500 mt-1">Vui lòng chọn bộ môn hoặc ngày khác trên thanh điều hướng.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(cls => {
    const isSelected = cls.id === currentSelectedClassId;
    const isFull = cls.booked >= cls.capacity;
    const isAlmostFull = !isFull && (cls.capacity - cls.booked <= 2);
    const capacityPercent = Math.min(100, Math.round((cls.booked / cls.capacity) * 100));

    // Badge sĩ số
    let capacityBadgeHtml = '';
    let progressBarClass = 'bg-emerald-500';
    if (isFull) {
      capacityBadgeHtml = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          ${cls.booked}/${cls.capacity} chỗ (Hết chỗ · ${cls.waitlistCount || 2} khách chờ)
        </span>
      `;
      progressBarClass = 'bg-red-500';
    } else if (isAlmostFull) {
      capacityBadgeHtml = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          ${cls.booked}/${cls.capacity} chỗ (Sắp đầy - Còn ${cls.capacity - cls.booked} chỗ)
        </span>
      `;
      progressBarClass = 'bg-amber-500';
    } else {
      capacityBadgeHtml = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          ${cls.capacity - cls.booked}/${cls.capacity} chỗ trống (Còn nhiều chỗ)
        </span>
      `;
      progressBarClass = 'bg-emerald-500';
    }

    // Nút hành động
    let actionBtnHtml = '';
    if (isSelected) {
      actionBtnHtml = `
        <div class="flex flex-col items-end justify-between self-stretch shrink-0 pt-2 md:pt-0">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3 shadow-xs">
            Đang chọn cho ${currentSelectedMember.name.split(' ')[0]}
          </span>
          <button type="button" class="w-full md:w-auto px-5 py-2.5 rounded-lg bg-[#0B2238] text-white text-sm font-bold shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-[#4cd7f6]">check_circle</span>
            <span>Chọn lớp này ✓</span>
          </button>
        </div>
      `;
    } else if (isFull) {
      actionBtnHtml = `
        <div class="flex flex-col items-end justify-end self-stretch shrink-0 pt-2 md:pt-0">
          <button type="button" onclick="selectClass('${cls.id}')"
            class="w-full md:w-auto px-4 py-2.5 rounded-lg bg-surface-container-lowest text-[#7C3AED] hover:bg-purple-50 border border-purple-200 text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">bolt</span>
            <span>Đăng ký hàng chờ (Waitlist)</span>
          </button>
        </div>
      `;
    } else {
      actionBtnHtml = `
        <div class="flex flex-col items-end justify-end self-stretch shrink-0 pt-2 md:pt-0">
          <button type="button" onclick="selectClass('${cls.id}')"
            class="w-full md:w-auto px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5">
            <span>Chọn lớp</span>
          </button>
        </div>
      `;
    }

    return `
      <article class="class-card bg-surface-container-lowest rounded-xl p-5 shadow-sm transition-all ${isSelected ? 'selected-card' : ''}">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div class="flex flex-col gap-2 flex-1">
            <!-- Time & Meta Header -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 text-base text-[#0B2238] font-bold">
                <span class="material-symbols-outlined text-[18px] text-teal-600">schedule</span>
                ${cls.time}
              </span>
              <span class="px-2 py-0.5 rounded text-xs bg-surface-container text-secondary font-medium">
                ${cls.duration}
              </span>
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${cls.shiftBg}">
                ${cls.shift}
              </span>
              <span class="inline-flex items-center gap-1 text-xs text-teal-700 font-medium">
                <span class="material-symbols-outlined text-[16px]">location_on</span>
                ${cls.room}
              </span>
            </div>

            <!-- Class Title & Desc -->
            <div>
              <h4 class="text-lg text-on-surface font-bold tracking-tight">${cls.title}</h4>
              <p class="text-xs text-secondary mt-0.5 line-clamp-2">${cls.description}</p>
            </div>

            <!-- Trainer info & tag -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <div class="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  <img class="w-full h-full object-cover" src="${cls.trainer.avatar}" alt="${cls.trainer.name}"/>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-on-surface font-semibold leading-tight">${cls.trainer.name}</span>
                  <div class="flex items-center gap-1 text-[11px] text-secondary">
                    <span class="text-amber-600 font-bold">★ ${cls.trainer.rating}</span>
                    <span>(${cls.trainer.reviews} đánh giá)</span>
                  </div>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded text-xs bg-surface-container text-primary-container font-semibold">
                ${cls.trainer.cert}
              </span>
            </div>

            <!-- Capacity & Progress Bar -->
            <div class="flex flex-col gap-1.5 pt-1.5 max-w-md">
              <div class="flex items-center justify-between text-xs">
                ${capacityBadgeHtml}
                <span class="text-secondary font-medium">${capacityPercent}% công suất</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full ${progressBarClass} rounded-full transition-all duration-300" style="width: ${capacityPercent}%;"></div>
              </div>
            </div>

            <!-- Amenities badge line -->
            <div class="flex items-center gap-2 pt-1 text-xs text-secondary">
              <span class="material-symbols-outlined text-[16px] text-teal-600">spa</span>
              <span>${cls.amenities}</span>
            </div>
          </div>

          <!-- Action button -->
          ${actionBtnHtml}
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================================================
// 9. CHỌN CA HỌC (SELECT CLASS)
// ==========================================================================
function selectClass(classId) {
  currentSelectedClassId = classId;
  renderClasses(currentSelectedDate, currentSelectedCategory);
  updateStickySummaryPanel(classId);

  const targetClass = mockClasses.find(c => c.id === classId);
  if (targetClass) {
    showToast(`Đã chọn ca học: ${targetClass.title}`, 'info');
  }
}

// ==========================================================================
// 10. CẬP NHẬT STICKY SUMMARY PANEL (BÊN PHẢI)
// ==========================================================================
function updateStickySummaryPanel(classId) {
  const targetClass = mockClasses.find(c => c.id === classId) || mockClasses[0];
  if (!targetClass) return;

  const isFull = targetClass.booked >= targetClass.capacity;
  
  // 1. Tên lớp & Thời gian
  const summaryTitleEl = document.getElementById("summaryClassTitle");
  const summaryStudioEl = document.getElementById("summaryStudioTag");
  const summaryDateTimeEl = document.getElementById("summaryDateTime");
  const summarySpotEl = document.getElementById("summarySpotText");
  const summaryTrainerEl = document.getElementById("summaryTrainerName");
  const summaryTimeUntilEl = document.getElementById("summaryTimeUntil");

  if (summaryTitleEl) summaryTitleEl.textContent = targetClass.title;
  if (summaryStudioEl) summaryStudioEl.textContent = targetClass.room.split('·')[0].trim();
  if (summaryDateTimeEl) summaryDateTimeEl.textContent = `${targetClass.time} · Thứ Năm, 01/10/2026`;
  if (summarySpotEl) summarySpotEl.textContent = targetClass.matDefault;
  if (summaryTrainerEl) summaryTrainerEl.textContent = `${targetClass.trainer.name} (${targetClass.trainer.cert.split(' ')[0]})`;
  if (summaryTimeUntilEl) summaryTimeUntilEl.textContent = targetClass.timeUntil || "Sau 14 tiếng";

  // 2. Validate Quyền lợi Gói tập
  const validationBox = document.getElementById("packageValidationBox");
  const actionBtn = document.getElementById("confirmBookingBtn");

  const isAllowed = currentSelectedMember.allowedDisciplines.includes('all') ||
                    currentSelectedMember.allowedDisciplines.includes(targetClass.category);

  if (validationBox) {
    if (!isAllowed) {
      validationBox.className = "bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-900";
      validationBox.innerHTML = `
        <span class="material-symbols-outlined text-amber-600 text-[22px] shrink-0 mt-0.5">warning</span>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-amber-900">Gói tập yêu cầu nâng cấp / phụ phí</span>
          <p class="text-xs text-amber-800 leading-snug">
            Gói <strong>${currentSelectedMember.package}</strong> không bao gồm lớp nhóm này. Đặt chỗ sẽ phát sinh vé lẻ <strong>150.000 đ/buổi</strong>.
          </p>
        </div>
      `;
    } else {
      validationBox.className = "bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3 text-emerald-900";
      validationBox.innerHTML = `
        <span class="material-symbols-outlined text-emerald-600 text-[22px] shrink-0 mt-0.5">check_circle</span>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-bold text-emerald-900">Hợp lệ &amp; Đủ điều kiện tham gia</span>
          <p class="text-xs text-emerald-800 leading-snug">
            Gói <strong>${currentSelectedMember.package}</strong> của hội viên ${currentSelectedMember.name} được miễn phí 100% ca học này. Không trừ điểm/vé phát sinh.
          </p>
        </div>
      `;
    }
  }

  // 3. Đổi trạng thái Nút xác nhận nếu Lớp Đã Đầy
  if (actionBtn) {
    if (isFull) {
      actionBtn.className = "w-full py-3.5 rounded-lg bg-[#7C3AED] hover:bg-purple-700 text-white text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98";
      actionBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px]">bolt</span>
        <span>⚡ Ghi danh vào hàng chờ (Waitlist)</span>
      `;
    } else {
      actionBtn.className = "w-full py-3.5 rounded-lg bg-[#0B2238] hover:bg-slate-800 text-white text-base font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98";
      actionBtn.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-[#4cd7f6]">how_to_reg</span>
        <span>✓ Xác nhận đặt chỗ ngay</span>
      `;
    }
  }
}

// ==========================================================================
// 11. XỬ LÝ ĐẶT CHỖ HOẶC VÀO HÀNG CHỜ (CONFIRM BOOKING)
// ==========================================================================
function confirmBooking() {
  const targetClass = mockClasses.find(c => c.id === currentSelectedClassId);
  if (!targetClass) return;

  const isFull = targetClass.booked >= targetClass.capacity;

  if (isFull) {
    targetClass.waitlistCount = (targetClass.waitlistCount || 0) + 1;
    showToast(`⚡ Đã ghi danh ${currentSelectedMember.name} vào Hàng chờ (Waitlist #${targetClass.waitlistCount})!`, 'info');
    showSuccessModal(targetClass, true);
  } else {
    // Tăng sĩ số lớp
    targetClass.booked += 1;
    if (currentSelectedMember.sessionsLeft > 0) {
      currentSelectedMember.sessionsLeft -= 1;
    }
    renderMemberProfile(currentSelectedMember);
    renderClasses(currentSelectedDate, currentSelectedCategory);
    updateStickySummaryPanel(currentSelectedClassId);

    showToast(`🎉 Đặt chỗ lớp "${targetClass.title}" thành công cho ${currentSelectedMember.name}!`, 'success');
    showSuccessModal(targetClass, false);
  }
}

function resetSelection() {
  currentSelectedClassId = "CLS-101";
  renderClasses(currentSelectedDate, currentSelectedCategory);
  updateStickySummaryPanel(currentSelectedClassId);
  showToast("Đã khôi phục lựa chọn mặc định", "info");
}

// ==========================================================================
// 12. MODAL XÁC NHẬN THÀNH CÔNG (SUCCESS MODAL)
// ==========================================================================
function showSuccessModal(targetClass, isWaitlist) {
  const existingModal = document.getElementById("bookingSuccessModal");
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div id="bookingSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-full ${isWaitlist ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center mb-4 shadow-sm">
          <span class="material-symbols-outlined text-3xl">${isWaitlist ? 'hourglass_top' : 'check_circle'}</span>
        </div>
        <h3 class="text-xl font-bold text-on-surface">
          ${isWaitlist ? 'Đã ghi danh vào Hàng chờ!' : 'Đặt chỗ thành công!'}
        </h3>
        <p class="text-xs text-secondary mt-1.5 leading-relaxed">
          ${isWaitlist 
            ? `Hội viên <strong>${currentSelectedMember.name}</strong> đã được thêm vào hàng chờ lớp <strong>${targetClass.title}</strong>. Hệ thống sẽ tự động gửi thông báo khi có người hủy lịch.`
            : `Đã xác nhận đặt chỗ cho hội viên <strong>${currentSelectedMember.name}</strong> tại lớp <strong>${targetClass.title}</strong>.`}
        </p>

        <!-- Thông tin tóm tắt phiếu đặt -->
        <div class="w-full bg-slate-50 rounded-xl p-3.5 mt-4 text-left text-xs space-y-2 border border-slate-200">
          <div class="flex justify-between">
            <span class="text-slate-500">Mã đặt chỗ:</span>
            <strong class="text-slate-800">#BK-${Date.now().toString().slice(-6)}</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Ca học:</span>
            <span class="text-slate-800 font-semibold">${targetClass.time} (${targetClass.shift})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Phòng tập:</span>
            <span class="text-slate-800 font-semibold">${targetClass.room}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">HLV phụ trách:</span>
            <span class="text-slate-800 font-semibold">${targetClass.trainer.name}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full mt-6">
          <button type="button" onclick="closeSuccessModal()"
            class="flex-1 py-2.5 rounded-lg bg-[#0B2238] text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md">
            Hoàn tất &amp; Đóng
          </button>
          <button type="button" onclick="printBookingTicket()"
            class="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px]">print</span>
            <span>In vé</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

function closeSuccessModal() {
  const modal = document.getElementById("bookingSuccessModal");
  if (modal) modal.remove();
}

function printBookingTicket() {
  window.print();
}

// ==========================================================================
// 13. TÌM KIẾM & CHUYỂN ĐỔI HỘI VIÊN (MEMBER SELECTOR & AUTOCOMPLETE)
// ==========================================================================
function initMemberSearchAutocomplete() {
  const input = document.getElementById("member-search");
  const container = document.getElementById("memberSearchDropdown");
  if (!input || !container) return;

  input.addEventListener("input", (e) => {
    const keyword = e.target.value.trim().toLowerCase();
    if (!keyword) {
      container.classList.add("hidden");
      return;
    }

    const matches = mockMembers.filter(m => 
      m.name.toLowerCase().includes(keyword) || 
      m.phone.includes(keyword) || 
      m.id.toLowerCase().includes(keyword)
    );

    if (matches.length > 0) {
      container.innerHTML = matches.map(m => `
        <div onclick="selectMemberById('${m.id}')"
          class="flex items-center justify-between p-3 hover:bg-slate-100 cursor-pointer border-b border-slate-100 transition-colors">
          <div class="flex items-center gap-2.5">
            <img class="w-8 h-8 rounded-full object-cover" src="${m.avatar}" alt="${m.name}"/>
            <div>
              <p class="text-xs font-bold text-on-surface">${m.name} <span class="text-slate-400 font-normal">(${m.id})</span></p>
              <p class="text-[11px] text-slate-500">${m.package.split('·')[0]}</p>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded ${m.vipClass}">${m.vip}</span>
        </div>
      `).join("");
      container.classList.remove("hidden");
    } else {
      container.innerHTML = `<div class="p-3 text-xs text-slate-400 text-center">Không tìm thấy hội viên nào</div>`;
      container.classList.remove("hidden");
    }
  });

  // Đóng dropdown khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !container.contains(e.target)) {
      container.classList.add("hidden");
    }
  });
}

function selectMemberById(memberId) {
  const found = mockMembers.find(m => m.id === memberId);
  if (found) {
    currentSelectedMember = found;
    const input = document.getElementById("member-search");
    if (input) input.value = `${found.name} (${found.id})`;
    const dropdown = document.getElementById("memberSearchDropdown");
    if (dropdown) dropdown.classList.add("hidden");

    renderMemberProfile(found);
    renderClasses(currentSelectedDate, currentSelectedCategory);
    updateStickySummaryPanel(currentSelectedClassId);
    showToast(`Đã chuyển sang hội viên: ${found.name}`, 'info');
  }
}

function clearMemberSearch() {
  const input = document.getElementById("member-search");
  if (input) {
    input.value = "";
    input.focus();
  }
}

function openMemberSwitchModal() {
  const modalHtml = `
    <div id="memberSwitchModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 class="text-base font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-teal-600">group</span>
            Chọn Hội Viên Đặt Lớp
          </h3>
          <button type="button" onclick="document.getElementById('memberSwitchModal').remove()" class="text-slate-400 hover:text-slate-600">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
          ${mockMembers.map(m => `
            <div onclick="selectMemberById('${m.id}'); document.getElementById('memberSwitchModal').remove();"
              class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 cursor-pointer transition-all ${m.id === currentSelectedMember.id ? 'border-teal-500 bg-teal-50/50' : ''}">
              <div class="flex items-center gap-3">
                <img class="w-10 h-10 rounded-full object-cover shadow-xs" src="${m.avatar}" alt="${m.name}"/>
                <div>
                  <h4 class="text-sm font-bold text-slate-800">${m.name}</h4>
                  <p class="text-xs text-slate-500">${m.package}</p>
                  <p class="text-[11px] text-teal-700 font-medium">Còn ${m.daysLeft} ngày · ${m.sessionsLeft} buổi khả dụng</p>
                </div>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded ${m.vipClass}">${m.vip}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHtml);
}

// ==========================================================================
// 14. RENDER THẺ THÔNG TIN HỘI VIÊN ĐANG CHỌN (MEMBER PREVIEW)
// ==========================================================================
function renderMemberProfile(member) {
  const nameEl = document.getElementById("memberPreviewName");
  const avatarEl = document.getElementById("memberPreviewAvatar");
  const vipEl = document.getElementById("memberPreviewVip");
  const pkgEl = document.getElementById("memberPreviewPackage");
  const phoneEl = document.getElementById("memberPreviewPhone");
  const emailEl = document.getElementById("memberPreviewEmail");
  const rfidEl = document.getElementById("memberPreviewRfid");
  const daysEl = document.getElementById("memberPreviewDays");
  const attendanceEl = document.getElementById("memberPreviewAttendance");
  const notesTextarea = document.getElementById("health-notes");

  if (nameEl) nameEl.textContent = member.name;
  if (avatarEl) avatarEl.src = member.avatar;
  if (vipEl) {
    vipEl.textContent = member.vip;
    vipEl.className = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${member.vipClass}`;
  }
  if (pkgEl) pkgEl.textContent = member.package;
  if (phoneEl) phoneEl.textContent = member.phone;
  if (emailEl) emailEl.textContent = member.email;
  if (rfidEl) rfidEl.textContent = `RFID: ${member.rfid}`;
  if (daysEl) daysEl.textContent = `Còn ${member.daysLeft} ngày - ${member.sessionsLeft} buổi nhóm khả dụng`;
  if (attendanceEl) attendanceEl.textContent = member.attendance;
  if (notesTextarea) notesTextarea.value = member.notes || "";
}

// ==========================================================================
// 15. AI GỢI Ý THEO THỂ TRẠNG (AI SMART RECOMMENDATION)
// ==========================================================================
function triggerAIRecommendation() {
  const memberName = currentSelectedMember.name;
  showToast(`✨ AI đang phân tích dữ liệu PAR-Q+ & lịch sử tập luyện của ${memberName}...`, 'info');

  setTimeout(() => {
    // Tự động gợi ý Vinyasa Flow hoặc Hatha Yoga tùy thể trạng
    const recClassId = currentSelectedMember.notes.includes("cổ chân") ? "CLS-104" : "CLS-101";
    selectClass(recClassId);

    const recModalHtml = `
      <div id="aiRecModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-200 flex flex-col">
          <div class="flex items-center gap-2 text-purple-700 font-bold text-sm mb-3">
            <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
            <span>Trợ lý AI FitManage Intelligence</span>
          </div>
          <h3 class="text-lg font-bold text-on-surface">Đề xuất ca học tối ưu cho ${memberName}</h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed bg-purple-50 p-3 rounded-xl border border-purple-100">
            Dựa trên tiền sử <em>"chấn thương nhẹ ở cổ chân trái"</em> và thói quen tập <em>4 buổi/tuần</em>, AI đề xuất ca <strong>Hatha Yoga Gentle Alignment (08:30 - 09:30)</strong> để giãn cơ nhẹ nhàng, tránh áp lực dồn trọng tâm.
          </p>
          <div class="flex items-center justify-end gap-2 mt-5">
            <button type="button" onclick="document.getElementById('aiRecModal').remove()"
              class="px-4 py-2 rounded-lg bg-[#0B2238] text-white text-xs font-bold hover:bg-slate-800 transition-colors">
              Áp dụng đề xuất này
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", recModalHtml);
  }, 700);
}

// ==========================================================================
// 16. ĐỒNG HỒ ĐẾM NGƯỢC GIỮ CHỖ (HOLD TIMER)
// ==========================================================================
function startHoldTimer() {
  let seconds = 585; // 9:45
  const timerEl = document.getElementById("holdTimerText");
  if (!timerEl) return;

  setInterval(() => {
    if (seconds <= 0) return;
    seconds--;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerEl.textContent = `Đang giữ chỗ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, 1000);
}

// ==========================================================================
// 17. TOAST NOTIFICATION UTILITY
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  let bgClass = "bg-[#0B2238] text-white";
  let icon = "info";

  if (type === 'success') {
    bgClass = "bg-emerald-700 text-white";
    icon = "check_circle";
  } else if (type === 'warning') {
    bgClass = "bg-amber-600 text-white";
    icon = "warning";
  }

  toast.className = `booking-toast show flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold ${bgClass}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.replace("show", "hide");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Xử lý các link placeholder ở sidebar
function handleNavFeature(name) {
  showToast(`Chức năng "${name}" đang được phát triển theo phân hệ Jira.`, 'info');
}
