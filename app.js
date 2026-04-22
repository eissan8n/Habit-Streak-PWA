
const STORAGE_KEY = 'habit-streak-pwa-data-v1';
const LANG_KEY = 'habit-streak-pwa-lang';

const texts = {
  en: {
    appTitle: 'Habit Tracker',
    appSubtitle: 'Build consistency every day',
    addHabitTitle: 'Add Habit',
    addHabitBtn: 'Add Habit',
    weeklyInsightsTitle: 'Weekly Insights',
    totalCheckins: 'Total Check-ins',
    bestHabit: 'Best Habit',
    activeHabits: 'Active Habits',
    yourHabits: 'Your Habits',
    noHabits: 'No habits yet',
    noHabitsText: 'Add your first habit to start a streak.',
    today: 'Today',
    streak: 'Streak',
    days: 'days',
    doneToday: 'Done Today',
    markDone: 'Mark Done',
    delete: 'Delete',
    bestHabitFallback: 'None',
    weekRangePrefix: 'Week',
    placeholder: 'Habit name',
    requiredAlert: 'Please enter a habit name.',
    deleteConfirm: 'Delete this habit?',
    created: 'Created',
    dayShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    langButton: 'العربية'
  },
  ar: {
    appTitle: 'متتبع العادات',
    appSubtitle: 'ابنِ الاستمرارية كل يوم',
    addHabitTitle: 'إضافة عادة',
    addHabitBtn: 'إضافة عادة',
    weeklyInsightsTitle: 'الإحصاءات الأسبوعية',
    totalCheckins: 'إجمالي التسجيلات',
    bestHabit: 'أفضل عادة',
    activeHabits: 'العادات النشطة',
    yourHabits: 'عاداتك',
    noHabits: 'لا توجد عادات بعد',
    noHabitsText: 'أضف أول عادة لبدء سلسلة إنجاز.',
    today: 'اليوم',
    streak: 'السلسلة',
    days: 'أيام',
    doneToday: 'تم اليوم',
    markDone: 'تسجيل الإنجاز',
    delete: 'حذف',
    bestHabitFallback: 'لا يوجد',
    weekRangePrefix: 'الأسبوع',
    placeholder: 'اسم العادة',
    requiredAlert: 'يرجى إدخال اسم العادة.',
    deleteConfirm: 'هل تريد حذف هذه العادة؟',
    created: 'تاريخ الإنشاء',
    dayShort: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    langButton: 'English'
  }
};

let state = {
  habits: loadHabits(),
  lang: localStorage.getItem(LANG_KEY) || 'en'
};

const el = {
  appTitle: document.getElementById('app-title'),
  appSubtitle: document.getElementById('app-subtitle'),
  addHabitTitle: document.getElementById('add-habit-title'),
  addHabitBtn: document.getElementById('add-habit-btn'),
  weeklyInsightsTitle: document.getElementById('weekly-insights-title'),
  statTotalLabel: document.getElementById('stat-total-label'),
  statBestLabel: document.getElementById('stat-best-label'),
  statActiveLabel: document.getElementById('stat-active-label'),
  yourHabitsTitle: document.getElementById('your-habits-title'),
  emptyTitle: document.getElementById('empty-title'),
  emptyText: document.getElementById('empty-text'),
  todayLabel: document.getElementById('today-label'),
  weekRange: document.getElementById('week-range'),
  statTotal: document.getElementById('stat-total'),
  statBest: document.getElementById('stat-best'),
  statActive: document.getElementById('stat-active'),
  weeklyBreakdown: document.getElementById('weekly-breakdown'),
  habitList: document.getElementById('habit-list'),
  emptyState: document.getElementById('empty-state'),
  habitForm: document.getElementById('habit-form'),
  habitName: document.getElementById('habit-name'),
  langToggle: document.getElementById('lang-toggle')
};

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.habits));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar' : 'en', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function getWeekDates() {
  const start = startOfWeek(new Date());
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function calculateStreak(habit) {
  const completed = new Set(habit.completedDates || []);
  let streak = 0;
  const current = new Date();
  current.setHours(0, 0, 0, 0);

  while (true) {
    const key = current.toISOString().slice(0, 10);
    if (completed.has(key)) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function addHabit(name) {
  state.habits.unshift({
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    completedDates: []
  });
  saveHabits();
  render();
}

function toggleHabitToday(id) {
  const habit = state.habits.find(h => h.id === id);
  if (!habit) return;
  const today = todayStr();
  const set = new Set(habit.completedDates);
  if (set.has(today)) {
    set.delete(today);
  } else {
    set.add(today);
  }
  habit.completedDates = Array.from(set).sort();
  saveHabits();
  render();
}

function deleteHabit(id) {
  const t = texts[state.lang];
  if (!window.confirm(t.deleteConfirm)) return;
  state.habits = state.habits.filter(h => h.id !== id);
  saveHabits();
  render();
}

function getWeeklyInsights() {
  const weekDates = getWeekDates();
  const weekKeys = weekDates.map(d => d.toISOString().slice(0, 10));
  let total = 0;
  let bestName = texts[state.lang].bestHabitFallback;
  let bestCount = -1;

  const dailyCounts = weekKeys.map(key => {
    let count = 0;
    state.habits.forEach(habit => {
      if ((habit.completedDates || []).includes(key)) {
        count += 1;
      }
    });
    total += count;
    return count;
  });

  state.habits.forEach(habit => {
    const count = (habit.completedDates || []).filter(d => weekKeys.includes(d)).length;
    if (count > bestCount) {
      bestCount = count;
      bestName = count > 0 ? habit.name : texts[state.lang].bestHabitFallback;
    }
  });

  return {
    total,
    bestName,
    active: state.habits.length,
    weekDates,
    dailyCounts
  };
}

function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
  render();
}

function renderStaticText() {
  const t = texts[state.lang];
  el.appTitle.textContent = t.appTitle;
  el.appSubtitle.textContent = t.appSubtitle;
  el.addHabitTitle.textContent = t.addHabitTitle;
  el.addHabitBtn.textContent = t.addHabitBtn;
  el.weeklyInsightsTitle.textContent = t.weeklyInsightsTitle;
  el.statTotalLabel.textContent = t.totalCheckins;
  el.statBestLabel.textContent = t.bestHabit;
  el.statActiveLabel.textContent = t.activeHabits;
  el.yourHabitsTitle.textContent = t.yourHabits;
  el.emptyTitle.textContent = t.noHabits;
  el.emptyText.textContent = t.noHabitsText;
  el.todayLabel.textContent = `${t.today}: ${formatDate(new Date(), state.lang)}`;
  el.habitName.placeholder = `${texts.en.placeholder} / ${texts.ar.placeholder}`;
  el.langToggle.textContent = t.langButton;
}

function renderInsights() {
  const t = texts[state.lang];
  const insights = getWeeklyInsights();
  const start = insights.weekDates[0];
  const end = insights.weekDates[6];

  el.weekRange.textContent = `${t.weekRangePrefix} ${formatDate(start, state.lang)} - ${formatDate(end, state.lang)}`;
  el.statTotal.textContent = String(insights.total);
  el.statBest.textContent = insights.bestName;
  el.statActive.textContent = String(insights.active);

  el.weeklyBreakdown.innerHTML = '';
  insights.weekDates.forEach((date, index) => {
    const box = document.createElement('div');
    box.className = 'day-pill';
    const dayName = t.dayShort[date.getDay()];
    box.innerHTML = `<span>${dayName}</span><strong>${insights.dailyCounts[index]}</strong>`;
    el.weeklyBreakdown.appendChild(box);
  });
}

function renderHabits() {
  const t = texts[state.lang];
  el.habitList.innerHTML = '';
  el.emptyState.classList.toggle('hidden', state.habits.length > 0);

  state.habits.forEach(habit => {
    const doneToday = (habit.completedDates || []).includes(todayStr());
    const streak = calculateStreak(habit);
    const item = document.createElement('div');
    item.className = 'habit-item';

    const createdDate = new Date(habit.createdAt);
    const completeLabel = doneToday ? t.doneToday : t.markDone;

    item.innerHTML = `
      <div class="habit-top">
        <div>
          <p class="habit-name"></p>
          <div class="habit-meta">
            <span class="badge">${t.streak}: ${streak} ${t.days}</span>
            <span class="badge">${t.created}: ${formatDate(createdDate, state.lang)}</span>
          </div>
        </div>
        <div class="actions">
          <button class="complete-btn ${doneToday ? 'done' : ''}">${completeLabel}</button>
          <button class="delete-btn">${t.delete}</button>
        </div>
      </div>
    `;

    item.querySelector('.habit-name').textContent = habit.name;
    item.querySelector('.complete-btn').addEventListener('click', () => toggleHabitToday(habit.id));
    item.querySelector('.delete-btn').addEventListener('click', () => deleteHabit(habit.id));
    el.habitList.appendChild(item);
  });
}

function render() {
  renderStaticText();
  renderInsights();
  renderHabits();
}

el.habitForm.addEventListener('submit', event => {
  event.preventDefault();
  const t = texts[state.lang];
  const name = el.habitName.value.trim();
  if (!name) {
    alert(t.requiredAlert);
    return;
  }
  addHabit(name);
  el.habitName.value = '';
  el.habitName.focus();
});

el.langToggle.addEventListener('click', () => {
  setLanguage(state.lang === 'en' ? 'ar' : 'en');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

setLanguage(state.lang);
