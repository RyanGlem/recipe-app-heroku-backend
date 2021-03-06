const createError = require('http-errors');
const session = require("express-session");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const cors = require ('cors')
const port = process.env.PORT || 5000

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const { sequelize: db } = require("./database");
const sessionStore = new SequelizeStore({ db });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const recipesRouter = require('./routes/recipes')
const authRouter = require("./routes/auth");

const app = express();

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  }
  catch (err) {
    done(err);
  }
});

// const apiRouter = require ('./api')

const syncDb = async () => {
  await db.sync()
}

const configApp = () => {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
   app.use(cors({ credentials: true, origin: [ "https://recipeio.netlify.app" ], exposedHeaders: ["set-cookie"] }))

  app.use('/static', express.static(path.join(__dirname, 'public', 'uploads')))

  app.use(
    session({
      secret: "a super secretive secret key string to encrypt and sign the cookie",
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {}
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  // app.use('/api', apiRouter)
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/recipes', recipesRouter)
  app.use('/auth', authRouter)

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
}



const listen = () => app.listen(port, () => console.log(`Listening on port: ${8080}`));



const boot = async () => {
  await sessionStore.sync()
  await syncDb()
  configApp()
  listen()
}

boot()

module.exports = app;
