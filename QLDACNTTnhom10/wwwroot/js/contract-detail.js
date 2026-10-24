// =============================================================================
// contract-detail.js - Xử lý logic hiển thị và API Chi tiết Hợp đồng
// FitManage Gym & Yoga Suite (TASK-349)
// =============================================================================

// Cấu hình Base API Endpoint
const API_BASE = '/api';

// Dữ liệu mẫu (Mock Data) chuẩn theo schema CSDL CONTRACTS & MEMBERS
const mockContractDetails = {
  contractID: "HD-2026-0892",
  status: "Active", // "Active", "Expired", "Frozen", "Cancelled"
  eSigned: true,
  signDate: "26/09/2026",
  createdBy: "Nguyễn Văn A (Lễ tân Flagship)",
  branch: "Quận 1 - Flagship Studio",
  member: {
    name: "Nguyễn Đức Chí Nguyên",
    avatarLetters: "CN",
    rank: "Diamond VIP",
    memberCode: "MEM-2026-042",
    rfid: "8892-004-912",
    phone: "0908 123 456",
    cccd: "079098012345",
    email: "chinguyen.fit@example.com",
    genderAge: "Nam • 14/06/1992 (34 tuổi)",
    address: "48 Nguyễn Thị Minh Khai, P. Bến Nghé, Q. 1, TP. HCM",
    parqStatus: "Đã ký xác nhận không có tiền sử bệnh tim mạch / huyết áp",
    emergencyContact: "Chị Lan (Vợ) - 0912 345 678",
    posLimit: "15.000.000 đ"
  },
  package: {
    packageID: 101,
    name: "Gym Diamond 12 Tháng",
    scope: "🏢 Toàn hệ thống (All Clubs)",
    operatingHours: "05:30 - 22:30 (Mở cửa 7 ngày/tuần)",
    startDate: "26/09/2026",
    endDate: "26/09/2027",
    remainingDays: 312,
    passedDays: 53,
    progressPercent: 14.5,
    policy: "Miễn phí bảo lưu tối đa 60 ngày"
  },
  pt: {
    trainerName: "HLV Trần Văn B",
    trainerAvatar: "TB",
    title: "Senior PT",
    cert: "Huấn luyện viên Thể hình Chuyên sâu (NASM Certified)",
    completedSessions: 6,
    totalSessions: 36,
    remainingSessions: 30,
    completionDeadline: "26/03/2027",
    nextSession: "Thứ Bảy, 26/09 lúc 09:00",
    sessionTopic: "Tập Chân & Mông (Lower Body Blast)"
  },
  amenities: [
    {
      id: "locker",
      title: "Tủ Locker VIP riêng",
      desc: "Số tủ <strong>#108 (Tầng 2 Khu Diamond)</strong> • Tích hợp khóa thẻ từ RFID cố định cả năm.",
      icon: "lock",
      color: "text-primary"
    },
    {
      id: "sauna",
      title: "Sauna & Hồ sục Jacuzzi",
      desc: "Không giới hạn lượt sử dụng xông khô đá muối Himalaya & xông ướt thảo dược.",
      icon: "hot_tub",
      color: "text-tertiary"
    },
    {
      id: "drink",
      title: "Khăn tập & Nước uống Detox",
      desc: "Cung cấp bộ khăn lớn/nhỏ cao cấp & đồ uống bù khoáng kiềm tại quầy VIP Lounge.",
      icon: "local_drink",
      color: "text-secondary"
    },
    {
      id: "guest",
      title: "Vé mời khách đi cùng (Guest Pass)",
      badge: "Còn 3 / 5 vé",
      desc: "Mời bạn bè trải nghiệm tiện ích trọn vẹn trong ngày (Đã sử dụng 2 vé).",
      icon: "confirmation_number",
      color: "text-primary"
    },
    {
      id: "inbody",
      title: "Phân tích thể trạng InBody 3D Định kỳ",
      badge: "Đã kiểm tra 2 / 12 lần",
      desc: "Đo lượng mỡ nội tạng, cơ xương và nhận báo cáo AI phân tích dinh dưỡng mỗi tháng.",
      icon: "monitoring",
      color: "text-tertiary",
      colSpan2: true
    }
  ],
  payment: {
    invoiceCode: "INV-2026-98231",
    basePrice: 18500000,
    voucherCode: "FITVIP2026",
    voucherDesc: "Voucher Tri Ân Diamond (FITVIP2026)",
    discountAmount: 1500000,
    lockerFee: 300000,
    rfidFee: 0,
    vatNote: "Đã bao gồm trong giá",
    finalAmount: 17300000,
    paidStatus: "Đã thanh toán đủ 100%",
    paidTime: "26/09/2026 10:24:18",
    paymentMethod: "Chuyển khoản VietQR Pro",
    bank: "Techcombank Corporate",
    transactionId: "TXN-98231-VN"
  },
  auditTrail: {
    totalCheckins: 18,
    lastCheckinTime: "Hôm qua, 18:20",
    lastCheckinGate: "Gate 02 • CS Q1",
    events: [
      {
        time: "26/09 10:24",
        title: "Ký duyệt hợp đồng điện tử",
        desc: "Tạo và ký số thành công qua OTP SMS. Thực hiện bởi nhân viên lễ tân: <strong>Nguyễn Văn A</strong>.",
        dotColor: "bg-primary"
      },
      {
        time: "26/09 10:22",
        title: "Thanh toán hoàn tất",
        desc: "Nhận 17.300.000 đ qua VietQR (#TXN-98231). Hệ thống tự động kích hoạt mã thẻ RFID #8892.",
        dotColor: "bg-tertiary"
      },
      {
        time: "25/09 16:45",
        title: "Khảo sát y tế PAR-Q+",
        desc: "Hội viên xác nhận trực tuyến trên FitManage Member App. Đạt chỉ số an toàn tập luyện 100%.",
        dotColor: "bg-secondary"
      },
      {
        time: "20/09 14:10",
        title: "Tạo phiếu trải nghiệm VIP",
        desc: "Sales Rep <strong>Hoàng Mai</strong> tạo cơ hội chuyển đổi từ hội viên tham quan sang Diamond Club.",
        dotColor: "bg-outline-variant"
      }
    ]
  }
};

// =============================================================================
// API SERVICE CALLS (Sử dụng fetch API)
// =============================================================================

/**
 * Gọi API lấy chi tiết hợp đồng theo ID: GET /api/contracts/{id}
 * Nếu backend chưa có hoặc lỗi kết nối, tự động fallback sang Mock Data
 */
async function fetchContractDetail(contractId) {
  try {
    const response = await fetch(`${API_BASE}/contracts/${encodeURIComponent(contractId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn(`[API] GET /api/contracts/${contractId} trả về status ${response.status}. Sử dụng dữ liệu Mock.`);
      return mockContractDetails;
    }
  } catch (error) {
    console.warn('[API] Lỗi khi kết nối Backend API. Sử dụng dữ liệu Mock cục bộ.', error);
    return mockContractDetails;
  }
}

/**
 * Gọi API gia hạn hợp đồng: POST /api/contracts/{id}/renew
 */
async function apiRenewContract(contractId, months) {
  try {
    const response = await fetch(`${API_BASE}/contracts/${encodeURIComponent(contractId)}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ additionalMonths: months })
    });
    return response.ok;
  } catch (error) {
    console.warn('[API] Lỗi kết nối API gia hạn, thực thi giả lập cục bộ.', error);
    return true;
  }
}

/**
 * Gọi API bảo lưu hợp đồng: POST /api/contracts/{id}/freeze
 */
async function apiFreezeContract(contractId, freezeDays) {
  try {
    const response = await fetch(`${API_BASE}/contracts/${encodeURIComponent(contractId)}/freeze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ freezeDays })
    });
    return response.ok;
  } catch (error) {
    console.warn('[API] Lỗi kết nối API bảo lưu, thực thi giả lập cục bộ.', error);
    return true;
  }
}

// =============================================================================
// DOM RENDERING & BINDING
// =============================================================================

function renderContractDetail(data) {
  if (!data) return;

  // 1. Header Banner
  setText('contractIdHeader', `Chi tiết Hợp đồng #${data.contractID}`);
  setText('contractSignDate', data.signDate);
  setText('contractCreatedBy', data.createdBy);
  setText('contractBranch', data.branch);

  // Status badge
  const statusBadge = document.getElementById('contractStatusBadge');
  if (statusBadge) {
    if (data.status === 'Active') {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span> Đang hiệu lực`;
      statusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-title-md text-title-md shadow-sm';
    } else if (data.status === 'Frozen') {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> Đang bảo lưu`;
      statusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-title-md text-title-md shadow-sm';
    } else {
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span> Hết hiệu lực`;
      statusBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-title-md text-title-md shadow-sm';
    }
  }

  // 2. Member Card
  if (data.member) {
    setText('memberName', data.member.name);
    setText('memberAvatar', data.member.avatarLetters || getInitials(data.member.name));
    setText('memberRank', data.member.rank);
    setText('memberCode', `Mã thẻ: ${data.member.memberCode}`);
    setText('memberRfid', `RFID: ${data.member.rfid}`);
    setText('memberPosLimit', data.member.posLimit);
    setText('memberPhone', data.member.phone);
    setText('memberCccd', data.member.cccd);
    setText('memberEmail', data.member.email);
    setText('memberGenderAge', data.member.genderAge);
    setText('memberAddress', data.member.address);
    setText('memberParq', data.member.parqStatus);
    setText('memberEmergency', data.member.emergencyContact);
  }

  // 3. Package & Benefits Card
  if (data.package) {
    setText('packageName', data.package.name);
    setText('packageScope', data.package.scope);
    setText('packageHours', data.package.operatingHours);
    setText('packageStartDate', data.package.startDate);
    setText('packageEndDate', data.package.endDate);
    setText('packageRemainingDays', `Còn lại ${data.package.remainingDays} ngày hiệu lực`);
    setText('packageProgressSummary', `Đã qua: ${data.package.passedDays} ngày (${data.package.progressPercent}%)`);
    setText('packagePolicy', `Chính sách: ${data.package.policy}`);

    const progressBar = document.getElementById('packageProgressBar');
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, data.package.progressPercent))}%`;
    }
  }

  // 4. Personal Trainer (PT)
  if (data.pt) {
    setText('ptName', data.pt.trainerName);
    setText('ptAvatar', data.pt.trainerAvatar || getInitials(data.pt.trainerName));
    setText('ptTitle', data.pt.title);
    setText('ptCert', data.pt.cert);
    setText('ptSessionProgress', `${data.pt.completedSessions} / ${data.pt.totalSessions} buổi (${Math.round(data.pt.completedSessions / data.pt.totalSessions * 100)}%)`);
    setText('ptSessionNote', `Còn lại ${data.pt.remainingSessions} buổi kèm riêng • Thời hạn hoàn thành: ${data.pt.completionDeadline}`);
    setText('ptNextSchedule', data.pt.nextSession);
    setText('ptSessionTopic', data.pt.sessionTopic);

    // Progress columns
    const ptProgressGrid = document.getElementById('ptProgressGrid');
    if (ptProgressGrid) {
      const completedRatio = Math.round((data.pt.completedSessions / data.pt.totalSessions) * 12);
      ptProgressGrid.innerHTML = `
        <div class="col-span-${Math.max(1, completedRatio)} h-full rounded-sm bg-primary"></div>
        <div class="col-span-${Math.max(1, 12 - completedRatio)} h-full rounded-sm bg-surface-container-highest"></div>
      `;
    }
  }

  // 5. Payment & Invoice Card
  if (data.payment) {
    setText('invoiceCodeLabel', `Mã giao dịch: #${data.payment.invoiceCode}`);
    setText('invoiceBasePackage', `${data.payment.basePrice.toLocaleString('vi-VN')} đ`);
    setText('invoiceVoucherDiscount', `-${data.payment.discountAmount.toLocaleString('vi-VN')} đ`);
    setText('invoiceLockerFee', `+${data.payment.lockerFee.toLocaleString('vi-VN')} đ`);
    setText('invoiceRfidFee', data.payment.rfidFee === 0 ? 'Miễn phí (0 đ)' : `${data.payment.rfidFee.toLocaleString('vi-VN')} đ`);
    setText('invoiceGrandTotal', data.payment.finalAmount.toLocaleString('vi-VN'));
    setText('paymentMethodName', data.payment.paymentMethod);
    setText('paymentBank', data.payment.bank);
    setText('paymentTxnId', `#${data.payment.transactionId}`);
    setText('paymentPaidTime', data.payment.paidTime);
  }

  // 6. Audit Trail Card
  if (data.auditTrail) {
    setText('auditTotalCheckins', `${data.auditTrail.totalCheckins} lượt`);
    setText('auditLastCheckinTime', data.auditTrail.lastCheckinTime);
    setText('auditLastCheckinGate', data.auditTrail.lastCheckinGate);
  }
}

// Helper setText an toàn
function setText(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.innerText = text;
}

// Helper lấy 2 chữ cái đầu tên
function getInitials(name) {
  if (!name) return 'FM';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// =============================================================================
// UI ACTIONS & INTERACTION HELPERS
// =============================================================================

function triggerToast(message) {
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}

function copyText(text, successMsg = 'Đã sao chép thành công!') {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(successMsg);
    });
  } else {
    triggerToast(successMsg);
  }
}

function printContractPdf() {
  triggerToast('Đang tạo bản in Hợp đồng điện tử khổ A4...');
  setTimeout(() => {
    window.print();
  }, 500);
}

function downloadInvoicePdf() {
  triggerToast('Đang tải hóa đơn điện tử e-Invoice PDF (#INV-2026-98231)...');
}

function checkVietQrGateway() {
  triggerToast('Mở cổng sao kê cổng thanh toán VietQR Hub...');
}

// =============================================================================
// MODAL GIA HẠN HỢP ĐỒNG (CONTRACT RENEWAL CONTROLLER)
// =============================================================================

const renewState = {
  months: 6,
  days: 180,
  basePrice: 4500000,
  discountPercent: 0.10,
  voucherCode: 'LOYALTY10',
  paymentMethod: 'vietqr',
  renewType: 'current'
};

function handleRenewContractAction() {
  openRenewContractModal();
}

function openRenewContractModal() {
  const modal = document.getElementById('contract-modal-backdrop');
  if (!modal) return;

  // Điền dữ liệu từ thông tin hợp đồng hiện tại
  const c = mockContractDetails;
  setText('modalRenewContractTitle', `Gia hạn Hợp đồng #${c.contractID}`);
  setText('modalRenewMemberName', c.member?.name || 'Hội viên');
  setText('modalRenewMemberPhone', c.member?.phone || '');
  setText('modalRenewMemberAvatar', c.member?.avatarLetters || 'NC');
  setText('modalRenewMemberRank', c.member?.rank || 'Thẻ VIP Gold');
  setText('modalRenewCurrentPackage', `Gói hiện tại: ${c.package?.name || 'Gym Diamond'}`);
  setText('modalRenewOldEndDate', c.package?.endDate || '26/09/2027');

  // Tính ngày bắt đầu mới (ngày tiếp theo ngày hết hạn cũ)
  const oldEndDateStr = c.package?.endDate || '26/09/2027';
  let oldEnd = parseDateDMY(oldEndDateStr);
  const newStartDate = new Date(oldEnd);
  newStartDate.setDate(newStartDate.getDate() + 1);

  setText('modalRenewNewStartDate', formatDateDMY(newStartDate));

  // Chọn mặc định +6 Tháng
  selectRenewDuration(6, 4500000, 180);

  modal.classList.remove('hidden');
}

function closeRenewContractModal() {
  const modal = document.getElementById('contract-modal-backdrop');
  if (modal) modal.classList.add('hidden');
}

// Chọn thời hạn gia hạn (+3T, +6T, +12T)
function selectRenewDuration(months, price, days) {
  renewState.months = months;
  renewState.basePrice = price;
  renewState.days = days;

  // Cập nhật trạng thái active cho các nút
  const btn3 = document.getElementById('renewBtn3M');
  const btn6 = document.getElementById('renewBtn6M');
  const btn12 = document.getElementById('renewBtn12M');

  const activeClass = 'duration-btn flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary ring-2 ring-primary font-semibold transition-all relative text-center cursor-pointer border border-primary';
  const inactiveClass = 'duration-btn flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all text-center cursor-pointer border border-outline-variant/30';

  if (btn3) btn3.className = months === 3 ? activeClass : inactiveClass;
  if (btn6) btn6.className = months === 6 ? activeClass : inactiveClass;
  if (btn12) btn12.className = months === 12 ? activeClass : inactiveClass;

  // Badge "Đang chọn"
  const badge6M = document.getElementById('badgeSelected6M');
  if (badge6M) {
    badge6M.style.display = months === 6 ? 'inline-block' : 'none';
  }

  // Tính ngày hết hạn mới
  const oldEndDateStr = mockContractDetails.package?.endDate || '26/09/2027';
  let oldEnd = parseDateDMY(oldEndDateStr);
  const newEndDate = new Date(oldEnd);
  newEndDate.setDate(newEndDate.getDate() + days);

  setText('modalRenewNewEndDate', formatDateDMY(newEndDate));
  setText('modalRenewAddedDaysText', `✓ Thời hạn thêm ${days} ngày`);

  calculateRenewPricing();
}

// Tính toán bảng giá & chiết khấu trong modal gia hạn
function calculateRenewPricing() {
  const discount = Math.round(renewState.basePrice * renewState.discountPercent);
  const finalTotal = Math.max(0, renewState.basePrice - discount);

  setText('modalRenewBaseLabel', `Giá niêm yết (Gói ${renewState.months} Tháng):`);
  setText('modalRenewBasePrice', `${renewState.basePrice.toLocaleString('vi-VN')} đ`);
  setText('modalRenewDiscountLabel', `Chiết khấu tri ân khách hàng (${Math.round(renewState.discountPercent * 100)}%):`);
  setText('modalRenewDiscountAmount', `-${discount.toLocaleString('vi-VN')} đ`);
  setText('modalRenewFinalTotal', `${finalTotal.toLocaleString('vi-VN')} đ`);
}

// Chuyển loại gia hạn (Gói hiện tại vs Nâng cấp)
function onRenewTypeChange(type) {
  renewState.renewType = type;
  if (type === 'upgrade') {
    // Giá nâng cấp lên Gói VIP All-Access Diamond
    if (renewState.months === 3) renewState.basePrice = 3200000;
    else if (renewState.months === 6) renewState.basePrice = 5800000;
    else if (renewState.months === 12) renewState.basePrice = 9800000;
    triggerToast('Đã chọn: Nâng cấp gói mới (Toàn quyền VIP Gym + Yoga + Sauna)');
  } else {
    // Giá gói hiện tại
    if (renewState.months === 3) renewState.basePrice = 2400000;
    else if (renewState.months === 6) renewState.basePrice = 4500000;
    else if (renewState.months === 12) renewState.basePrice = 7600000;
  }
  calculateRenewPricing();
}

// Thay đổi mã Voucher
function onRenewVoucherChange(val) {
  const code = (val || '').trim().toUpperCase();
  const badge = document.getElementById('modalRenewVoucherBadge');

  if (code === 'LOYALTY10') {
    renewState.discountPercent = 0.10;
    if (badge) {
      badge.innerText = 'Áp dụng thành công (10%)';
      badge.className = 'px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold shrink-0';
    }
  } else if (code === 'VIP20') {
    renewState.discountPercent = 0.20;
    if (badge) {
      badge.innerText = 'Áp dụng thành công (20%)';
      badge.className = 'px-2 py-0.5 rounded bg-emerald-700 text-white font-label-sm text-label-sm font-semibold shrink-0';
    }
  } else if (code === '') {
    renewState.discountPercent = 0;
    if (badge) {
      badge.innerText = 'Chưa nhập mã';
      badge.className = 'px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shrink-0';
    }
  } else {
    renewState.discountPercent = 0;
    if (badge) {
      badge.innerText = 'Mã không đúng';
      badge.className = 'px-2 py-0.5 rounded bg-error-container text-error font-label-sm text-label-sm font-semibold shrink-0';
    }
  }
  calculateRenewPricing();
}

// Chọn hình thức thanh toán gia hạn
function selectRenewPaymentMethod(method) {
  renewState.paymentMethod = method;

  const tiles = document.querySelectorAll('.renew-pay-tile');
  tiles.forEach(t => {
    t.className = 'renew-pay-tile p-3 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container flex items-center justify-between transition-all cursor-pointer border border-outline-variant/30';
    const check = t.querySelector('.material-symbols-outlined[style*="FILL"]');
    if (check) check.remove();
  });

  const activeTileId = method === 'vietqr' ? 'renewPayVietQR' : (method === 'cash' ? 'renewPayCash' : 'renewPayPOS');
  const activeTile = document.getElementById(activeTileId);
  if (activeTile) {
    activeTile.className = 'renew-pay-tile p-3 rounded-xl bg-primary/10 text-primary ring-2 ring-primary flex items-center justify-between transition-all cursor-pointer border border-primary';
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined text-[18px] text-primary';
    icon.style.fontVariationSettings = "'FILL' 1";
    icon.innerText = 'check_circle';
    activeTile.appendChild(icon);
  }

  const methodText = method === 'vietqr' ? 'VietQR Pro' : (method === 'cash' ? 'Tiền mặt tại quầy' : 'Quẹt thẻ POS');
  triggerToast(`Đã chọn hình thức: ${methodText}`);
}

// Xác nhận gia hạn hợp đồng
async function confirmRenewContract() {
  const c = mockContractDetails;
  const newEndDateStr = document.getElementById('modalRenewNewEndDate').innerText;
  const totalAmountStr = document.getElementById('modalRenewFinalTotal').innerText;

  // Gọi API Backend
  await apiRenewContract(c.contractID, renewState.months);

  // Cập nhật state dữ liệu hợp đồng
  c.package.endDate = newEndDateStr;
  c.package.remainingDays += renewState.days;
  c.status = 'Active';

  // Thêm sự kiện vào Audit Trail Timeline
  const methodText = renewState.paymentMethod === 'vietqr' ? 'VietQR Pro' : (renewState.paymentMethod === 'cash' ? 'Tiền mặt' : 'Quẹt thẻ POS');
  const now = new Date();
  const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  c.auditTrail.events.unshift({
    time: timeStr,
    title: `Gia hạn hợp đồng (+${renewState.months} Tháng)`,
    desc: `Đã thanh toán ${totalAmountStr} qua ${methodText}. Thời hạn hợp đồng mới kéo dài đến ${newEndDateStr}.`,
    dotColor: "bg-primary"
  });

  // Re-render lại giao diện chi tiết hợp đồng
  renderContractDetail(c);
  renderAuditTrailEvents(c.auditTrail.events);

  closeRenewContractModal();

  triggerToast(`🎉 Gia hạn Hợp đồng #${c.contractID} thêm ${renewState.months} tháng thành công! Đã cập nhật hạn dùng đến ${newEndDateStr}.`);
}

// Cập nhật hiển thị dòng sự kiện audit trail
function renderAuditTrailEvents(events) {
  const container = document.querySelector('.relative.pl-6.space-y-5');
  if (!container || !Array.isArray(events)) return;

  container.innerHTML = events.map(e => `
    <div class="relative flex flex-col gap-0.5">
      <span class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${e.dotColor || 'bg-primary'} ring-4 ring-surface-container-lowest"></span>
      <div class="flex items-center justify-between">
        <span class="font-title-md text-title-md text-on-surface font-bold">${e.title}</span>
        <span class="font-label-sm text-label-sm text-on-surface-variant font-mono">${e.time}</span>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
        ${e.desc}
      </p>
    </div>
  `).join('');
}

// Helper date parsing (dd/mm/yyyy)
function parseDateDMY(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date();
}

function formatDateDMY(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Phím bấm ESC để đóng modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeRenewContractModal();
  }
});

function handleFreezeContractAction() {
  const days = prompt('Nhập số ngày muốn bảo lưu hợp đồng (Tối đa 60 ngày):', '30');
  if (days && !isNaN(days)) {
    apiFreezeContract(mockContractDetails.contractID, parseInt(days)).then(() => {
      triggerToast(`❄️ Đã bảo lưu hợp đồng #${mockContractDetails.contractID} trong ${days} ngày.`);
    });
  }
}

function handleSchedulePtAction() {
  triggerToast('Đang kết nối Thời khóa biểu Yoga & Gym...');
  setTimeout(() => {
    window.location.href = '/schedules.html';
  }, 1000);
}

// =============================================================================
// KHỞI CHẠY KHI TẢI TRANG
// =============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Lấy mã hợp đồng từ Query Parameter (VD: ?id=HD-2026-0892)
  const urlParams = new URLSearchParams(window.location.search);
  const contractId = urlParams.get('id') || 'HD-2026-0892';

  // Tải và hiển thị dữ liệu
  const contractData = await fetchContractDetail(contractId);
  renderContractDetail(contractData);

  // Mở trực tiếp modal nếu có tham số ?renew=true
  if (urlParams.get('renew') === 'true') {
    setTimeout(openRenewContractModal, 300);
  }
});

function handleNavFeature(name) {
  triggerToast(`Tính năng "${name}" đang được kết nối trong phiên bản kế tiếp.`);
}

