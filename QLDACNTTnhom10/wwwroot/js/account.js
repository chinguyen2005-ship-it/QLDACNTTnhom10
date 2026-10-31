'use strict';

(() => {
  const user = window.FitManageAuth?.current();
  if (!user) {
    location.replace('/login.html');
    return;
  }

  // Populate basic user info
  const username = user.username || 'Hội viên';
  const roleName = { Admin: 'Quản trị viên', Staff: 'Nhân viên', Trainer: 'Huấn luyện viên', Member: 'Hội viên' }[user.role] || 'Hội viên';

  const nameEl = document.getElementById('account-name');
  if (nameEl) nameEl.textContent = username;

  const welcomeEl = document.getElementById('welcome-fullname');
  if (welcomeEl) welcomeEl.textContent = username;

  const cardHolderEl = document.getElementById('card-holder-name');
  if (cardHolderEl) cardHolderEl.textContent = username.toUpperCase();

  const roleBadgeEl = document.getElementById('account-role-badge');
  if (roleBadgeEl) roleBadgeEl.textContent = `${roleName} FitManage`;

  // Initials in Avatar
  const avatarEl = document.getElementById('member-avatar');
  if (avatarEl) {
    avatarEl.textContent = username.slice(0, 2).toUpperCase();
  }

  // Generate deterministic Member Code from username hash or ID
  const cardCodeEl = document.getElementById('card-member-code');
  if (cardCodeEl) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = (hash << 5) - hash + username.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash) % 9000 + 1000;
    cardCodeEl.textContent = `#HV-2026-${positiveCode}`;
  }

  // If Admin or Staff accidentally logged in, give them a shortcut back to Dashboard
  if (['Admin', 'Staff'].includes(user.role)) {
    const dashLink = document.getElementById('account-dashboard');
    if (dashLink) dashLink.hidden = false;
  }

  // Load real schedules for today from API
  async function loadTodaySchedules() {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/Classes/schedules', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (res.ok) {
        const schedules = await res.json();
        const container = document.getElementById('today-schedules-container');
        if (container && Array.isArray(schedules) && schedules.length > 0) {
          container.innerHTML = schedules.slice(0, 4).map(s => {
            const timeStr = s.StartTime ? new Date(s.StartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '08:00';
            const cap = s.Capacity || 20;
            const booked = s.CurrentBooked || 0;
            const left = Math.max(0, cap - booked);
            const badgeClass = left <= 3 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700';
            const badgeText = left <= 3 ? `Sắp đầy (${left}/${cap} chỗ)` : `Còn ${left} chỗ`;

            return `
              <div class="py-3 flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                    ${timeStr}
                  </div>
                  <div>
                    <span class="text-xs font-bold text-[#0B1C30] block">${s.ClassName || 'Lớp tập luyện'}</span>
                    <span class="text-[11px] text-slate-400">${s.Room || 'Studio 01'} · HLV FitManage</span>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeClass}">${badgeText}</span>
              </div>
            `;
          }).join('');
        }
      }
    } catch (e) {
      console.warn('Không tải được lịch học API cho account:', e);
    }
  }
  loadTodaySchedules();

  // Logout handler
  const logoutBtn = document.getElementById('account-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.FitManageAuth.logout();
    });
  }
})();
