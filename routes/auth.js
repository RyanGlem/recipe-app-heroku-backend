const express = require("express");
const router = express.Router();
const cors = require ('cors')
const { User } = require("../database/models");

const corsOptions = {
  origin: 'https://recipeio.netlify.app',
  optionsSuccessStatus: 200,
}
router.options('*', cors())
router.use (cors())

router.post("/login", cors(corsOptions), async (req, res, next) => {
  try {
    const user = await User.findOne({ 
        where: (req.body?.email ?? false) ? { email: req.body.email } : { username: req.body.username } 
    });
    if (!user) {
      res.status(401).send("Wrong username and/or password");
    }
    else if (!user.correctPassword(req.body.password)) {
      res.status(401).send("Wrong username and/or password");
    }
    else {
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  }
  catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    res.set('Access-Control-Allow-Origin', 'https://recipeio.netlify.app')
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.json(user)));
  }
  catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    }
    else {
      next(err);
    }
  }
});

router.delete("/logout", (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    else {
      res.status(204).end();
    }
  });
});

router.get("/me", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'https://recipeio.netlify.app')
   if (!!(req?.user ?? false)) res.json(req.user);
  else res.status(401).send()
});

module.exports = router;
