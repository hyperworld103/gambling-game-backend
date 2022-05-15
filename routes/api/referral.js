let mongoose = require('mongoose');
let express = require('express');
const multer = require('multer');
let router = express.Router();
const fs = require("fs");
let ReferralSchema = require('../../models/referral');
let BetHistorySchema = require('../../models/BetHistory');
let RoundSettingsSchema = require('../../models/RoundSettings');
const { db } = require('../../models/referral');

router.route('/add-profit-to-referral').post((req,res,next)=>{
    var pub = req.body.publicKey.toLowerCase();
    ReferralSchema.findOne({publicKey: pub})
    .then((check)=>{
        if(check){
            ReferralSchema.findOneAndUpdate({publicKey: pub},{$inc:{amount: req.body.amount}}, (error, data)=>{
                if(error){
                    console.log(error)
                } else {
                    res.json(data);
                }
            })
        } else {
            ReferralSchema.create(req.body, (error, data)=>{
                // console.log("wowwowowowowow",data)
                if (error) {
                    console.log(error)
                }else
                    res.json(data);
            })
        }
    })
})

router.route('/create-collection').post((req,res)=>{
    mongoose.connection.db.listCollections({name: 'bet_histories'})
    .next(function(err, collinfo) {
        if (collinfo==null) {
            BetHistorySchema.create(req.body, (error, data)=>{
                if (error) {
                    console.log(error);
                } else
                    res.json(data);
            })
        }
    });    
})

router.route('/add-data').post((req, res)=>{
    BetHistorySchema.create({
        amount: req.body.amount,
        fee: req.body.fee,
        total_red_amount: req.body.total_red_amount,
        total_green_amount: req.body.total_green_amount,
        wallet_key: req.body.wallet_key,
        round_number: req.body.round_number,
        which: req.body.which,
        trans_address: req.body.trans_address
    }).then((check)=>{
        if(check){
           res.json(check);
        }
    })
})

router.route('/get-card-data').post((req, res) =>{ // find last record.
    BetHistorySchema.find({}).sort({ _id: -1 }).limit(1).then((products) => {
        if(products) res.json(products);
    });
})

router.route('/create-admin-collection').post((req,res)=>{
    mongoose.connection.db.listCollections({name: 'round_settings'})
    .next(function(err, collinfo) {
        RoundSettingsSchema.remove({}, (err)=>{});
        RoundSettingsSchema.create(req.body, (error, data)=>{
            if (error) {
                console.log(error)
            } else{
                res.json(data);
            }
        })
    });
})

router.route('/load-admin-collection').post((req, res) =>{ // find first record.
    RoundSettingsSchema.findOne({checked: false}).sort({idnum: 1})
    .then((check)=>{
        // console.log(check);
        res.json(check);
    });
})

router.route('/load-admin-page').post((req, res) =>{ // find first record.
    RoundSettingsSchema.find( { idnum: { $gt: 0 } } )
    .then((check)=>{
        res.json(check);
    });
})

router.route('/get-referral-amount').post((req,res) =>{
    var pubKey = req.body.publicKey;
    ReferralSchema.findOne({publicKey: pubKey })
    .then((check)=>{
        console.log(check);
        if(check){
           res.json(check);
        } else{
            res.json({amount: 0});
        }
    })
})

router.route('/withdraw').post((req,res) =>{
    var pubKey = req.body.publicKey.toLowerCase();
    ReferralSchema.findOneAndUpdate({publicKey: pubKey},{amount: 0}, (error, data)=>{
        if(error){
            console.log(error)
        } else {
            res.json(data);
        }
    })
})

router.route('/get-bet-history').post((req, res) =>{
    let walletKey = req.body.walletKey;
    BetHistory.findOne({ wallet_key: walletKey})
    .then((check)=>{
        if(check){
            res.json(check);
        }
    })
})

router.route('/get-team-history').post((req, res) =>{
    let round = req.body.round;
    let team = req.body.team;
    BetHistory.find().
        where('round_number').equals(round).
        where('which').equals(team).
        select('amount wallet_key fee trans_address').
        exec(function(err, data) {
            if(!err) {
                res.json(data);
            }
    });
})

router.route('/get-all-referral').post((req, res)=>{
    ReferralSchema.find((error, data)=>{
        if(error) console.log(error);
        else res.json(data);
    })
})

router.route('/delete-patient').post((req,res)=>{
    console.log(req.body)
    ReferralSchema.findByIdAndRemove(req.body.id, (error,data)=>{
        if(error){
            
        } else {
            res.json(data)
        }
    })
})

module.exports = router;