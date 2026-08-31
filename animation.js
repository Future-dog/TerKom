document.addEventListener('DOMContentLoaded', function () {
  // Проверяем мобильное устройство (ширина <= 690px)
  const isMobile = window.matchMedia('(max-width: 690px)');

  function updateCards() {
    // Если не мобилка – ничего не делаем (или можно убрать проверку, если нужно везде)
    if (!isMobile.matches) return;

    const cards = document.querySelectorAll('.familiar article');
    const viewportHeight = window.innerHeight;
    const centerY = viewportHeight / 2;
    const tolerance = 85; // допуск от центра (можно подогнать)

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
document.addEventListener('DOMContentLoaded', function() {
  // Все кнопки с классом social-modal-open
  const openBtns = document.querySelectorAll('.social-modal-open');
  const overlay = document.getElementById('socialModalOverlay');
  const closeBtn = document.getElementById('closeSocialModal');

  // Открыть окно по любой кнопке
  openBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      overlay.style.display = 'flex';
    });
  });

  // Закрыть по крестику
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      overlay.style.display = 'none';
    });
  }

  // Закрыть по клику на подложку (вне окна)
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  }

  // Закрыть по клавише Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
      overlay.style.display = 'none';
    }
  });
});