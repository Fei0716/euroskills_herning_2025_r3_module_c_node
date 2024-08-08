const express = require('express');
const app = express();
const router = express.Router();
//import the controller
const StatController = require('../controllers/api/StatController');
//import middlewares
const checkToken = require('../middlewares/checkToken');

app.use(checkToken);//this route is protected by the checkToken middleware
router.get('/stats', StatController.index);

module.exports = router;