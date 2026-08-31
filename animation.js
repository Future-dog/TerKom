document.addEventListener('DOMContentLoaded', function() {
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
