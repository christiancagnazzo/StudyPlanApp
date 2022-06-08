const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const userDao = require('../dao/userDao'); // module for accessing the users in the DB

class Authentication {
    constructor(app) {
        if (app) this.app = app;
    }

    async initPassport() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        /*** Set up Passport ***/
        // set up the "username and password" login strategy
        // by setting a function to verify username and password
        passport.use(new LocalStrategy(
            function (username, password, done) {
                userDao.getUser(username, password).then((user) => {
                    if (!user)
                        return done(null, false, { message: 'Incorrect username and/or password.' });

                    return done(null, user);
                })
            }
        ));

        // serialize and de-serialize the user (user object <-> session)
        // we serialize the user id and we store it in the session: the session is very small in this way
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        // starting from the data in the session, we extract the current (logged-in) user
        passport.deserializeUser((id, done) => {
            userDao.getUserById(id)
                .then(user => {
                    done(null, user); // this will be available in req.user
                }).catch(err => {
                    done(err, null);
                });
        });
    }

    getPassport() {
        return passport;
    }
}

module.exports = Authentication;







