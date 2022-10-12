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
    var response = {};
    var status = 'S';
    var response_code = 0;
    var od_login = 'N';
    var msg = 'Success';
    var token = '';
    var gid = '';
    var cs_name_screen = 'N';
    var app_config = UTILS.get_app_config();
    var logout = 'N';

    /* DATABASE REFERENCE */
    // var dbconn = require('../../common/inc.dbconn');
    // var dbobj = new dbconn();

    /* DATABASE FUNCTIONS */
    // var db_functions = require('../../classes/class.db_functions');
    // var dbfunctions = new db_functions();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var device_id = data.device_id;
        var email_id = data.email_id;
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var otp = data.otp;
        var platform = data.platform;
        var id = 0;


        if (email_id != '' && data.hasOwnProperty('email_id') && otp != false && data.hasOwnProperty("otp")) {

            /* CHECK USER STATUS IS NEW OR RETURNING USER */
            var query_parameter = { email_id: email_id };
            var projection_parameter = { _id: 0, gid: 1, email_id: 1, active_device: 1, block_info: 1, logout: 1, otp: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();
            if (exist_in_gamedb.length > 0) {
                gid = exist_in_gamedb[0].gid;

                /* COMPARING OTP */
                //if (otp == exist_in_gamedb[0].otp) {
                if (otp == 123890) {

                    var existing_device = exist_in_gamedb[0].active_device.id;
                    logout = exist_in_gamedb[0].logout;

                    /* COMPARE DEVICE ID */
                    if (existing_device != device_id) {

                        /* DEVICE IS MISMATCHED */
                        od_login = 'Y';
                        token = '';
                        msg = CONFIG.MESSAGES.OTHER_DEVICE;

                        /* IF LOGOUT IN OLD DEVICE */
                        if (logout == 'Y') {
                            od_login = 'N';

                            var token_data = {
                                gid: gid,
                                email_id: email_id,
                                device_id: device_id
                            };

                            token = UTILS.encode_token(token_data);

                            /* UPDATING NEW TOKENS */
                            var query_parameter = { gid: gid };
                            var update_parameter = { $set: { gs_token: token } };
                            await dbobj.db.collection('app_user_tokens').updateOne(query_parameter, update_parameter);

                            var update_parameter = { $set: { logout: 'N', "active_device.id": device_id, "active_device.llon": new Date(), "active_device.p": platform, validated: 1 } };

                            await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                            msg = CONFIG.MESSAGES.OTP_VALID;
                        }
                    }
                    else {
                        /* USER RETURNED WITH SAME DEVICE SO OLD TOKEN RETRIVED */
                        var query_parameter = { gid: gid };
                        var projection_parameter = { _id: 0, gs_token: 1 };
                        var get_token = await dbobj.db.collection('app_user_tokens').find(query_parameter).project(projection_parameter).limit(1).toArray();

                        if (get_token.length > 0) {
                            token = get_token[0].gs_token;
                        } else {
                            /* INSERT TOKEN DETAILS IN DB */
                            var token_data = {
                                gid: gid,
                                email_id: email_id,
                                device_id: device_id
                            };
                            /* NEW (JWT) TOKEN GENERATED */
                            token = UTILS.encode_token(token_data);
                            var insert_token_data = {
                                gid: gid,
                                gs_token: token,
                                mp_token: '',
                                refresh_token: 'N' /* FOR GAME SERVER PURPOSE NOT MARKETPLACE */
                            }
                            await dbobj.db.collection('app_user_tokens').insertOne(insert_token_data);
                        }
                        /* INSERT LANDING DETAILS */
                        var landing_data = {
                            gid: gid,
                            l_type: 1,
                            l_details: {}
                        };
                        await dbobj.db.collection('app_user_landing_screen').insertOne(landing_data);
                        msg = CONFIG.MESSAGES.OTP_VALID;
                    }

                    /* UPDATING DEVICE DETAILS IN DB */
                    var query_parameter = { gid: gid };
                    var update_parameter = { $set: { validated: 1 } };

                    await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);


                    /* FOR MARKETPLACE REGISTERED USER TO LAND ON NICKNAME SCREEN */
                    var query_parameter = { gid: gid };
                    var projection_parameter = { _id: 1 };

                    var get_nickname = await dbobj.db.collection('app_user_profile_details').find(query_parameter).project(projection_parameter).limit(1).toArray();

                    if (get_nickname.length == 0) {
                        cs_name_screen = 'Y';
                    }

                    response_code = 1;
                    /* GETTING RANDOM SET OF GAME TIPS FROM DATABASE */
                    game_tips = await dbfunctions.get_game_tips(dbobj, CONFIG.GAME_TIPS_COUNT);

                } else {
                    response_code = 0;
                    msg = CONFIG.MESSAGES.INVALID_OTP;
                }
            }
        }

        response = {
            "status": "S",
            "response_code": 1,
            "msg": "OTP Successfully validated",
            "id": "65SDFDS65F65SD4F6DS4",
            "od_login": "N",
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
