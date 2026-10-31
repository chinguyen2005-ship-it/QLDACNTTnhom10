'use strict';

/**
 * FitManage Topbar Controls - Unified Language Switcher & Notification Flyout
 * Chuẩn Motion & Design System Material 3 / Tailwind
 * - Chuyển đổi ngôn ngữ VN/EN động toàn trang (Zero reload or smooth re-render)
 * - Bảng thông báo tương tác thông minh (AI Alert, Contract Expiry, Class Full, RFID)
 * - Tự động đồng bộ trên toàn bộ các trang trong hệ thống
 */

(() => {
  // =========================================================================
  // 1. I18N DICTIONARY & STATE
  // =========================================================================
  const I18N = {
    vi: {
      lang_switched: "Đã chuyển sang Tiếng Việt",
      notifications: "Thông báo hệ thống",
      unread_count: "{n} mới",
      mark_all_read: "Đánh dấu tất cả đã đọc",
      no_notifications: "Không có thông báo mới",
      filter_all: "Tất cả",
      filter_ai: "Cảnh báo AI",
      filter_contract: "Hợp đồng",
      filter_operations: "Vận hành",
      view_all: "Xem tất cả thông báo",
      live_status: "07:00 – 23:00 Trực tiếp",
      search_placeholder: "Tìm kiếm hội viên, hợp đồng, lớp học... (Ctrl+K)",
      role_admin: "Quản trị viên",
      role_staff: "Nhân viên",
      role_trainer: "Huấn luyện viên",
      role_member: "Hội viên",
      role_director: "Giám đốc điều hành",

      // Navigation & Sidebar
      nav_ops_group: "Vận hành & Lịch tập",
      nav_dashboard: "Bảng điều khiển",
      nav_schedules: "Lịch & Đăng ký lớp học",
      nav_center_group: "Quản lý trung tâm",
      nav_members: "Quản lý hội viên",
      nav_packages: "Hợp đồng & Gói tập",
      nav_trainers: "Quản lý Huấn luyện viên",
      nav_ai_group: "Trí tuệ nhân tạo & Báo cáo",
      nav_ai_retention: "Trợ lý AI gia hạn",
      nav_retention_report: "Báo cáo tỷ lệ gia hạn",
      nav_templates: "Mẫu Email & Tin nhắn",
      nav_logout: "Đăng xuất",

      // Buttons
      btn_refresh: "Tải lại",
      btn_add_class: "+ Mở lớp mới",
      btn_book_class: "Đăng ký lớp cho hội viên",
      btn_ai_suggest: "✨ Đề xuất lịch AI",
      btn_new_contract: "+ Lập Hợp đồng mới",
      btn_contract_detail: "Chi tiết Hợp đồng",
      btn_new_package: "+ Tạo gói tập mới",
      btn_export_excel: "Xuất Excel (Export)",
      btn_add_trainer: "+ Thêm HLV mới",
      btn_add_member: "+ Thêm hội viên",
      btn_save: "Lưu thay đổi",
      btn_cancel: "Hủy",
      btn_close: "Đóng",

      // Notification Items
      notif_1_title: "Cảnh báo nguy cơ huỷ thẻ (88%)",
      notif_1_desc: "Hội viên Sarah Mitchell (Gói VIP 12T) giảm tần suất tập 65% trong 30 ngày qua. Đề xuất gửi voucher giảm 20% tái ký.",
      notif_1_action: "Mở AI Copilot →",
      notif_2_title: "3 Hợp đồng sắp hết hạn trong 7 ngày",
      notif_2_desc: "Trần Văn Nam, Lê Thảo Linh, Đỗ Quốc Thái cần được tư vấn gia hạn trước ngày 05/11.",
      notif_2_action: "Xem hợp đồng →",
      notif_3_title: "Lớp Sound Bath & Yin Yoga đã đầy",
      notif_3_desc: "Khung giờ 09:00 Chủ Nhật đã đạt 15/15 chỗ. Có 4 hội viên đăng ký vào hàng đợi Waitlist.",
      notif_3_action: "Xem lịch lớp →",
      notif_4_title: "Hội viên quét thẻ Check-in thành công",
      notif_4_desc: "Hội viên David Trần (#HV-1011) vừa quét mã RFID qua cổng turnstile tại CS1 Flagship.",
      notif_4_action: "Xem chi tiết →"
    },
    en: {
      lang_switched: "Switched to English",
      notifications: "System Notifications",
      unread_count: "{n} new",
      mark_all_read: "Mark all as read",
      no_notifications: "No new notifications",
      filter_all: "All",
      filter_ai: "AI Alerts",
      filter_contract: "Contracts",
      filter_operations: "Operations",
      view_all: "View all notifications",
      live_status: "07:00 – 23:00 Live",
      search_placeholder: "Search members, contracts, classes... (Ctrl+K)",
      role_admin: "Administrator",
      role_staff: "Staff",
      role_trainer: "Personal Trainer",
      role_member: "Member",
      role_director: "Club Director",

      // Navigation & Sidebar
      nav_ops_group: "Operations & Schedules",
      nav_dashboard: "Dashboard",
      nav_schedules: "Class Timetable & Booking",
      nav_center_group: "Club Management",
      nav_members: "Member Management",
      nav_packages: "Contracts & Packages",
      nav_trainers: "Trainer Directory",
      nav_ai_group: "AI Intelligence & Reports",
      nav_ai_retention: "AI Retention Copilot",
      nav_retention_report: "Retention Reports",
      nav_templates: "Message & Email Templates",
      nav_logout: "Sign Out",

      // Buttons
      btn_refresh: "Refresh",
      btn_add_class: "+ Add Class",
      btn_book_class: "Book Class for Member",
      btn_ai_suggest: "✨ AI Schedule Suggestion",
      btn_new_contract: "+ New Contract",
      btn_contract_detail: "Contract Details",
      btn_new_package: "+ Create Package",
      btn_export_excel: "Export Excel",
      btn_add_trainer: "+ Add Trainer",
      btn_add_member: "+ Add Member",
      btn_save: "Save Changes",
      btn_cancel: "Cancel",
      btn_close: "Close",

      // Notification Items
      notif_1_title: "High Churn Risk Warning (88%)",
      notif_1_desc: "Member Sarah Mitchell (VIP 12M) attendance dropped 65% in the last 30 days. Recommend sending 20% comeback voucher.",
      notif_1_action: "Open AI Copilot →",
      notif_2_title: "3 Contracts Expiring within 7 Days",
      notif_2_desc: "Tran Van Nam, Le Thao Linh, Do Quoc Thai require renewal follow-up before Nov 5.",
      notif_2_action: "View Contracts →",
      notif_3_title: "Sound Bath & Yin Yoga Full Capacity",
      notif_3_desc: "Sunday 09:00 slot reached 15/15 capacity. 4 members queued on the waitlist.",
      notif_3_action: "View Timetable →",
      notif_4_title: "RFID Check-in Successful",
      notif_4_desc: "Member David Tran (#HV-1011) just scanned RFID turnstile at Flagship CS1.",
      notif_4_action: "View Details →"
    }
  };

  // =========================================================================
  // 2. NOTIFICATIONS DATA STORE
  // =========================================================================
  const NOTIFICATIONS_SEED = [
    {
      id: "notif-1",
      category: "ai",
      icon: "auto_awesome",
      badgeVi: "AI Copilot",
      badgeEn: "AI Copilot",
      timeVi: "10 phút trước",
      timeEn: "10 mins ago",
      titleKey: "notif_1_title",
      descKey: "notif_1_desc",
      actionKey: "notif_1_action",
      url: "/ai-retention-copilot.html"
    },
    {
      id: "notif-2",
      category: "contract",
      icon: "warning",
      badgeVi: "Hợp đồng",
      badgeEn: "Contract",
      timeVi: "45 phút trước",
      timeEn: "45 mins ago",
      titleKey: "notif_2_title",
      descKey: "notif_2_desc",
      actionKey: "notif_2_action",
      url: "/packages.html"
    },
    {
      id: "notif-3",
      category: "operations",
      icon: "event_seat",
      badgeVi: "Lớp học",
      badgeEn: "Class",
      timeVi: "2 giờ trước",
      timeEn: "2 hours ago",
      titleKey: "notif_3_title",
      descKey: "notif_3_desc",
      actionKey: "notif_3_action",
      url: "/schedules.html"
    },
    {
      id: "notif-4",
      category: "operations",
      icon: "badge",
      badgeVi: "Check-in",
      badgeEn: "Check-in",
      timeVi: "3 giờ trước",
      timeEn: "3 hours ago",
      titleKey: "notif_4_title",
      descKey: "notif_4_desc",
      actionKey: "notif_4_action",
      url: "/members.html"
    }
  ];

  let currentLang = localStorage.getItem('fitmanage_lang') || 'vi';
  let activeTab = 'all';

  function getReadNotifs() {
    try {
      return JSON.parse(localStorage.getItem('fitmanage_read_notifs') || '[]');
    } catch {
      return [];
    }
  }

  function setReadNotifs(list) {
    localStorage.setItem('fitmanage_read_notifs', JSON.stringify(list));
  }

  function getUnreadCount() {
    const read = new Set(getReadNotifs());
    return NOTIFICATIONS_SEED.filter(n => !read.has(n.id)).length;
  }

  // =========================================================================
  // 3. TOAST NOTIFICATION HELPER
  // =========================================================================
  function showToast(message, iconName = 'check_circle') {
    let toast = document.getElementById('fmTopbarToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fmTopbarToast';
      toast.className = 'fm-topbar-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="material-symbols-outlined toast-icon">${iconName}</span><span>${message}</span>`;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  // =========================================================================
  // 4. LANGUAGE SWITCHING ENGINE
  // =========================================================================
  function setLanguage(lang, triggerToast = true) {
    if (!['vi', 'en'].includes(lang)) lang = 'vi';
    currentLang = lang;
    localStorage.setItem('fitmanage_lang', lang);
    document.documentElement.lang = lang;

    // Update Language Toggle Buttons in DOM
    document.querySelectorAll('.fm-lang-btn').forEach(btn => {
      const btnLang = btn.dataset.lang;
      btn.classList.toggle('active', btnLang === lang);
    });

    // Translate DOM Text
    applyTranslations();

    // Re-render Notification Flyout if open or present
    renderNotificationFlyout();

    if (triggerToast) {
      showToast(I18N[lang].lang_switched, 'language');
    }

    // Dispatch Event
    window.dispatchEvent(new CustomEvent('fitmanage:lang-change', { detail: { lang } }));
  }

  function t(key, fallback = '') {
    return I18N[currentLang]?.[key] || fallback || key;
  }

  function applyTranslations() {
    const dict = I18N[currentLang];
    if (!dict) return;

    // 1. Sidebar Nav
    document.querySelectorAll('.fm-group').forEach(group => {
      const h2 = group.querySelector('h2');
      if (!h2) return;
      const text = h2.textContent.trim();
      if (text.includes('Vận hành') || text.includes('Operations')) h2.textContent = dict.nav_ops_group;
      else if (text.includes('Quản lý trung tâm') || text.includes('Club Management')) h2.textContent = dict.nav_center_group;
      else if (text.includes('Trí tuệ') || text.includes('AI Intelligence')) h2.textContent = dict.nav_ai_group;
    });

    const navMap = {
      dashboard: dict.nav_dashboard,
      calendar: dict.nav_schedules,
      users: dict.nav_members,
      contract: dict.nav_packages,
      trainer: dict.nav_trainers,
      ai: dict.nav_ai_retention,
      report: dict.nav_retention_report,
      mail: dict.nav_templates
    };

    document.querySelectorAll('.fm-link[data-section]').forEach(link => {
      const section = link.dataset.section;
      const label = link.querySelector('.fm-label');
      if (label && navMap[section]) {
        label.textContent = navMap[section];
      }
    });

    const logoutBtn = document.querySelector('[data-auth-logout]');
    if (logoutBtn) logoutBtn.textContent = dict.nav_logout;

    // 2. User Role in Topbar
    document.querySelectorAll('[data-user-role]').forEach(el => {
      const user = window.FitManageAuth?.current();
      if (user) {
        el.textContent = user.role === 'Admin' ? dict.role_admin : dict.role_staff;
      }
    });

    // 3. Breadcrumb Home
    document.querySelectorAll('header a[href="/index.html"], header a[href="/dashboard.html"]').forEach(a => {
      if (a.textContent.trim() === 'Trang chủ' || a.textContent.trim() === 'Home') {
        a.textContent = currentLang === 'en' ? 'Home' : 'Trang chủ';
      }
    });

    // 4. Live Badge
    document.querySelectorAll('header .font-semibold, header span').forEach(el => {
      if (el.textContent.includes('07:00 – 23:00')) {
        el.textContent = dict.live_status;
      }
    });

    // 5. Search Placeholder
    document.querySelectorAll('header input[type="text"]').forEach(input => {
      input.placeholder = dict.search_placeholder;
    });

    // 6. Action Buttons
    document.querySelectorAll('button, a').forEach(el => {
      const txt = el.textContent.trim();
      if (txt === 'Tải lại' || txt === 'Refresh') {
        el.innerHTML = `<span class="material-symbols-outlined text-lg">refresh</span>${dict.btn_refresh}`;
      } else if (txt.includes('Mở lớp mới') || txt.includes('Add Class')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px]">add</span><span>${dict.btn_add_class}</span>`;
      } else if (txt.includes('Đăng ký lớp cho hội viên') || txt.includes('Book Class for Member')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px]">how_to_reg</span><span>${dict.btn_book_class}</span>`;
      } else if (txt.includes('Đề xuất lịch AI') || txt.includes('AI Schedule Suggestion')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px] text-yellow-300">auto_awesome</span><span>${dict.btn_ai_suggest}</span>`;
      } else if (txt.includes('Lập Hợp đồng mới') || txt.includes('New Contract')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px]">add</span><span>${dict.btn_new_contract}</span>`;
      } else if (txt.includes('Tạo gói tập mới') || txt.includes('Create Package')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px]">add_circle</span><span>${dict.btn_new_package}</span>`;
      } else if (txt.includes('Xuất Excel') || txt.includes('Export Excel')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[18px]">download</span><span>${dict.btn_export_excel}</span>`;
      } else if (txt.includes('Thêm HLV mới') || txt.includes('Add Trainer')) {
        el.innerHTML = `<span class="material-symbols-outlined text-[20px]">add</span><span>${dict.btn_add_trainer}</span>`;
      }
    });
  }

  // =========================================================================
  // 5. NOTIFICATION FLYOUT RENDERING & LOGIC
  // =========================================================================
  function renderNotificationFlyout() {
    let flyout = document.getElementById('fmNotificationFlyout');
    if (!flyout) return;

    const dict = I18N[currentLang];
    const readSet = new Set(getReadNotifs());
    const unreadCount = getUnreadCount();

    // Filter items based on activeTab
    const filtered = NOTIFICATIONS_SEED.filter(item => {
      if (activeTab === 'all') return true;
      if (activeTab === 'ai') return item.category === 'ai';
      if (activeTab === 'contract') return item.category === 'contract';
      if (activeTab === 'operations') return item.category === 'operations';
      return true;
    });

    flyout.innerHTML = `
      <div class="fm-notif-header">
        <div class="fm-notif-title-wrap">
          <span class="fm-notif-title">${dict.notifications}</span>
          ${unreadCount > 0 ? `<span class="fm-notif-count-pill">${dict.unread_count.replace('{n}', unreadCount)}</span>` : ''}
        </div>
        <button type="button" class="fm-notif-mark-read" id="fmMarkAllReadBtn">
          <span class="material-symbols-outlined text-[16px]">done_all</span>
          <span>${dict.mark_all_read}</span>
        </button>
      </div>

      <div class="fm-notif-tabs">
        <button type="button" class="fm-notif-tab ${activeTab === 'all' ? 'active' : ''}" data-tab="all">
          ${dict.filter_all} (${NOTIFICATIONS_SEED.length})
        </button>
        <button type="button" class="fm-notif-tab ${activeTab === 'ai' ? 'active' : ''}" data-tab="ai">
          ✨ ${dict.filter_ai} (1)
        </button>
        <button type="button" class="fm-notif-tab ${activeTab === 'contract' ? 'active' : ''}" data-tab="contract">
          📄 ${dict.filter_contract} (1)
        </button>
        <button type="button" class="fm-notif-tab ${activeTab === 'operations' ? 'active' : ''}" data-tab="operations">
          ⏱️ ${dict.filter_operations} (2)
        </button>
      </div>

      <div class="fm-notif-list">
        ${filtered.length === 0 ? `
          <div class="p-8 text-center text-slate-400 text-xs">
            <span class="material-symbols-outlined text-3xl mb-2 text-slate-300">notifications_off</span>
            <p>${dict.no_notifications}</p>
          </div>
        ` : filtered.map(item => {
          const isUnread = !readSet.has(item.id);
          const badgeText = currentLang === 'en' ? item.badgeEn : item.badgeVi;
          const timeText = currentLang === 'en' ? item.timeEn : item.timeVi;
          const title = dict[item.titleKey] || '';
          const desc = dict[item.descKey] || '';
          const actionText = dict[item.actionKey] || '';

          return `
            <a href="${item.url}" class="fm-notif-item ${isUnread ? 'is-unread' : ''}" data-id="${item.id}">
              <div class="fm-notif-icon ${item.category}">
                <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
              </div>
              <div class="fm-notif-content">
                <div class="fm-notif-meta">
                  <span class="fm-notif-badge ${item.category}">${badgeText}</span>
                  <span class="fm-notif-time">${timeText}</span>
                </div>
                <div class="fm-notif-item-title">${title}</div>
                <div class="fm-notif-item-desc">${desc}</div>
                <span class="fm-notif-link">${actionText}</span>
              </div>
              ${isUnread ? `<span class="fm-notif-unread-dot"></span>` : ''}
            </a>
          `;
        }).join('')}
      </div>

      <div class="fm-notif-footer">
        <span class="text-[11px] text-slate-400">FitManage Push Engine v4.2</span>
        <button type="button" class="fm-notif-footer-link" id="fmCloseNotifBtn">${dict.btn_close}</button>
      </div>
    `;

    // Wire up Mark All As Read
    flyout.querySelector('#fmMarkAllReadBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setReadNotifs(NOTIFICATIONS_SEED.map(n => n.id));
      updateBellBadge();
      renderNotificationFlyout();
      showToast(dict.mark_all_read, 'done_all');
    });

    // Wire up Tab switching
    flyout.querySelectorAll('.fm-notif-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        activeTab = tabBtn.dataset.tab;
        renderNotificationFlyout();
      });
    });

    // Wire up Click on Item
    flyout.querySelectorAll('.fm-notif-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const id = itemEl.dataset.id;
        if (id) {
          const reads = getReadNotifs();
          if (!reads.includes(id)) {
            reads.push(id);
            setReadNotifs(reads);
            updateBellBadge();
          }
        }
        closeNotificationFlyout();
      });
    });

    // Wire up Close Button
    flyout.querySelector('#fmCloseNotifBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeNotificationFlyout();
    });
  }

  function updateBellBadge() {
    const unread = getUnreadCount();
    document.querySelectorAll('.fm-bell-btn').forEach(btn => {
      let badge = btn.querySelector('.fm-bell-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'fm-bell-badge';
        btn.appendChild(badge);
      }
      if (unread > 0) {
        badge.textContent = unread;
        badge.classList.remove('is-hidden');
      } else {
        badge.classList.add('is-hidden');
      }
    });
  }

  function toggleNotificationFlyout() {
    const flyout = document.getElementById('fmNotificationFlyout');
    if (!flyout) return;
    const isOpen = flyout.classList.contains('is-open');
    if (isOpen) {
      closeNotificationFlyout();
    } else {
      openNotificationFlyout();
    }
  }

  function openNotificationFlyout() {
    const flyout = document.getElementById('fmNotificationFlyout');
    if (!flyout) return;
    renderNotificationFlyout();
    flyout.classList.add('is-open');
    document.querySelectorAll('.fm-bell-btn').forEach(btn => btn.classList.add('is-active'));
  }

  function closeNotificationFlyout() {
    const flyout = document.getElementById('fmNotificationFlyout');
    if (!flyout) return;
    flyout.classList.remove('is-open');
    document.querySelectorAll('.fm-bell-btn').forEach(btn => btn.classList.remove('is-active'));
  }

  // =========================================================================
  // 6. MOUNTING CONTROLS ONTO HEADER
  // =========================================================================
  function mountControls() {
    // 1. Mount or Upgrade Language Switcher in Header
    document.querySelectorAll('header').forEach(header => {
      // Find language toggle container or elements with VN / EN
      let langContainer = header.querySelector('.fm-lang-toggle');
      if (!langContainer) {
        // Find existing static button or container (strictly targeting language pill)
        const existingLangWrapper = Array.from(header.querySelectorAll('div, button')).find(el => {
          if (el === header) return false;
          if (el.querySelector('.material-symbols-outlined, input, [data-user-name], canvas, table')) return false;
          const t = el.textContent.trim().replace(/\s+/g, ' ');
          if (t.length > 20) return false;
          return (t.includes('VN') && t.includes('EN')) || t === 'VN | EN' || t.includes('VN VI') || t === 'VN' || t === 'EN';
        });

        if (existingLangWrapper) {
          let replaceTarget = existingLangWrapper;
          const parent = existingLangWrapper.parentElement;
          if (parent && parent !== header && parent.textContent.trim().length <= 25 && !parent.querySelector('.material-symbols-outlined, input, [data-user-name]')) {
            replaceTarget = parent;
          }
          langContainer = document.createElement('div');
          langContainer.className = 'fm-lang-toggle';
          langContainer.innerHTML = `
            <button type="button" class="fm-lang-btn ${currentLang === 'vi' ? 'active' : ''}" data-lang="vi">VN</button>
            <button type="button" class="fm-lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
          `;
          replaceTarget.replaceWith(langContainer);
        }
      }

      // Bind Language Click Events
      header.querySelectorAll('.fm-lang-btn').forEach(btn => {
        if (!btn._bound) {
          btn._bound = true;
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setLanguage(btn.dataset.lang, true);
          });
        }
      });

      // 2. Mount or Upgrade Bell Notification Button
      const bellBtn = Array.from(header.querySelectorAll('button')).find(btn => {
        return btn.querySelector('.material-symbols-outlined')?.textContent.trim() === 'notifications' ||
               btn.getAttribute('title')?.includes('Thông báo') ||
               btn.getAttribute('title')?.includes('Notification');
      });

      if (bellBtn && !bellBtn._bound) {
        bellBtn._bound = true;
        bellBtn.classList.add('fm-bell-btn');
        bellBtn.setAttribute('type', 'button');
        bellBtn.setAttribute('aria-label', 'Thông báo hệ thống');

        // Remove old static red dot
        bellBtn.querySelectorAll('.bg-rose-500, .bg-error').forEach(d => d.remove());

        bellBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleNotificationFlyout();
        });
      }

      // 3. Update User Avatar Initials and Name
      const user = window.FitManageAuth?.current();
      if (user) {
        const username = user.username || '';
        const initials = username.length >= 2 ? username.slice(0, 2).toUpperCase() : 'AD';
        const avatarBox = header.querySelector('.w-8.h-8, .rounded-full.bg-\\[\\#6D28D9\\], .rounded-full.bg-\\[\\#0B2238\\]');
        if (avatarBox && !avatarBox.querySelector('img')) {
          avatarBox.textContent = initials;
        }
      }
    });

    // 4. Ensure Notification Flyout element is in DOM
    if (!document.getElementById('fmNotificationFlyout')) {
      const flyout = document.createElement('div');
      flyout.id = 'fmNotificationFlyout';
      flyout.className = 'fm-notification-flyout';
      document.body.appendChild(flyout);
      renderNotificationFlyout();
    }

    // 5. Update Badge Count
    updateBellBadge();

    // 6. Apply initial translations
    applyTranslations();
  }

  // =========================================================================
  // 7. GLOBAL EVENT LISTENERS (CLICK OUTSIDE & ESCAPE)
  // =========================================================================
  document.addEventListener('click', (e) => {
    const flyout = document.getElementById('fmNotificationFlyout');
    if (!flyout || !flyout.classList.contains('is-open')) return;

    const clickedBell = e.target.closest('.fm-bell-btn');
    const clickedInside = e.target.closest('#fmNotificationFlyout');

    if (!clickedBell && !clickedInside) {
      closeNotificationFlyout();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNotificationFlyout();
    }
  });

  // =========================================================================
  // 8. INITIALIZATION
  // =========================================================================
  const init = () => {
    mountControls();
    // Observe DOM changes in case header or sidebar renders asynchronously
    let scheduled = false;
    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(() => {
        scheduled = false;
        mountControls();
      }, 50);
    }).observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Expose Global API for manual triggering if needed
  window.FitManageTopbar = {
    setLanguage,
    toggleNotifications: toggleNotificationFlyout,
    openNotifications: openNotificationFlyout,
    closeNotifications: closeNotificationFlyout,
    t
  };
})();
