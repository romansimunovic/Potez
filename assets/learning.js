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
  const filters = document.getElementById('learningFilters');
  const moreButton = document.getElementById('learningShowMore');
  const searchInput = document.getElementById('learningSearch');
  const resultCount = document.getElementById('learningResultCount');
  const resetButton = document.getElementById('learningReset');
  const INITIAL_VISIBLE_TOPICS = 6;
  let activeCategory = 'sve';
  let searchQuery = '';
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

    const categoryName = categories.find(category => category.id === topic.category)?.label || 'Tema';
    const cardTop = el('div', 'learning-card-top');
    cardTop.append(el('span', 'learning-topic-label', topic.label || categoryName));
    cardTop.append(el('span', 'learning-category-label', categoryName));
    card.append(cardTop);
    card.append(el('h3', '', topic.title));
    card.append(el('p', 'learning-card-intro', topic.intro));

    const details = document.createElement('details');
    details.className = 'learning-card-details';
    const summary = el('summary', '', 'Pročitaj objašnjenje');
    details.append(summary);

    const question = el('p', 'learning-question', topic.question);
    details.append(question);
    details.append(el('p', 'learning-insight', topic.insight));

    const action = el('div', 'learning-action');
    action.append(el('strong', '', 'Kako ovo primijeniti'));
    action.append(el('p', '', topic.action));
    details.append(action);

    const sources = el('div', 'learning-card-sources');
    sources.append(el('span', 'learning-source-caption', 'Izvor'));
    sources.append(safeExternalLink(topic.sourceTitle, topic.sourceUrl));
    if (topic.sourceNote) sources.append(el('p', 'learning-source-note', topic.sourceNote));
    details.append(sources);

    const footer = el('div', 'learning-card-footer');
    if (topic.target) {
      const guide = el('a', 'learning-guide-link', 'Povezani vodič →');
      guide.href = topic.target;
      footer.append(guide);
    }
    const award = el('button', 'learning-award', 'Pročitano · +4 XP');
    award.type = 'button';
    const key = 'lesson-' + topic.id;
    const done = Boolean(readProgress()[key]);
    if (done) {
      award.disabled = true;
      award.textContent = 'Naučeno ✓';
      card.classList.add('is-complete');
    }
    award.addEventListener('click', () => {
      if (window.POTEZ_PROGRESS?.awardLesson(key, 'naučena tema')) {
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

  function normalizeSearch(value) {
    return String(value || '')
      .toLocaleLowerCase('hr')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function renderFilters() {
    if (!filters) return;
    // Update in place after first render so activating a filter never drops keyboard focus.
    if (filters.childElementCount) {
      filters.querySelectorAll('[data-filter]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === activeCategory));
      });
      return;
    }
    categories.forEach(category => {
      const count = category.id === 'sve'
        ? content.topics.length
        : content.topics.filter(topic => topic.category === category.id).length;
      const button = el('button', 'learning-filter', '');
      button.type = 'button';
      button.dataset.filter = category.id;
      button.setAttribute('aria-pressed', String(category.id === activeCategory));
      button.append(el('span', 'learning-filter-label', category.label));
      const countLabel = el('span', 'learning-filter-count', String(count));
      countLabel.setAttribute('aria-hidden', 'true');
      button.append(countLabel);
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
    const categoryTopics = activeCategory === 'sve'
      ? content.topics
      : content.topics.filter(topic => topic.category === activeCategory);
    const query = normalizeSearch(searchQuery);
    const selected = query
      ? categoryTopics.filter(topic => {
          const categoryName = categories.find(category => category.id === topic.category)?.label || '';
          const searchable = [
            topic.label, topic.title, topic.intro, topic.question,
            topic.insight, topic.action, topic.sourceTitle, topic.sourceNote,
            categoryName
          ].join(' ');
          return normalizeSearch(searchable).includes(query);
        })
      : categoryTopics;
    // A search should reveal every matching result; the six-card limit is for browsing.
    const visible = showAll || query ? selected : selected.slice(0, INITIAL_VISIBLE_TOPICS);
    root.replaceChildren();
    visible.forEach(topic => root.append(buildCard(topic)));

    if (!selected.length) {
      const empty = el('div', 'learning-empty');
      empty.append(el('p', '', 'Nema rezultata za odabrani pojam ili područje. Pokušaj drukčiji izraz ili poništi filtre.'));
      root.append(empty);
    }

    if (resultCount) {
      resultCount.textContent = query || activeCategory !== 'sve'
        ? `Rezultati: ${selected.length} od ${content.topics.length} tema`
        : `Prikazano ${visible.length} od ${content.topics.length} tema`;
    }
    if (resetButton) resetButton.hidden = !query && activeCategory === 'sve';

    if (moreButton) {
      const remaining = selected.length - visible.length;
      moreButton.hidden = query || remaining <= 0;
      moreButton.textContent = showAll ? 'Prikaži manje tema' : `Prikaži još ${remaining} tema`;
      moreButton.setAttribute('aria-expanded', String(showAll));
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      showAll = false;
      renderTopics();
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      activeCategory = 'sve';
      searchQuery = '';
      showAll = false;
      if (searchInput) searchInput.value = '';
      renderFilters();
      renderTopics();
      searchInput?.focus();
    });
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
    header.append(el('span', 'daily-fact-date', new Intl.DateTimeFormat('hr-HR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(today)));
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

  function syncTopicProgress() {
    const saved = readProgress();
    root.querySelectorAll('.learning-card[data-topic-id]').forEach(card => {
      const button = card.querySelector('.learning-award');
      const done = saved['lesson-' + card.dataset.topicId] === true;
      if (button) {
        button.disabled = done;
        button.textContent = done ? 'Naučeno ✓' : 'Zabilježi naučeno · +4 XP';
      }
      card.classList.toggle('is-complete', done);
    });
  }

  function syncDailyFactProgress() {
    const button = factRoot.querySelector('.daily-fact-award');
    if (!button) return;
    const done = readProgress().dailyFactStamp === localDateKey(new Date());
    button.disabled = done;
    button.textContent = done ? 'Današnja zanimljivost pročitana ✓' : 'Pročitao/la sam · +2 XP';
  }

  renderFilters();
  renderTopics();
  renderDailyFact();

  // Update completion indicators in place so open explanations and keyboard focus survive.
  window.addEventListener('potez:progress', () => {
    syncTopicProgress();
    syncDailyFactProgress();
  });
})();