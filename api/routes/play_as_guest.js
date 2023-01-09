const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');
// const DEV_UTILS = require('../../utils/dev.function')

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
    var game_tips = [];
    var msg = '';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    /* MARKETPLACE CLASS */
    const guardiangames = require('../../mp_classes/class.guardiangames');
    var guardianobj = new guardiangames();

    // var db_functions = require('../../classes/class.db_functions');
    // var dbfunctions = new db_functions();

    try {
        var data = req.body;
        console.log("play_as_guest");
        console.log(data);
        var device_id = data.device_id;
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var platform = data.platform;

        if (data.hasOwnProperty('device_id') && device_id != '') {
            var aid = '';
            var token = '';
            var cs_name_screen = 'N';
            var response = {};
            var already_available_device = await dbobj.db.collection('app_user_accounts').find({ 'active_device.id': device_id, guest: true }).toArray();

            if (already_available_device.length > 0) {
                aid = already_available_device[0].aid
                /* USER RETURNED WITH SAME DEVICE SO OLD TOKEN RETRIVED */
                var query_parameter = { aid: aid };
                var projection_parameter = { _id: 0, gs_token: 1 };
                var get_token = await dbobj.db.collection('app_user_tokens').find(query_parameter).project(projection_parameter).limit(1).toArray();

                if (get_token.length > 0) {
                    token = get_token[0].gs_token;
                }

                var get_nickname = await dbobj.db.collection('app_user_profile_details').find(query_parameter).project(projection_parameter).limit(1).toArray();

                if (get_nickname.length == 0) {
                    cs_name_screen = 'Y';
                }
                response_code = 1

            } else {
                aid = await UTILS.create_aid(dbobj);
                var insert_acct_data = {
                    aid: aid,
                    otp: '',
                    validated: 0,
                    app_ver: app_ver,
                    email_id: '',
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
                    last_otp_sent_time: '',
                    fcm: '',
                    guest: true,
                    day_count:1,
                    week_count:1
                }

                await dbobj.db.collection('app_user_accounts').insertOne(insert_acct_data);
                var user_ownership = []
                var nt_asset = await dbobj.db.collection('app_non_tradable_assets_master').find({ unit_id: 1 }).project({ _id: 0 }).sort({ unit_id: 1 }).toArray()
                for (let i = 0; i < nt_asset.length; i++) {
                    nt_asset[i].aid = aid
                    nt_asset[i].crd_on = UTILS.CURRENT_DATE(new Date())
                    var last_selected = 'N';
                    var ownership = 'YO'
                    if (nt_asset[i].unit_id == 1) {
                        last_selected = 'Y';
                        ownership = 'O'
                    }
                    user_ownership.push({
                        aid: aid,
                        unit_id: nt_asset[i].unit_id,
                        unit_type: nt_asset[i].unit_type,
                        last_selected: last_selected,
                        ownership: ownership,
                        crd_on: UTILS.CURRENT_DATE(new Date()),
                        status: 'A',
                    })
                }
                
                await dbobj.db.collection('app_asset_ownership').insertMany(user_ownership);
                await dbobj.db.collection('app_non_tradable_assets').insertMany(nt_asset)
                // UTILS.transaction_log(CONFIG.TRANSACTION_LOG, dbobj, { registration_reward: 8000 }, { aid: aid })
                // UTILS.rc_transaction_log(aid, "INSTALATION_BONUS", 8000, "CREDIT", dbobj);
                await guardianobj.reward_coins(8000, aid, dbobj);

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

                var query_parameter = { aid: aid };
                var projection_parameter = { _id: 1 };

                var get_nickname = await dbobj.db.collection('app_user_profile_details').find(query_parameter).project(projection_parameter).limit(1).toArray();
                var landing_data = {
                    aid: aid,
                    l_type: 1,
                    l_details: {}
                };
                await dbobj.db.collection('app_user_landing_screen').insertOne(landing_data);

                if (get_nickname.length == 0) {
                    cs_name_screen = 'Y';
                }
                response_code = 1
            }
            /* GETTING RANDOM SET OF GAME TIPS FROM DATABASE */
            // game_tips = await dbfunctions.get_game_tips(dbobj, CONFIG.GAME_TIPS_COUNT);

            response = {
                status: status,
                response_code: response_code,
                msg: 'SUCCESS',
                app_config: app_config,
                game_tips: game_tips,
                cs_name_screen: cs_name_screen,
                token: token,
                aid: aid,
                r_bonus: CONFIG.REFERRAL_BONUS
            }

        }
        else {
            var response = UTILS.error();
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
        console.log(err);
        var response = UTILS.error();
        res.send(response);
    }
    finally {
        await dbobj.dbclose()
    }
})
module.exports = router;