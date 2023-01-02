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
                    "owned_char":[1,2,3,4,5],
                    last_selected_index:1,
                    "player_Details": {
                        "coin_balance": 1000,
                        "nickname": "super_surfer",
                        "char_details": {
                            "gender": 0,
                            "b_id": "1",
                            "c_id": "1",
                            "avatar": "1",
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
