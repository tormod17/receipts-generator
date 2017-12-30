/** 
 * This is a simple express server, to show basic authentication services (login and logout requests)
 * based JWT, and basic socket.io.
 * 
 * Once a user is authenticated, a jwt token will be returned as response to the client. 
 * It's expected the jwt token will be included in the subsequent client requests. The server
 * can then protect the services by verifying the jwt token in the subsequent API requests.
 * 
 * The server will also broadcast the login/logout events to connected clients via socket.io.
 * 
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('env2')('./.env');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path =require('path');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/airgreets');
const db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected to the database');
  // we're connected!
});
//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
const port = process.env.PORT || 3001;
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
// Configure app to use bodyParser to parse json data
//const server = require("http").createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// include routes
const routes = require('./routes/');
app.use('/', routes);
const staticFilePath = process.env.NODE_ENV ==='production' ? 'build' : 'public';

app.use(express.static(path.resolve(__dirname, '..', staticFilePath )));
app.use(express.static(path.join(__dirname,'..', 'views')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
// Test server is working (GET http://localhost:3001/api)
app.get('/api/', function(req, res) {
  res.json({ message: 'Hi, welcome to the server api!' });
});
// Start the server
app.listen(port,  function(){
  console.log('Server is listening on port ' + port);  
});
