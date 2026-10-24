'use strict';

/**
 * FitManage Unified Sidebar Loader
 * Tự động chèn HTML sidebar dùng chung và kích hoạt (active) mục menu tương ứng
 */
async function loadSidebar() {
  const host = document.querySelector('[data-fitmanage-sidebar]');
  if (!host) return;

  // Bản đồ liên kết file màn hình (bao gồm cả màn hình con / tạo mới / chi tiết) tới mục menu cha
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

  try {
    const response = await fetch('/components/sidebar.html');
    if (!response.ok) throw new Error(`Sidebar HTTP ${response.status}`);
    const template = document.createElement('template');
    template.innerHTML = await response.text();

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
        }
      });
    }

    host.replaceChildren(template.content.cloneNode(true));
  } catch (error) {
    console.error('Không tải được sidebar FitManage:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
  loadSidebar();
}
