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
    var status = 'S';
    var response_code = 0;
    var msg = '';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var email_id = data.email_id;
        console.log(data);
        if (email_id != '' && data.hasOwnProperty('email_id')) {

            var query_parameter = { email_id: email_id };
            var projection_parameter = { _id: 1, validated: 1, last_otp_sent_time: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();
            console.log(exist_in_gamedb);
            // return

            if (exist_in_gamedb.length == 0) {
                /* REGISTRATION INCOMPLETE USER */
                let no_obj = {
                    email_id: data.email_id,
                    crd_on: new Date()
                }
                await dbobj.db.collection('app_account_not_exist').insertOne(no_obj)
                response_code = 0;
                msg = CONFIG.MESSAGES.NO_ACCOUNT;
            }
            else {
                if (exist_in_gamedb[0].validated == 1) {
                    let otp_expiry_time = (new Date().getTime() - new Date(exist_in_gamedb[0].last_otp_sent_time).getTime()) / 1000;
                    if (otp_expiry_time > 60) {
                        var otp = UTILS.generate_otp();
                        var query_parameter = { email_id: email_id };
                        var update_parameter = { $set: { otp: otp, last_otp_sent_time: new Date() } };
                        await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                     
                            //UTILS.send_otp(email_data);
 
                    }
                    response_code = 1;
                    msg = CONFIG.MESSAGES.OTP_SENT;
                }
                else {
                    response_code = 0;
                    msg = CONFIG.MESSAGES.NO_ACCOUNT;
                }
            }

            /* BUILD RESPONSE */
            response = {
                status: status,
                response_code: response_code,
                msg: msg,
                otp_expiry: CONFIG.OTP_RESEND_DURATION,
                otp_retry: CONFIG.OTP_RETRY,
                app_config: app_config
            };
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
        await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */