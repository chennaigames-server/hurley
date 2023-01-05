const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {

    /* LOGGER MODULE */
    var loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    /* DEFAULT VALUES */
    var response = UTILS.error();
    var status = "S";
    var response_code = 0;
    var msg = "";
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    const dbconn = require('../../common/inc.dbconn');
    const dbobj = new dbconn();

    /* MARKETPLACE CLASS */
    const guardiangames = require('../../mp_classes/class.guardiangames');
    var guardianobj = new guardiangames();

    try {

        /* REQUEST PARAMETERS */
        var data = req.body;
        var r_code = data.r_code;
        var aid = data.aid;
        var email_id = data.email_id;

        if (aid != false && data.hasOwnProperty("aid") && r_code != '' && data.hasOwnProperty("r_code") && aid) {

            /* VALIDATE REFERRAL CODE FROM THE CLIENT */
            var query_parameter = { referral_code: r_code, aid: { $ne: aid } };
            var check_referral_exist = await dbobj.db.collection('app_referral_code_master').find(query_parameter).toArray();
            /* IF VALID, RESPONSE SUCCESS */
            if (check_referral_exist.length > 0) {
                var insert_redeem_data = {
                    referee: aid,
                    referrer: check_referral_exist[0].aid,
                    is_played: 'N',
                    crd_on: UTILS.CURRENT_DATE(new Date()),
                    mdy_on: '',
                    stat: "A"
                }

                /* INSERTING REDEEM DETAILS */
                var insert_redeem_details = await dbobj.db.collection('app_redeemed_details').insertOne(insert_redeem_data)

                /* UPDATING REFERRER REFERRAL COUNT */
                var increment = await dbobj.db.collection('app_referral_code_master').bulkWrite([{
                    updateOne: {
                        filter: { aid: check_referral_exist[0].aid },
                        update: { $inc: { total_redeem: 1 } }
                    }
                }, {
                    updateOne: {
                        filter: { aid: aid },
                        update: { $set: { claimed: 'Y' } }
                    }
                }
                ])

                response_code = 1;
                msg = CONFIG.MESSAGES.SUCCESS;
                var check_played_pot_race = await dbobj.db.collection('app_user_profile_details').find({ aid: aid, 'details.played_pot_race': 'N' }).toArray()
                if (check_played_pot_race.length > 0) {
                    msg = CONFIG.MESSAGES.REFERRAL_SUCCESS_MSG;
                }
            } else {
                response_code = 0;
                msg = CONFIG.MESSAGES.INVALID_REFERRAL;
            }

            /* BUILD RESPONSE */
            response = {
                status: status,
                ut_balance: rc_balance,
                response_code: response_code,
                msg: msg,
                app_config: app_config
            }
        }

        /* LOGGER */
        logger.log({
            level: 'info',
            type: 'Response',
            message: response
        });

        /* OUTPUT */
        res.send(response);
    }
    catch (err) {

        /* LOGGER */
        logger.log({
            level: 'error',
            message: err
        });
        var response = UTILS.error();
        res.send(response);
    }
    finally {
        dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */
