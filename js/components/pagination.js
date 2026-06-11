let currentPage = 1;        
const itemsPerPage = 6;

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  currentPage = page;
}

export function resetPagination() {
  currentPage = 1;
}


export function paginateProducts(products) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return products.slice(startIndex, endIndex);
}

export function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationButtons = document.querySelectorAll('.catalog__pagination-link');
  const paginationContainer = document.querySelector('.catalog__pagination');


  paginationButtons.forEach((button, index) => {
    const pageNum = index + 1;

    if (pageNum <= totalPages) {
      button.style.display = 'flex';

      button.classList.remove('catalog__pagination-link--active');

      if (pageNum === currentPage) {
        button.classList.add('catalog__pagination-link--active');
      }
    } else {
      button.style.display = 'none';
    }
  });
}

export function initPagination(allProducts, filterAndSort, renderProducts, scrollToCatalog) {
  const paginationButtons = document.querySelectorAll('.catalog__pagination-link');

   paginationButtons.forEach((button, index) => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', () => {
      const newPage = index + 1;
      const totalItems = filterAndSort(allProducts).length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        currentPage = newPage;
        const filteredProducts = filterAndSort(allProducts);
        renderProducts(filteredProducts);
        scrollToCatalog();
      }
    });
  });
}


