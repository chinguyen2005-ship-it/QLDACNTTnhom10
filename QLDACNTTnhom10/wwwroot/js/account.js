'use strict';
(() => {
  const user = FitManageAuth.current();
  if (!user) { location.replace('/login.html'); return; }
  document.getElementById('account-name').textContent = user.username;
  document.getElementById('account-role').textContent = { Admin: 'Quản trị viên', Staff: 'Nhân viên', Trainer: 'Huấn luyện viên', Member: 'Hội viên' }[user.role];
  if (['Admin', 'Staff'].includes(user.role)) {
    document.getElementById('account-dashboard').hidden = false;
    document.getElementById('account-description').textContent = 'Bạn có thể truy cập khu vực quản lý bằng tài khoản của mình.';
  }
  document.getElementById('account-logout').addEventListener('click', FitManageAuth.logout);
})();
