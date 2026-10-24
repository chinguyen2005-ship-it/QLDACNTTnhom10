// =========================================================
// contracts.js - Lập & Quản lý Hợp đồng (Mock Data & API ready)
// =========================================================

// Dữ liệu Gói tập mẫu để đổ vào Dropdown
const packagesCatalog = [
  { packageID: 1, packageName: "Gói Gym Cơ Bản (1 Tháng)", durationDays: 30, totalSessions: 30, price: 500000 },
  { packageID: 2, packageName: "Gói Gym Tiết Kiệm (3 Tháng)", durationDays: 90, totalSessions: 90, price: 1350000 },
  { packageID: 3, packageName: "Gói Gym Toàn Diện (1 Năm)", durationDays: 365, totalSessions: 365, price: 4800000 },
  { packageID: 4, packageName: "Gói Yoga VIP (3 Tháng)", durationDays: 90, totalSessions: 72, price: 2100000 }
];

// Danh sách Hợp đồng mẫu chuẩn bảng CONTRACTS
let contractsList = [
  {
    contractID: 101,
    memberName: "Nguyễn Văn An",
    phone: "0901234567",
    packageName: "Gói Gym Cơ Bản (1 Tháng)",
    startDate: "2026-09-01",
    endDate: "2026-10-01",
    remainingSessions: 24,
    totalAmount: 500000,
    status: "Active"
  },
  {
    contractID: 102,
    memberName: "Trần Thị Bích",
    phone: "0912345678",
    packageName: "Gói Yoga VIP (3 Tháng)",
    startDate: "2026-08-15",
    endDate: "2026-11-15",
    remainingSessions: 58,
    totalAmount: 2000000,
    status: "Active"
  },
  {
    contractID: 103,
    memberName: "Lê Hoàng Nam",
    phone: "0988776655",
    packageName: "Gói Gym Tiết Kiệm (3 Tháng)",
    startDate: "2026-05-01",
    endDate: "2026-08-01",
    remainingSessions: 0,
    totalAmount: 1350000,
    status: "Expired"
  }
];

// Đổ dữ liệu vào bảng Hợp đồng
function renderContractsTable(data) {
  const tbody = document.getElementById("table-contracts-body");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 32px;">Không tìm thấy hợp đồng nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(c => `
    <tr>
      <td><strong>#${c.contractID}</strong></td>
      <td>${c.memberName}</td>
      <td>${c.phone}</td>
      <td>${c.packageName}</td>
      <td>${formatDate(c.startDate)} - ${formatDate(c.endDate)}</td>
      <td>${c.remainingSessions} buổi</td>
      <td style="color: #34d399; font-weight: 600;">${c.totalAmount.toLocaleString('vi-VN')} đ</td>
      <td>
        <span class="badge ${c.status === 'Active' ? 'badge-success' : (c.status === 'Expired' ? 'badge-danger' : 'badge-warning')}">
          ${c.status === 'Active' ? 'Đang hiệu lực' : (c.status === 'Expired' ? 'Hết hạn' : 'Đã gia hạn')}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="alert('In phiếu hợp đồng #' + ${c.contractID})">🖨️ In</button>
      </td>
    </tr>
  `).join('');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Lọc hợp đồng
function filterContracts() {
  const keyword = document.getElementById("searchContractInput").value.toLowerCase().trim();
  const filtered = contractsList.filter(c =>
    c.memberName.toLowerCase().includes(keyword) || c.phone.includes(keyword)
  );
  renderContractsTable(filtered);
}

// Khởi tạo Dropdown gói tập
function populatePackagesDropdown() {
  const select = document.getElementById("packageSelect");
  if (!select) return;

  select.innerHTML = '<option value="">-- Chọn Gói Tập --</option>' +
    packagesCatalog.map(p => `
      <option value="${p.packageID}" data-price="${p.price}" data-days="${p.durationDays}">
        ${p.packageName} (${p.price.toLocaleString('vi-VN')} đ - ${p.durationDays} ngày)
      </option>
    `).join('');
}

// Khi người dùng chọn Gói tập
function onPackageSelected() {
  calculateTotal();
}

// Tính toán tổng tiền & ngày kết thúc
function calculateTotal() {
  const packageSelect = document.getElementById("packageSelect");
  const selectedOption = packageSelect.options[packageSelect.selectedIndex];

  if (!selectedOption || !selectedOption.value) {
    document.getElementById("labelOriginalPrice").innerText = "0 đ";
    document.getElementById("labelEndDate").innerText = "Chưa chọn gói";
    document.getElementById("labelFinalTotal").innerText = "0 đ";
    return;
  }

  const price = parseFloat(selectedOption.getAttribute("data-price")) || 0;
  const days = parseInt(selectedOption.getAttribute("data-days")) || 0;
  const discount = parseFloat(document.getElementById("discountAmount").value) || 0;

  // Tính ngày kết thúc
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);

  const finalTotal = Math.max(0, price - discount);

  document.getElementById("labelOriginalPrice").innerText = price.toLocaleString('vi-VN') + " đ";
  document.getElementById("labelEndDate").innerText = endDate.toLocaleDateString('vi-VN');
  document.getElementById("labelFinalTotal").innerText = finalTotal.toLocaleString('vi-VN') + " đ";
}

// Modal Lập HĐ
function openCreateContractModal() {
  document.getElementById("contractForm").reset();
  populatePackagesDropdown();
  calculateTotal();
  document.getElementById("contractModal").classList.add("active");
}

function closeContractModal() {
  document.getElementById("contractModal").classList.remove("active");
}

// Submit Lập HĐ (Chuẩn theo DTO CreateContractRequest)
async function handleCreateContract(event) {
  event.preventDefault();

  const memberSelect = document.getElementById("memberSelect");
  const packageSelect = document.getElementById("packageSelect");
  const memberName = memberSelect.options[memberSelect.selectedIndex].text;
  const packageOption = packageSelect.options[packageSelect.selectedIndex];
  const packageName = packageOption.text.split('(')[0].trim();
  const price = parseFloat(packageOption.getAttribute("data-price")) || 0;
  const days = parseInt(packageOption.getAttribute("data-days")) || 0;
  const discount = parseFloat(document.getElementById("discountAmount").value) || 0;

  // Payload chuẩn bị gửi lên API POST /api/contracts khi Backend sẵn sàng
  const payload = {
    memberID: parseInt(memberSelect.value),
    packageID: parseInt(packageSelect.value),
    trainerID: document.getElementById("trainerSelect").value ? parseInt(document.getElementById("trainerSelect").value) : null,
    classID: document.getElementById("classSelect").value ? parseInt(document.getElementById("classSelect").value) : null,
    discountAmount: discount,
    promoCode: document.getElementById("promoCode").value.trim() || null,
    paymentMethod: document.getElementById("paymentMethod").value
  };

  console.log("Dữ liệu gửi lên API Backend:", payload);

  // Tạo hợp đồng mới thêm vào danh sách Mock
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + days);

  const newContract = {
    contractID: 100 + contractsList.length + 1,
    memberName: memberName.split('(')[0].trim(),
    phone: memberName.includes('(') ? memberName.split('(')[1].replace(')', '') : "0900000000",
    packageName: packageName,
    startDate: today.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    remainingSessions: 30,
    totalAmount: Math.max(0, price - discount),
    status: "Active"
  };

  contractsList.unshift(newContract);
  alert(`Lập hợp đồng #${newContract.contractID} thành công! Phương thức: ${payload.paymentMethod}`);

  closeContractModal();
  renderContractsTable(contractsList);
}

// Khởi chạy khi load trang
document.addEventListener("DOMContentLoaded", () => {
  renderContractsTable(contractsList);
  populatePackagesDropdown();
});
