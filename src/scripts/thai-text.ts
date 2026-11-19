/*
  Thai paragraphs: no broken words, even edges.

  Thai has no spaces between words, so the browser breaks lines with a dictionary. Loanwords and compounds it does
  not know ("สต็อก", "หน้าเว็บ") can be split in the middle. This script:
  1. keeps the terms below in one piece (wraps them in a no-wrap span);
  2. justifies paragraphs that are left-aligned, so both edges line up (centred text stays centred).
  CSS (base.css) adds text-wrap: pretty, which stops a single short word from ending up alone on the last line.
*/

/** Longest first, so a compound wins over the shorter word inside it. */
const KEEP_TOGETHER = [
  'ระบบหลังบ้าน',
  'ใบเสนอราคา',
  'ภาษีมูลค่าเพิ่ม',
  'ไม่กี่คลิก',
  'เว็บตัวอย่าง',
  'เว็บไซต์',
  'หน้าเว็บ',
  'เต็นท์รถ',
  'แอนิเมชัน',
  'ไฟแนนซ์',
  'แกลเลอรี',
  'ซอฟต์แวร์',
  'ฮาร์ดแวร์',
  'พรีเมียม',
  'ออนไลน์',
  'แพ็กเกจ',
  'เทมเพลต',
  'โฮสติ้ง',
  'โปรแกรม',
  'ค่างวด',
  'มือสอง',
  'สต็อก',
  'คลิก',
  'แบรนด์',
  'ดีไซน์',
  'โลโก้',
  'ฟอร์ม',
  'โมดูล',
  'คูปอง',
  'ดิสเพลย์',
  'สติ๊กเกอร์',
  'งาช้าง',
  'บนมือถือ',
  'ทั้งเว็บ',
].sort((a, b) => b.length - a.length);

const pattern = new RegExp(`(${KEEP_TOGETHER.join('|')})`, 'g');
/** Same terms without the g flag: a global regex remembers lastIndex between test() calls and would skip nodes. */
const hasTerm = new RegExp(KEEP_TOGETHER.join('|'));
const SKIP = 'script, style, textarea, input, select, option, code, pre, .nowrap-term';

function protectTerms(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (!node.nodeValue || !hasTerm.test(node.nodeValue) || !parent || parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      // In a flex/grid parent (buttons, chips) a new span becomes its own item and gets the gap around it: skip.
      return /flex|grid/.test(getComputedStyle(parent).display) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => {
    const parts = node.nodeValue!.split(pattern);
    const fragment = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (!part) return;
      if (index % 2 === 1) {
        const span = document.createElement('span');
        span.className = 'nowrap-term';
        span.textContent = part;
        fragment.append(span);
      } else fragment.append(part);
    });
    node.replaceWith(fragment);
  });
}

/** Justify left-aligned paragraphs that contain Thai; leave centred and right-aligned text alone. */
function justifyParagraphs(root: Element) {
  root.querySelectorAll<HTMLElement>('p, .sub, .lead').forEach((el) => {
    if (!/[฀-๿]/.test(el.textContent || '')) return;
    const align = getComputedStyle(el).textAlign;
    if (align === 'start' || align === 'left' || align === 'justify') el.classList.add('justify-th');
  });
}

/** Labels are orange English eyebrows; a label written in Thai would glow, so it gets the grey .label-th look. */
function calmThaiLabels(root: Element) {
  root.querySelectorAll<HTMLElement>('.label').forEach((el) => {
    if (/[฀-๿]/.test(el.textContent || '')) el.classList.add('label-th');
  });
}

const main = document.querySelector('main');
if (main) {
  protectTerms(main);
  justifyParagraphs(main);
  calmThaiLabels(main);
}
