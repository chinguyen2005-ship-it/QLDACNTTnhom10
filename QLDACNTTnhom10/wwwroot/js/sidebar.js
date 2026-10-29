'use strict';

/**
 * FitManage Unified Sidebar Loader
 * Tự động chèn HTML sidebar dùng chung và kích hoạt (active) mục menu tương ứng
 * Tích hợp Session Cache chống flicker khi chuyển trang
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

function renderSidebar(htmlString) {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return false;

  const template = document.createElement('template');
  template.innerHTML = htmlString;

  // Xác định tên file từ pathname hiện tại
  const pathParts = location.pathname.split('/').filter(Boolean);
  const rawFile = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'index.html';
  const cleanFile = rawFile.toLowerCase().split('?')[0].split('#')[0];
  const noExtFile = cleanFile.replace(/\.html$/, '');

  const activeSection = sectionMap[cleanFile] || sectionMap[noExtFile];

  // Gán trạng thái active (aria-current="page") cho mục menu tương ứng
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

  // 1. Render tức thì từ cache sessionStorage nếu có (0ms, chống giật nháy)
  let hasRenderedFromCache = false;
  try {
    const cachedHTML = sessionStorage.getItem('fitmanage_sidebar_html');
    if (cachedHTML) {
      renderSidebar(cachedHTML);
      hasRenderedFromCache = true;
    }
  } catch (e) {
    // SessionStorage có thể bị hạn chế trong một số ngữ cảnh bảo mật
  }

  // 2. Fetch nội dung mới nhất từ server
  try {
    const response = await fetch('/components/sidebar.html');
    if (!response.ok) throw new Error(`Sidebar HTTP ${response.status}`);
    const html = await response.text();
    
    // Nếu chưa có cache hoặc cache khác phiên bản server, render lại
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
  loadSidebar();
}
