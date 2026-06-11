export function getCard(product) {
  // const itemEl = document.createElement('li')
  // itemEl.classList.add('catalog__item')

  const cardEl = document.createElement('div')
  cardEl.classList.add('product-card')
  cardEl.innerHTML = `
      <div class="product-card__visual" data-id="${product.id}">
        <img class="product-card__img" src="${product.image}" alt="${product.name}">
        <div class="product-card__more">
        <a href="#"  data-id="${product.id}" class="product-card__link btn btn--icon">
        <span class="btn__text">В корзину
        </span>
        <svg width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-basket"></use>
        </svg>
        </a>
        <a href="#" class="product-card__link btn btn--secondary">
        <span class="btn__text">Подробнее</span>
        </a>
        </div>
      </div>
      <div class="product-card__info">
        <h2 class="product-card__title">${product.name}</h2>
         <span class="product-card__old">
          <span class="product-card__old-number">${product.price.old}</span>
          <span class="product-card__old-add">₽</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-number">${product.price.new}</span>
          <span class="product-card__price-add">₽</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" data-id="${product.id}" aria-label="Показать подсказку">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>

        </div>
      </div>
      
    `
  // itemEl.appendChild(cardEl)
  return cardEl
}