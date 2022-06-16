const express = require('express');
const router = express.Router();
const controller = require('../controllers/book.controller');

router.get('/detail', controller.bookDetail);
router.post('/detail',  controller.bookUpdate);
router.post('/add', controller.addNewBook);
router.get('/:page', controller.getBooks);
router.post('/delete', controller.bookDelete);
router.get('/', controller.getBooks);

module.exports = router;