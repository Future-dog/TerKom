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

// -------------- familiar? ----------

function setPaddingFromHeight() {
    const divs = document.querySelectorAll('.div-svg');
    divs.forEach(div => {
        const parent = div.parentElement; // это .flipper
        if (!parent) return;
        const parentHeight = parent.offsetHeight;
        if (parentHeight > 0) {
            const paddingB = parentHeight * 0.265; // 15% от высоты родителя
            const paddingT = parentHeight * 0.05;
            div.style.paddingBottom = paddingB + 'px';
            div.style.paddingTop = paddingT + 'px';
            // Опционально: сбросить justify-content, если он мешает
            // div.style.justifyContent = 'flex-end'; // можно задать через JS
        }
    });
}

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', setPaddingFromHeight);

// Пересчитываем при ресайзе окна (если размеры меняются)
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setPaddingFromHeight, 200); // debounce
});

// flipper mobile animation

document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, мобильное ли устройство (ширина <= 690px)
  const isMobile = window.matchMedia('(max-width: 690px)');

  function updateCards() {
    // Если не мобилка – ничего не делаем (или можно убрать проверку для универсальности)
    if (!isMobile.matches) return;

    const cards = document.querySelectorAll('.familiar article');
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;
    const tolerance = 70; // допуск от центра (можно подогнать под свой дизайн)

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterY = rect.top + rect.height / 2;
      const isCentered = Math.abs(cardCenterY - centerY) < tolerance;
      const flipper = card.querySelector('.flipper');
      if (flipper) {
        if (isCentered) {
          flipper.classList.add('flipped');
        } else {
          flipper.classList.remove('flipped');
        }
      }
    });
  }

  // Запускаем при загрузке
  updateCards();

  // Следим за прокруткой с оптимизацией через requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateCards();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Обновляем при изменении размера окна (поворот экрана)
  window.addEventListener('resize', updateCards);
});