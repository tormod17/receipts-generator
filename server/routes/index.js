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

const mongoose = require('mongoose');

// GET route for reading data
router.get('/', function(req, res, next) {
    const jwtToken = extractToken(req);
    const { username } = jwt.verify(jwtToken, JWT_SECRET);
    console.log(username, '>>>>>>>>')
    //return res.sendFile(path.join(__dirname + '/public/index.html'));
});


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
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    }

    User.create(userData, function(err, user) {
        if (err) {
            return next(err)
        }
        return res.redirect('/api/profile?userId=' + user._id);
    });
})

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
                    const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: 5 * 60 });
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
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
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
            return res.status(401).send(err || { message: "User Not Found" })
        }
        const profile = {
            username: user.username,
            email: user.email,
            id: user._id
        }
        const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: 5 * 60 });
        return res.status(200).json({
            id_token: jwtToken
        });
    })

});



// GET for logout logout
router.post('/api/logout', function(req, res, next) {
    const jwtToken = extractToken(req);
    try {
        const { username } = jwt.verify(jwtToken, JWT_SECRET);
        return res.status(200).json({ message: `User ${username} logged out` });

    } catch (err) {
        console.log("jwt verify error", err);
        return res.status(500).json({ message: "Invalid jwt token" });
    }
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
        if (originalname.split('.')[originalname.split('.').length - 1] === 'xlsx') {
            const workbook = XLSX.readFile('./uploads/' + filename);
            const sheet_name_list = workbook.SheetNames;
            const jsonResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            const new_receipt = {
                data: jsonResults,
                userId,
                filename,
                time: DATETIMESTAMP,
            }
            ReceiptDB.create(new_receipt, function(err) {
                if (err) return console.log(err)
                console.log('saved');
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
    query = ReceiptDB.find({ 'userId': userId });
    query.limit(10);
    query.sort({ time: -1 });
    query.select('data');
    query.exec((err, receipts) => {
        if (err) return console.error(err);
        console.log(receipts.length)
        res.json(receipts);
    })
})

router.post('/api/receipts', function(req, res, next) {
    /// add or edit a receipt 
})

module.exports = router;