'use strict';

(() => {
  const form = document.querySelector('form');
  const isRegister = document.body.dataset.authPage === 'register';
  const message = document.getElementById('auth-message');
  const submit = document.getElementById('auth-submit');
  let pending = false;

  function showMessage(text, state = 'error') {
    message.textContent = text;
    message.dataset.state = state;
    message.hidden = false;
    message.focus();
  }
  function showInfo(title, text) {
    document.getElementById('auth-info-title').textContent = title;
    document.getElementById('auth-info-body').textContent = text;
    document.getElementById('auth-info-dialog').showModal();
  }
  function language(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('fitmanage_language', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = translations[lang]?.[el.dataset.i18n];
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-language]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.language === lang));
      btn.classList.toggle('bg-white', btn.dataset.language === lang);
    });
    // The standalone registration screen has its own authored Vietnamese form copy.
    // Keep this form in Vietnamese until a complete translation is available.
    if (!isRegister) {
      document.getElementById('form-heading').textContent = translations[lang].heading_signin;
      document.getElementById('form-subheading').textContent = translations[lang].subheading_signin;
    }
  }
  async function request(endpoint, payload) {
    const response = await fetch(`/api/auth/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(20000)
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!response.ok) {
      const validation = data?.errors && Object.values(data.errors).flat().join(' ');
      const detail = typeof data === 'string' && !data.includes('<') ? data : data?.message || data?.Message || validation;
      throw new Error(response.status >= 500 ? 'Hệ thống đang bận. Vui lòng thử lại sau.' : detail || 'Không thể thực hiện yêu cầu. Vui lòng kiểm tra thông tin.');
    }
    return data;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const fields = new FormData(form);
    const payload = { Username: fields.get('Username').trim(), Password: fields.get('Password') };
    if (!payload.Username) { showMessage('Vui lòng nhập tên đăng nhập.'); return; }
    if (isRegister) {
      if (payload.Password !== fields.get('ConfirmPassword')) { showMessage('Mật khẩu xác nhận không trùng khớp.'); return; }
      if (new TextEncoder().encode(payload.Password).length > 72) { showMessage('Mật khẩu tối đa 72 byte. Vui lòng dùng mật khẩu ngắn hơn.'); return; }
      if (!document.getElementById('signup-consent').checked) return;
      Object.assign(payload, {
        FullName: fields.get('FullName').trim(), Phone: fields.get('Phone').trim(),
        Email: fields.get('Email').trim(), DateOfBirth: fields.get('DateOfBirth') || null,
        Gender: fields.get('gender'), RoleID: 4
      });
    }
    pending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    message.hidden = true;
    const label = submit.querySelector('span');
    const previous = label.textContent;
    label.textContent = 'Đang xử lý…';
    try {
      const data = await request(isRegister ? 'register' : 'login', payload);
      if (isRegister) {
        sessionStorage.setItem('fitmanage_registered_username', payload.Username);
        form.reset();
        location.assign('/login.html?registered=1');
      } else {
        FitManageAuth.save(data.token || data.Token);
        if (document.getElementById('remember-username').checked) localStorage.setItem('fitmanage_username', payload.Username);
        else localStorage.removeItem('fitmanage_username');
        location.replace(FitManageAuth.destination());
      }
    } catch (error) {
      showMessage(['TimeoutError', 'AbortError'].includes(error.name) ? 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.' : error.name === 'TypeError' ? 'Không kết nối được máy chủ. Vui lòng kiểm tra kết nối.' : error.message);
    } finally {
      pending = false;
      submit.disabled = false;
      form.removeAttribute('aria-busy');
      label.textContent = previous;
    }
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.authLink) { location.assign(`/${button.dataset.authLink}.html`); return; }
    if (button.dataset.passwordToggle) {
      const input = document.getElementById(button.dataset.passwordToggle);
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    } else if (button.dataset.language) language(button.dataset.language);
    else if (button.hasAttribute('data-dialog-close')) document.getElementById('auth-info-dialog').close();
    else if (button.hasAttribute('data-auth-forgot')) showInfo('Khôi phục tài khoản', 'Vui lòng liên hệ lễ tân hoặc quản trị viên phòng tập để được hỗ trợ khôi phục tài khoản.');
    else if (button.hasAttribute('data-auth-info')) showInfo('Thông tin hỗ trợ', 'Vui lòng liên hệ phòng tập để nhận điều khoản sử dụng và chính sách bảo mật hiện hành trước khi đăng ký.');
  });
  if (isRegister) {
    document.getElementById('signup-dob').max = new Date().toLocaleDateString('en-CA');
    const limits = { 'signup-name': 100, 'signup-phone': 20, 'signup-email': 100, 'signup-user': 50 };
    Object.entries(limits).forEach(([id, max]) => document.getElementById(id).maxLength = max);
    document.getElementById('signup-user').pattern = '[A-Za-z0-9_.-]{3,50}';
    document.getElementById('signup-user').title = 'Dùng 3–50 chữ, số, dấu chấm, gạch dưới hoặc gạch ngang.';
  } else {
    const username = sessionStorage.getItem('fitmanage_registered_username') || localStorage.getItem('fitmanage_username') || '';
    document.getElementById('signin-user').value = username;
    document.getElementById('remember-username').checked = Boolean(localStorage.getItem('fitmanage_username'));
    if (new URLSearchParams(location.search).get('registered') === '1' && sessionStorage.getItem('fitmanage_registered_username')) {
      showMessage('Đăng ký thành công! Bạn có thể đăng nhập bằng tài khoản vừa tạo.', 'success');
      sessionStorage.removeItem('fitmanage_registered_username');
      history.replaceState(null, '', '/login.html');
    }
  }
  language(isRegister ? 'vi' : localStorage.getItem('fitmanage_language') === 'en' ? 'en' : 'vi');
})();
