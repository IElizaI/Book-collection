const authCheck = require('../middleware/jwt');

const router = require('express').Router();
require('../config-passport');

// eslint-disable-next-line no-shadow
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const coverTemplate = (cover) => `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
const defaultCover = 'https://via.placeholder.com/250x200';

router.use('/:key/details', authCheck((req, res) => {
  res.render('forbidden');
}));
router.get('/:key/details', async (req, res) => {
  const { key } = req.params;

  const responseBook = await fetch(`https://openlibrary.org/works/${key}.json`);
  const book = await responseBook.json();

  const description = book.description?.value || book.description || 'description not found';
  const cover = book.covers && book.covers.length ? coverTemplate(book.covers.pop()) : defaultCover;
  const linkToWiki = book?.links?.filter((link) => {
    if (link.url.includes('wikipedia')) {
      return link;
    }
    return false;
  });
  const link = linkToWiki?.url || '';
  // const link =
  const subPlaces = book?.subject_places ? book.subject_places : '';
  const subPeople = book?.subject_people ? book.subject_people : '';
  const arrayAuthors = book.authors;

  const arrayAuthorsKey = [];
  const authors = [];

  await Promise.all(arrayAuthors.map(async (person) => {
    const authorKey = person.author.key.slice(9);
    arrayAuthorsKey.push(authorKey);

    await Promise.all(arrayAuthorsKey.map(async (personKey) => {
      const responseAuthor = await fetch(`https://openlibrary.org/authors/${personKey}.json`);
      const author = await responseAuthor.json();
      authors.push(author);
    }));
  }));

  res.render('book', {
    book, description, cover, link, subPlaces, subPeople, authors,
  });
});

module.exports = router;
