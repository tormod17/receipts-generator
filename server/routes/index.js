const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const ReceiptDB = require('../models/receipts');

const jwt = require("jsonwebtoken");
const querystring = require('querystring');
const csv = require('fast-csv');
const XLSX = require('xlsx');
const multer = require('multer');
const uuidv1 = require('uuid/v1');

const mongoose = require('mongoose');

const expTime = 1 * 60 * 60 * 24 * 150


//POST route for updating data
router.post('/api/signup', function(req, res, next) {
    const { username, email, password, confirmPassword } = req.body;
    // confirm that user typed same password twice
    if (password !== confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("passwords dont match");
        return next(err);
    }
    const userData = {
        email,
        username,
        password,
    }
    User.addUser(userData, function(err, newUser) {
        if (err) {
            return next(err)
        }
        if (!newUser) {
            const err = new Error('You have an account');
            err.status = 400;
            return next(err);
        }
        userData.id = newUser._id
        const jwtToken = jwt.sign(userData, JWT_SECRET, { expiresIn: expTime  });
        return res.status(200).json({
            id_token: jwtToken
        });
    })
});

// GET route after registering
router.get('/api/profile', function(req, res, next) {
    User.findById(req.query.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    const err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    const profile = {
                        username: user.username,
                        email: user.email,
                        id: user._id
                    }
                    const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: expTime });
                    return res.status(200).json({
                        id_token: jwtToken
                    });
                }
            }
        });
});


/**
 * Util function to extract jwt token from the authorization header
 */
function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
}
// This should be well-guarded secret on the server (in a file or database).
const JWT_SECRET = "JWT Rocks!";

// JWT based login service.
router.post("/api/login", function(req, res) {

    const credentials = req.body;
    const { email, password } = credentials;
    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password.' });
    }

    User.authenticate(email, password, function(err, user) {
        if (err || !user) {
            return res.status(401).send({ message: "User Not Found" })
        }
        const profile = {
            username: user.username,
            email: user.email,
            id: user._id
        }
        const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: expTime  });
        return res.status(200).json({
            id_token: jwtToken
        });
    })

});

// GET for logout logout
router.post('/api/logout', function(req, res, next) {
    const jwtToken = extractToken(req);
    if (!jwtToken) {
        return res.status(200).json({ message: `logged out` });
    } else {
        const { username } = jwt.verify(jwtToken, JWT_SECRET);
        return res.status(200).json({ message: `User ${username} logged out` });
    }
    console.log("jwt verify error", err);
    return res.status(500).json({ message: "Invalid jwt token" });
});


const DATETIMESTAMP = Date.now();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.split('.')[0] + '-' + DATETIMESTAMP + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ storage: storage }).single('file')

router.post('/api/upload', function(req, res, next) {
    const { files, body } = req
    const { userId } = req.query;

    upload(req, res, function(err) {
        const { file } = req;
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        if (!file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        const { originalname, filename } = file;
        const ext = originalname.split('.')[originalname.split('.').length - 1]
        if (ext === 'xlsx' || ext === 'xlsm') {
            const workbook = XLSX.readFile('./uploads/' + filename);
            const sheet_name_list = workbook.SheetNames;
            const jsonResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            jsonResults.forEach((receipt, i) => {
                const new_receipt = {
                    ...receipt,
                    filename,
                    userId,
                    Rechnungsnummer: uuidv1(),
                    time: DATETIMESTAMP + i,
                }
                ReceiptDB.create(new_receipt, function(err) {
                    if (err) return console.log(err)
                    console.log('saved');
                })
            })


            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('error deleteing');
            }
            res.json(jsonResults);
        }

    });

});

router.get('/api/receipts', function(req, res, next) {
    /// get the list of the reciepts

    if (!req.query) return console.error('no userId');
    const { userId } = req.query;
    ReceiptDB.find({ userId })
        .limit(10)
        .sort({ time: -1 })
        .exec((err, receipts) => {
            if (err) return console.error(err);
            res.json(receipts);
        })
})

router.post('/api/addreceipt', function(req, res, next) {
    if (!req.query.userId) return console.error('no userId');
    const { userId } = req.query;
    console.log(req.body);
    const new_receipt = {
        ...req.body,
        filename: 'manual entry',
        Rechnungsnummer: uuidv1(),
        userId,
        time: DATETIMESTAMP,
    }

    ReceiptDB.create(new_receipt, function(err) {
        if (err) return console.err(err)
        res.send('Your receipt has been added');
    })

    /// add or edit a receipt 
})

module.exports = router;