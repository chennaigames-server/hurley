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
    let xp_val = random_number(1,50);

    try {

        /* REQUEST PARAMETERS */
        var data = req.body;
                /* BUILD RESPONSE */
                response = {
                    "status": "S",
                    "msg": "SUCCESS",
                    "app_config": {
                        "f_u": "N",
                        "url": "https://play.google.com/store/apps/details?id=com.chennaigames.mrracer",
                        "m": "N",
                        "i_d": "N",
                        "m_t": 3600
                    },
                    "char_details": {
                        "unit_type": 2,
                        "unit_id": 2,
                        "gender": 1,
                        "xp_level": 1,
                        "c_xp": 50,
                        "t_xp": 500,
                        "p_p": 10,
                        "d_xp": "50/500XP",
                        "rarity": "common",
                        "char_name": "sloth_2",
                        "board": 1,
                        "top_dress": 1,
                        "bottom_dress": 1,
                        "back": 1,
                        "face": 2,
                        "glass": 3,
                        "head": 9,
                        "hair": 6,
                        "hand": 7,
                        "leg": 5,
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
                        ],
                        "crd_on": "2023-01-05T09:14:33.535Z",
                        "stat": "A",
                        "aid": "pHbZQCiFyB7UPDkx"
                    }
                }

        /* LOGGER */
        logger.log({ level: 'info',type: 'Response',message: response });
        /* OUTPUT */
        console.log(response,"char_details:::");
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error',message: err });
        /* ERROR OUTPUT */
        res.send(UTILS.error())
    }
    finally {
        //await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */

function random_number(min, max) {
	let number = Math.floor(Math.random() * (max - min + 1)) + min;
	return number;
}