const TOAST_DURATION_MS = 2200;

let toastElement: HTMLElement | null = null;
let hideTimer: number | undefined;

export function showToast(message: string) {
  if (!toastElement) {
    toastElement = document.createElement('div');
    toastElement.className = 'toast glass';
    toastElement.setAttribute('role', 'status');
    document.body.appendChild(toastElement);
  }
  toastElement.textContent = message;
  toastElement.classList.add('show');
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => toastElement?.classList.remove('show'), TOAST_DURATION_MS);
}
