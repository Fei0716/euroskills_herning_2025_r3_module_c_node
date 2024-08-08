const express = require('express');
const app = express();
const router = express.Router();
//import the controller
const table = require('../controllers/api/TableController');
//import middlewares
const checkToken = require('../middlewares/checkToken');

app.use(checkToken);//this route is protected by the checkToken middleware
router.get('/tables', table.index);

module.exports = router;