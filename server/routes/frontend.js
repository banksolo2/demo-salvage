const express = require('express');
const router = express.Router();
const frontend = require('../controllers/frontend');

router.get('/', frontend.home);

router.get('/make-bid-form/:id',frontend.bidForm);

router.post('/make-bid', frontend.bid);


module.exports = router;