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
                response ={
                    "status": "S",
                    "msg": "SUCCESS",
                    "app_config": {
                        "f_u": "N",
                        "url": "https://play.google.com/store/apps/details?id=com.chennaigames.mrracer",
                        "m": "N",
                        "i_d": "N",
                        "m_t": 3600
                    },
                    "coin_balance": 4500,
                    "owned_char": [
                        {
                            "unit_type": 1,
                            "unit_id": 1
                        },
                        {
                            "unit_type": 2,
                            "unit_id": 1
                        },
                        {
                            "unit_type": 2,
                            "unit_id": 2
                        }
                    ],
                    "player_details": {
                        "nickname": "winner"
                    },
                    "char_details": {
                        "unit_type": 2,
                        "unit_id": 1,
                        "gender": 1,
                        "xp_level": 1,
                        "c_xp": 50,
                        "t_xp": 500,
                        "p_p": 10,
                        "d_xp": "50/500XP",
                        "rarity": "rare",
                        "char_name": "sloth_1",
                        "board": 1,
                        "top_dress": 3,
                        "bottom_dress": 3,
                        "back": 1,
                        "face": 14,
                        "glass": 6,
                        "head": 4,
                        "hair": 6,
                        "hand": 5,
                        "leg": 1,
                        "claw": 5,
                        "ornament": 1,
                        "attr": {
                            "agility": 0,
                            "stamina": 0,
                            "energy": 0,
                            "durability": 0,
                            "speed": 0,
                            "damage": 0
                        },
                        "repair_cost": 0,
                        "animations": [
                            1,
                            2,
                            3
                        ]
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
        res.send(UTILS.error())
    }
    finally {
        //await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */
