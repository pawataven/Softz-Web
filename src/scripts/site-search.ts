/*
  Nav search: suggests services, packages, case studies, pages and FAQ while the visitor types, and opens the
  chosen one. The index is the JSON that NavSearch.astro embeds at build time.

  Matching (no library): lower-case, spaces ignored, every word typed must appear somewhere. A title match beats a
  keyword match, which beats a match in the description. English words also match with one typo
  ("stagcraft", "shoggun"). Keyboard: / or Ctrl+K focuses, ↑↓ move, Enter opens, Esc closes.
*/
interface Entry {
  title: string;
  meta: string;
  group: string;
  href: string;
  text: string;
  popular?: boolean;
}

const root = document.querySelector<HTMLElement>('[data-search]');
if (root) {
  const input = root.querySelector<HTMLInputElement>('input')!;
  const box = root.querySelector<HTMLElement>('.nav-search-box')!;
  const panel = root.querySelector<HTMLElement>('[data-search-panel]')!;
  const list = root.querySelector<HTMLElement>('[data-search-list]')!;
  const openBtn = root.querySelector<HTMLButtonElement>('[data-search-open]')!;
  const closeBtn = root.querySelector<HTMLButtonElement>('[data-search-close]')!;
  const entries: Entry[] = JSON.parse(root.querySelector('[data-search-index]')!.textContent || '[]');

  const norm = (s: string) => s.toLowerCase().normalize('NFC').replace(/[\s\-_.·,/()]+/g, '');
  const indexed = entries.map((e) => ({ e, title: norm(e.title), meta: norm(e.meta), text: norm(e.text) }));

  // Edit distance, stopping early once it passes 1.
  const withinOne = (a: string, b: string) => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const row = [i];
      for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (Math.min(...row) > 1) return false;
      prev = row;
    }
    return prev[b.length] <= 1;
  };
  // One typo in a Latin word of 4+ letters, against any stretch of the target of about the same length.
  const nearMatch = (word: string, target: string) => {
    if (word.length < 4 || !/^[a-z0-9]+$/.test(word)) return false;
    for (let len = word.length - 1; len <= word.length + 1; len++)
      for (let i = 0; i + len <= target.length; i++) if (withinOne(word, target.slice(i, i + len))) return true;
    return false;
  };

  const score = (row: (typeof indexed)[number], words: string[]) => {
    let total = 0;
    for (const w of words) {
      if (row.title.startsWith(w)) total += 100;
      else if (row.title.includes(w)) total += 70;
      else if (row.meta.includes(w)) total += 45;
      else if (row.text.includes(w)) total += 30;
      else if (nearMatch(w, row.title)) total += 25;
      else if (nearMatch(w, row.text)) total += 12;
      else return 0; // every word must match somewhere
    }
    // Services and case studies first, FAQ last.
    const weight: Record<string, number> = { 'บริการ': 8, 'ผลงาน': 8, 'หน้า': 5, 'แพ็กเกจ': 2, 'คำถามที่พบบ่อย': 0 };
    return total + (weight[row.e.group] ?? 0);
  };

  let results: Entry[] = [];
  let active = -1;

  const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  const render = () => {
    const raw = input.value.trim();
    const words = raw.split(/\s+/).map(norm).filter(Boolean);
    // Nothing typed yet: no list. Suggestions appear only once the visitor starts typing.
    if (!words.length) {
      results = [];
      active = -1;
      list.innerHTML = '';
      input.setAttribute('aria-activedescendant', '');
      show(false);
      return;
    } else {
      results = indexed
        .map((row) => ({ row, s: score(row, words) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.row.e)
        // The same FAQ question can sit under several services: show it once.
        .filter((e, i, all) => all.findIndex((o) => o.title === e.title) === i)
        .slice(0, 8);
    }
    active = results.length && words.length ? 0 : -1;
    if (!results.length) {
      list.innerHTML = `<li class="ns-empty" role="presentation">ไม่พบ “${escape(raw)}” ลองคำอื่น เช่น เว็บไซต์ POS ร้านกาแฟ<br><a href="/contact/">หรือทักมาถามทีมงานได้เลย →</a></li>`;
    } else {
      let lastGroup = '';
      list.innerHTML = results
        .map((e, i) => {
          const head = e.group !== lastGroup ? `<li class="ns-group" role="presentation">${words.length ? e.group : i === 0 ? 'แนะนำ' : e.group}</li>` : '';
          lastGroup = e.group;
          return `${head}<li role="option" id="ns-${i}" data-i="${i}" aria-selected="${i === active}"><a href="${e.href}" tabindex="-1"><b>${escape(e.title)}</b><small>${escape(e.meta)}</small></a></li>`;
        })
        .join('');
    }
    input.setAttribute('aria-activedescendant', active >= 0 ? `ns-${active}` : '');
    show(true);
  };

  const show = (on: boolean) => {
    panel.hidden = !on;
    box.setAttribute('aria-expanded', String(on));
  };

  const highlight = (i: number) => {
    active = (i + results.length) % results.length;
    list.querySelectorAll<HTMLElement>('[role="option"]').forEach((li) => li.setAttribute('aria-selected', String(Number(li.dataset.i) === active)));
    list.querySelector(`#ns-${active}`)?.scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', `ns-${active}`);
  };

  const go = (e?: Entry) => {
    if (!e) return;
    window.location.href = e.href;
    close();
  };

  const open = () => {
    root.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    input.focus();
    render();
  };
  const close = () => {
    root.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    show(false);
    input.blur();
  };

  // Wide screens: the field grows leftwards when open; slide the menu just far enough to keep a 24px gap,
  // without running into the logo.
  const measureShift = () => {
    const nav = root.closest('.nav-inner');
    const menu = nav?.querySelector<HTMLElement>('.nav-menu');
    const logo = nav?.querySelector<HTMLElement>('.nav-logo');
    if (!nav || !menu || !logo || window.innerWidth < 1400) return;
    const openLeft = root.getBoundingClientRect().right - 340;
    const m = menu.getBoundingClientRect();
    const need = Math.max(0, m.right + 24 - openLeft);
    const room = Math.max(0, m.left - logo.getBoundingClientRect().right - 16);
    (nav as HTMLElement).style.setProperty('--nav-shift', `${Math.round(Math.min(need, room))}px`);
  };
  input.addEventListener('focus', () => { if (!root.classList.contains('is-open')) measureShift(); root.classList.add('is-open'); render(); });
  input.addEventListener('click', () => { if (panel.hidden) { if (!root.classList.contains('is-open')) measureShift(); root.classList.add('is-open'); render(); } });
  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); if (results.length) highlight(active + 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); if (results.length) highlight(active - 1); }
    else if (event.key === 'Enter') { event.preventDefault(); go(results[Math.max(active, 0)]); }
    else if (event.key === 'Escape') { input.value = ''; close(); }
  });
  list.addEventListener('mousedown', (event) => event.preventDefault()); // keep focus so the click lands
  list.addEventListener('click', (event) => {
    const li = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (li) { event.preventDefault(); go(results[Number(li.dataset.i)]); }
  });
  list.addEventListener('mousemove', (event) => {
    const li = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (li && Number(li.dataset.i) !== active) highlight(Number(li.dataset.i));
  });
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => { input.value = ''; close(); });
  document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target as Node)) close(); });
  // "/" or Ctrl/Cmd+K jumps to search from anywhere (not while typing in another field).
  document.addEventListener('keydown', (event) => {
    const typing = (event.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable="true"]');
    if ((event.key === '/' && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      open();
    }
  });
}
