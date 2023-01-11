const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');
const Object = require('mongodb').ObjectId

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* LOGGER MODULE */
    let loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();
    /* DEFAULT VALUES */
    let response = UTILS.error();
    let status = 'S';
    let response_code = 0;
    let msg = '';
    let app_config = UTILS.get_app_config();
    /* DATABASE REFERENCE */
    let dbconn = require('../../common/inc.dbconn');
    let dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        let data = req.body;
        let email_id = data.email_id;
        let aid = data.aid;
        let trans_id = data.trans_id;
        let claim_source = data.claim_s;
        let cs_btn = "Y";

        if (claim_source && trans_id) {
            if (claim_source == 1) { //  REFERRAL
                var multiple_id = trans_id.split('||');
                var temp = [];
                for (let i = 0; i < multiple_id.length; i++) {
                    if (multiple_id[i]) {
                        temp.push(new Object(multiple_id[i]));
                    }
                }
                console.log(temp, "temp::::::;");
                let agg = [
                    { $match: { _id: { $in: temp }, is_claimed: 'N' } },
                    { $group: { _id: 1, coins: { $sum: '$coins' } } }
                ];
                console.log(JSON.stringify(agg));
                var check_ids = await dbobj.db.collection('app_coins_transaction').aggregate(agg).toArray();
                console.log(check_ids, "check_ids:::::::::");
                if (check_ids.length && temp.length) {
                    await UTILS.reward_coins(aid, check_ids[0].coins, dbobj);
                    await UTILS.transaction_log(CONFIG.TRANSACTION_LOG, dbobj, { referral_claim: check_ids[0].ut }, { aid: aid });
                    await UTILS.coin_transaction_log(aid, "REFERRAL", check_ids[0].coins, "CREDIT", dbobj);
                    var claims = await dbobj.db.collection('app_coins_transaction').updateMany({ _id: { $in: temp } }, { $set: { is_claimed: 'Y' } });
                    console.log(claims, "claims::::::");
                    var filter_query = { aid: aid };
                    var update_query = { $set: { to_redeem: 0 } }
                    await dbobj.db.collection('app_referral_code_master').updateOne(filter_query, update_query);
                }
                response_code = 1;
                msg = "Success";
                cs_btn = "N";
            }
        }
        else {
            res.send(response);
        }
        let cur_coins = await dbobj.db.collection("app_coins").findOne({aid:aid});
        /* BUILD RESPONSE */
        response = {
            coin_balance:cur_coins.coin_balance,
            status:status,
            msg:msg,
            response_code:response_code,
            app_config:app_config,
            claim_btn:cs_btn
        }
        /* LOGGER */
        logger.log({ level: 'info',type: 'Response',message: response });
        /* OUTPUT */
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({level: 'error',message: err});
        response = UTILS.error();
        res.send(response);
    }
    finally {
        await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */