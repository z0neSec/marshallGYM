const containerId = 'mg-toast-container';

function ensureContainer() {
  let c = document.getElementById(containerId);
  if (!c) {
    c = document.createElement('div');
    c.id = containerId;
    c.className = 'mg-toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function show(type, message, timeout = 3000) {
  const container = ensureContainer();
  const el = document.createElement('div');
  el.className = `mg-toast mg-toast-${type}`;
  el.textContent = message;
  container.appendChild(el);
  // animate in
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => {
    el.classList.remove('visible');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }, timeout);
}

export const toastSuccess = (msg) => show('success', msg);
export const toastError = (msg) => show('error', msg);
export const toastInfo = (msg) => show('info', msg);