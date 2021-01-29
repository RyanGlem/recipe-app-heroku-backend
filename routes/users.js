var express = require('express');
const models = require ('../database/models')
var router = express.Router();

/* GET users listing. */
/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}); */

router.get('/', (req, res, next) => {
	models.User.findAll()
		.then((users) => res.status(200).json({message: "Got users", users}))
		.catch((err) => next(err));
});

//Dynamically add to the database on the same page
router.post('/', (req, res, next) => {

  models.User.create ({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    imageUrl: req.body.imageUrl,
    skill: req.body.skill,
  })

  .then (user => {
    res.status (201)
    .json({
      message: "You have created a user",
      user
    })
  })
  .catch(err => {
    res.status(404)
    .json ({

      message: "An error has occured",
      err
    })
    next (err)
  })
})


module.exports = router;
