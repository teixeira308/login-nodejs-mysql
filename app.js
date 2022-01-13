var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const passport = require('passport');
const session = require('express-session');


require('./auth')(passport);
app.use(session({  
  secret: process.env.SESSION_SECRET,//configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}));


 
const MySQLStore = require('express-mysql-session')(session);
require('./auth')(passport);
app.use(session({
  store: new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }//30min
}))
app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var loginRouter = require('./routes/login');

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login?fail=true');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret : '123',
  resave: false,
  saveUninitialized: false,
  cookie:
  { maxAge : 30 * 60 * 1000}
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);
app.use('/usuarios', authenticationMiddleware, usuariosRouter);
app.use('/', authenticationMiddleware, indexRouter);

app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
