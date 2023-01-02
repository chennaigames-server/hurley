var express = require('express');
var router = express.Router();
const CONFIG = require('../../../common/inc.config');
const UTILS = require('../../../utils/util.functions');

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
    var loggerobj = require('../../../classes/class.logger');
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
                    avatr_id:1,
                    nickname:"super_surfer",
                    email_id:"super_surfer@gmail.com",
                    info:"The account is used to save your game progress,Locations earned Hurley coins and other information",
                    p_p:"https://chennaigames.com/privacy_policy.html",
                    t_o_u:"https://chennaigames.com/privacy_policy.html",
                    supp:"https://chennaigames.com/"
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
