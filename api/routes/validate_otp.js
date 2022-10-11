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
    var od_login = 'N';
    var msg = 'Success';
    var token = '';
    var gid = '';
    var cs_name_screen = 'N';
    var app_config = UTILS.get_app_config();
    var logout = 'N';

    /* DATABASE REFERENCE */
    // var dbconn = require('../../common/inc.dbconn');
    // var dbobj = new dbconn();

    /* DATABASE FUNCTIONS */
    // var db_functions = require('../../classes/class.db_functions');
    // var dbfunctions = new db_functions();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var device_id = data.device_id;
        var email_id = data.email_id;
        var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
        var otp = data.otp;
        var platform = data.platform;
        var id = 0;

        response = {
            "status": "S",
            "response_code": 1,
            "msg": "OTP Successfully validated",
            "id": "65SDFDS65F65SD4F6DS4",
            "od_login": "N",
            "app_config": {
              "f_u": "N",
              "m": "N",
              "i_d": "N",
              "m_t": 0
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
