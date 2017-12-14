const express = require('express');
const fs = require('fs');
const router = express.Router();
const User = require('../models/user');
const ReceiptDB = require('../models/receipts');

const jwt = require('jsonwebtoken');
//const querystring = require('querystring');
//const csv = require('fast-csv');
const XLSX = require('xlsx');
const multer = require('multer'); // used for writing file before saving.
const uuidv1 = require('uuid/v1');

//const mongoose = require('mongoose');

const DATETIMESTAMP = Date.now();
const expTime = 1 * 60 * 60 * 24 * 150;

//POST route for updating data
router.post('/api/signup', function(req, res, next) {
    const { username, email, password, confirmPassword } = req.body;
    // confirm that user typed same password twice
    if (password !== confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        res.send('passwords dont match');
        return next(err);
    }
    const userData = {
        email,
        username,
        password,
    };
    User.addUser(userData, function(err, newUser) {
        if (err) {
            return next(err);
        }
        if (!newUser) {
            const err = new Error('You have an account');
            err.status = 400;
            return next(err);
        }
        userData.id = newUser._id;
        const jwtToken = jwt.sign(userData, JWT_SECRET, { expiresIn: expTime  });
        return res.status(200).json({
            id_token: jwtToken
        });
    });
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
                    };
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
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
}
// This should be well-guarded secret on the server (in a file or database).
const JWT_SECRET = 'JWT Rocks!';

// JWT based login service.
router.post('/api/login', function(req, res) {

    const credentials = req.body;
    const { email, password } = credentials;
    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide email and password.' });
    }

    User.authenticate(email, password, function(err, user) {
        if (err || !user) {
            return res.status(401).send({ message: 'User Not Found' });
        }
        const profile = {
            username: user.username,
            email: user.email,
            id: user._id
        };
        const jwtToken = jwt.sign(profile, JWT_SECRET, { expiresIn: expTime  });
        return res.status(200).json({
            id_token: jwtToken
        });
    });

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


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.split('.')[0] + '-' + DATETIMESTAMP + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ storage }).single('file');

router.post('/api/upload', function(req, res) {
    const { userId } = req.query;

    upload(req, res, function(err) {
        const { file } = req;
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        if (!file) {
            res.json({ error_code: 1, err_desc: 'No file passed' });
            return;
        }
        const { originalname, filename } = file;
        const ext = originalname.split('.')[originalname.split('.').length - 1];
        if (ext === 'xlsx' || ext === 'xlsm') {
            const workbook = XLSX.readFile('./uploads/' + filename);
            const sheet_name_list = workbook.SheetNames;
            const jsonResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            jsonResults.forEach((receipt) => {
                const Rechnungsnummer = uuidv1();
                const new_receipt = {
                    ...receipt,
                    filename,
                    userId,
                    Rechnungsnummer,
                    'Rechnungs-datum': DATETIMESTAMP,
                    time: DATETIMESTAMP,
                    _id: Rechnungsnummer,
                };
                ReceiptDB.create(new_receipt, function(err) {
                    if (err) return console.log(err);
                    console.log('saved');
                });
            });
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.error('error deleteing');
            }
            res.json(jsonResults);
        }
    });
});

router.get('/api/receipts', function(req, res) {
    /// get the list of the reciepts

    if (!req.query) return console.error('no userId');
    const { userId } = req.query;
    ReceiptDB.find({ userId })
        //.limit(50)
        .sort({ time: -1 })
        .exec((err, receipts) => {
            if (err) return console.error(err);
            res.json(receipts);
        });
});

router.put('/api/receipt', function(req, res) {
    //type, guests, corrections 
    const { customer, } = req.body;
    const { receiptId } = req.query;
    if (!receiptId) return console.error('no receiptId');

    //const billType = type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};

    const changes ={
        ...req.body
    };

    ReceiptDB.findByIdAndUpdate(receiptId, changes, (err, model) => {
        if(err) {
            console.error(err);
            return res.json({ message: err });
        }
        res.json({ message: 'customer has been updated', model : {...model, ...customer} });
    });
    console.log('req body', req.body, receiptId);
});

   
    // if (guests) {
    //     Object.keys(guests).forEach((key) => {
    //         const changes = {
    //             ...guests[key],
    //             ...customer['Kunde'],
    //             ...customer['Kunde-nummer'],
    //             ...customer['Stadt'],
    //             ...customer['Straße'],
    //             ...customer['Rechnungs-datum'],
    //         };
    //         ReceiptDB.findByIdAndUpdate( key, changes, () => {
    //             res.json({ message: 'receipt updated for guests'});
    //         });
    //     });
    // }
    // if (corrections) {
    //     Object.keys(corrections).forEach((key) => {
    //         const changes = {
    //             ...corrections[key],
    //             ...customer['Kunde'],
    //             ...customer['Kunde-nummer'],
    //             ...customer['Stadt'],
    //             ...customer['Straße'],
    //             ...customer['Rechnungs-datum'],
    //         };
    //         console.log(changes);
    //         ReceiptDB.findByIdAndUpdate( key, changes, () => {
    //             res.json({ message: 'receipt updated, for correcitons'});
    //         });
    //     });
    // }

    // if (!guests || !corrections) {
    //     const changes ={
    //         ...customer,
    //     };
    //     console.log(changes);
    //}


router.post('/api/receipt', function(req, res) {
    if (!req.query.userId) return console.error('no userId');
    const { userId } = req.query;

    const { guests, corrections, customer, type }= req.body;   
    const billType =  type === 'Rechnung' ? { Rechnung: 'X' } : { Auszahlung: 'X'};
    
    if (Object.keys(guests).length >0){
        Object.keys(guests).forEach(key => {
            const Rechnungsnummer = uuidv1();
            const new_receipt = {
                ...customer,
                ...guests[key],
                ...billType,
                filename: 'manual entry',
                Rechnungsnummer: !guests[key]['Rechnungsnummer'] && Rechnungsnummer,
                'Rechnungs-datum':  customer['Rechnungs-datum']|| DATETIMESTAMP,
                userId,
                time: DATETIMESTAMP,
                _id: Rechnungsnummer,
            };
            console.log(new_receipt);
            ReceiptDB.create(new_receipt, function(err) {
                if (err) return console.error(err);
                res.json({ message:'Your receipt has been added for guests'});
            });
        });

    }

    if (Object.keys(corrections).length > 0) {
        Object.keys(corrections).forEach(key => {
            const Rechnungsnummer = uuidv1();
            const new_receipt = {
                ...customer,
                ...corrections[key],
                ...billType,
                filename: 'manual entry',
                Rechnungsnummer: !corrections[key]['Rechnungsnummer'] || Rechnungsnummer ,
                userId,
                time: DATETIMESTAMP,
                _id: Rechnungsnummer,
            };
            console.log(new_receipt);
            ReceiptDB.create(new_receipt, function(err) {
                if (err) return console.error(err);
                res.json({message:'Your receipt has been added for corrections'});
            });
        });
    }
});


router.post('/api/deletereceipts', function(req, res, next) {
    if (!req.body) return console.error('no body to request');
    const ids = [...req.body];
    ids.forEach(id => {
        ReceiptDB.deleteOne({ _id: id }, function(err) {
            if (err) return console.error(err);
            console.log('receipt has been removed');
        });
    });
    res.json({ message: 'Your receipts has been removed'});
    next();
    /// add or edit a receipt 
});

module.exports = router;