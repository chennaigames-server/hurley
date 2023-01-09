const express = require('express');
const router = express.Router();
const CONFIG = require('../common/inc.config');
const UTILS = require('../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (reqqscq, res) => {

    /* LOGGER MODULE */
    var loggerobj = require('../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    /* DEFAULT VALUES */
    var response = UTILS.error();
    var status = 'S';
    var response_code = 0;
    var msg = '';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    // var dbconn = require('../../common/inc.dbconn');
    // var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var email_id = data.email_id;

        /* BUILD RESPONSE */
        response = {
            "status": "S",
            "response_code": 1,
            "coin_balance": 500,
            "msg": "upgraded successfully",
            "app_config": {
                "f_u": "N",
                "m": "N",
                "i_d": "N",
                "m_t": 3600
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