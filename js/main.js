import { getCard } from "./components/components.js";
import { basketCard } from "./components/basketCard.js";
import { renderBasketProducts, updateBasketCount, setupDeleteButtons } from "./components/basketUtilits.js";
import { paginateProducts, updatePagination, initPagination, resetPagination, getCurrentPage, setCurrentPage } from "./components/pagination.js";
import { renderProducts, renderDayProducts} from './components/render.js'
import { initTooltips } from "./components/tooltips.js";


const menuEl = document.querySelector('.main-menu')
const menuCloseEl = document.querySelector('.main-menu__wrapper')
const burgerEl = document.querySelector('.header__catalog-btn')
const burgerCloseEl = document.querySelector('.main-menu__close')
const basketBtnEl = document.querySelector('.header__user-btn')
const basketEl = document.querySelector('.basket')
const basketCount = document.querySelector('.header__user-count')
const accardionBtnEls = document.querySelectorAll('.accordion__btn')

export let allProducts = [];
let currentFilteredProducts = [];
let selectedCity = 'orenburg';

//------------------------------ кнопки открытия бурегрных меню, выбора города, акардеона, корзыны товаров---------------

//-----------------аккардеон
accardionBtnEls.forEach(btn => {
  btn.addEventListener('click', (event) => {
    if (btn.classList.contains('accordion__btn--active')) {
      btn.classList.remove('accordion__btn--active');
      return;
    }
    accardionBtnEls.forEach(otherBtn => {
      otherBtn.classList.remove('accordion__btn--active');
    })
    btn.classList.add('accordion__btn--active');
  });
})

//------------- бургерное меню
burgerEl.addEventListener('click', (event) => {
  event.stopPropagation();
  menuEl.classList.add('main-menu--active')
})
burgerCloseEl.addEventListener('click', () => {
  menuEl.classList.remove('main-menu--active')
})

basketBtnEl.addEventListener('click', (event) => {
  event.stopPropagation();
  basketEl.classList.toggle('basket--active')
})
const mainEl = document.querySelector('main')

document.addEventListener('click', (event) => {
  if (!basketBtnEl.contains(event.target) && !basketEl.contains(event.target) && mainEl.contains(event.target)) {
    basketEl.classList.remove('basket--active')
  }
})

//------------ выбор города ---

const buttonLocationEl = document.querySelector('.location__city')
if (buttonLocationEl) {
  buttonLocationEl.addEventListener('click', () => {
    buttonLocationEl.classList.toggle('location__city--active')
  })
}

const buttonCityEl = document.querySelectorAll('.location__sublink')
buttonCityEl.forEach(button => {
  button.addEventListener('click', () => {
    buttonLocationEl.classList.remove('location__city--active')
    document.querySelector('.location__city-name').textContent = button.textContent
    selectedCity = button.getAttribute('data-city');

    resetPagination();

    const filteredProducts = filterAndSort(allProducts);
    renderProducts(filteredProducts);
    renderDayProducts(allProducts);
  })
});

document.addEventListener('click', (event) => {
  if (buttonLocationEl && !buttonLocationEl.contains(event.target)) {
    buttonLocationEl.classList.remove('location__city--active')
  }
  const isClickOnBurger = event.target.closest('.header__catalog-btn');
  const isClickInsideMenu = event.target.closest('.main-menu__wrapper');
  if (!isClickInsideMenu && !isClickOnBurger) {
    menuEl.classList.remove('main-menu--active')
  }
})

//-------- функция скрола к выбору товара---

function scrollToCatalog() {
  const catalogEl = document.querySelector('.catalog');
  if (catalogEl) {
    catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const basketLinkToCatalog = document.querySelector('.basket__link').addEventListener('click', () => {
  scrollToCatalog()
})

// --------------------------------- функции для загрузки данных с local и отрисовки карточек ------------------------------------

export async function loadData() {
  const response = await fetch('../data/data.json');
  const data = await response.json();
  allProducts = data;

  currentFilteredProducts = [...allProducts];

  renderProducts(currentFilteredProducts);
  updateCounters(allProducts);
  return allProducts;
}

// ---------------------------------- функция для обновления счетчиков чекбоксов -------------------------------------
async function updateCounters(products) {
  const types = ['pendant', 'ceiling', 'overhead', 'point', 'nightlights'];

  types.forEach(type => {
    const count = products.filter(item => item.type.includes(type)).length;
    const FilterEl = document.querySelector(`.custom-checkbox--${type}`);

    if (FilterEl) {
      const countSpan = FilterEl.querySelector('.custom-checkbox__count');
      if (countSpan) {
        countSpan.textContent = `(${count})`;
      }
    }
  })
};
// ------------------------------- функция фильтрации и сортировки -------------------------------------------------
export function filterAndSort(products) {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
    .map(checkbox => checkbox.value);


  let filtered = [...products];
  if (selectedTypes.length > 0) {
    filtered = filtered.filter(product =>
      product.type.some(type => selectedTypes.includes(type))
    );
  }

  const selectedStatus = document.querySelector('input[name="status"]:checked')?.value;
  if (selectedStatus === 'instock') {
    filtered = filtered.filter(product => {
      return product.availability[selectedCity] > 0;
    });
  }

  const sortValue = document.querySelector('.catalog__sort-select')?.value;

  switch (sortValue) {
    case 'price-min':
      filtered.sort((a, b) => a.price.new - b.price.new);
      break;
    case 'price-max':
      filtered.sort((a, b) => b.price.new - a.price.new);
      break;
    case 'rating-max':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
  }
  return filtered;
}

// -----------------------------------------------------функция инициализации фильтров и сортировки -------------------------------
function initFilters() {
  const filters = document.querySelectorAll('input[name="type"], input[name="status"], .catalog__sort-select');

  filters.forEach(filter => {
    filter.addEventListener('change', () => {
      resetPagination();
      const filteredProducts = filterAndSort(allProducts);
      renderProducts(filteredProducts);
    });
  });

  const initialProducts = filterAndSort(allProducts);
  renderProducts(initialProducts);

  const resetFilterEl = document.querySelector('.catalog-form__reset');
  if (resetFilterEl)
    resetFilterEl.addEventListener('click', () => {
      document.querySelectorAll('input[name="type"]').forEach(checkbox => checkbox.checked = false);
      document.querySelectorAll('input[name="status"]').forEach(checkbox => checkbox.checked = false);
      // document.querySelector('.catalog__sort-select').value = 'price-min';       ----------- если нужно сбрасывать сортировку при сбросе фильтров
      const filteredProducts = filterAndSort(allProducts);
      renderProducts(filteredProducts);
    });
}
// --------------------------------- установка кнопок в карточки для добовления в корзину -----------------------------------------------
function setupAddToBasketButtons() {
  document.body.addEventListener('click', (event) => {
    const button = event.target.closest('.product-card__link');

    if (!button) return;

    event.preventDefault();

    const productId = button.getAttribute('data-id');
    const product = allProducts.find(p => p.id == productId);

    if (product) {
      addProductToLocal(product);
      renderBasketProducts();
    }
  });
}
// --------------------------------- функция добовления в local-----------------------------------------------------------------------
function addProductToLocal(product) {
  const basketProducts = JSON.parse(localStorage.getItem('basketProduct')) || [];

  if (product.availability[selectedCity] <= 0) {
    alert('Товар недоступен в вашем городе');
    return;
  }

  basketProducts.push(product);
  localStorage.setItem('basketProduct', JSON.stringify(basketProducts));
  updateBasketCount();
  renderBasketProducts();
}
// ----------------------------------------------------- swiper --------------------------------------------------------------
const swiper = new Swiper('.swiper', {
  slidesPerView: 4,
  slidePerGroup: 1,
  spaceBetween: 20,
  grabCursor: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  navigation: {
    nextEl: '.day-products__navigation-btn--next',
    prevEl: '.day-products__navigation-btn--prev',
  },
});

// ---------------------------------------------- JustValidate -------------------------------------------------------
const validator = new JustValidate('.questions__form');

validator
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Пожалуйста введите ваше имя',
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'Минимум 3 символа',
    },
    {
      rule: 'maxLength',
      value: 20,
      errorMessage: 'Максимум 20 символа',
    },
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'Пожалуйста введите ваш E-mail',
    },
    {
      rule: 'email',
    },
  ])
  .addField('#agree', [
    {
      rule: 'required',
      errorMessage: 'Подтвердите ваше согласие',
    },
  ])
// -------------------------------------------------- Инициализация всех функций ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  loadData().then(() => {
    initFilters();
    renderDayProducts(allProducts);
    setupAddToBasketButtons();
    renderBasketProducts();
    updateBasketCount();
    setupDeleteButtons();
    initPagination(allProducts, filterAndSort, renderProducts, scrollToCatalog);
  });
});