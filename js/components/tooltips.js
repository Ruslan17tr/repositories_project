import {allProducts} from './../main.js'

// ------------------------------------------------ Tooltips --------------------------------------------------------------
export function initTooltips() {
  const tooltipBtns = document.querySelectorAll('.tooltip__btn');

  tooltipBtns.forEach(btn => {
    if (btn._tippy) {
      btn._tippy.destroy();
    }
  });

  tippy('.tooltip__btn', {
    allowHTML: true,
    placement: 'top-end',
    arrow: true,
    theme: 'light',
    animation: 'fade',
    duration: 200,
    delay: [100, 0],


    content: (reference) => {
      const productCard = reference.closest('.product-card');
      if (!productCard) return 'Нет данных';


      const productId = productCard.querySelector('.product-card__link')?.getAttribute('data-id');
      if (!productId) return 'Нет данных';


      const product = allProducts.find(p => p.id == productId);
      if (!product) return 'Нет данных';

      return `
        <div class="tooltip__content">
          <span class="tooltip__text">Наличие товара по городам:</span>
          <ul class="tooltip__list">
            <li class="tooltip__item">Москва: ${product.availability.moscow}</li>
            <li class="tooltip__item">Оренбург: ${product.availability.orenburg}</li>
            <li class="tooltip__item">Санкт-Петербург: ${product.availability.saintPetersburg}</li>
          </ul>
        </div>
      `;
    },
  });
}