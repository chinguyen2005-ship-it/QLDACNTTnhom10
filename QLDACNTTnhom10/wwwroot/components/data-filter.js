/**
 * FITMANAGE GYM & YOGA SUITE - DATA FILTER COMPONENT CONTROLLER
 * Task: TASK-376 (Story cha: TASK-332 Import / Export Dữ liệu)
 * Pure JavaScript, Zero Dependencies, Clean Code, Fully Modular
 */

(function() {
  'use strict';

  window.FitManageDataFilter = {
    // Current filter state
    state: {
      search: '',
      branch: 'all',
      package: 'all',
      timeRange: 'this_month',
      status: 'all',
      advanced: {
        trainer: 'all',
        attendance: 'all',
        minPrice: '',
        maxPrice: '',
        source: 'all'
      }
    },

    listeners: [],

    // Register callback for filter state change
    onChange: function(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
    },

    // Emit change to all registered listeners and DOM CustomEvent
    emitChange: function() {
      this.updateActiveTags();
      this.updateAdvancedCountBadge();
      const payload = JSON.parse(JSON.stringify(this.state));
      this.listeners.forEach(function(fn) {
        fn(payload);
      });
      document.dispatchEvent(new CustomEvent('fitmanage:filterChange', { detail: payload }));
    },

    // Update the counter badge on the "Bộ lọc khác" button
    updateAdvancedCountBadge: function() {
      const adv = this.state.advanced;
      let count = 0;
      if (adv.trainer !== 'all') count++;
      if (adv.attendance !== 'all') count++;
      if (adv.source !== 'all') count++;
      if (adv.minPrice || adv.maxPrice) count++;

      const badge = document.getElementById('filterAdvancedCountBadge');
      if (badge) {
        if (count > 0) {
          badge.textContent = count;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
    },

    // Render active filter chips below the status chips
    updateActiveTags: function() {
      const container = document.getElementById('activeFilterTagsContainer');
      if (!container) return;
      container.innerHTML = '';

      const tags = [];
      const self = this;

      if (this.state.search) {
        tags.push({ key: 'search', label: 'Từ khóa: "' + this.state.search + '"' });
      }
      if (this.state.branch !== 'all') {
        const branchMap = { q1: 'CN Quận 1', td: 'CN Thảo Điền', ts: 'CN Trung Sơn' };
        tags.push({ key: 'branch', label: branchMap[this.state.branch] || this.state.branch });
      }
      if (this.state.package !== 'all') {
        const pkgMap = { vip_diamond: 'VIP Diamond', yoga_pure: 'Yoga Pure', classic_gym: 'Classic Gym', pilates: 'Pilates' };
        tags.push({ key: 'package', label: pkgMap[this.state.package] || this.state.package });
      }
      if (this.state.advanced.trainer !== 'all') {
        const ptMap = { tuananh: 'PT Tuấn Anh', celine: 'Coach Celine', minhtri: 'PT Minh Trí', no_pt: 'Không PT' };
        tags.push({ key: 'adv_trainer', label: ptMap[this.state.advanced.trainer] || this.state.advanced.trainer });
      }

      if (tags.length > 0) {
        tags.forEach(function(tag) {
          const chip = document.createElement('span');
          chip.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EFF4FF] border border-slate-200 text-[11px] font-medium text-[#0B1C30] shadow-2xs';
          chip.innerHTML = tag.label + '<button type="button" class="text-slate-400 hover:text-slate-700 ml-0.5" title="Xóa điều kiện này">&times;</button>';
          chip.querySelector('button').addEventListener('click', function() {
            self.removeTag(tag.key);
          });
          container.appendChild(chip);
        });

        const clearAllBtn = document.createElement('button');
        clearAllBtn.type = 'button';
        clearAllBtn.className = 'text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition-colors ml-1';
        clearAllBtn.textContent = 'Xóa lọc';
        clearAllBtn.addEventListener('click', function() {
          self.reset();
        });
        container.appendChild(clearAllBtn);
      }
    },

    // Remove single active filter tag
    removeTag: function(key) {
      if (key === 'search') {
        this.state.search = '';
        const input = document.getElementById('filterSearchInput');
        if (input) input.value = '';
        const clearBtn = document.getElementById('filterClearSearchBtn');
        if (clearBtn) clearBtn.classList.add('hidden');
      } else if (key === 'branch') {
        this.state.branch = 'all';
        const el = document.getElementById('filterBranch');
        if (el) el.value = 'all';
      } else if (key === 'package') {
        this.state.package = 'all';
        const el = document.getElementById('filterPackage');
        if (el) el.value = 'all';
      } else if (key === 'adv_trainer') {
        this.state.advanced.trainer = 'all';
        const el = document.getElementById('advFilterTrainer');
        if (el) el.value = 'all';
      }
      this.emitChange();
    },

    // Reset all filter fields to defaults
    reset: function() {
      this.state.search = '';
      this.state.branch = 'all';
      this.state.package = 'all';
      this.state.timeRange = 'this_month';
      this.state.status = 'all';
      this.state.advanced = {
        trainer: 'all',
        attendance: 'all',
        minPrice: '',
        maxPrice: '',
        source: 'all'
      };

      const searchInput = document.getElementById('filterSearchInput');
      if (searchInput) searchInput.value = '';
      const clearBtn = document.getElementById('filterClearSearchBtn');
      if (clearBtn) clearBtn.classList.add('hidden');

      const branch = document.getElementById('filterBranch');
      if (branch) branch.value = 'all';
      const pkg = document.getElementById('filterPackage');
      if (pkg) pkg.value = 'all';
      const time = document.getElementById('filterTimeRange');
      if (time) time.value = 'this_month';

      const trainer = document.getElementById('advFilterTrainer');
      if (trainer) trainer.value = 'all';
      const attendance = document.getElementById('advFilterAttendance');
      if (attendance) attendance.value = 'all';
      const minP = document.getElementById('advFilterMinPrice');
      if (minP) minP.value = '';
      const maxP = document.getElementById('advFilterMaxPrice');
      if (maxP) maxP.value = '';
      const src = document.getElementById('advFilterSource');
      if (src) src.value = 'all';

      const chips = document.querySelectorAll('#statusChipsContainer .status-chip');
      chips.forEach(function(c) {
        c.classList.remove('active', 'bg-[#0B1C30]', 'text-white', 'border-[#0B1C30]', 'shadow-2xs');
        c.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      const allChip = document.querySelector('#statusChipsContainer [data-status="all"]');
      if (allChip) {
        allChip.classList.add('active', 'bg-[#0B1C30]', 'text-white', 'border-[#0B1C30]', 'shadow-2xs');
        allChip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      }

      this.emitChange();
    },

    // Initialize all event listeners
    init: function() {
      const self = this;

      // 1. Search Input + Debounce
      const searchInput = document.getElementById('filterSearchInput');
      const clearBtn = document.getElementById('filterClearSearchBtn');
      let searchTimeout = null;

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const val = this.value.trim();
          if (clearBtn) {
            if (val.length > 0) {
              clearBtn.classList.remove('hidden');
            } else {
              clearBtn.classList.add('hidden');
            }
          }
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(function() {
            self.state.search = val;
            self.emitChange();
          }, 250);
        });
      }

      if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', function() {
          searchInput.value = '';
          self.state.search = '';
          clearBtn.classList.add('hidden');
          searchInput.focus();
          self.emitChange();
        });
      }

      // 2. Global Keyboard Shortcut (Ctrl+K)
      document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (searchInput) searchInput.focus();
        }
      });

      // 3. Core Dropdowns
      const branch = document.getElementById('filterBranch');
      if (branch) {
        branch.addEventListener('change', function() {
          self.state.branch = this.value;
          self.emitChange();
        });
      }

      const pkg = document.getElementById('filterPackage');
      if (pkg) {
        pkg.addEventListener('change', function() {
          self.state.package = this.value;
          self.emitChange();
        });
      }

      const timeRange = document.getElementById('filterTimeRange');
      if (timeRange) {
        timeRange.addEventListener('change', function() {
          self.state.timeRange = this.value;
          self.emitChange();
        });
      }

      // 4. Status Chips
      const chipsContainer = document.getElementById('statusChipsContainer');
      if (chipsContainer) {
        chipsContainer.addEventListener('click', function(e) {
          const chip = e.target.closest('.status-chip');
          if (!chip) return;

          chipsContainer.querySelectorAll('.status-chip').forEach(function(c) {
            c.classList.remove('active', 'bg-[#0B1C30]', 'text-white', 'border-[#0B1C30]', 'shadow-2xs');
            c.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
          });
          chip.classList.add('active', 'bg-[#0B1C30]', 'text-white', 'border-[#0B1C30]', 'shadow-2xs');
          chip.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

          self.state.status = chip.dataset.status || 'all';
          self.emitChange();
        });
      }

      // 5. Toggle Advanced Filter Panel
      const advToggleBtn = document.getElementById('filterAdvancedToggleBtn');
      const advPanel = document.getElementById('filterAdvancedPanel');
      const closeAdvBtn = document.getElementById('filterCloseAdvancedBtn');

      if (advToggleBtn && advPanel) {
        advToggleBtn.addEventListener('click', function() {
          advPanel.classList.toggle('hidden');
        });
      }

      if (closeAdvBtn && advPanel) {
        closeAdvBtn.addEventListener('click', function() {
          advPanel.classList.add('hidden');
        });
      }

      // 6. Apply & Reset Advanced Filters
      const advApplyBtn = document.getElementById('advFilterApplyBtn');
      if (advApplyBtn) {
        advApplyBtn.addEventListener('click', function() {
          self.state.advanced.trainer = document.getElementById('advFilterTrainer')?.value || 'all';
          self.state.advanced.attendance = document.getElementById('advFilterAttendance')?.value || 'all';
          self.state.advanced.source = document.getElementById('advFilterSource')?.value || 'all';
          self.state.advanced.minPrice = document.getElementById('advFilterMinPrice')?.value || '';
          self.state.advanced.maxPrice = document.getElementById('advFilterMaxPrice')?.value || '';
          self.emitChange();
        });
      }

      const advResetBtn = document.getElementById('advFilterResetBtn');
      if (advResetBtn) {
        advResetBtn.addEventListener('click', function() {
          const trainer = document.getElementById('advFilterTrainer'); if (trainer) trainer.value = 'all';
          const attendance = document.getElementById('advFilterAttendance'); if (attendance) attendance.value = 'all';
          const source = document.getElementById('advFilterSource'); if (source) source.value = 'all';
          const minP = document.getElementById('advFilterMinPrice'); if (minP) minP.value = '';
          const maxP = document.getElementById('advFilterMaxPrice'); if (maxP) maxP.value = '';

          self.state.advanced = { trainer: 'all', attendance: 'all', minPrice: '', maxPrice: '', source: 'all' };
          self.emitChange();
        });
      }

      // 7. Reset Button
      const resetBtn = document.getElementById('filterResetBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          self.reset();
        });
      }

      // 8. Export Excel Dropdown & Triggers (Story TASK-332)
      const exportBtn = document.getElementById('filterExportExcelBtn');
      const exportMenu = document.getElementById('exportExcelMenu');

      if (exportBtn && exportMenu) {
        exportBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          exportMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', function(e) {
          if (!exportMenu.contains(e.target) && !exportBtn.contains(e.target)) {
            exportMenu.classList.add('hidden');
          }
        });

        exportMenu.querySelectorAll('[data-export-type]').forEach(function(item) {
          item.addEventListener('click', function() {
            const type = this.dataset.exportType;
            exportMenu.classList.add('hidden');
            document.dispatchEvent(new CustomEvent('fitmanage:exportExcel', {
              detail: { type: type, filterState: self.state }
            }));
          });
        });
      }

      // Trigger initial state
      this.emitChange();
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.FitManageDataFilter.init();
    });
  } else {
    window.FitManageDataFilter.init();
  }
})();
