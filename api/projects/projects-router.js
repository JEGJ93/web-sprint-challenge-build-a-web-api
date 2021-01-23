// Write your "projects" router here!

const express = require('express');
const Project = require('../projects/projects-model')
const router = express.Router();

router.use((req, res, next) => {
    console.log('in the project router');
    next();
});


module.exports = router;