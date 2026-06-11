import { paginateProducts, updatePagination, initPagination, resetPagination, getCurrentPage, setCurrentPage } from "./pagination.js";
import { getCard } from "./components.js";
import { initTooltips }from "./tooltips.js"

//---------------------------------------- функция рендера карточек  -------------------------------------------------------------
export function renderProducts(products) {
  const catalogList = document.querySelector('.catalog__list');

  if (catalogList) {
    const paginatedProducts = paginateProducts(products);

    catalogList.innerHTML = '';

    paginatedProducts.forEach(product => {
      const itemEl = document.createElement('li')
      itemEl.classList.add('catalog__item')

      const card = getCard(product);

      itemEl.appendChild(card);
      catalogList.appendChild(itemEl);
    });
    updatePagination(products.length);
    initTooltips();
  }
}
//---------------------------------------- функция рендера карточек товар дня -----------------------------------------------------
export function renderDayProducts(products) {
  const dayProductsListEl = document.querySelector('.day-products__list');
  if (dayProductsListEl) {
    dayProductsListEl.innerHTML = '';

    products.forEach(product => {
      if (product.goodsOfDay === true) {
        const dayProductEl = document.createElement('li')
        dayProductEl.classList.add('swiper-slide')

        const card = getCard(product);
        dayProductEl.appendChild(card);
        dayProductsListEl.appendChild(dayProductEl);
      }
    });
    if (window.swiper) {
      window.swiper.update();
    }
      initTooltips();
  }
}