const express = require('express');
const router = express.Router();
const { exchangeToken, getProjects } = require('../controllers/jiraController');

router.post('/token', exchangeToken);
router.get('/projects', getProjects);

module.exports = router;
