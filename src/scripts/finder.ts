import { lineMessageUrl } from '../lib/line';
import type { PackageCatalogItem } from '../data/package-catalog';

const MAX_RESULTS = 4;

const finder = document.querySelector<HTMLElement>('[data-finder]');
const catalogSource = document.getElementById('finder-catalog');

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

if (finder && catalogSource) {
  const catalog: PackageCatalogItem[] = JSON.parse(catalogSource.textContent ?? '[]');
  const input = finder.querySelector<HTMLInputElement>('input')!;
  const list = finder.querySelector<HTMLUListElement>('.cmd-list')!;
  const count = finder.querySelector<HTMLElement>('[data-count]')!;
  const quoteLink = finder.querySelector<HTMLAnchorElement>('[data-finder-go]')!;
  let results: PackageCatalogItem[] = [];
  let selectedIndex = 0;

  const score = (item: PackageCatalogItem, query: string) => {
    const haystack = `${item.name} ${item.description} ${item.keywords}`.toLowerCase();
    const keywords = item.keywords.split(' ').filter((keyword) => keyword.length > 1);
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .reduce((total, word) => {
        const directHit = haystack.includes(word) ? 2 : 0;
        // Thai is written without spaces, so also count catalog keywords that appear inside the typed word.
        const keywordHits = keywords.filter((keyword) => word.includes(keyword.toLowerCase())).length;
        return total + directHit + keywordHits;
      }, 0);
  };

  const updateSelection = () => {
    list.querySelectorAll('.cmd-item').forEach((option, index) => {
      option.setAttribute('aria-selected', String(index === selectedIndex));
    });
    input.setAttribute('aria-activedescendant', results.length ? `finder-option-${selectedIndex}` : '');

    const selected = results[selectedIndex];
    const requirement = input.value ? `\nความต้องการ: ${input.value}` : '';
    quoteLink.href = lineMessageUrl(
      selected ? `สนใจ ${selected.name} (${selected.price}) ขอใบเสนอราคาครับ${requirement}` : input.value,
    );
  };

  const render = () => {
    const query = input.value.trim();
    results = catalog
      .map((item, index) => ({ item, index, score: query ? score(item, query) : index < MAX_RESULTS ? 1 : 0 }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, MAX_RESULTS)
      .map((result) => result.item);
    selectedIndex = 0;

    list.innerHTML = results.length
      ? results
          .map(
            (item, index) => `
        <li class="cmd-item" role="option" id="finder-option-${index}" aria-selected="${index === 0}" data-index="${index}">
          <span class="cmd-ico">${escapeHtml(item.icon)}</span>
          <span class="t"><b>${escapeHtml(item.name)}${item.tag ? ` <span class="tag tag-orange">${escapeHtml(item.tag)}</span>` : ''}</b><small>${escapeHtml(item.description)}</small></span>
          <span class="p">${escapeHtml(item.price)}</span>
        </li>`,
          )
          .join('')
      : '<li class="cmd-empty">ยังไม่เจอแพ็กเกจที่ตรง ลองพิมพ์คำอื่น หรือทักแชทให้ทีมช่วยเลือก</li>';
    count.textContent = `${results.length} แพ็กเกจ`;
    updateSelection();
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
      updateSelection();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection();
    }
    if (event.key === 'Enter' && results[selectedIndex]) {
      event.preventDefault();
      window.open(quoteLink.href, '_blank', 'noopener');
    }
  });

  const optionFromEvent = (event: Event) => (event.target as Element).closest<HTMLElement>('.cmd-item');

  list.addEventListener('mousemove', (event) => {
    const option = optionFromEvent(event);
    const index = Number(option?.dataset.index);
    if (option && index !== selectedIndex) {
      selectedIndex = index;
      updateSelection();
    }
  });

  list.addEventListener('click', (event) => {
    const option = optionFromEvent(event);
    if (option) window.location.href = results[Number(option.dataset.index)].href;
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      input.focus();
      input.select();
    }
  });

  render();
}
