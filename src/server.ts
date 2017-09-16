import * as mongoose from 'mongoose';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as bodyParser from 'body-parser';
import { printSchema } from 'graphql/utilities/schemaPrinter';

import { graphqlSchema } from './schema';
import { setupPassportAuth, onlyAuthorized } from './authenticate';

// Use node like promise for mongoose
(mongoose as any).Promise = global.Promise;

const DEBUG_MODE = true;
const GRAPHQL_PORT = 3000;
const MONGODB_DATABASE_NAME = 'heros';
const MONGODB_CONNECTION_URI = `mongodb://localhost:27017/${MONGODB_DATABASE_NAME}`;

// Main App
const app = express();

// Setup MongoDb connection
mongoose.connect(MONGODB_CONNECTION_URI, { useMongoClient: true });

// Express morgan logs
app.use(morgan('combined'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Parse application/json
app.use(bodyParser.json())

// Example routes
app.get('/', (req, res) => {
    res.status(200).send('Server endpoint');
});

app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});

// Set Auth
setupPassportAuth(app, DEBUG_MODE);

app.use('/graphql',
    cors(),
    onlyAuthorized(),
    graphqlHTTP(request => {
        const startTime = Date.now();
        return {
            schema: graphqlSchema,
            graphiql: true,
            extensions({ document, variables, operationName, result }) {
                return { runTime: Date.now() - startTime };
            }
        };
    })
);

app.use('/schema',
    onlyAuthorized(),
    (req, res, _next) => {
        res.set('Content-Type', 'text/plain');
        res.send(printSchema(graphqlSchema));
    }
);

app.use(errorHandler());

app.listen(GRAPHQL_PORT, '0.0.0.0');

console.log(`Server started on http://localhost:${GRAPHQL_PORT}/`);
