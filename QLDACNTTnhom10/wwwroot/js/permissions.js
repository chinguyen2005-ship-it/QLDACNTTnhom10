'use strict';

(() => {
  const roles = Object.freeze({ administration: ['Admin'], operations: ['Admin', 'Staff'] });
  const restrictedPages = new Set(['/retention-report.html', '/data-tools.html']);
  const allowed = (role, permission) => Boolean(roles[permission]?.includes(role));
  const can = permission => allowed(window.FitManageAuth?.current()?.role, permission);
  function apply(root = document) {
    const user = window.FitManageAuth?.current();
    root.querySelectorAll('[data-permission]').forEach(element => {
      element.dataset.authorized = String(allowed(user?.role, element.dataset.permission));
    });
    root.querySelectorAll('.fm-nav li').forEach(item => {
      const link = item.querySelector('a[data-permission]');
      if (link) item.hidden = link.dataset.authorized !== 'true';
    });
    root.querySelectorAll('[data-user-name]').forEach(element => {
      if (element.textContent !== user?.username) element.textContent = user?.username || '';
    });
    root.querySelectorAll('[data-user-role]').forEach(element => {
      const isEn = localStorage.getItem('fitmanage_lang') === 'en';
      const labels = isEn
        ? { Admin: 'Administrator', Staff: 'Staff', Trainer: 'Personal Trainer', Member: 'Member' }
        : { Admin: 'Quản trị viên', Staff: 'Nhân viên', Trainer: 'Huấn luyện viên', Member: 'Hội viên' };
      const label = labels[user?.role] || '';
      if (element.textContent !== label) element.textContent = label;
    });
  }
  window.FitManagePermissions = { allowed, can, apply };
  const user = window.FitManageAuth?.current();
  const currentPath = location.pathname.toLowerCase();
  const isAccountPage = currentPath.endsWith('/account.html');

  if (!user) {
    document.documentElement.classList.add('fm-access-redirect');
    location.replace('/login.html');
    return;
  }

  // Member & Trainer được phép truy cập trang /account.html (Cổng cá nhân); chỉ chuyển hướng khi vào trang nghiệp vụ
  if (!allowed(user.role, 'operations')) {
    if (!isAccountPage) {
      document.documentElement.classList.add('fm-access-redirect');
      location.replace('/account.html');
      return;
    }
  } else if (restrictedPages.has(location.pathname) && !allowed(user.role, 'administration')) {
    document.documentElement.classList.add('fm-access-redirect');
    location.replace('/dashboard.html?access=restricted');
    return;
  }
  document.documentElement.dataset.fitmanageRole = user.role;
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-permission]');
    if (control && !can(control.dataset.permission)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  const start = () => {
    apply();
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => { scheduled = false; apply(); });
    }).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
