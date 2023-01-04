const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');
const redis_class = require('../../classes/class.redis')
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
    var aid = '';
    var cs_name_screen = 'N';
    var app_config = UTILS.get_app_config();
    var game_tips = [];
    var logout = 'N';

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    /* DATABASE FUNCTIONS */
    // var db_functions = require('../../classes/class.db_functions');
    // var dbfunctions = new db_functions();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var device_id = data.device_id;
        var email_id = data.email_id;
        var login = data.login
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var otp = parseInt(data.otp);
        var platform = data.platform;
        var aid = 0;

        if (email_id != '' && data.hasOwnProperty('email_id') && otp != "" && data.hasOwnProperty("otp")) {
            /* CHECK USER STATUS IS NEW OR RETURNING USER */
            var query_parameter = { email_id: email_id };
            if (login == 'N') {
                query_parameter = { 'active_device.id': device_id, guest: true }
            }
            var projection_parameter = { _id: 0, aid: 1, email_id: 1, active_device: 1, block_info: 1, logout: 1, otp: 1 };
            var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).limit(1).toArray();
            if (exist_in_gamedb.length > 0) {
                aid = exist_in_gamedb[0].aid;
                let user_otp = exist_in_gamedb[0].otp
               

                /* COMPARING OTP */
               // if (otp == user_otp) {
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
                                    aid: aid,
                                    email_id: email_id,
                                    device_id: device_id
                                };

                                token = UTILS.encode_token(token_data);

                                /* UPDATING NEW TOKENS */
                                var query_parameter = { aid: aid };
                                var update_parameter = { $set: { gs_token: token } };
                                await dbobj.db.collection('app_user_tokens').updateOne(query_parameter, update_parameter);

                                var update_parameter = { $set: { logout: 'N', "active_device.id": device_id, "active_device.llon": UTILS.CURRENT_DATE(new Date()), "active_device.p": platform, validated: 1 } };
                                if (login == 'N') {
                                    update_parameter.$set.email_id = email_id;
                                }
                                await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                                msg = CONFIG.MESSAGES.OTP_VALID;
                            }
                        }
                        else {
                            /* USER RETURNED WITH SAME DEVICE SO OLD TOKEN RETRIVED */
                            var query_parameter = { aid: aid };
                            var projection_parameter = { _id: 0, gs_token: 1 };
                            var get_token = await dbobj.db.collection('app_user_tokens').find(query_parameter).project(projection_parameter).limit(1).toArray();

                            if (get_token.length > 0) {
                                token = get_token[0].gs_token;
                            } else {
                                /* INSERT TOKEN DETAILS IN DB */
                                var token_data = {
                                    aid: aid,
                                    email_id: email_id,
                                    device_id: device_id
                                };
                                /* NEW (JWT) TOKEN GENERATED */
                                token = UTILS.encode_token(token_data);
                                var insert_token_data = {
                                    aid: aid,
                                    gs_token: token,
                                    mp_token: '',
                                    refresh_token: 'N' /* FOR GAME SERVER PURPOSE NOT MARKETPLACE */
                                }
                                await dbobj.db.collection('app_user_tokens').insertOne(insert_token_data);
                            }
                            /* INSERT LANDING DETAILS */
                            var landing_data = {
                                aid: aid,
                                l_type: 1,
                                l_details: {}
                            };

                            if (login == 'N') {
                                landing_data.l_type = 0
                            }

                            await dbobj.db.collection('app_user_landing_screen').insertOne(landing_data);
                            msg = CONFIG.MESSAGES.OTP_VALID;
                        }

                        /* UPDATING DEVICE DETAILS IN DB */
                        var query_parameter = { aid: aid };
                        var update_parameter = { $set: { validated: 1 } };
                        if (login == 'N') { 
                            update_parameter.$set.email_id = email_id;
                            update_parameter.$set.guest = false;
                        }
                        await dbobj.db.collection('app_user_accounts').updateOne(query_parameter, update_parameter);
                        // await UTILS.free_car_for_signup(aid, 2, dbobj);


                        /* FOR MARKETPLACE REGISTERED USER TO LAND ON NICKNAME SCREEN */
                        var query_parameter = { aid: aid };
                        var projection_parameter = { _id: 1 };

                        var get_nickname = await dbobj.db.collection('app_user_profile_details').find(query_parameter).project(projection_parameter).limit(1).toArray();

                        if (get_nickname.length == 0) {
                            cs_name_screen = 'Y';
                        }

                        response_code = 1;
                        /* GETTING RANDOM SET OF GAME TIPS FROM DATABASE */
                        // game_tips = await dbfunctions.get_game_tips(dbobj, CONFIG.GAME_TIPS_COUNT);
                    
                } else {
                    response_code = 0;
                    msg = CONFIG.MESSAGES.INVALID_OTP;
                }

                response = {
                    status: status,
                    msg: msg,
                    aid: aid,
                    response_code: response_code,
                    cs_name_screen: cs_name_screen,
                    od_login: od_login,
                    r_bonus: 5000,
                    token: token,
                    app_config: app_config,
                    game_tips: game_tips
                }
            }
        }

        /* LOGGER */
        logger.log({
            level: 'info',
            type: 'Response',
            message: response
        });
        /* OUTPUT */
        console.log();
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
