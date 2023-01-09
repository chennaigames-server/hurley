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

    /* MARKETPLACE CLASS */
    const guardiangames = require('../../mp_classes/class.guardiangames');
    var guardianobj = new guardiangames();

    try {

        /* REQUEST PARAMETERS */
        var data = req.body;
        var device_id = data.device_id;
        var email_id = data.email_id;
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var t_c = data.t_c;
        var platform = data.platform;

        console.log(data,"register");

        if (data.hasOwnProperty('email_id') && email_id != '' && data.hasOwnProperty("t_c") && t_c != false) {
            var query_parameter = { email_id: email_id };
            var projection_parameter = { _id: 1, validated: 1, last_otp_sent_time: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();
            console.log(exist_in_gamedb,"exist_in_gamedb::::");
            /* CHECK USER EXIST IN GAME DB */
            if (exist_in_gamedb.length > 0) {
                /* USER EXIST IN GAME DB */
                /* RESPONSE THE USER TO EMAIL IS ALREADY TAKEN */
                if (exist_in_gamedb[0].validated == 0) {
                    let otp_expiry_time = (new Date().getTime() - new Date(exist_in_gamedb[0].last_otp_sent_time).getTime()) / 1000;
                    if (otp_expiry_time > 60) {
                        var otp = UTILS.generate_otp();
                        var query_parameter = { email_id: email_id };
                        var update_parameter = { $set: { otp: otp, last_otp_sent_time: new Date() } };
                        await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                        let email_data = {        
                            email_id: email_id,
                            otp: otp,
                            type: "Register"
                        }                     
                            //  UTILS.send_otp(email_data);
                    }
                    response_code = 1;
                    msg = CONFIG.MESSAGES.OTP_SENT;
                }
                else {
                    response_code = 2;
                    msg = CONFIG.MESSAGES.REGISTERED;
                }
            }
            else {
                console.log("else:::");
                /* USER NOT EXIST IN GAME DB */
                var aid = await UTILS.create_aid(dbobj);
                console.log(aid,"gid:::");
                /* GENERATE OTP  */
                var otp = UTILS.generate_otp();
                /* INSERT USER ACCOUNT DETAILS IN DATABASE*/
                var insert_acct_data = {
                    aid: aid,
                    otp: otp,
                    validated: 0,
                    app_ver: app_ver,
                    email_id: email_id,
                    active_device: {
                        id: device_id,
                        p: platform,
                        llon: UTILS.CURRENT_DATE(new Date())
                    },
                    crd_on: UTILS.CURRENT_DATE(new Date()),
                    mdy_on: '',
                    block_info: {
                        s: 'A',
                        e_t: '',
                    },
                    user_source: {
                        from: 'G'
                    },
                    stat: 'A',
                    last_otp_sent_time: new Date(),
                    fcm: '',
                    guest:false,
                    day_count:1,
                    week_count:1
                }
                 console.log(insert_acct_data,"insert_acct_data:::");
                 //return false
                let a = await dbobj.db.collection('app_user_accounts').insertOne(insert_acct_data);
                console.log(a);
                // DEVICE LOG
                let device_obj = {
                    aid: aid,
                    device_id: [device_id]
                }
                await dbobj.db.collection('app_user_devices_log').insertOne(device_obj);

                    /* OTP MAIL */
                    let email_data = {        // NEED TO UNCOMMAND
                        email_id: email_id,
                        otp: otp,
                        type: "Register"
                    }
                    // UTILS.send_otp(email_data);
             
                var user_ownership = []
                var nt_assets = await dbobj.db.collection('app_non_tradable_assets_master').find({ unit_id: 1 }).project({ _id: 0 }).sort({ unit_id: 1 }).toArray();
                for (let i = 0; i < nt_assets.length; i++) {
                    nt_assets[i].aid = aid
                    nt_assets[i].crd_on = UTILS.CURRENT_DATE(new Date())
                    var last_selected = 'N';
                    var ownership = 'YO' 
                    if (nt_assets[i].unit_id == 1) {
                        last_selected = 'Y';
                        ownership = 'O'
                    }
                    user_ownership.push({
                        aid: aid,
                        unit_id: nt_assets[i].unit_id,
                        unit_type: nt_assets[i].unit_type,
                        last_selected: last_selected,
                        ownership: ownership,
                        crd_on: UTILS.CURRENT_DATE(new Date()),
                        status: 'A',
                    })
                }
                await dbobj.db.collection('app_asset_ownership').insertMany(user_ownership)
                await dbobj.db.collection('app_non_tradable_assets').insertMany(nt_assets)
                // UTILS.transaction_log(CONFIG.TRANSACTION_LOG, dbobj, { registration_reward: 8000 }, { aid: aid })
                // UTILS.rc_transaction_log(aid, "INSTALATION_BONUS", 8000, "CREDIT", dbobj);
                await guardianobj.reward_coins(8000, aid, dbobj);

                response_code = 1;
                msg = CONFIG.MESSAGES.OTP_SENT;
            }

            /* BUILD RESPONSE */
            response = {
                status: status,
                response_code: response_code,
                msg: msg,
                otp_expiry: CONFIG.OTP_RESEND_DURATION,
                otp_retry: CONFIG.OTP_RETRY,
                app_config:app_config
            };
        }
        /* LOGGER */
        logger.log({
            level: 'info',
            type: 'Response',
            message: response
        });

        /* OUTPUT */
        console.log(response);
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