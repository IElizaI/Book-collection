// const randomCover = (array) => {
//   const maxNumber = array.length;
//   const randomNumber = Math.floor(Math.random() * maxNumber);
//   return `https://covers.openlibrary.org/b/id/${array.covers[randomNumber - 1]}-M.jpg`;
// };

const coverTemplate = (cover) => `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
const defaultCover = 'https://via.placeholder.com/250x200';

const handleSearch = async (event) => {
  event.preventDefault();

  const containerCards = document.querySelector('.cards');
  containerCards.innerHTML = '';
  console.log('Hi');

  let formRequest = document.getElementById('js-search').value.toLowerCase();
  formRequest = formRequest.split(' ').join('+');
  console.log('formRequest', formRequest);

  const responseAllBooks = await fetch(`http://openlibrary.org/search.json?q=${formRequest}`);
  const resultAllBooks = await responseAllBooks.json();
  const books = await resultAllBooks.docs;
  // console.log(await books);

  books.forEach(async (book) => {
    let resultBook = null;
    try {
      const responseBook = await fetch(`https://openlibrary.org${book.key}.json`);
      resultBook = await responseBook.json();
    } catch {
      return;
    }

    // console.log(await resultBook);

    const containerCard = document.createElement('div');
    containerCard.className = 'card';

    console.log(resultBook);
    const { covers } = resultBook;
    const cover = covers && covers.length ? coverTemplate(covers.pop()) : defaultCover;

    const description = resultBook.description?.value || resultBook.description || '';

    if (cover === defaultCover && description === '') {
      return;
    }

    // const cover = resultBook.covers ? resultBook.covers[resultBook.covers.length - 1] : 'https://via.placeholder.com/250x200'
    // const cover = resultBook.covers[resultBook.covers.length - 1];
    // let description = resultBook.description?.value;

    // if (resultBook.description?.value || resultBook.description) {
    //   if (!description) {
    //     description = resultBook.description;
    //   }
    // if (!cover) {
    //   containerCard.innerHTML = `
    //     <img class="cover" src="https://via.placeholder.com/250x200">
    //     <div class="title">${resultBook.title}</div>
    //     <p class="description">${description}</p>
    //     <a data-key="${book.key}" class="details" href="/book/details"><div>Details</div></a>
    //   `;
    // } else {
    const key = book.key.slice(7);
    console.log(key);
    containerCard.innerHTML = `
      <img class="cover" src="${cover}">
      <div class="title">${resultBook.title}</div>
      <p class="description">${description}</p>
      <a data-key="${book.key}" class="details" href="/books/${key}/details"><div>Details</div></a>
    `;
    console.log('book.key', book.key);
    // }
    containerCards.appendChild(containerCard);
    // } else {
    //   containerCard.innerHTML = `
    //     <img class="cover" src="https://covers.openlibrary.org/b/id/${cover}-M.jpg">
    //     <div class="title">${resultBook.title}</div>
    //     <p class="description"></p>
    //     <a class="details" href="/book/details/${book.key}"><div>Details</div></a>
    //     `;
    //   containerCards.appendChild(containerCard);
    // }
  });
  document.getElementById('js-search').value = '';
};

const handleLogin = async (event) => {
  event.preventDefault();
  console.log('логин');

  const email = document.getElementById('js-email').value;
  const password = document.getElementById('js-password').value;

  console.log(email, password);

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email, password,
    }),
  });

  const result = await response.json;

  const alert = getElementById('js-alert');

  if (result.success) {

  }
};

document.getElementById('js-btn-search')
  ?.addEventListener('click', handleSearch);

document.getElementById('js-auth-btn')
  ?.addEventListener('click', handleLogin);
