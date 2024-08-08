const express = require('express');
const router = express.Router();
//import the controller
const auth = require('../controllers/api/AuthController');
//import middlewares
const checkToken = require('../middlewares/checkToken');

router.post('/login', auth.loginWithPassword);
router.post('/login/pin', auth.loginWithPin);
router.post('/logout', checkToken, auth.logout);//this route is protected by the checkToken middleware

module.exports = router;