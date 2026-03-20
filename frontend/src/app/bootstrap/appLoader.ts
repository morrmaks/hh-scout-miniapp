let current = 0;
let target = 0;
let cap = 0;

let raf: number | null = null;
let phraseInterval: number | null = null;

const phrases = [
  'Запускаем движок поиска вакансий...',
  'Подключаемся к серверам...',
  'Загружаем интерфейс...',
  'Оптимизируем производительность...',
  'Почти готово...',
  'Еще немного...',
  'Казалось бы да, всего лишь бот...',
  'Шла седьмая секунда загрузки...',
  'Тут я тоже разочаровался бы...',
  'Ладно, еще есть надежда...'
];

function render(progress: number) {
  const bar = document.getElementById('app-loader-bar');
  if (!bar) return;
  bar.style.width = `${progress}%`;
}

function animate() {
  // реальный прогресс
  if (current < target) {
    current += Math.max((target - current) * 0.08, 0.1);
  }

  // автопрогресс до cap
  else if (current < cap) {
    current += 0.02;
  }

  render(current);

  raf = requestAnimationFrame(animate);
}

export function startAppLoader() {
  const text = document.getElementById('app-loader-text');

  current = 0;
  target = 15;
  cap = 35;

  render(current);

  raf = requestAnimationFrame(animate);

  if (text) {
    let i = 0;

    phraseInterval = window.setInterval(() => {
      i = (i + 1) % phrases.length;
      text.textContent = phrases[i] ?? '';
    }, 2000);
  }
}

export function setLoaderProgress(percent: number) {
  target = Math.max(target, percent);

  // следующий cap всегда немного впереди
  cap = Math.max(cap, percent + 10);
}

export function stopAppLoader() {
  target = 100;
  cap = 100;

  if (phraseInterval) {
    clearInterval(phraseInterval);
    phraseInterval = null;
  }

  const loader = document.getElementById('app-loader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('hide');

    setTimeout(() => {
      loader.remove();

      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }, 350);
  }, 300);
}
