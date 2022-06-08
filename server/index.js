'use strict';

const express = require('express');
const Authentication = require('./services/authentication')
const Middleware = require('./services/middleware')

// init express
const app = express();
const port = 3001;

// init app
new Middleware(app).initMiddleware();
new Middleware(app).initSessions();
new Authentication(app).initPassport();


/* ------------------------------------ */
const courseRouter = require('./routes/CourseRoutes');
const studyPlanRouter = require('./routes/StudyPlanRoutes');
const userRouter = require('./routes/UserRoutes');

app.use('/api', courseRouter);
app.use('/api', studyPlanRouter);
app.use('/api', userRouter);
/* ------------------------------------ */

// Activate the server
app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
});