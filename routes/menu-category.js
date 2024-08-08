const express = require('express');
const app = express();
const router = express.Router();

//import the controller
const menuCategory = require('../controllers/api/MenuCategoryController');
//import middlewares
const checkToken = require('../middlewares/checkToken');


app.use(checkToken);
router.get('/menuCategories', checkToken,menuCategory.index);
router.post('/menuCategories', menuCategory.store);
router.put('/menuCategories/:id', menuCategory.update);
router.delete('/menuCategories/:id', menuCategory.destroy);

module.exports = router;