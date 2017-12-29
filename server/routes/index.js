const express = require('express');
const router = express.Router();
const multer = require('multer'); // used for writing file before saving.


const { 
    getClientsHandler,
    addClientHandler,
    updateClientHandler,
    delClientHandler
} = require('./clientsHandler');

const {
    signUpHandler,
    loginHandler,
    logoutHandler,
    profileHandler
} = require ('./authHandler');

const { uploadHandler } = require('./uploadHandler');

const { saveMonthHandler } = require ('./saveMonthHandler');
const { emailHandler } = require ('./emailHandler');

//auth
router.post('/api/signup', (req, res, next) => signUpHandler(req,res, next) );
// GET route after registering
router.get('/api/profile', (req, res, next) => profileHandler(req, res, next));
// JWT based login service.
router.post('/api/login', (req, res) => loginHandler(req, res));
// GET for logout logout
router.post('/api/logout', (req, res, next) => logoutHandler(req,res, next));

var upload = multer();
router.post('/api/upload', upload.single('csvdata'), (req,res) => uploadHandler(req, res));
// receipts 
router.get('/api/clients', (req, res) => getClientsHandler(req,res));

router.put('/api/client', (req, res) => updateClientHandler(req, res));

router.post('/api/client', (req, res) => addClientHandler(req, res));

router.post('/api/deleteclients', (req, res, next) => delClientHandler(req,res, next));

// save month
router.post('/api/savemonth', (req, res) => saveMonthHandler(req, res));

router.post('/api/email', (req, res) => emailHandler(req, res));


module.exports = router;
