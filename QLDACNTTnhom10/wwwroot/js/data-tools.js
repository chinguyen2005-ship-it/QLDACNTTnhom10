'use strict';

async function loadFilter() {
  const mount = document.getElementById('filterMount');
  const status = document.getElementById('filterStatus');
  try {
    const response = await fetch('/components/data-filter.html');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const fragment = new DOMParser().parseFromString(await response.text(), 'text/html');
    const component = fragment.getElementById('fitmanageDataFilter');
    if (!component) throw new Error('Không tìm thấy bộ lọc');
    mount.replaceChildren(document.importNode(component, true));
    document.addEventListener('fitmanage:filterChange', () => {
      status.textContent = 'Đã cập nhật điều kiện lọc. Chưa truy vấn dữ liệu thực tế.';
    });
    document.addEventListener('fitmanage:exportExcel', (e) => {
      status.textContent = 'Đang tải xuống tệp Excel...';
      const a = document.createElement('a');
      a.href = '/api/Reports/export-members';
      a.download = `DanhSachHoiVien_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => { status.textContent = 'Đã xuất thành công tệp Excel danh sách hội viên.'; }, 1500);
      return;
    });
    const script = document.createElement('script');
    script.src = '/components/data-filter.js';
    script.onerror = () => { status.textContent = 'Không tải được chức năng bộ lọc. Hãy tải lại trang.'; };
    document.body.appendChild(script);
  } catch (error) {
    mount.textContent = 'Không tải được bộ lọc. Hãy tải lại trang.';
    console.error(error);
  } finally {
    mount.setAttribute('aria-busy', 'false');
  }
}

loadFilter();
