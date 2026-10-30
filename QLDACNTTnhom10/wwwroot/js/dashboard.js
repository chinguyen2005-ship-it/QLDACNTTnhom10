'use strict';

(() => {
  const user = FitManageAuth.current();
  if (!user || !FitManagePermissions.allowed(user.role, 'operations')) return;
  const admin = user.role === 'Admin';
  const format = new Intl.NumberFormat('vi-VN');
  const charts = [];
  let activeRequest;
  // SQL/Dapper rows retain their column casing; normalize at this API boundary.
  function normalize(value) {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key[0].toLowerCase() + key.slice(1), normalize(item)]));
    return value;
  }
  async function read(path, signal) {
    const response = await fetch(path, { headers: { Authorization: `Bearer ${user.token}` }, signal });
    if (response.status === 401) { FitManageAuth.logout(); throw new Error('Phiên đăng nhập đã hết hạn.'); }
    if (!response.ok) throw new Error(response.status === 403 ? 'Bạn không có quyền xem dữ liệu này.' : 'Không tải được dữ liệu. Vui lòng thử lại.');
    return normalize(await response.json());
  }
  function text(id, value) { document.getElementById(id).textContent = value; }
  function rows(id, values, render, emptyText) {
    const target = document.getElementById(id);
    target.replaceChildren();
    if (!values.length) {
      const empty = document.createElement('p');
      empty.className = 'text-sm text-slate-500 py-6';
      empty.textContent = emptyText;
      target.append(empty);
    } else values.forEach(value => target.append(render(value)));
  }
  function item(title, description, href, label) {
    const row = document.createElement('div');
    row.className = 'flex flex-wrap gap-3 justify-between items-center py-4 border-b border-slate-100 last:border-0';
    const content = document.createElement('div');
    const heading = document.createElement('p');
    heading.className = 'font-semibold text-sm text-[#0b1c30]';
    heading.textContent = title;
    const detail = document.createElement('p');
    detail.className = 'text-xs text-slate-500 mt-1';
    detail.textContent = description;
    content.append(heading, detail);
    const action = document.createElement('a');
    action.className = 'text-xs font-bold text-[#006172] bg-[#eff4ff] px-3 py-2 rounded-lg';
    action.href = href;
    action.textContent = label;
    row.append(content, action);
    return row;
  }
  const clock = value => new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  function renderOperations(data) {
    const summary = data.summary;
    if (!admin) {
      text('metric-one', format.format(summary.todayCheckIns));
      text('metric-two', format.format(summary.todayClasses));
      text('metric-three', format.format(summary.expiringSoonContracts));
      text('metric-four', format.format(summary.pendingCare));
    }
    rows('today-classes', data.classes, row => item(row.className,
      `${clock(row.startTime)} – ${clock(row.endTime)} · ${row.room} · ${row.currentBooked}/${row.capacity} lượt ghi nhận`,
      '/schedules.html', 'Xem lịch'), 'Chưa có lớp học nào được lên lịch hôm nay.');
    rows('care-queue', data.careQueue, row => item(row.fullName,
      `${row.phone} · ${row.daysRemaining >= 0 ? `Còn ${row.daysRemaining} ngày` : `Hết hạn ${Math.abs(row.daysRemaining)} ngày`} · ${ {High:'Nguy cơ cao',Medium:'Trung bình',Low:'Nguy cơ thấp'}[row.riskLevel] || row.riskLevel }`,
      '/ai-retention-copilot.html', 'Chăm sóc'), 'Không có hội viên đang chờ chăm sóc.');
  }
  function draw(id, config) {
    const chart = new Chart(document.getElementById(id), config);
    charts.push(chart);
  }
  function renderManagement(data) {
    text('metric-one', `${format.format(data.summary.revenue)} đ`);
    text('metric-two', format.format(data.summary.activeMembers));
    text('metric-three', format.format(data.summary.todayCheckIns));
    text('metric-four', format.format(data.summary.expiringSoonContracts));
    const from = new Date(data.summary.fromDate);
    const to = new Date(data.summary.toDate);
    text('finance-range', `${from.toLocaleDateString('vi-VN')} – ${to.toLocaleDateString('vi-VN')}`);
    charts.splice(0).forEach(chart => chart.destroy());
    if (typeof Chart === 'undefined') {
      text('chart-status', 'Không tải được thư viện biểu đồ. Các chỉ số phía trên vẫn là dữ liệu thực tế.');
      return;
    }
    Chart.defaults.font.family = 'DM Sans, sans-serif';
    const days = [];
    for (let date = new Date(from); date <= to; date.setDate(date.getDate() + 1)) days.push(new Date(date));
    const key = value => String(value).slice(0,10);
    const amounts = new Map(data.revenue.map(row => [key(row.day), row.amount]));
    const registrations = new Map(data.registrations.map(row => [key(row.day), row.count]));
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const options = { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} };
    draw('revenueTrendChart', { type:'line', data:{ labels:days.map(date=>date.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit'})), datasets:[
      {label:'Doanh thu (triệu đ)',data:days.map(date=>(amounts.get(dateKey(date))||0)/1000000),borderColor:'#0b1c30',backgroundColor:'#0b1c3010',tension:.25,yAxisID:'revenue'},
      {label:'Hội viên mới',data:days.map(date=>registrations.get(dateKey(date))||0),borderColor:'#10b981',tension:.25,yAxisID:'members'}
    ]}, options:{...options,scales:{revenue:{beginAtZero:true,position:'left'},members:{beginAtZero:true,position:'right',grid:{drawOnChartArea:false},ticks:{precision:0}}}} });
    const total = data.packages.reduce((sum, row) => sum + row.amount, 0);
    text('packages-empty', total ? '' : 'Chưa có doanh thu trong kỳ đã chọn.');
    draw('packageDonutChart',{type:'doughnut',data:{labels:data.packages.map(row=>row.packageName),datasets:[{data:data.packages.map(row=>row.amount),backgroundColor:['#0b1c30','#3a6285','#006172','#acedff','#7c3aed','#10b981'],borderWidth:3}]},options:{...options,cutout:'68%'}});
    const hourly = new Map(data.checkIns.map(row=>[row.hour,row.count]));
    draw('checkInHourlyChart',{type:'bar',data:{labels:Array.from({length:24},(_,hour)=>`${hour}h`),datasets:[{label:'Lượt check-in',data:Array.from({length:24},(_,hour)=>hourly.get(hour)||0),backgroundColor:'#3a6285',borderRadius:4}]},options:{...options,scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
  }
  async function refresh() {
    activeRequest?.abort();
    activeRequest = new AbortController();
    const currentRequest = activeRequest;
    const status = document.getElementById('dashboard-status');
    const button = document.getElementById('refreshBtn');
    const workspace = document.getElementById('dashboard-data');
    workspace.hidden = true;
    button.disabled = true;
    status.textContent = 'Đang tải dữ liệu…';
    status.setAttribute('role','status');
    try {
      const operations = await read('/api/dashboard/operations', currentRequest.signal);
      const management = admin ? await read(`/api/dashboard/management?period=${document.getElementById('periodFilter').value}`, currentRequest.signal) : null;
      renderOperations(operations);
      workspace.hidden = false;
      if (management) renderManagement(management);
      status.textContent = `Dữ liệu thực tế · Cập nhật ${new Date().toLocaleTimeString('vi-VN')}`;
    } catch (error) {
      if (error.name !== 'AbortError') {
        status.textContent = error.message;
        status.setAttribute('role','alert');
      }
    } finally { if (currentRequest === activeRequest) button.disabled = false; }
  }
  text('dashboard-title', admin ? 'Tổng quan quản trị' : 'Công việc hôm nay');
  text('dashboard-subtitle', `Xin chào ${user.username}. ${admin ? 'Theo dõi doanh thu và hoạt động trung tâm.' : 'Theo dõi lịch lớp, gia hạn và hội viên cần chăm sóc.'}`);
  const labels = admin ? ['Doanh thu trong kỳ','Hội viên hoạt động','Check-in hôm nay','Hợp đồng hết hạn trong 7 ngày'] : ['Check-in hôm nay','Lớp học hôm nay','Hợp đồng hết hạn trong 7 ngày','Hội viên chờ chăm sóc'];
  labels.forEach((label,index)=>text(`metric-label-${index+1}`,label));
  document.getElementById('refreshBtn').addEventListener('click',refresh);
  document.getElementById('periodFilter').addEventListener('change',refresh);
  document.getElementById('globalSearchInput')?.addEventListener('keydown',event=>{
    if(event.key==='Enter') location.assign(`/members.html?search=${encodeURIComponent(event.target.value.trim())}`);
  });
  if (new URLSearchParams(location.search).get('access') === 'restricted') text('access-notice','Chức năng vừa chọn chỉ dành cho quản trị viên.');
  refresh();
})();
