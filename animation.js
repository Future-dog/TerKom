// const titles = document.getElementById('titles');
// const content = document.getElementById('titlecontent');

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       // Когда секция видна — добавляем класс, запускающий анимацию
//       content.classList.add('active');
//       // Можно отключить наблюдение, чтобы не запускалось повторно
//       observer.unobserve(titles);
//     }
//   });
// }, {
//   threshold: 0.5 // 50% элемента должно быть видно
// });

// observer.observe(titles);

const titles = document.getElementById('titles');
const content = document.getElementById('titlecontent');

const AUTO_SPEED = 0.05;
const MAX_TOP = 100;
const MIN_TOP = -170;

let currentTop = MAX_TOP;
let autoMove = false;
let animationId = null;

function setPosition(value) {
  currentTop = Math.min(MAX_TOP, Math.max(MIN_TOP, value));
  content.style.top = currentTop + '%';
}

function stepAuto() {
  if (!autoMove) return;
  setPosition(currentTop - AUTO_SPEED);
  if (currentTop <= MIN_TOP) {
    setPosition(MAX_TOP);
  }
  animationId = requestAnimationFrame(stepAuto);
}

function startAuto() {
  if (autoMove) return;
  autoMove = true;
  if (animationId) cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(stepAuto);
}

function stopAuto() {
  autoMove = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

// Обработчик колесика (только когда мышь внутри, но мы не проверяем, т.к. событие будет срабатывать только при наведении)
content.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 2 : -2;
  setPosition(currentTop - delta);
}, { passive: false });

// Остановка при наведении мыши
content.addEventListener('mouseenter', () => {
  stopAuto();
});

// Возобновление при уходе мыши
content.addEventListener('mouseleave', () => {
  startAuto();
});

// Intersection Observer - запуск анимации при видимости
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setPosition(MAX_TOP);
      startAuto();
      observer.unobserve(titles);
    }
  });
}, { threshold: 0.5 });

observer.observe(titles);