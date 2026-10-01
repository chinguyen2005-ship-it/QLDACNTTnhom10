// =============================================================================
// create-contract.js - Xử lý logic Lập Hợp đồng mới & Ký số điện tử
// FitManage Gym & Yoga Suite (TASK-349)
// =============================================================================

const API_BASE = '/api';

// Dữ liệu Gói tập mẫu (Dự phòng khi API chưa sẵn sàng)
const packagesCatalog = [
  { packageID: 1, name: "Gym Diamond 12 Tháng Toàn Hệ Thống", price: 18500000, durationDays: 365, badge: "Bán chạy nhất", desc: "Bao gồm xông hơi đá muối, hồ sục Jacuzzi & Yoga Masterclass" },
  { packageID: 2, name: "Yoga VIP Unlimited All-Access 12 Tháng", price: 14200000, durationDays: 365, badge: "Được yêu thích", desc: "Không giới hạn lớp Hot Yoga, Yin, Vinyasa & Master Ấn Độ" },
  { packageID: 3, name: "Combo PT 1:1 Siêu cấp 36 Buổi", price: 28800000, durationDays: 180, badge: "Doanh thu cao", desc: "36 buổi kèm 1:1 cùng Master Coach + Meal Plan" },
  { packageID: 4, name: "Pilates Reformer Core Dynamic 24 Buổi", price: 22000000, durationDays: 120, badge: "Xu hướng mới", desc: "Dàn máy Reformer Cadillac USA - Tối đa 4 người/lớp" },
  { packageID: 5, name: "Gym Standard Cơ bản 06 Tháng", price: 7800000, durationDays: 180, badge: "Tiêu chuẩn", desc: "Tập luyện tại 01 chi nhánh đăng ký, giờ tự do" },
  { packageID: 6, name: "Trải nghiệm 14 Ngày All-In", price: 990000, durationDays: 14, badge: "Tiếp cận mới", desc: "Gym, Yoga, Xông hơi Sauna 14 ngày trọn gói" }
];

// State quản lý trên màn hình tạo mới
const state = {
  memberID: 1042,
  memberName: "Sarah Mitchel",
  memberPhone: "0908 345 678",
  memberCode: "#MB-1042",
  basePrice: 18500000,
  lockerPrice: 3600000,
  freezePrice: 200000,
  voucherPercent: 0.10, // 10%
  voucherCode: 'FITVIP2026',
  paymentMode: 'full', // 'full' | 'deposit'
  paymentMethod: 'vietqr', // 'vietqr' | 'pos' | 'cash' | 'installment'
  hasSigned: false
};

// =============================================================================
// API SERVICE CALLS
// =============================================================================

/**
 * Lấy danh mục gói tập: GET /api/packages
 */
async function fetchPackagesForDropdown() {
  try {
    const res = await fetch(`${API_BASE}/packages`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[API] Lấy gói tập từ Backend thất bại, dùng catalog mặc định.', err);
  }
  return packagesCatalog;
}

/**
 * Gửi dữ liệu tạo mới hợp đồng: POST /api/contracts
 */
async function apiCreateContract(payload) {
  try {
    const res = await fetch(`${API_BASE}/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[API] Gọi API POST /api/contracts thất bại, tạo mã hợp đồng cục bộ.', err);
  }

  // Giả lập trả về mã hợp đồng mới tạo thành công
  return {
    contractID: 'HD-2026-' + Math.floor(1000 + Math.random() * 9000),
    success: true,
    message: 'Tạo hợp đồng thành công!'
  };
}

// =============================================================================
// GIAO DIỆN & TÍNH TOÁN BẢNG GIÁ
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Đặt ngày mặc định là hôm nay
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateInput = document.getElementById('contractStartDate');
  if (dateInput) {
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // Đọc tham số URL ?pkg=... nếu được chuyển từ trang packages.html
  const urlParams = new URLSearchParams(window.location.search);
  const pkgParam = urlParams.get('pkg') || urlParams.get('package');
  if (pkgParam) {
    const select = document.getElementById('mainPackageSelect');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(pkgParam.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  onPackageChange();
  initSignatureCanvas();
});

// Xử lý khi đổi Gói tập
function onPackageChange() {
  const select = document.getElementById('mainPackageSelect');
  if (!select) return;
  const opt = select.options[select.selectedIndex];
  if (!opt) return;

  state.basePrice = parseFloat(opt.value) || 0;
  const pkgName = opt.getAttribute('data-name') || opt.text.split('(')[0].trim();
  const badge = opt.getAttribute('data-badge') || 'Tiêu chuẩn';
  const desc = opt.getAttribute('data-desc') || '';
  const days = parseInt(opt.getAttribute('data-days')) || 365;
  const durationText = opt.getAttribute('data-duration') ? `${opt.getAttribute('data-duration')} Tháng (${days} Ngày)` : `${days} Ngày`;

  const titleEl = document.getElementById('summaryPackageTitle');
  if (titleEl) titleEl.innerText = `Đơn giá gói ${pkgName}`;
  const priceEl = document.getElementById('summaryPackagePrice');
  if (priceEl) priceEl.innerText = state.basePrice.toLocaleString('vi-VN') + ' đ';
  const badgeTag = document.getElementById('packageBadgeTag');
  if (badgeTag) badgeTag.innerText = badge;
  const badgeDesc = document.getElementById('packageBadgeDesc');
  if (badgeDesc) badgeDesc.innerText = desc;
  const durLabel = document.getElementById('labelPackageDuration');
  if (durLabel) durLabel.innerText = durationText;

  calculateDates();
  calculateTotal();
}

// Tính ngày kết thúc
function calculateDates() {
  const startInputEl = document.getElementById('contractStartDate');
  const startInput = startInputEl ? startInputEl.value.trim() : '';
  let startDate = new Date();
  if (startInput) {
    if (startInput.includes('/')) {
      const parts = startInput.split('/');
      if (parts.length === 3) startDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else if (startInput.includes('-')) {
      const parts = startInput.split('-');
      if (parts.length === 3) startDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
  }
  if (isNaN(startDate.getTime())) startDate = new Date();

  const select = document.getElementById('mainPackageSelect');
  const opt = select ? select.options[select.selectedIndex] : null;
  const days = parseInt(opt ? opt.getAttribute('data-days') : 365) || 365;

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);

  const edd = String(endDate.getDate()).padStart(2, '0');
  const emm = String(endDate.getMonth() + 1).padStart(2, '0');
  const eyyyy = endDate.getFullYear();
  const endLabel = document.getElementById('labelPackageEndDate');
  if (endLabel) endLabel.innerText = `${edd}/${emm}/${eyyyy}`;
}

// Tính tổng tiền & voucher
function calculateTotal() {
  const chkLocker = document.getElementById('chkAddonLocker');
  const chkFreeze = document.getElementById('chkAddonFreeze');

  const isLocker = chkLocker && chkLocker.checked;
  const isFreeze = chkFreeze && chkFreeze.checked;

  const rowLocker = document.getElementById('rowSummaryLocker');
  const rowFreeze = document.getElementById('rowSummaryFreeze');
  if (rowLocker) rowLocker.style.display = isLocker ? 'flex' : 'none';
  if (rowFreeze) rowFreeze.style.display = isFreeze ? 'flex' : 'none';

  let subtotal = state.basePrice;
  if (isLocker) subtotal += state.lockerPrice;
  if (isFreeze) subtotal += state.freezePrice;

  let discount = 0;
  if (state.voucherPercent > 0) {
    discount = Math.round(subtotal * state.voucherPercent);
  }

  const finalTotal = Math.max(0, subtotal - discount);
  const depositTotal = Math.round(finalTotal * 0.3);

  const voucherDiscountEl = document.getElementById('voucherDiscountAmount');
  if (voucherDiscountEl) voucherDiscountEl.innerText = `-${discount.toLocaleString('vi-VN')} đ`;

  const finalTotalDisplayEl = document.getElementById('labelFinalTotalDisplay');
  if (finalTotalDisplayEl) finalTotalDisplayEl.innerText = finalTotal.toLocaleString('vi-VN');

  const fullPriceEl = document.getElementById('labelModeFullPrice');
  if (fullPriceEl) fullPriceEl.innerText = finalTotal.toLocaleString('vi-VN') + ' đ';

  const depPriceEl = document.getElementById('labelModeDepositPrice');
  if (depPriceEl) depPriceEl.innerText = depositTotal.toLocaleString('vi-VN') + ' đ';

  const savingsEl = document.getElementById('labelSavingsText');
  if (savingsEl) {
    savingsEl.innerText = `(Tiết kiệm ${discount.toLocaleString('vi-VN')} đ so với giá niêm yết ${subtotal.toLocaleString('vi-VN')} đ)`;
  }
}

// Áp dụng mã Voucher
function applyVoucher() {
  const inputEl = document.getElementById('inputPromoCode');
  const input = inputEl ? inputEl.value.trim().toUpperCase() : '';
  const checkIcon = document.getElementById('promoCheckIcon');
  const feedbackLabel = document.getElementById('voucherFeedbackLabel');

  if (input === 'FITVIP2026') {
    state.voucherPercent = 0.10;
    if (checkIcon) {
      checkIcon.innerText = '✓';
      checkIcon.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 text-title-md font-bold';
    }
    if (feedbackLabel) feedbackLabel.innerText = 'Voucher FITVIP2026 (Giảm 10%)';
    showToast('Áp dụng mã giảm giá 10% thành công!', 'success');
  } else if (input === 'SALE20') {
    state.voucherPercent = 0.20;
    if (checkIcon) {
      checkIcon.innerText = '✓';
      checkIcon.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 text-title-md font-bold';
    }
    if (feedbackLabel) feedbackLabel.innerText = 'Voucher SALE20 (Giảm 20%)';
    showToast('Áp dụng mã giảm giá 20% thành công!', 'success');
  } else if (input === '') {
    state.voucherPercent = 0;
    if (checkIcon) checkIcon.innerText = '';
    if (feedbackLabel) feedbackLabel.innerText = 'Không có voucher';
  } else {
    state.voucherPercent = 0;
    if (checkIcon) {
      checkIcon.innerText = '✗';
      checkIcon.className = 'absolute right-2 top-1/2 -translate-y-1/2 text-error text-title-md font-bold';
    }
    if (feedbackLabel) feedbackLabel.innerText = 'Mã không hợp lệ';
    showToast('Mã giảm giá không tồn tại hoặc đã hết hạn!', 'info');
  }
  calculateTotal();
}

// Chuyển hình thức thanh toán 100% hoặc Đặt cọc
function onPaymentModeChange(mode) {
  state.paymentMode = mode;
  const fullLabel = document.getElementById('payModeFull') ? document.getElementById('payModeFull').closest('label') : null;
  const depLabel = document.getElementById('payModeDeposit') ? document.getElementById('payModeDeposit').closest('label') : null;

  if (mode === 'full') {
    if (fullLabel) fullLabel.className = 'flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high cursor-pointer border border-primary';
    if (depLabel) depLabel.className = 'flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20';
    showToast('Đã chọn: Thanh toán 100% trọn gói', 'info');
  } else {
    if (depLabel) depLabel.className = 'flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high cursor-pointer border border-primary';
    if (fullLabel) fullLabel.className = 'flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20';
    showToast('Đã chọn: Đặt cọc 30% giữ chỗ (hoàn tất số dư trong 7 ngày)', 'info');
  }
}

// Lựa chọn cổng thanh toán
function selectPaymentMethod(method) {
  state.paymentMethod = method;
  const tiles = document.querySelectorAll('.pay-tile');
  tiles.forEach(t => {
    t.className = 'pay-tile flex flex-col p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface cursor-pointer transition-colors border border-outline-variant/30';
  });

  const qrBox = document.getElementById('boxDynamicVietQR');
  if (method === 'vietqr') {
    const tile = document.getElementById('tileVietQR');
    if (tile) tile.className = 'pay-tile flex flex-col p-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed cursor-pointer relative shadow-sm border border-primary/20';
    if (qrBox) qrBox.classList.remove('hidden');
    showToast('Đã chuyển sang phương thức: VietQR Pro', 'info');
  } else {
    if (qrBox) qrBox.classList.add('hidden');
    if (method === 'pos') {
      const tile = document.getElementById('tilePOS');
      if (tile) tile.className = 'pay-tile flex flex-col p-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed cursor-pointer relative shadow-sm border border-primary/20';
      showToast('Đã chuyển sang phương thức: Quẹt thẻ POS tại quầy', 'info');
    } else if (method === 'cash') {
      const tile = document.getElementById('tileCash');
      if (tile) tile.className = 'pay-tile flex flex-col p-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed cursor-pointer relative shadow-sm border border-primary/20';
      showToast('Đã chuyển sang phương thức: Thu tiền mặt tại quầy', 'info');
    } else if (method === 'installment') {
      const tile = document.getElementById('tileInstallment');
      if (tile) tile.className = 'pay-tile flex flex-col p-2.5 rounded-lg bg-primary-fixed text-on-primary-fixed cursor-pointer relative shadow-sm border border-primary/20';
      showToast('Đã chuyển sang phương thức: Trả góp 0% Kredivo', 'info');
    }
  }
}

function copyTransferCode() {
  const codeEl = document.getElementById('transferContentCode');
  const code = codeEl ? codeEl.innerText : 'FIT HD9042';
  navigator.clipboard.writeText(code).then(() => {
    showToast('Đã sao chép nội dung chuyển khoản: ' + code, 'success');
  });
}

// Đổi hồ sơ hội viên
function switchMemberDialog() {
  const name = prompt('Nhập tên hoặc SĐT hội viên cần chuyển sang:', 'Nguyễn Đức Chí Nguyên');
  if (name) {
    state.memberName = name;
    document.getElementById('memberName').innerText = name;
    document.getElementById('memberAvatarText').innerText = name.split(' ').map(n => n[0]).slice(-2).join('');
    document.getElementById('memberCode').innerText = '#MB-' + Math.floor(1000 + Math.random() * 9000);
    showToast('Đã chuyển sang hồ sơ hội viên: ' + name, 'success');
  }
}

function openQuickCreateMemberModal() {
  const name = prompt('Nhập Họ và tên hội viên mới:');
  if (name) {
    const phone = prompt('Nhập Số điện thoại:');
    state.memberName = name;
    document.getElementById('memberName').innerText = name;
    if (phone) document.getElementById('memberPhone').innerText = phone;
    document.getElementById('memberAvatarText').innerText = name.split(' ').map(n => n[0]).slice(-2).join('');
    document.getElementById('memberCode').innerText = '#MB-' + Math.floor(1000 + Math.random() * 9000);
    showToast('Tạo nhanh hồ sơ hội viên "' + name + '" thành công!', 'success');
  }
}

// =============================================================================
// CANVAS KÝ SỐ ĐIỆN TỬ (E-SIGNATURE)
// =============================================================================

let canvas, ctx, isDrawing = false;

function initSignatureCanvas() {
  canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#5300b7';

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  });
  canvas.addEventListener('touchend', () => {
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
  });
}

function startDraw(e) {
  isDrawing = true;
  const hint = document.getElementById('signPlaceholderHint');
  if (hint) hint.classList.add('hidden');
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
}

function stopDraw() {
  isDrawing = false;
}

function clearSignature() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const hint = document.getElementById('signPlaceholderHint');
  if (hint) hint.classList.remove('hidden');
}

function openSignatureModal() {
  const agreement = document.getElementById('chkLegalAgreement');
  if (agreement && !agreement.checked) {
    alert('Hội viên cần tích chọn cam kết tuân thủ Điều khoản & Nội quy phòng tập trước khi ký hợp đồng!');
    return;
  }
  const member = document.getElementById('memberName').innerText;
  const select = document.getElementById('mainPackageSelect');
  const opt = select.options[select.selectedIndex];
  const pkg = opt ? opt.text.split('(')[0] : '';
  const total = document.getElementById('labelFinalTotalDisplay').innerText;

  document.getElementById('modalSignMemberName').innerText = `${member} (${document.getElementById('memberPhone').innerText})`;
  document.getElementById('modalSignPackageName').innerText = `${pkg} - ${total} đ`;

  document.getElementById('signModal').classList.remove('hidden');
  setTimeout(() => {
    initSignatureCanvas();
  }, 50);
}

function closeSignatureModal() {
  document.getElementById('signModal').classList.add('hidden');
}

async function confirmSignature() {
  state.hasSigned = true;
  closeSignatureModal();

  // Chuẩn bị payload gửi lên API POST /api/contracts
  const payload = {
    memberID: state.memberID,
    memberName: state.memberName,
    packageID: parseInt(document.getElementById('mainPackageSelect').value),
    startDate: document.getElementById('contractStartDate').value,
    paymentMode: state.paymentMode,
    paymentMethod: state.paymentMethod,
    voucherCode: state.voucherCode,
    totalAmount: parseFloat(document.getElementById('labelFinalTotalDisplay').innerText.replace(/\./g, ''))
  };

  const result = await apiCreateContract(payload);
  const code = result.contractID || ('#HD-2026-' + Math.floor(1000 + Math.random() * 9000));

  const badge = document.getElementById('badgeContractNumber');
  if (badge) badge.innerText = `ĐÃ KÝ THÀNH CÔNG ${code}`;

  const pdfSig = document.getElementById('pdfSignatureBox');
  if (pdfSig) {
    pdfSig.innerHTML = `<span class="text-primary font-bold font-serif text-base italic underline">✓ Đã ký điện tử (${new Date().toLocaleDateString('vi-VN')})</span>`;
  }

  showToast(`🎉 Ký hợp đồng ${code} thành công! Đang chuyển đến màn hình Chi tiết Hợp đồng...`, 'success');

  // Tự động chuyển sang màn hình Chi tiết Hợp đồng sau 1.8 giây
  setTimeout(() => {
    window.location.href = `/contract-detail.html?id=${encodeURIComponent(code)}`;
  }, 1800);
}

// =============================================================================
// MODAL XEM TRƯỚC BẢN IN PDF
// =============================================================================

function openPrintPdfModal() {
  const member = document.getElementById('memberName').innerText;
  const phone = document.getElementById('memberPhone').innerText;
  const select = document.getElementById('mainPackageSelect');
  const opt = select.options[select.selectedIndex];

  document.getElementById('pdfMemberName').innerText = `Họ tên: ${member} (${document.getElementById('memberCode').innerText})`;
  document.getElementById('pdfMemberPhone').innerText = `Số điện thoại: ${phone}`;
  document.getElementById('pdfSignerName').innerText = member;
  document.getElementById('pdfPackageName').innerText = opt.getAttribute('data-name') || opt.text.split('(')[0];
  document.getElementById('pdfPackagePrice').innerText = state.basePrice.toLocaleString('vi-VN') + ' đ';
  document.getElementById('pdfPackageDuration').innerText = document.getElementById('labelPackageDuration').innerText;
  document.getElementById('pdfFinalTotal').innerText = document.getElementById('labelFinalTotalDisplay').innerText + ' đ';

  const isLocker = document.getElementById('chkAddonLocker').checked;
  document.getElementById('pdfLockerRow').style.display = isLocker ? 'table-row' : 'none';

  document.getElementById('printPdfModal').classList.remove('hidden');
}

function closePrintPdfModal() {
  document.getElementById('printPdfModal').classList.add('hidden');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0 ${
    type === 'success' 
      ? 'bg-emerald-900/95 text-white border-emerald-500/40 backdrop-blur-md' 
      : 'bg-[#0B304A]/95 text-white border-cyan-400/40 backdrop-blur-md'
  }`;
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px] ${type === 'success' ? 'text-emerald-400' : 'text-cyan-400'}">
      ${type === 'success' ? 'check_circle' : 'info'}
    </span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ESC Listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSignatureModal();
    closePrintPdfModal();
  }
});

function handleNavFeature(name) {
  showNotificationToast(`Tính năng "${name}" đang được kết nối với module hệ thống trong phiên bản kế tiếp.`, 'info');
}
