/* Evidence-led learning browser: deterministic daily rotation, local-only progress. */
(() => {
  'use strict';

  const content = window.POTEZ_LEARNING_CONTENT;
  const root = document.getElementById('learningTopics');
  const factRoot = document.getElementById('dailyFact');
  if (!content || !root || !factRoot) return;

  const categories = [
    { id: 'sve', label: 'Sve teme' },
    { id: 'svakodnevica', label: 'Svakodnevica' },
    { id: 'digitalno', label: 'Digitalni svijet' },
    { id: 'sudjelovanje', label: 'Glas mladih' },
    { id: 'odgovornost', label: 'Javni novac i prava' }
  ];
  const categoryLabel = Object.fromEntries(categories.map(item => [item.id, item.label]));
  const filters = document.getElementById('learningFilters');
  const countLabel = document.getElementById('learningCount');
  const moreButton = document.getElementById('learningShowMore');
  let activeCategory = 'sve';
  let showAll = false;

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function safeExternalLink(label, href) {
    const link = el('a', 'learning-source-link', label + ' ↗');
    try {
      const url = new URL(href);
      if (url.protocol !== 'https:') throw new Error('Only HTTPS sources are allowed');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } catch {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
    }
    return link;
  }

  function buildCard(topic) {
    const card = el('article', 'learning-card');
    card.dataset.category = topic.category;
    card.dataset.topicId = topic.id;

    const top = el('div', 'learning-card-top');
    top.append(el('span', 'learning-topic-label', topic.label));
    top.append(el('span', 'learning-category-label', categoryLabel[topic.category] || 'Istraži'));
    card.append(top);
    card.append(el('h3', '', topic.title));
    card.append(el('p', 'learning-card-intro', topic.intro));

    const details = document.createElement('details');
    details.className = 'learning-card-details';
    const summary = el('summary', '', 'Otkrij zašto je ovo važno');
    details.append(summary);

    const question = el('p', 'learning-question', topic.question);
    details.append(question);
    details.append(el('p', 'learning-insight', topic.insight));

    const action = el('div', 'learning-action');
    action.append(el('strong', '', 'Tvoj mogući potez'));
    action.append(el('p', '', topic.action));
    details.append(action);

    const sources = el('div', 'learning-card-sources');
    sources.append(el('span', 'learning-source-caption', 'Izvor i dodatni kontekst'));
    sources.append(safeExternalLink(topic.sourceTitle, topic.sourceUrl));
    if (topic.sourceNote) sources.append(el('p', 'learning-source-note', topic.sourceNote));
    details.append(sources);

    const footer = el('div', 'learning-card-footer');
    if (topic.target) {
      const guide = el('a', 'learning-guide-link', 'Otvori praktični vodič →');
      guide.href = topic.target;
      footer.append(guide);
    }
    const award = el('button', 'learning-award', 'Zabilježi naučeno · +4 XP');
    award.type = 'button';
    const key = 'lesson-' + topic.id;
    const done = Boolean(readProgress()[key]);
    if (done) {
      award.disabled = true;
      award.textContent = 'Naučeno ✓';
      card.classList.add('is-complete');
    }
    award.addEventListener('click', () => {
      if (window.POTEZ_PROGRESS?.award(key, 4, 'naučena tema')) {
        award.disabled = true;
        award.textContent = 'Naučeno ✓';
        card.classList.add('is-complete');
      }
    });
    footer.append(award);
    details.append(footer);
    card.append(details);
    return card;
  }

  function readProgress() {
    try {
      const data = JSON.parse(localStorage.getItem('potez-demo-v1') || '{}');
      return data && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  function renderFilters() {
    if (!filters) return;
    filters.replaceChildren();
    categories.forEach(category => {
      const button = el('button', 'learning-filter', category.label);
      button.type = 'button';
      button.dataset.filter = category.id;
      button.setAttribute('aria-pressed', String(category.id === activeCategory));
      button.addEventListener('click', () => {
        activeCategory = category.id;
        showAll = false;
        renderFilters();
        renderTopics();
      });
      filters.append(button);
    });
  }

  function renderTopics() {
    const selected = activeCategory === 'sve'
      ? content.topics
      : content.topics.filter(topic => topic.category === activeCategory);
    const visible = showAll ? selected : selected.slice(0, 4);
    root.replaceChildren();
    visible.forEach(topic => root.append(buildCard(topic)));
    if (countLabel) {
      countLabel.textContent = selected.length === 1
        ? '1 tema'
        : selected.length + ' tema';
    }
    if (moreButton) {
      const canExpand = selected.length > 4;
      moreButton.hidden = !canExpand;
      moreButton.textContent = showAll ? 'Prikaži manje tema' : 'Prikaži sve teme';
      moreButton.setAttribute('aria-expanded', String(showAll));
    }
    if (!selected.length) root.append(el('p', 'learning-empty', 'U ovoj kategoriji trenutačno nema tema.'));
  }

  if (moreButton) {
    moreButton.addEventListener('click', () => {
      showAll = !showAll;
      renderTopics();
    });
  }

  function hash(value) {
    let result = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      result = Math.imul(result ^ value.charCodeAt(i), 16777619);
    }
    return result >>> 0;
  }

  function seededShuffle(values, seed) {
    const out = values.slice();
    let state = seed >>> 0;
    for (let i = out.length - 1; i > 0; i -= 1) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const j = state % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function localDateKey(date) {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

  function dailyFactIndex(date) {
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const weekday = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - weekday);
    const weekKey = localDateKey(monday);
    const order = seededShuffle(content.facts.map((_, index) => index), hash(weekKey));
    return order[weekday];
  }

  function renderDailyFact() {
    const today = new Date();
    const stamp = localDateKey(today);
    const fact = content.facts[dailyFactIndex(today)];
    factRoot.replaceChildren();

    const header = el('div', 'daily-fact-header');
    header.append(el('span', 'daily-fact-kicker', 'Zanimljivost dana'));
    header.append(el('time', 'daily-fact-date', today.toLocaleDateString('hr-HR', {
      day: 'numeric', month: 'long', year: 'numeric'
    })));
    factRoot.append(header);
    factRoot.append(el('h2', '', fact.title));
    factRoot.append(el('p', 'daily-fact-text', fact.text));
    factRoot.append(el('p', 'daily-fact-note', fact.note));

    const footer = el('div', 'daily-fact-footer');
    const source = safeExternalLink(fact.source, fact.url);
    source.classList.add('daily-fact-source');
    footer.append(source);

    const award = el('button', 'daily-fact-award', 'Pročitao/la sam · +2 XP');
    award.type = 'button';
    const progress = readProgress();
    if (progress.dailyFactStamp === stamp) {
      award.disabled = true;
      award.textContent = 'Današnja zanimljivost pročitana ✓';
    }
    award.addEventListener('click', () => {
      if (window.POTEZ_PROGRESS?.claimDailyFact(stamp)) {
        award.disabled = true;
        award.textContent = 'Današnja zanimljivost pročitana ✓';
      }
    });
    footer.append(award);
    factRoot.append(footer);
  }

  renderFilters();
  renderTopics();
  renderDailyFact();

  window.addEventListener('potez:progress', () => {
    // Keep the current card UI in sync when progress is reset elsewhere.
    renderTopics();
    renderDailyFact();
  });
})();