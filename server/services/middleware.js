const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const session = require('express-session'); // enable sessions


class Middleware {
    constructor(app) {
        this.app = app;
    }

    initMiddleware() {
        // set-up the middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        const corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true,
        };
        this.app.use(cors(corsOptions));
    }

    initSessions() {
        // set up the session
        this.app.use(session({
            // by default, Passport uses a MemoryStore to keep track of the sessions
            secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
            resave: false,
            saveUninitialized: false
        }));
    }
}

module.exports = Middleware;







