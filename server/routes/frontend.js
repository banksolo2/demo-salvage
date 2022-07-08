const express = require('express');
const router = express.Router();
const frontend = require('../controllers/frontend');

router.get('/', frontend.home);


module.exports = router;