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
      const label = { Admin: 'Quản trị viên', Staff: 'Nhân viên', Trainer: 'Huấn luyện viên', Member: 'Hội viên' }[user?.role] || '';
      if (element.textContent !== label) element.textContent = label;
    });
  }
  window.FitManagePermissions = { allowed, can, apply };
  const user = window.FitManageAuth?.current();
  if (!user || !allowed(user.role, 'operations') || (restrictedPages.has(location.pathname) && !allowed(user.role, 'administration'))) {
    document.documentElement.classList.add('fm-access-redirect');
    location.replace(!user ? '/login.html' : allowed(user.role, 'operations') ? '/dashboard.html?access=restricted' : '/account.html');
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
