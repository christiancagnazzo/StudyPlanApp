const express = require("express");
const router = express.Router();
const Authentication = require('../services/authentication');
const passport = new Authentication().getPassport();

// POST /sessions 
// login
router.post('/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});


// DELETE /sessions/current 
// logout
router.delete('/sessions/current', (req, res) => {
    req.logout(() => { res.end(); });
});


// GET /sessions/current
// check whether the user is logged in or not
router.get('/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else
        res.status(401).json({ error: 'Unauthenticated user!' });;
});

module.exports = router;