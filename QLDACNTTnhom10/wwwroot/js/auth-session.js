'use strict';

// Decoding only controls navigation. API authorization still validates the JWT on the server.
window.FitManageAuth = (() => {
  function claims(token) {
    try {
      const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0))));
    } catch { return null; }
  }
  function clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('fitmanage_active_path');
  }
  function current() {
    const token = localStorage.getItem('token');
    const payload = token && claims(token);
    if (!payload || !Number.isFinite(payload.exp) || payload.exp * 1000 <= Date.now()) {
      clear();
      return null;
    }
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
    const username = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.unique_name || payload.name || '';
    if (!['Admin', 'Staff', 'Trainer', 'Member'].includes(role)) { clear(); return null; }
    return { token, role, username };
  }
  function save(token) {
    clear();
    localStorage.setItem('token', token);
    const user = current();
    if (!user) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng thử lại.');
    localStorage.setItem('role', user.role);
    return user;
  }
  function destination(user = current()) {
    return user && ['Admin', 'Staff'].includes(user.role) ? '/dashboard.html' : '/account.html';
  }
  function logout() { clear(); location.replace('/login.html'); }
  return { current, save, clear, destination, logout };
})();
