const { Router } = require('express');
const { getImages } = require('../controllers/imageController');

const router = Router();

router.get('/', getImages);

module.exports = router;
