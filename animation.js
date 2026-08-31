document.addEventListener('DOMContentLoaded', function () {
  // Проверяем мобильное устройство (ширина <= 690px)
  const isMobile = window.matchMedia('(max-width: 690px)');

  function updateCards() {
    // Если не мобилка – ничего не делаем (или можно убрать проверку, если нужно везде)
    if (!isMobile.matches) return;

    const cards = document.querySelectorAll('.familiar article, .album article');
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;
    const tolerance = 85; // допуск от центра (можно подогнать)

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterY = rect.top + rect.height / 2;
      const isCentered = Math.abs(cardCenterY - centerY) < tolerance;
      const flipper = card.querySelector('.flipper');
      const flipperF = card.querySelector('.flipper-fact');
      if (flipper) {
        if (isCentered) {
          flipper.classList.add('flipped');
        } else {
          flipper.classList.remove('flipped');
        }
      }
      if (flipperF) {
        if (isCentered) {
          flipperF.classList.add('flipped');
        } else {
          flipperF.classList.remove('flipped');
        }
      }
    });
  }

  // Запускаем обновление при загрузке
  updateCards();

  // Следим за прокруткой с оптимизацией через requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateCards();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Обновляем при изменении размера окна (поворот экрана)
  window.addEventListener('resize', updateCards);
});

// ------------ modal window ----------
document.addEventListener('DOMContentLoaded', function () {
  // Все кнопки с классом social-modal-open
  const openBtns = document.querySelectorAll('.social-modal-open');
  const overlay = document.getElementById('socialModalOverlay');
  const closeBtn = document.getElementById('closeSocialModal');

  // Открыть окно по любой кнопке
  openBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.style.display = 'flex';
    });
  });

  // Закрыть по крестику
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      overlay.style.display = 'none';
    });
  }

  // Закрыть по клику на подложку (вне окна)
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  }

  // Закрыть по клавише Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
      overlay.style.display = 'none';
    }
  });
});

// --------------- facts -----------

window.addEventListener('load', function () {
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  const album = document.querySelector('.album');

  if (!img1 || !img2 || !album) {
    console.warn('Не найдены img1, img2 или .album');
    return;
  }

  // Получаем актуальную высоту изображений (включая padding/border, если есть)
  // offsetHeight – полная высота с рамками и отступами; clientHeight – только содержимое.
  // Для грида обычно используют высоту содержимого, но выбирайте по ситуации.
  const height1 = img1.offsetHeight || img1.clientHeight || 0;
  const height2 = img2.offsetHeight || img2.clientHeight || 0;

  // Переводим 1.5rem в пиксели
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const remInPx = 1.5 * rootFontSize;

  // Общая высота контейнера
  const total = height1 + height2 + remInPx;

  // Применяем высоту к .album
  album.style.height = total + 'px';

  // Задаём grid-template-rows: первая строка = высота img1, вторая = высота img2
  album.style.gridTemplateRows = height1 + 'px ' + height2 + 'px';
});