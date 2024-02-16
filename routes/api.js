const express = require('express');
const router = express.Router();
const charactersRouter = require('./characters');
const locationsRouter = require('./locations');
const episodesRouter = require('./episodes');

router.use('/', charactersRouter);
router.use('/', locationsRouter);
router.use('/', episodesRouter);

module.exports = router;