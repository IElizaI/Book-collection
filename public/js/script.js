const socket = io();

const defaultCover = 'https://via.placeholder.com/250x200';

const coverTemplate = (cover) => `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;

// комментарии к книге
const messageCard = ({ text, timestamp, user }) => `
    <div class="comment">
      <p class="time">${timestamp}</p>
      <p>${user}</p>
      <p class="text">${text}</p>
    </div>
  `;

const addComment = (message) => {
  document.querySelector('.user-comments').innerHTML += messageCard(message);
};

const sendMessage = async (event) => {
  event.preventDefault();

  const text = document.getElementById('input-comment').value;
  const timestamp = new Date().toLocaleString('ru-RU');
  const { key } = event.target.dataset;
  let user;

  const response = await fetch(`/books/${key}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bookId: key,
      text,
    }),
  });

  const result = await response.json();

  if (result.success) {
    user = result.user;
  }

  const message = {
    text,
    timestamp,
    user,
  };

  socket.emit('chat:outgoing', message);

  addComment(message);
  document.getElementById('input-comment').value = '';
};

socket.on('connect', () => {
  console.log('WS-соединение установлено', socket.id);
});

socket.on('chat:incoming', (message) => {
  addComment(message);
});

// эффект загрузки
const uploader = () => {
  const load = document.createElement('div');
  load.className = 'sk-cube-grid';
  load.innerHTML = `
    <div class="sk-cube sk-cube1"></div>
    <div class="sk-cube sk-cube2"></div>
    <div class="sk-cube sk-cube3"></div>
    <div class="sk-cube sk-cube4"></div>
    <div class="sk-cube sk-cube5"></div>
    <div class="sk-cube sk-cube6"></div>
    <div class="sk-cube sk-cube7"></div>
    <div class="sk-cube sk-cube8"></div>
    <div class="sk-cube sk-cube9"></div>
  `;
  return load;
};

const handleSearch = async (event) => {
  event.preventDefault();

  document.querySelector('.cards').innerHTML = '';

  const containerCards = document.querySelector('.cards');

  const load = uploader();
  document.querySelector('.cards').prepend(load);

  let formRequest = document.getElementById('js-search').value.toLowerCase();
  formRequest = formRequest.split(' ').join('+');

  const responseAllBooks = await fetch(`http://openlibrary.org/search.json?q=${formRequest}`);
  const resultAllBooks = await responseAllBooks.json();
  const books = await resultAllBooks.docs;

  load.remove();

  books.forEach(async (book) => {
    let resultBook = null;
    try {
      const responseBook = await fetch(`https://openlibrary.org${book.key}.json`);
      resultBook = await responseBook.json();
    } catch {
      return;
    }

    const containerCard = document.createElement('div');
    containerCard.className = 'card';

    const { covers } = resultBook;
    const cover = covers && covers.length ? coverTemplate(covers.pop()) : defaultCover;

    let description = resultBook.description?.value || resultBook.description || '';

    if (description) {
      description = description.slice(0, 400);
    }

    if (cover === defaultCover && description === '') {
      return;
    }

    const key = book.key.slice(7);
    containerCard.innerHTML = `
      <img class="cover" src="${cover}">
      <div class="title">${resultBook.title}</div>
      <p class="description">${description}</p>
      <a data-key="${book.key}" class="details" href="/books/${key}/details"><div>Details</div></a>
    `;

    containerCards.appendChild(containerCard);
  });
  document.getElementById('js-search').value = '';
};

const handleLogin = async (event) => {
  event.preventDefault();

  const alert = document.getElementById('js-alert');

  if (alert) {
    alert.innerText = '';
  }

  const email = document.getElementById('js-email').value;
  const password = document.getElementById('js-password').value;

  if (!email || !password) {
    alert.className = 'failed';
    alert.innerText = 'Please fill in all fields';
    return;
  }

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (result.success) {
    alert.className = 'successfully';
    alert.innerText = 'User successfully logged in';
    setTimeout(() => {
      document.location = '/';
    }, 3000);
  } else {
    alert.className = 'failed';
    alert.innerText = 'Authorisation Error. Check your input or register';
  }
};

const handleRegister = async (event) => {
  event.preventDefault();

  const alert = document.getElementById('js-alert');

  if (alert) {
    alert.innerText = '';
  }

  const name = document.getElementById('js-name').value;
  const email = document.getElementById('js-email').value;
  const password = document.getElementById('js-password').value;

  if (!name || !email || !password) {
    alert.className = 'failed';
    alert.innerText = 'Please fill in all fields';
    return;
  }

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const result = await response.json();

  if (result.success) {
    alert.className = 'successfully';
    alert.innerText = 'User successfully registered';
    setTimeout(() => {
      document.location = '/';
    }, 3000);
  } else {
    alert.className = 'failed';
    alert.innerText = 'Error during registration. Perhaps such a user exists';
  }
};

document.getElementById('js-btn-search')?.addEventListener('click', handleSearch);

document.getElementById('js-auth-btn')?.addEventListener('click', handleLogin);

document.getElementById('js-reg-btn')?.addEventListener('click', handleRegister);

document.getElementById('comment-btn')?.addEventListener('click', sendMessage);
