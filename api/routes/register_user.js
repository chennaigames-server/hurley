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
        var device_id = data.device_id;
        var email_id = data.email_id;
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var t_c = data.t_c;
        var platform = data.platform;

        if (data.hasOwnProperty('email_id') && email_id != '' && data.hasOwnProperty("t_c") && t_c != false) {

            var query_parameter = { email_id: email_id };
            var projection_parameter = { _id: 1, validated: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();

            /* CHECK USER EXIST IN GAME DB */
            if (exist_in_gamedb.length > 0) {
                /* USER EXIST IN GAME DB */
                /* RESPONSE THE USER TO EMAIL IS ALREADY TAKEN */
                if (exist_in_gamedb[0].validated == 0) {
                    var otp = UTILS.generate_otp();
                    var query_parameter = { email_id: email_id };
                    var update_parameter = { $set: { otp: otp } };
                    await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                    await UTILS.send_otp(email_id, otp);
                    response_code = 1;
                    msg = CONFIG.MESSAGES.OTP_SENT;
                }
                else {
                    response_code = 0;
                    msg = CONFIG.MESSAGES.REGISTERED;
                }
            }
            else {
                /* USER NOT EXIST IN GAME DB */
                var gid = await UTILS.create_gid(dbobj);
                /* GENERATE OTP  */
                var otp = UTILS.generate_otp();
                /* INSERT USER ACCOUNT DETAILS IN DATABASE*/
                var insert_acct_data = {
                    gid: gid,
                    otp: otp,
                    validated: 0,
                    app_ver: app_ver,
                    email_id: email_id,
                    active_device: {
                        id: device_id,
                        p: platform,
                        llon: new Date()
                    },
                    crd_on: new Date(),
                    mdy_on: '',
                    block_info: {
                        s: 'A',
                        e_t: '',
                    },
                    user_source: {
                        from: 'G'
                    },
                    stat: 'A'
                }

                await dbobj.db.collection('app_user_accounts').insertOne(insert_acct_data);
                /* OTP MAIL */
                //await UTILS.send_otp(email_id, otp);
                var user_ownership = [];
                var nt_cars = await dbobj.db.collection('app_non_tradable_assets_master').find({}).project({ _id: 0 }).sort({ unit_id: 1 }).toArray();
                for (let i = 0; i < nt_cars.length; i++) {
                    var lf = new Date()
                    lf.setHours(00, 00)
                    nt_cars[i].gid = gid
                    nt_cars[i].crd_on = new Date()
                    nt_cars[i].nft_details.charge.l_f = lf
                    var last_selected = 'N';
                    var ownership = 'YO'
                    if (nt_cars[i].unit_id == 1) {
                        last_selected = 'Y';
                        ownership = 'O'
                    }
                    user_ownership.push({
                        gid: gid,
                        unit_id: nt_cars[i].unit_id,
                        unit_type: nt_cars[i].unit_type,
                        car_type: nt_cars[i].car_type,
                        last_selected: last_selected,
                        ownership: ownership,
                        crd_on: new Date(),
                        status: 'A',
                    })
                }
                await dbobj.db.collection('app_nft_ownership').insertMany(user_ownership)
                await dbobj.db.collection('app_non_tradable_assets').insertMany(nt_cars)
                UTILS.transaction_log(CONFIG.TRANSACTION_LOG, dbobj, { registration_reward: 10000 }, { gid: gid })

                // await DEV_UTILS.update_units(gid, 1000, dbobj)
                await guardianobj.reward_ut(10000, gid, dbobj);
                response_code = 1;
                msg = CONFIG.MESSAGES.OTP_SENT;
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


