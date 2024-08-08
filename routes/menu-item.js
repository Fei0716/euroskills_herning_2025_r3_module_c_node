const express = require('express');
const app = express();
const router = express.Router();
//import the controller
const menuItem = require('../controllers/api/MenuController');
//import middlewares
const checkToken = require('../middlewares/checkToken');

app.use(checkToken);//this route is protected by the checkToken middleware
router.get('/menuItems', menuItem.index);
router.post('/menuItems', menuItem.store);
router.put('/menuItems/:id', menuItem.update);
router.delete('/menuItems/:id', menuItem.destroy);

module.exports = router;