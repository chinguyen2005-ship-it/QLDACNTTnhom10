// =============================================================================
// packages.js - Quản lý Gói tập (API Service & Mock Data Fallback)
// FitManage Gym & Yoga Suite (TASK-349)
// =============================================================================

const API_BASE = '/api';

// Dữ liệu giả lập (Mock Data) chuẩn theo database PACKAGES
let packagesList = [
  { packageID: 1, packageName: "Gói Gym Cơ Bản (1 Tháng)", durationDays: 30, totalSessions: 30, price: 500000, isActive: true },
  { packageID: 2, packageName: "Gói Gym Tiết Kiệm (3 Tháng)", durationDays: 90, totalSessions: 90, price: 1350000, isActive: true },
  { packageID: 3, packageName: "Gói Gym Toàn Diện (1 Năm)", durationDays: 365, totalSessions: 365, price: 4800000, isActive: true },
  { packageID: 4, packageName: "Gói Yoga VIP (3 Tháng)", durationDays: 90, totalSessions: 72, price: 2100000, isActive: true },
  { packageID: 5, packageName: "Gói Thử Nghiệm 7 Ngày", durationDays: 7, totalSessions: 7, price: 150000, isActive: false }
];

// =============================================================================
// API SERVICE CALLS (fetch API)
// =============================================================================

/**
 * Lấy danh sách gói tập: GET /api/packages
 */
async function fetchPackagesApi() {
  try {
    const res = await fetch(`${API_BASE}/packages`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        packagesList = data;
      }
    }
  } catch (err) {
    console.warn('[API] Lỗi khi gọi GET /api/packages, dùng dữ liệu mẫu cục bộ.', err);
  }
  return packagesList;
}

/**
 * Tạo mới gói tập: POST /api/packages
 */
async function createPackageApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Lỗi khi gọi POST /api/packages, thực thi lưu cục bộ.', err);
  }
  return null;
}

/**
 * Cập nhật gói tập: PUT /api/packages/{id}
 */
async function updatePackageApi(id, payload) {
  try {
    const res = await fetch(`${API_BASE}/packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) return true;
  } catch (err) {
    console.warn('[API] Lỗi khi gọi PUT /api/packages/' + id, err);
  }
  return false;
}

// =============================================================================
// UI RENDERING & CRUD
// =============================================================================

// Render bảng danh sách gói tập
function renderPackagesTable(data) {
  const tbody = document.getElementById("table-packages-body");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">Không tìm thấy gói tập nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(pkg => `
    <tr>
      <td>#${pkg.packageID}</td>
      <td><strong>${pkg.packageName}</strong></td>
      <td>${pkg.durationDays} ngày</td>
      <td>${pkg.totalSessions} buổi</td>
      <td style="color: #38bdf8; font-weight: 600;">${pkg.price.toLocaleString('vi-VN')} đ</td>
      <td>
        <span class="badge ${pkg.isActive ? 'badge-success' : 'badge-danger'}">
          ${pkg.isActive ? 'Đang bán' : 'Tạm ngưng'}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="openEditPackageModal(${pkg.packageID})">✏️ Sửa</button>
        <button class="btn btn-sm btn-secondary" onclick="togglePackageStatus(${pkg.packageID})" style="margin-left: 6px;">
          ${pkg.isActive ? 'Khóa' : 'Kích hoạt'}
        </button>
      </td>
    </tr>
  `).join('');
}

// Tìm kiếm gói tập
function filterPackages() {
  const input = document.getElementById("searchPackageInput");
  if (!input) return;
  const keyword = input.value.toLowerCase().trim();
  const filtered = packagesList.filter(p => p.packageName.toLowerCase().includes(keyword));
  renderPackagesTable(filtered);
}

// Modal Thêm / Sửa
function openCreatePackageModal() {
  document.getElementById("modalTitle").innerText = "Thêm Gói Tập Mới";
  document.getElementById("packageForm").reset();
  document.getElementById("packageId").value = "";
  document.getElementById("packageModal").classList.add("active");
}

function openEditPackageModal(id) {
  const pkg = packagesList.find(p => p.packageID === id);
  if (!pkg) return;

  document.getElementById("modalTitle").innerText = "Chỉnh Sửa Gói Tập #" + id;
  document.getElementById("packageId").value = pkg.packageID;
  document.getElementById("packageName").value = pkg.packageName;
  document.getElementById("durationDays").value = pkg.durationDays;
  document.getElementById("totalSessions").value = pkg.totalSessions;
  document.getElementById("price").value = pkg.price;
  document.getElementById("isActive").value = pkg.isActive ? "true" : "false";

  document.getElementById("packageModal").classList.add("active");
}

function closePackageModal() {
  document.getElementById("packageModal").classList.remove("active");
}

// Lưu Gói tập (Tạo mới hoặc Sửa)
async function handleSavePackage(event) {
  event.preventDefault();

  const id = document.getElementById("packageId").value;
  const name = document.getElementById("packageName").value.trim();
  const duration = parseInt(document.getElementById("durationDays").value);
  const sessions = parseInt(document.getElementById("totalSessions").value);
  const price = parseFloat(document.getElementById("price").value);
  const isActive = document.getElementById("isActive").value === "true";

  const payload = {
    packageName: name,
    durationDays: duration,
    totalSessions: sessions,
    price: price,
    isActive: isActive
  };

  if (id) {
    // Sửa gói
    const index = packagesList.findIndex(p => p.packageID === parseInt(id));
    if (index !== -1) {
      packagesList[index] = { ...packagesList[index], ...payload };
      await updatePackageApi(id, payload);
      alert("Cập nhật gói tập thành công!");
    }
  } else {
    // Thêm mới
    const apiResult = await createPackageApi(payload);
    const newId = apiResult?.packageID || (packagesList.length > 0 ? Math.max(...packagesList.map(p => p.packageID)) + 1 : 1);
    packagesList.unshift({
      packageID: newId,
      ...payload
    });
    alert("Thêm gói tập mới thành công!");
  }

  closePackageModal();
  renderPackagesTable(packagesList);
}

// Bật / tắt trạng thái gói
function togglePackageStatus(id) {
  const pkg = packagesList.find(p => p.packageID === id);
  if (pkg) {
    pkg.isActive = !pkg.isActive;
    updatePackageApi(id, { isActive: pkg.isActive });
    renderPackagesTable(packagesList);
  }
}

// Khởi chạy khi load trang
document.addEventListener("DOMContentLoaded", async () => {
  await fetchPackagesApi();
  renderPackagesTable(packagesList);
});

function handleNavFeature(name) {
  alert(`Tính năng "${name}" đang được kết nối với module hệ thống trong phiên bản kế tiếp.`);
}
