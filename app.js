import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
// import favicon from 'serve-favicon';

import index from './routes/index';
import datatypes from './routes/datatypes';
import datastructures from './routes/datastructures';

const app = express();
const debug = Debug('mock-server:app');
const cors = require('cors');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


// use it before all route definitions
app.use(cors({ origin: 'http://localhost:3000' }));

// Add headers
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/', index);
app.use('/datatypes', datatypes);
app.use('/datastructures', datastructures);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
