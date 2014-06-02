
/**
 * Module dependencies.
 */

 var express = require('express')
  , routes = require('./routes')
  , cors = require('cors')
  , mongo = require('mongodb')
  , mongoose = require('mongoose')
  , User = require('./user-model')
  , path = require('path')
  , mysql = require('mysql');

app = express()
/**
 * Middleware.
 */
app.use(cors());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'supercalafragalistic' }));
app.locals.pretty = true;
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');

/**
* my middleware
*/


/**
 *  routes
 */

//set app flow here.
app.get('/', routes.index);

app.post('/logIn', routes.logIn);

app.get('/signup', routes.signUp);

app.post('/addUser', routes.addUser);

app.post('/signOut', routes.signOut);

app.get('/getJobs', routes.getJobs );

app.post('/newJob', routes.newJob);
/*POST time to database*/
app.get('/clockStatus', routes.clockStatus);

app.post('/clockIn', routes.clockIn);

app.post('/clockOut', routes.clockOut);


/**
 * Connect to the database.
 */
//mongoose connect to database!
var connStr = 'mongodb://localhost:27017/time-sheet';
mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

  // listen
  app.listen(3001, function () {
    console.log('\033[96m  + \033[39m app listening on *:3001');
  });
