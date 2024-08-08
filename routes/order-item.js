const express = require('express')
const app = express();
const router = express.Router();

//import the controllers
const OrderItemController = require('../controllers/api/OrderItemController')
//import the middlewares
const checkToken = require('../middlewares/checkToken')

app.use(checkToken);
router.post('/orderItems', OrderItemController.store);

module.exports = router;
