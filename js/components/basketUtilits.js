import { getCard } from "./components.js";
import { basketCard } from "./basketCard.js";



//------------------------------ функции для отрисовки товаров в корзине и удаления товаров из корзины ------------------------------------
export function updateBasketCount() {
  const basketCount = document.querySelector('.header__user-count');
  const products = JSON.parse(localStorage.getItem('basketProduct')) || [];
  basketCount.textContent = products.length;
}
//------------------------------------- функция для добавления товара в корзину и сохранения его в localStorage -------------------------------
export function renderBasketProducts() {
  const basketProducts = JSON.parse(localStorage.getItem('basketProduct')) || [];
  const basketListEl = document.querySelector('.basket__list')
  const basketLinkEl = document.querySelector('.basket__link')
  const basketEmptyBlockEl = document.querySelector('.basket__empty-block')

  basketListEl.innerHTML = '';

  basketProducts.forEach(product => {
    const productEl = basketCard(product);
    basketListEl.appendChild(productEl);
  });
  if (basketProducts.length === 0) {
    basketLinkEl.style.display = 'flex';
    basketEmptyBlockEl.style.display = 'block';
    basketListEl.style.display = 'none';
  }
    else {
      basketLinkEl.style.display = 'none';
      basketEmptyBlockEl.style.display = 'none';
      basketListEl.style.display = 'block';
    }
  
  updateBasketCount();
  setupDeleteButtons()
}


export function setupDeleteButtons() {
  setTimeout(() => {
    const deleteEl = document.querySelectorAll('.basket__close');

    deleteEl.forEach(element => {
      element.removeEventListener('click', handleDeleteClick);
      element.addEventListener('click', handleDeleteClick);
    });
  }, 0);
}

function handleDeleteClick() {
  const productId = parseInt(this.getAttribute('data-id'));
  deleteProductById(productId);
}

// ------------------------------Удаление записи по id-------------
export function deleteProductById(id) {
  const products = JSON.parse(localStorage.getItem('basketProduct')) || [];
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    localStorage.setItem('basketProduct', JSON.stringify(products));
    updateBasketCount();
    renderBasketProducts();
  };
}
