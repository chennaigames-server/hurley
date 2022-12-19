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
                    "coin_balance": 1000,
                    "nickname": "super_surfer",
                    "asset_details": {
                      "gender": "M/F",
                      "board_id": 1,
                      "char_id": 1,
                      "avatar": "1",
                      "xp_level": 1,
                      "c_xp": 10,
                      "t_xp": 500,
                      "p_p": 70,
                      "d_xp": "10/500 XP",
                      "char_details": {
                        "char_id": 1,
                        "back_attach": 1,
                        "bottom_attach": 2,
                        "face_attach": 3,
                        "glass_attach": 4,
                        "hair_attach": 5,
                        "hand_attach": 6,
                        "head_attach": 7,
                        "leg_attach": 8,
                        "maleClaws_attach": 9,
                        "ornaments_attach": 10,
                        "topDress_attach": 11,
                        "attr": {
                          "agility": 10,
                          "stamina": 20,
                          "energy": 100,
                          "durability": 10,
                          "speed": 20,
                          "damage": 0
                        }
                      }
                    },
                    "referral_details": {
                      "code": "123ABC",
                      "r_bonus": 5000,
                      "is_redeemed": "Y/N"
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
