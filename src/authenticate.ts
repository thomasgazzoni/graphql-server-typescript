import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';
import { Application, Request, Response, RequestHandler } from 'express';
import { Strategy, StrategyOptions, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { User, getUserById, getUserByUsername, addUser } from './db/users';

interface JwtPayload {
    userId: string;
}

const JWT_SECRET_KEY = 'PRIVATE_AUTH_KEY';

const TEST_ADMIN_USER: User = {
    username: 'admin',
    password: 'admin',
};

/** Options for JWT
 * in this exemple we use fromAuthHeader, so the client need to
 * provide an "Authorization" request header token
 */
const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: JWT_SECRET_KEY,
    passReqToCallback: true,
};

const jwtStategy = new Strategy(
    jwtOptions,
    (req: Request, jwtPayload: JwtPayload, done: VerifiedCallback) => {

        // In the login we encrypt the payload

        if (!jwtPayload.userId) {
            throw new Error('No userId in the JWT session token');
        }

        // const user = await getUser(username);

        getUserById(jwtPayload.userId)
            .then((user) => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // TODO: handle custom error to ask for create a new account
                }
            }).catch(err => {
                return done(err, false);
            });
    });

/**
 * If added to a express route, it will make the route require the auth token
 */
export function onlyAuthorized() {
    return passport.authenticate('jwt', { session: false });
}

/**
 * Setup the Passport JWT for the given express App.
 * It will add the auth routes (auth, login, logout) to handle the token authorization
 * It will use the mongoDB UserModel to check for user and password
 * Set addDebugRoutes to true for adding a Auth Form for testing purpose
 */
export function setupPassportAuth(app: Application, addDebugRoutes = false) {

    passport.use(jwtStategy);

    app.use(passport.initialize());

    if (addDebugRoutes) {

        app.get('/auth', (req, res) => {
            const loginFormHtml = `
            <form action="/login" method="post">
                <div>
                    <label>Username:</label>
                    <input type="text" name="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" value="Log In"/>
                </div>
            </form>
        `;
            res.send(loginFormHtml);
        });

        app.get('/add-admin-user', async (req, res) => {
            try {
                const adminUser = await addUser(TEST_ADMIN_USER);

                res.json({
                    testAccount: TEST_ADMIN_USER,
                    adminUser
                });
            } catch (error) {
                res.json({
                    testAccount: TEST_ADMIN_USER,
                    error: error.message
                });
            }
        });
    }

    app.post('/login', async (req, res, next) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw new Error('Username or password not set in the request');
            }

            // Get user by username
            const user = await getUserByUsername(username);

            if (!user) {
                throw new Error(`User for "${username}" could not be found`);
            }

            // Check user password using custom method in Mongooose UserModel Schema methods
            if (!await user.comparePassword(password)) {
                throw new Error('User password is not correct');
            }

            const jwtPayload: JwtPayload = {
                userId: user._id.toString(),
            };

            // Return a sign token containing the user ID (JwtPayload)
            const token = jwt.sign(jwtPayload, jwtOptions.secretOrKey);

            res.json({ token });

        } catch (error) {
            res.json({
                error: error.message
            });
        }
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
}
