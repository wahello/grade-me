import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from 'express';
import {apiRouter} from './routes/api-router';
import {staticsRouter} from './routes/statics-router';
import {staticsDevRouter} from './routes/statics-dev-router';

import * as mysql from 'mysql';

import * as config from './config';
import {User} from './entities/User';

// const dbConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'rustam',
//     password: 'zuzuli',
//     database: 'grademe'
// });
//
// dbConnection.connect(err => {
//     if (err) {
//         throw err;
//     }
//     console.log('Connected to MySQL database.');
//     const app = express();
//
//     app.use(apiRouter(dbConnection));
//     app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter());
//
//     app.listen(config.SERVER_PORT, () => {
//         console.log(`App listening on port ${config.SERVER_PORT}!`);
//     });
// });

createConnection({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'zuzuli',
    database: 'grademe2',
    entities: [
        User
    ]
}).then(connection => {
    console.log(`Connected to the database using ORM`);
    const app = express();
    app.use(apiRouter(connection));
    app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter());
    app.listen(config.SERVER_PORT, () => {
        console.log(`App listening on port ${config.SERVER_PORT}.`);
    });
}).catch(error => {
    console.error(`Failed to create ORM connection.`);
});