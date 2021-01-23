const express = require('express');

const projectRouter = require('./projects/projects-router')
const actionRouter = require('./actions/actions-router')
const server = express();
const helmet = require('helmet');

server.use(express.json());
server.use(helmet());

server.use(logger);
server.use('/api/project', projectRouter);
server.use('/api/action', actionRouter);



server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
    console.log(req);
    let date = new Date();

    console.log(
        `${req.method} request,
        URL: ${req.headers.host}${req.originalUrl},
        Date: ${date}`
    );

    next();
}

server.use((error, req, res, next) => {
    res.status(error.code).json({message: "Error:", error})
})

// Complete your server here!
// Do NOT `server.listen()` inside this file!

module.exports = server;
