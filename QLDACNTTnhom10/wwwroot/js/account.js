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

  // Logout handler
  const logoutBtn = document.getElementById('account-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.FitManageAuth.logout();
    });
  }
})();
