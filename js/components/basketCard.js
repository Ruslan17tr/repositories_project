import { updateBasketCount, renderBasketProducts } from "./basketUtilits.js";


export function basketCard(product) {
  if (!product) {
        return document.createElement('li'); // Возвращаем пустой элемент
    }
const productName = product.name;
    const itemEl = document.createElement('li')
    itemEl.classList.add('basket__item')
    itemEl.innerHTML = `
    <div class="basket__img">
        <img src="${product.image}" alt="Фотография товара" height="60" width="60">
    </div>
    <span class="basket__name">${productName}</span>
    <span class="basket__price">${product.price.new} руб</span>
    <button data-id="${product.id}" class="basket__close" type="button">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
            <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
    </button>`
    return itemEl
}

