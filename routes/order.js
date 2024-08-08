const express = require('express');
const app = express();
const router = express.Router();
//import the controller
const OrderController = require('../controllers/api/OrderController');
//import middlewares
const checkToken = require('../middlewares/checkToken');

app.use(checkToken);//this route is protected by the checkToken middleware
router.get('/orders', OrderController.index);
router.post('/orders', OrderController.store);
router.get('/orders/tables/:id', OrderController.getOpenOrder);
router.put('/orders/tables/:id/close', OrderController.closeOrder);

module.exports = router;