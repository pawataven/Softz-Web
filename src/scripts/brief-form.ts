import { PUBLIC_BRIEF_ENDPOINT } from 'astro:env/client';
import { lineMessageUrl } from '../lib/line';
import { showToast } from './toast';

const THAI_PHONE_PATTERN = /^0\d{8,9}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface BriefPayload {
  name: string;
  business: string;
  phone: string;
  email: string;
  interest: string[];
  budget: string;
  start: string;
  detail: string;
}

const form = document.querySelector<HTMLFormElement>('[data-brief]');
const thanks = document.querySelector<HTMLElement>('[data-thanks]');

function isInvalid(control: FormControl) {
  if (control instanceof HTMLInputElement && control.type === 'checkbox') return !control.checked;
  const value = control.value.trim();
  if (!value) return true;
  if (control.type === 'tel') return !THAI_PHONE_PATTERN.test(value.replace(/[\s-]/g, ''));
  if (control.type === 'email') return !EMAIL_PATTERN.test(value);
  return false;
}

function setInvalid(control: FormControl, invalid: boolean) {
  const wrapper = control.closest('.field, .consent');
  wrapper?.classList.toggle('err', invalid);
  control.setAttribute('aria-invalid', String(invalid));
}

function readPayload(formElement: HTMLFormElement): BriefPayload {
  const data = new FormData(formElement);
  const text = (key: string) => String(data.get(key) ?? '').trim();
  return {
    name: text('name'),
    business: text('business'),
    phone: text('phone'),
    email: text('email'),
    interest: data.getAll('interest').map(String),
    budget: text('budget'),
    start: text('start'),
    detail: text('detail'),
  };
}

function lineSummary(payload: BriefPayload, interestLabels: Map<string, string>) {
  const interests = payload.interest.map((value) => interestLabels.get(value) ?? value).join(', ');
  return [
    'ส่งรายละเอียดงานครับ',
    `ชื่อ: ${payload.name || '-'}`,
    `ธุรกิจ: ${payload.business || '-'}`,
    `โทร: ${payload.phone || '-'}`,
    `สนใจ: ${interests || '-'}`,
    `งบ: ${payload.budget || '-'}`,
    `เริ่ม: ${payload.start || '-'}`,
    payload.detail,
  ]
    .filter(Boolean)
    .join('\n');
}

async function submitToEndpoint(payload: BriefPayload) {
  if (!PUBLIC_BRIEF_ENDPOINT) return false;
  const response = await fetch(PUBLIC_BRIEF_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Brief endpoint responded ${response.status}`);
  return true;
}

if (form && thanks) {
  const controls = [...form.querySelectorAll<FormControl>('input, select, textarea')];
  const interestLabels = new Map(
    [...form.querySelectorAll<HTMLInputElement>('input[name="interest"]')].map((input) => [
      input.value,
      input.nextElementSibling?.textContent ?? input.value,
    ]),
  );
  const submitButton = form.querySelector<HTMLButtonElement>('[type="submit"]');

  const preselected = new URLSearchParams(window.location.search).get('interest');
  preselected?.split(',').forEach((value) => {
    const checkbox = form.querySelector<HTMLInputElement>(`input[name="interest"][value="${CSS.escape(value)}"]`);
    if (checkbox) checkbox.checked = true;
  });

  controls.forEach((control) => control.addEventListener('input', () => setInvalid(control, false)));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const invalidControls = controls.filter((control) => control.required && isInvalid(control));
    controls.forEach((control) => {
      if (control.required) setInvalid(control, invalidControls.includes(control));
    });
    if (invalidControls.length > 0) {
      invalidControls[0].focus();
      showToast('กรอกข้อมูลที่จำเป็นให้ครบก่อนนะครับ');
      return;
    }

    const payload = readPayload(form);
    if (submitButton) submitButton.disabled = true;

    let deliveredToTeam = false;
    try {
      deliveredToTeam = await submitToEndpoint(payload);
    } catch {
      showToast('ส่งข้อมูลไม่สำเร็จ ลองส่งต่อทาง LINE แทนได้เลยครับ');
    } finally {
      if (submitButton) submitButton.disabled = false;
    }

    thanks.querySelector<HTMLAnchorElement>('[data-thanks-line]')!.href = lineMessageUrl(lineSummary(payload, interestLabels));
    thanks.querySelector<HTMLElement>('[data-thanks-sent]')!.hidden = !deliveredToTeam;
    thanks.querySelector<HTMLElement>('[data-thanks-pending]')!.hidden = deliveredToTeam;

    form.hidden = true;
    thanks.classList.add('show');
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  thanks.querySelector('[data-again]')?.addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    thanks.classList.remove('show');
  });
}
