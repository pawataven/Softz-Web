import { showToast } from './toast';

function copyWithTextareaFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  // execCommand is deprecated but is the only option on non-secure (http) origins.
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return copyWithTextareaFallback(text);
    }
  }
  return copyWithTextareaFallback(text);
}

document.querySelectorAll<HTMLElement>('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy ?? '';
    const copied = await copyText(text);
    showToast(copied ? `คัดลอกแล้ว: ${text}` : text);
  });
});
