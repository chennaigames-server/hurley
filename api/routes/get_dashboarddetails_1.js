var express = require('express');
var router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* DEFAULT VALUES */
    var response = {};
    var profile_details = {};
    var status = "S";
    var app_config = UTILS.get_app_config();
    /* DATABASE REFERENCE */
    // const dbconn = require('../../common/inc.dbconn');
    // const dbobj = new dbconn();
    /* LOGGER MODULE */
    var loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    try {

        /* REQUEST PARAMETERS */
        var data = req.body;
        /* BUILD RESPONSE */
        response = {
            "status": "S",
            "msg": "Success",
            "app_config": {
                "f_u": "N",
                "m": "N",
                "i_d": "N",
                "m_t": 0
            },
            "player_Details": {
                "coin_balance": 1000,
                "nickname": "super_surfer",
                "char_details": {
                    "gender": 0,
                    "b_id": "1",
                    "c_id": "1",
                    "avatar_id": "1",
                    "xp_level": 1,
                    "c_xp": 10,
                    "t_xp": 500,
                    "p_p": 70,
                    "d_xp": "10/500 XP",
                    "rarity": "common",
                    "char_name": "supreme_sloth",
                    "asset_details": {
                        gender: 2,
                        board: 1,
                        top_dress: 3,
                        bottom_dress: 1,
                        back: 1,
                        face: 13,
                        glass: 2,
                        head: 8,
                        hair: 4,
                        hand: 1,
                        leg: 10,
                        claw: 5,
                        ornament: 1,
                    },
                    "attr": {
                        "agility": 10,
                        "stamina": 20,
                        "energy": 100,
                        "durability": 10,
                        "speed": 20,
                        "damage": 0
                    },
                    "repair_cost": 50,
                    "animations": [
                        1,
                        2,
                        3
                    ]
                },

            },
            "referral_details": {
                "code": "123ABC",
                "r_bonus": 5000,
                "is_redeemed": "Y"
            },
            "settings":{
                    email_id:"super_surfer@gmail.com",
                    info:"The account is used to save your game progress,Locations earned Hurley coins and other information",
                    p_p:"https://chennaigames.com/privacy_policy.html",
                    t_o_u:"https://chennaigames.com/privacy_policy.html",
                    supp:"https://chennaigames.com/"
            },
            "upgrades": [
                {
                  "id": 1,
                  "title": "Coin Magnet",
                  "desc": "Automatically collects all nearby coins",
                  "upgr_cost": 1000,
                  "c_level": 1,
                  "t_level": 10,
                  "p_percent": 10,
                  "btn_status": 1
                },
                {
                  "id": 2,
                  "title": "2x Multiplier",
                  "desc": "multiply 2x Score while the powerup is active",
                  "upgr_cost": 1000,
                  "c_level": 1,
                  "t_level": 10,
                  "p_percent": 10,
                  "btn_status": 1
                },
                {
                  "id": 3,
                  "title": "Shield",
                  "desc": "protect you from single hit while active",
                  "upgr_cost": 1000,
                  "c_level": 1,
                  "t_level": 10,
                  "p_percent": 10,
                  "btn_status": 1
                },
                {
                  "id": 4,
                  "title": "Fly Board",
                  "desc": "Airborne from the waves and obstacles",
                  "upgr_cost": 1000,
                  "c_level": 1,
                  "t_level": 10,
                  "p_percent": 10,
                  "btn_status": 1
                }
              ]
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
        res.send(UTILS.error())
    }
    finally {
        //await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */