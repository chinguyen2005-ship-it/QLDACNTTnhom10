'use strict';

/**
 * FitManage Unified Sidebar & Seamless Navigation Router
 * Chuẩn Motion Design của Animate UI (Linear/Stripe Token Standard)
 * - Chuyển trang mượt mà 0ms nháy trắng (Zero-Flicker SPA-like Router)
 * - Token chuẩn: 180ms cubic-bezier(0.16, 1, 0.3, 1), GPU Transform + Opacity
 * - Bảo vệ tuyệt đối: Modals, overlays, toasts không bị lộ/bật nhầm
 * - Chống xung đột Script & hủy request dồn dập (AbortController)
 */

const sectionMap = {
  'dashboard.html': 'dashboard',
  'dashboard': 'dashboard',
  'index.html': 'dashboard',
  'index': 'dashboard',
  '': 'dashboard',

  'schedules.html': 'calendar',
  'schedules': 'calendar',
  'class-booking.html': 'calendar',
  'class-booking': 'calendar',

  'members.html': 'users',
  'members': 'users',
  'data-tools.html': 'users',
  'data-tools': 'users',

  'packages.html': 'contract',
  'packages': 'contract',
  'contracts.html': 'contract',
  'contracts': 'contract',
  'create-contract.html': 'contract',
  'create-contract': 'contract',
  'contract-detail.html': 'contract',
  'contract-detail': 'contract',
  'contract-renewal-modal.html': 'contract',
  'contract-renewal-modal': 'contract',

  'trainers.html': 'trainer',
  'trainers': 'trainer',

  'ai-retention-copilot.html': 'ai',
  'ai-retention-copilot': 'ai',
  'ai-copilot.html': 'ai',
  'ai-copilot': 'ai',

  'retention-report.html': 'report',
  'retention-report': 'report',

  'message-templates.html': 'mail',
  'message-templates': 'mail',
  'email-expiry-reminder.html': 'mail',
  'email-expiry-reminder': 'mail'
};

// =============================================================================
// 1. SIDEBAR RENDERING & ACTIVE STATE MANAGEMENT
// =============================================================================

function getSectionFromPath(pathname) {
  const pathParts = pathname.split('/').filter(Boolean);
  const rawFile = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'index.html';
  const cleanFile = rawFile.toLowerCase().split('?')[0].split('#')[0];
  const noExtFile = cleanFile.replace(/\.html$/, '');
  return sectionMap[cleanFile] || sectionMap[noExtFile] || 'dashboard';
}

function updateActiveSidebarLink(pathname) {
  const activeSection = getSectionFromPath(pathname);
  const sidebar = document.querySelector('[data-fitmanage-sidebar]');
  if (!sidebar) return;

  const links = sidebar.querySelectorAll('[data-section]');
  links.forEach(link => {
    if (link.dataset.section === activeSection) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function renderSidebar(htmlString) {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return false;

  const template = document.createElement('template');
  template.innerHTML = htmlString;

  const activeSection = getSectionFromPath(location.pathname);
  if (activeSection) {
    template.content.querySelectorAll('[data-section]').forEach(link => {
      if (link.dataset.section === activeSection) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.FitManagePermissions?.apply(template.content);
  host.replaceChildren(template.content.cloneNode(true));
  const user = window.FitManageAuth?.current();
  if (user) {
    const name = host.querySelector('.fm-meta strong');
    const role = host.querySelector('.fm-meta small');
    const avatar = host.querySelector('.fm-avatar');
    if (name) name.textContent = user.username;
    const isEn = localStorage.getItem('fitmanage_lang') === 'en';
    if (role) role.textContent = user.role === 'Admin' ? (isEn ? 'Administrator' : 'Quản trị viên') : (isEn ? 'Staff' : 'Nhân viên');
    if (avatar) avatar.textContent = user.username.slice(0, 2).toUpperCase();
    const profile = host.querySelector('.fm-profile');
    if (profile && !profile.querySelector('[data-auth-logout]')) {
      const logout = document.createElement('button');
      logout.type = 'button';
      logout.dataset.authLogout = '';
      logout.textContent = 'Đăng xuất';
      logout.style.cssText = 'margin-left:auto;color:#acedff;font-size:11px';
      logout.addEventListener('click', () => window.FitManageAuth.logout());
      profile.append(logout);
    }
  }
  return true;
}

async function loadSidebar() {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return;

  // 1. Render tức thì từ cache sessionStorage nếu có (0ms)
  let hasRenderedFromCache = false;
  try {
    const cachedHTML = sessionStorage.getItem('fitmanage_sidebar_html_roles_v1');
    if (cachedHTML) {
      renderSidebar(cachedHTML);
      hasRenderedFromCache = true;
    }
  } catch (e) {}

  // 2. Fetch nội dung mới nhất từ server
  try {
    const response = await fetch('/components/sidebar.html');
    if (!response.ok) throw new Error(`Sidebar HTTP ${response.status}`);
    const html = await response.text();

    if (!hasRenderedFromCache || sessionStorage.getItem('fitmanage_sidebar_html_roles_v1') !== html) {
      renderSidebar(html);
      try {
        sessionStorage.setItem('fitmanage_sidebar_html_roles_v1', html);
      } catch (e) {}
    }
  } catch (error) {
    if (!hasRenderedFromCache) {
      console.error('Không tải được sidebar FitManage:', error);
    }
  }
}

// =============================================================================
// 2. SEAMLESS ZERO-FLICKER CLIENT-SIDE ROUTER ENGINE
// =============================================================================

const pageCache = new Map();
const scriptTextCache = new Map();
let currentAbortController = null;
let navSequence = 0;
let isNavigating = false;

/**
 * Kiểm tra xem một phần tử có phải là Modal, Toast, Backdrop hoặc Overlay ẩn hay không
 * Đảm bảo TUYỆT ĐỐI không bao giờ gắn animation .fm-page-enter lên các phần tử này!
 */
function isOverlayOrModal(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
  const id = (el.id || '').toLowerCase();
  const cls = (el.className || '').toString().toLowerCase();

  // Kiểm tra ID định danh
  if (id.includes('modal') || id.includes('toast') || id.includes('backdrop') || id.includes('dialog')) {
    return true;
  }

  // Kiểm tra Class định danh overlay/fixed/hidden/popup
  if (cls.includes('fixed inset-0') || cls.includes('fixed bottom-') || cls.includes('fixed top-') ||
      cls.includes('modal-backdrop') || cls.includes('modal-content') || cls.includes('toast') ||
      cls.includes('opacity-0') || cls.includes('hidden') || cls.includes('pointer-events-none')) {
    return true;
  }

  // Thuộc tính Accessibility
  if (el.getAttribute('aria-modal') === 'true' || el.getAttribute('role') === 'dialog' || el.hasAttribute('hidden')) {
    return true;
  }

  return false;
}

/**
 * Chuyển đổi các khai báo const/let ở cấp cao nhất thành var
 * Giúp việc nạp lại trang/script nhiều lần không bị lỗi:
 * "Uncaught SyntaxError: Identifier 'xyz' has already been declared"
 */
function prepareScriptForExecution(code) {
  if (!code) return '';
  return code.replace(/^([ \t]*)(const|let)([ \t]+)/gm, '$1var$3');
}

/**
 * Hủy các tài nguyên của trang cũ (như Chart.js canvas) trước khi xóa DOM
 */
function cleanupPreviousPage() {
  if (window.Chart && window.Chart.instances) {
    Object.keys(window.Chart.instances).forEach(id => {
      try {
        window.Chart.instances[id].destroy();
      } catch (e) {}
    });
  }
}

/**
 * Thực thi an toàn các file script và inline script của trang mới
 */
async function executePageScripts(scripts) {
  for (const scriptEl of scripts) {
    const src = scriptEl.getAttribute('src');

    // Bỏ qua các script thư viện dùng chung đã nạp sẵn
    if (src) {
      if (src.includes('sidebar.js') ||
          src.includes('cdn.tailwindcss.com') ||
          src.includes('chart.js') ||
          src.includes('lucide') ||
          src.includes('tailwind-config')) {
        continue;
      }

      try {
        let code = scriptTextCache.get(src);
        if (!code) {
          const res = await fetch(src);
          if (res.ok) {
            code = await res.text();
            scriptTextCache.set(src, code);
          }
        }

        if (code) {
          const prepared = prepareScriptForExecution(code);
          const runner = document.createElement('script');
          runner.textContent = prepared;
          document.body.appendChild(runner);
          runner.remove();
        }
      } catch (err) {
        console.warn('[FitManage Router] Không thể nạp script:', src, err);
      }
    } else {
      // Inline script
      const id = scriptEl.id || '';
      if (id === 'tailwind-config') continue;
      const code = scriptEl.textContent;
      if (!code || !code.trim()) continue;

      try {
        const prepared = prepareScriptForExecution(code);
        const runner = document.createElement('script');
        runner.textContent = prepared;
        document.body.appendChild(runner);
        runner.remove();
      } catch (err) {
        console.warn('[FitManage Router] Không thể chạy inline script:', err);
      }
    }
  }

  // Kích hoạt sự kiện lifecycle cho các module trang khởi tạo (schedules, trainers, dashboard, members)
  setTimeout(() => {
    try {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      window.dispatchEvent(new Event('load'));
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (e) {
      console.warn('[FitManage Router] Lỗi lifecycle dispatch:', e);
    }
  }, 10);
}

/**
 * Điều hướng mượt mà không nháy trắng (Seamless Transition Router)
 */
async function navigateTo(targetUrlString, pushState = true) {
  const nextUrl = new URL(targetUrlString, location.origin);

  // Nếu click vào chính trang hiện tại, chỉ cuộn lên đầu
  if (nextUrl.pathname === location.pathname && nextUrl.search === location.search) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // 1. Phản hồi thị giác tức thì trên Sidebar (0ms Feedback)
  updateActiveSidebarLink(nextUrl.pathname);

  // 2. Hủy bỏ request đang dở nếu user spam click
  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();
  const sequenceId = ++navSequence;

  try {
    isNavigating = true;

    // 3. Lấy nội dung HTML (ưu tiên Cache bộ nhớ)
    let html = pageCache.get(nextUrl.href);
    if (!html) {
      const response = await fetch(nextUrl.href, { signal: currentAbortController.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      html = await response.text();
      pageCache.set(nextUrl.href, html);
    }

    // Nếu có request mới hơn đã chạy, bỏ qua kết quả cũ
    if (sequenceId !== navSequence) return;

    // 4. Phân tích HTML trang đích
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');

    // 5. Đồng bộ Title & Class của <body>
    document.title = newDoc.title;
    document.body.className = newDoc.body.className;

    // 6. Đồng bộ các file stylesheet <link rel="stylesheet"> mới trong <head>
    newDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = href;
        document.head.appendChild(newLink);
      }
    });

    // 7. Dọn dẹp tài nguyên trang cũ
    cleanupPreviousPage();

    // 8. Hoán đổi DOM an toàn:
    //    - GIỮ NGUYÊN Sidebar [data-fitmanage-sidebar]
    //    - Modals / Toasts / Overlays: Thêm vào AS-IS KHÔNG ĐƯỢC GẮN .fm-page-enter
    //    - Main Content Container: Thêm vào và gắn .fm-page-enter (180ms ease-out)
    const sidebar = document.querySelector('[data-fitmanage-sidebar]');
    Array.from(document.body.children).forEach(child => {
      if (child !== sidebar) {
        child.remove();
      }
    });

    // Lọc các phần tử con từ trang mới
    const newChildren = Array.from(newDoc.body.children).filter(child => {
      return !child.matches('[data-fitmanage-sidebar]');
    });

    const scriptsToExecute = [];

    newChildren.forEach(child => {
      // Nếu là thẻ script
      if (child.tagName === 'SCRIPT') {
        scriptsToExecute.push(child);
        return;
      }

      // Thu thập các thẻ script con bên trong
      child.querySelectorAll('script').forEach(s => scriptsToExecute.push(s));

      const clonedChild = child.cloneNode(true);

      // KIỂM TRA QUAN TRỌNG:
      // Modals/Toasts tuyệt đối KHÔNG nhận class .fm-page-enter để không bị đè opacity: 1!
      if (isOverlayOrModal(clonedChild)) {
        // Giữ nguyên trạng thái ẩn gốc (opacity-0, pointer-events-none, hidden)
        document.body.appendChild(clonedChild);
      } else {
        // Đây là Main Content Container (.pl-64, .ml-64, main)
        clonedChild.classList.add('fm-page-enter');

        // Tự động gỡ bỏ class animation khi kết thúc 180ms để giữ DOM sạch sẽ
        clonedChild.addEventListener('animationend', () => {
          clonedChild.classList.remove('fm-page-enter');
        }, { once: true });

        document.body.appendChild(clonedChild);
      }
    });

    // Cập nhật URL trên thanh địa chỉ
    if (pushState) {
      history.pushState(null, '', nextUrl.href);
    }

    // Cuộn lên đầu trang
    window.scrollTo(0, 0);

    // 9. Thực thi an toàn các script của trang mới
    await executePageScripts(scriptsToExecute);

  } catch (err) {
    if (err.name === 'AbortError') {
      // Bị hủy do người dùng click trang khác dồn dập, an toàn bỏ qua
      return;
    }
    console.error('Lỗi khi chuyển trang mượt mà:', err);
    // Fallback nếu có lỗi nghiêm trọng: chuyển trang thông thường
    window.location.href = nextUrl.href;
  } finally {
    isNavigating = false;
  }
}

// Prefetch trang trước khi click khi hover chuột (Tăng tốc 0ms)
function prefetchPage(url) {
  if (pageCache.has(url)) return;
  fetch(url)
    .then(res => {
      if (res.ok) return res.text();
      throw new Error(`HTTP ${res.status}`);
    })
    .then(html => {
      pageCache.set(url, html);
    })
    .catch(() => {});
}

// Bắt sự kiện hover để nạp trước
document.addEventListener('pointerenter', (e) => {
  const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
  try {
    const targetUrl = new URL(href, location.origin);
    if (targetUrl.origin === location.origin && targetUrl.pathname.endsWith('.html')) {
      prefetchPage(targetUrl.href);
    }
  } catch (e) {}
}, true);

// Phản hồi tức thì khi click vào menu Sidebar
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-fitmanage-sidebar] a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

  try {
    const targetUrl = new URL(href, location.origin);
    // Cập nhật trạng thái Active ngay lập tức trên Sidebar (0ms feedback)
    updateActiveSidebarLink(targetUrl.pathname);
    sessionStorage.setItem('fitmanage_active_path', targetUrl.pathname);
  } catch (err) {}
  // Để trình duyệt chuyển trang mượt mà qua Native View Transitions API (Không dùng AJAX hủy hoại DOM)
});

// Chuyển tới đăng nhập thật; không tự cấp phiên Admin bằng tài khoản mẫu.
async function ensureAuthenticated() {
  if (!window.FitManageAuth) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/js/auth-session.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  const user = window.FitManageAuth.current();
  if (!user) { location.replace('/login.html'); return null; }
  if (!['Admin', 'Staff'].includes(user.role)) { location.replace('/account.html'); return null; }
  return user.token;
}

function ensureTopbarResources() {
  if (!document.querySelector('link[href*="topbar.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/topbar.css';
    document.head.append(link);
  }
  if (!window.FitManageTopbar && !document.querySelector('script[src*="topbar.js"]')) {
    const script = document.createElement('script');
    script.src = '/js/topbar.js';
    script.defer = true;
    document.head.append(script);
  }
}

async function initializeAuthenticatedSidebar() {
  try {
    ensureTopbarResources();
    if (await ensureAuthenticated()) await loadSidebar();
  } catch {
    location.replace('/login.html');
  }
}

// Khởi tạo Sidebar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuthenticatedSidebar);
} else {
  initializeAuthenticatedSidebar();
}
