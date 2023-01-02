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
    var msg = '';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var r_code = data.r_code;
        var nickname = data.nickname;
        var aid = data.aid;
        console.log(data, "data::::");
        console.log(data.hasOwnProperty('nickname'));
        console.log(data.hasOwnProperty('aid'));

        if (data.hasOwnProperty('nickname') && nickname != '' && aid != '' && data.hasOwnProperty('aid')) {
            nickname = nickname.trim();
            console.log(nickname, "nickname:::::::::");
            if (nickname) {
                var query_parameter = { aid: aid };
                var profile_exist = await dbobj.db.collection('app_user_profile_details').find(query_parameter).toArray();
                if (profile_exist.length === 0) {
                    var user_referral_details = await dbobj.db.collection('app_referral_code_master').find({ aid: aid }).toArray()
                    if (user_referral_details.length === 0) {
                        var generate_referral = await UTILS.generate_referral_code(dbobj);//generate
                        var user_referral = {
                            aid: aid,
                            referral_code: generate_referral,
                            total_redeem: 0,
                            to_redeem: 0,
                            claimed: "N",
                            crd_on: UTILS.CURRENT_DATE(new Date()),
                            stat: "A"
                        }
                        /* INSERTING NEW REFERRAL DATA */
                        await dbobj.db.collection('app_referral_code_master').insertOne(user_referral)
                    }

                    /* INSERT PROFILE NICKNAME */
                    var insert_profile_data = {
                        aid: aid,
                        details: {
                            nickname: nickname,
                            avatar: 1,
                            last_edited_on: UTILS.CURRENT_DATE(new Date()),
                            upgr: [
                                {
                                  id: 1,
                                  title: "Coin Magnet",
                                  desc: "Automatically collects all nearby coins",
                                  upgr_cost: 1000,
                                  c_level: 1,
                                  t_level: 10,
                                  p_percent: 10
                                },
                                {
                                  id: 2,
                                  title: "2x Multiplier",
                                  desc: "multiply 2x Score while the powerup is active",
                                  upgr_cost: 1000,
                                  c_level: 1,
                                  t_level: 10,
                                  p_percent: 10
                                },
                                {
                                  id: 3,
                                  title: "Shield",
                                  desc: "protect you from single hit while active",
                                  upgr_cost: 1000,
                                  c_level: 1,
                                  t_level: 10,
                                  p_percent: 10
                                },
                                {
                                  id: 4,
                                  title: "Fly Board",
                                  desc: "Airborne from the waves and obstacles",
                                  upgr_cost: 1000,
                                  c_level: 1,
                                  t_level: 10,
                                  p_percent: 10
                                },
                              ]
                        },
                        owned_char: [1, 2, 3, 4]
                    };

                    if (nickname && !r_code) {
                        if (UTILS.check_swear_word(nickname) === false) {
                            var insert_profile = await dbobj.db.collection('app_user_profile_details').insertOne(insert_profile_data);
                            var query_parameter = { aid: aid };
                            var update_parameter = { $set: { l_type: 0 } };
                            await dbobj.db.collection('app_user_landing_screen').updateOne(query_parameter, update_parameter);
                            msg = CONFIG.MESSAGES.REG_SUCCESS;
                            response_code = 1;

                        } else {
                            response_code = 3;
                            msg = "DON'T USE SWEAR WORDS";
                        }
                    }
                    if (r_code) {
                        // /* INSERT REFERRAL CODES */
                        console.log(UTILS.check_swear_word(nickname), "swearrrr");
                        if (UTILS.check_swear_word(nickname) === false) {
                            r_code = (r_code).toUpperCase()
                            console.log(r_code, "r code::::::");
                            let check = await dbobj.db.collection('app_referral_code_master').findOne({ referral_code: r_code, aid: { $ne: aid } })
                            console.log(check, "referal hshehe");
                            if (check) {
                                var insert_redeem_data = {
                                    referee: aid,
                                    referrer: check.aid,
                                    is_played: 'N',
                                    crd_on: UTILS.CURRENT_DATE(new Date()),
                                    mdy_on: '',
                                    stat: "A"
                                }
                                await dbobj.db.collection('app_redeemed_details').insertOne(insert_redeem_data);
                                var increment = await dbobj.db.collection('app_referral_code_master').bulkWrite([{
                                    updateOne: {
                                        filter: { aid: check.aid },
                                        update: { $inc: { total_redeem: 1 } }
                                    }
                                }, {
                                    updateOne: {
                                        filter: { aid: aid },
                                        update: { $set: { claimed: 'Y' } }
                                    }
                                }
                                ])

                                var insert_profile = await dbobj.db.collection('app_user_profile_details').insertOne(insert_profile_data);
                                var query_parameter = { aid: aid };
                                var update_parameter = { $set: { l_type: 0 } };
                                await dbobj.db.collection('app_user_landing_screen').updateOne(query_parameter, update_parameter);
                                msg = CONFIG.MESSAGES.REG_SUCCESS
                                response_code = 1
                            } else {
                                response_code = 2;
                                msg = "INVALID REFERRAL CODE"
                            }
                        } else {
                            response_code = 3;
                            msg = "DON'T USE SWEAR WORDS"
                        }
                    }
                }
                else {
                    response_code = 1;
                    msg = CONFIG.MESSAGES.LOGIN_SUCCESS;
                }

                /* BUILD RESPONSE */
                response = {
                    status: status,
                    msg: msg,
                    response_code: response_code,
                    landing: {
                        type: 3
                    },
                    app_config: {
                        "f_u": "N",
                        "m": "N",
                        "i_d": "N",
                        "m_t": 0
                    }
                }
            }
            else {
                response = {
                    status: status,
                    msg: 'Nickname should not be empty',
                    response_code: 2,
                    landing: {
                        type: 3
                    },
                    app_config: app_config
                }
            }
        }
        else {
            response = UTILS.error();
        }

        /* LOGGER */
        logger.log({
            level: 'info',
            type: 'Response',
            message: response
        });

        /* OUTPUT */
        console.log(response, "up_randn");
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