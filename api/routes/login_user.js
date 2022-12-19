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
    // var dbconn = require('../../common/inc.dbconn');
    // var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var email_id = data.email_id;

        if (email_id != '' && data.hasOwnProperty('email_id')) {
            var query_parameter = { email_id: data.email_id };
            var projection_parameter = { _id: 1, validated: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();
            if (exist_in_gamedb.length == 0) {
                /* REGISTRATION INCOMPLETE USER */
                response_code = 0;
                msg = CONFIG.MESSAGES.NO_ACCOUNT;
            }
            else {
                if (exist_in_gamedb[0].validated == 1) {
                    var otp = UTILS.generate_otp();
                    var query_parameter = { email_id: email_id };
                    var update_parameter = { $set: { otp: otp } };
                    await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                    //await UTILS.send_otp(email_id, otp);

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
                "status": "S",
                "response_code": 1,
                "msg": "OTP Sent Succesfully",
                "otp_expiry": 30,
                "otp_retry": 3,
                "app_config": {
                  "f_u": "N",
                  "m": "N",
                  "i_d": "N",
                  "m_t": 0
                }
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
        //await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */