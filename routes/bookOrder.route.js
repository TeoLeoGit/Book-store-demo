const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookOrder.controller');

router.post('/add', controller.addNewOrder);
router.post('/delete', controller.removeOrder);
router.get('/', controller.getOrdersInProcess);

module.exports = router;