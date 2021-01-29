const express = require('express');
const models = require('../database/models')
const router = express.Router();
const multer = require('multer')
const path = require('path')


const destination = 'public/uploads/',
	  staticRoute = '/static/'

const makeFilename = (id, title, ext) => `${id}-${title}${ext}`

const filename = (req, file, cb) => {
	const { id } = req.user
	console.log('REQ: ', JSON.stringify(req.body, null, 2))
	cb(null, makeFilename(id, req.body?.name?.split(' ').join('-'), path.extname(file.originalname)))
}


const upload = multer({ 
	storage: multer.diskStorage ({
		destination,
		filename 
	})
})



/* GET users listing. */
router.get('/all', (req, res, next) => {
	models.Recipe.findAll()
		.then((recipes) => res.json({message: "Got All recipes", recipes}))
		.catch((err) => next(err));
})

router.get('/', function(req, res, next) {
	console.log('Getting recipes for: ', JSON.stringify(req?.user, null, 2))

	models.Recipe.findAll((req?.user ?? false) && { where: { userId: req.user.id }})
		.then((recipes) => res.json({message: "Got User recipes", recipes}))
		.catch((err) => next(err));
});

router.post('/', upload.any(), (req, res, next) => {
	if (req?.user ?? false) {
		models.Recipe
			.create({ ...req.body, imageUrl: `${staticRoute}${(req?.files?.[0]?.filename ?? req?.file?.filename)}` , userId: req.user.id })
			.then(recipe => {
				res.status(200)
				.json({
					message: "Created Recipe",
					recipe
				});
			})
			.catch (error => {
				res.status(409)
				.json({
					message: "ERROR: Failed to Create",
					error
				});
			})
		} else {
			res.status(403).json({ message: "ERROR: Login Required" })
		}
})

router.put('/', (req, res, next) => {

})

module.exports = router;