function render() {

  const template = document.getElementById('template-book').innerHTML;
  const booksList = document.querySelector('.books-list');

  booksList.innerHTML = '';


  dataSource.books.forEach(book => {

    const ratingBgc = determineRatingBgc(book.rating);

    const ratingWidth = (book.rating / 10) * 100;

    const bookHTML = Handlebars.compile(template)({
      name: book.name,
      price: book.price,
      image: book.image,
      id: book.id,
      rating: book.rating,
      ratingBgc: ratingBgc,
      ratingWidth: ratingWidth,
    });

    const bookElement = utils.createDOMFromHTML(bookHTML);

    booksList.appendChild(bookElement);
  });
}

const favoriteBooks = [];
const filters = [];

function initActions() {
  const booksList = document.querySelector('.books-list');
  const filtersForm = document.querySelector('.filters');

  booksList.addEventListener('dblclick', event => {
    const targetElement = event.target.classList.contains('book__image') ? event.target : event.target.offsetParent;

    if (targetElement && targetElement.classList.contains('book__image')) {
      event.preventDefault();

      const bookId = targetElement.getAttribute('data-id');
      const isFavorite = favoriteBooks.includes(bookId);

      if (!isFavorite) {

        favoriteBooks.push(bookId);
        targetElement.classList.add('favorite');
      } else {

        const index = favoriteBooks.indexOf(bookId);
        if (index !== -1) {
          favoriteBooks.splice(index, 1);
          targetElement.classList.remove('favorite');
        }
      }
    }
  });

  filtersForm.addEventListener('change', event => {
    if ((event.target.name === 'filter' || event.target.name === 'filter2') && event.target.type === 'checkbox') {
      const filterValue = event.target.value;

      if (event.target.checked) {

        filters.push(filterValue);
      } else {

        const index = filters.indexOf(filterValue);
        if (index !== -1) {
          filters.splice(index, 1);
        }
      }

      filterBooks();
    }
  });
}

function filterBooks() {

  const bookImages = document.querySelectorAll('.book__image');
  console.log('bookImages:', bookImages);
  dataSource.books.forEach(book => {

    const bookId = book.id;

    let shouldBeHidden = false;

    for (const filter of filters) {

      if (!book.details[filter]) {
        //console.log(filter);

        shouldBeHidden = true;
        break;
      }
    }

    const bookImage = document.querySelector(`.book__image[data-id="${bookId}"]`);

    if (bookImage) {

      if (shouldBeHidden) {
        bookImage.classList.add('hidden');
      } else {
        bookImage.classList.remove('hidden');
      }
    }
  });
}

function determineRatingBgc(rating) {
  if (rating < 6) {
    return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
  } else if (rating <= 8) {
    return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
  } else if (rating <= 9) {
    return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
  } else {
    return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
  }
}

render();
initActions();

