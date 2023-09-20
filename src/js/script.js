class BooksList {
  constructor() {
    this.favoriteBooks = [];
    this.filters = [];
    this.initData();
    this.getElements();
    this.initActions();
    this.render();
  }

  initData() {
    this.data = dataSource.books;
  }

  getElements() {
    this.booksList = document.querySelector('.books-list');
    this.filtersForm = document.querySelector('.filters');
  }

  initActions() {
    this.booksList.addEventListener('dblclick', event => {
      const targetElement = event.target.classList.contains('book__image') ? event.target : event.target.offsetParent;

      if (targetElement && targetElement.classList.contains('book__image')) {
        event.preventDefault();

        const bookId = targetElement.getAttribute('data-id');
        const isFavorite = this.favoriteBooks.includes(bookId);

        if (!isFavorite) {
          this.favoriteBooks.push(bookId);
          targetElement.classList.add('favorite');
        } else {
          const index = this.favoriteBooks.indexOf(bookId);
          if (index !== -1) {
            this.favoriteBooks.splice(index, 1);
            targetElement.classList.remove('favorite');
          }
        }
      }
    });

    this.filtersForm.addEventListener('change', event => {
      if ((event.target.name === 'filter' || event.target.name === 'filter2') && event.target.type === 'checkbox') {
        const filterValue = event.target.value;

        if (event.target.checked) {
          this.filters.push(filterValue);
        } else {
          const index = this.filters.indexOf(filterValue);
          if (index !== -1) {
            this.filters.splice(index, 1);
          }
        }

        this.filterBooks();
      }
    });
  }

  filterBooks() {
    console.log('Aktywne filtry:', this.filters);

    this.data.forEach(book => {
      const bookId = book.id;
      let shouldBeHidden = false;

      for (const filter of this.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }

      const bookImage = this.booksList.querySelector(`.book__image[data-id="${bookId}"]`);

      if (bookImage) {
        if (shouldBeHidden) {
          bookImage.classList.add('hidden');
        } else {
          bookImage.classList.remove('hidden');
        }
      }
    });
  }


  determineRatingBgc(rating) {
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

  render() {
    const template = document.getElementById('template-book').innerHTML;
    this.booksList.innerHTML = '';

    this.data.forEach(book => {
      const ratingBgc = this.determineRatingBgc(book.rating);
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

      const bookElement = this.createDOMFromHTML(bookHTML);
      this.booksList.appendChild(bookElement);
    });
  }

  createDOMFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  new BooksList();
});


