const express = require('express');
const router = express.Router();
const multer = require('multer'); // used for writing file before saving.


const { 
    getReceiptsHandler,
    addReceiptsHandler,
    updateReceiptsHandler,
    delReceiptHandler
} = require('./receiptsHandler');

const {
    signUpHandler,
    loginHandler,
    logoutHandler,
    profileHandler
} = require ('./authHandler');

const { uploadHandler } = require('./uploadHandler');


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
router.get('/api/receipts', (req, res) => getReceiptsHandler(req,res));

router.put('/api/receipt', (req, res) => updateReceiptsHandler(req, res));

router.post('/api/receipt', (req, res) => addReceiptsHandler(req, res));

router.post('/api/deletereceipts', (req, res, next) => delReceiptHandler(req,res,next));

module.exports = router;
