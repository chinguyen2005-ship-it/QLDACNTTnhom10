'use strict';

/**
 * FitManage Unified Sidebar Loader & Seamless Page Transition Engine
 * Triệt tiêu hoàn toàn hiện tượng nhấp nháy (Zero-Flicker SPA-Lite Router)
 * Tuân thủ quy chuẩn Motion Design của Animate UI (180ms cubic-bezier(0.16, 1, 0.3, 1))
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

function getActiveSectionFromPath(pathname) {
  const pathParts = pathname.split('/').filter(Boolean);
  const rawFile = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'dashboard.html';
  const cleanFile = rawFile.toLowerCase().split('?')[0].split('#')[0];
  const noExtFile = cleanFile.replace(/\.html$/, '');
  return sectionMap[cleanFile] || sectionMap[noExtFile] || 'dashboard';
}

function updateActiveMenu(pathname) {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return;

  const activeSection = getActiveSectionFromPath(pathname);
  host.querySelectorAll('[data-section]').forEach(link => {
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

  const activeSection = getActiveSectionFromPath(location.pathname);
  if (activeSection) {
    template.content.querySelectorAll('[data-section]').forEach(link => {
      if (link.dataset.section === activeSection) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  host.replaceChildren(template.content.cloneNode(true));
  return true;
}

async function loadSidebar() {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return;

  // 1. Render tức thì từ cache sessionStorage (0ms)
  let hasRenderedFromCache = false;
  try {
    const cachedHTML = sessionStorage.getItem('fitmanage_sidebar_html');
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
    
    if (!hasRenderedFromCache || sessionStorage.getItem('fitmanage_sidebar_html') !== html) {
      renderSidebar(html);
      try {
        sessionStorage.setItem('fitmanage_sidebar_html', html);
      } catch (e) {}
    }
  } catch (error) {
    if (!hasRenderedFromCache) {
      console.error('Không tải được sidebar FitManage:', error);
    }
  }
}

// =========================================================================
// SEAMLESS PAGE TRANSITION ENGINE (SPA-Lite - Không nháy, Giữ nguyên Sidebar)
// =========================================================================

let isNavigating = false;

async function navigateTo(targetUrl, pushHistory = true) {
  if (isNavigating) return;
  const currentUrl = new URL(location.href);
  const nextUrl = new URL(targetUrl, location.origin);

  // Nếu đang ở cùng trang, chỉ cuộn mượt
  if (currentUrl.pathname === nextUrl.pathname && currentUrl.search === nextUrl.search) {
    if (nextUrl.hash) {
      const el = document.querySelector(nextUrl.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  isNavigating = true;

  try {
    // 1. Cập nhật active indicator trên Sidebar ngay lập tức (phản hồi tức thì)
    updateActiveMenu(nextUrl.pathname);

    // 2. Fetch HTML trang đích
    const response = await fetch(nextUrl.href);
    if (!response.ok) {
      window.location.href = nextUrl.href;
      return;
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, 'text/html');

    // 3. Cập nhật tiêu đề trang và lịch sử trình duyệt
    document.title = newDoc.title || document.title;
    if (pushHistory) {
      window.history.pushState({ path: nextUrl.pathname }, '', nextUrl.href);
    }

    // 4. Đồng bộ các file stylesheet <link rel="stylesheet"> mới trong <head>
    newDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = href;
        document.head.appendChild(newLink);
      }
    });

    // 5. Cập nhật class trên <body>
    document.body.className = newDoc.body.className;

    // 6. Hoán đổi vùng nội dung: Giữ nguyên Sidebar, thay thế tất cả phần tử còn lại
    const sidebar = document.querySelector('[data-fitmanage-sidebar]');
    
    // Xóa tất cả các phần tử con trong <body> NGOẠI TRỪ sidebar
    Array.from(document.body.children).forEach(child => {
      if (child !== sidebar) {
        child.remove();
      }
    });

    // Lấy các phần tử con trong <body> của trang mới (ngoại trừ sidebar)
    const newChildren = Array.from(newDoc.body.children).filter(child => {
      return !child.matches('[data-fitmanage-sidebar]');
    });

    // Chèn các phần tử mới vào <body> với animation Animate UI
    const scriptsToExecute = [];
    newChildren.forEach(child => {
      const clonedChild = child.cloneNode(true);
      
      // Áp dụng class animation mượt mà cho container nội dung
      clonedChild.classList.add('fm-page-enter');

      // Thu thập các thẻ script để chạy lại
      if (clonedChild.tagName === 'SCRIPT') {
        scriptsToExecute.push(clonedChild);
      } else {
        clonedChild.querySelectorAll('script').forEach(s => scriptsToExecute.push(s));
      }

      document.body.appendChild(clonedChild);
    });

    // Cuộn lên đầu trang
    window.scrollTo(0, 0);

    // 7. Thực thi lại các script của trang mới
    scriptsToExecute.forEach(oldScript => {
      const src = oldScript.getAttribute('src');
      // Không nạp lại sidebar.js vì đang chạy
      if (src && src.includes('sidebar.js')) return;

      const newScript = document.createElement('script');
      if (src) {
        newScript.src = src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      Array.from(oldScript.attributes).forEach(attr => {
        if (attr.name !== 'src') newScript.setAttribute(attr.name, attr.value);
      });
      document.body.appendChild(newScript);
    });

    // 8. Kích hoạt sự kiện lifecycle để các module trang (Chart.js, schedules, trainers) khởi tạo
    setTimeout(() => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      window.dispatchEvent(new Event('load'));
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }, 15);

  } catch (err) {
    console.error('Lỗi khi điều hướng mượt:', err);
    window.location.href = nextUrl.href;
  } finally {
    isNavigating = false;
  }
}

// Bắt sự kiện click trên toàn bộ liên kết nội bộ
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  // Bỏ qua các liên kết không phù hợp (tab mới, download, anchor hash, external)
  if (link.target && link.target !== '_self') return;
  if (link.hasAttribute('download')) return;
  if (href.startsWith('#') || href.startsWith('javascript:')) return;

  const targetUrl = new URL(href, location.origin);
  if (targetUrl.origin !== location.origin) return;

  const path = targetUrl.pathname;
  // Chỉ can thiệp các trang HTML nội bộ
  if (!path.endsWith('.html') && path !== '/' && !path.endsWith('/')) return;

  e.preventDefault();
  navigateTo(targetUrl.href);
});

// Hỗ trợ nút Back / Forward của trình duyệt
window.addEventListener('popstate', () => {
  navigateTo(location.href, false);
});

// Khởi tạo Sidebar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
  loadSidebar();
}
