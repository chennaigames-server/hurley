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
    var response = UTILS.error();
    var status = 'S';
    var response_code = 0;
    var msg = '';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
  

   

        response = {
            "status": "S",
            "coin_balance": 10000,
            "response_code": 1,
            "game_token" :"8das7fy78adsf",
            "msg": "successfully",
            "app_config": app_config,
              "missions": [
              {
                "id": 1,
                " ": 1,
                "mission": "COLLECT 450 COINS IN SINGLE RACE",
                "coin_bonus": 250,
                "c_progress": 225,
                "t_progress": 450,
                "p_percent": 50,
                "btn_status": 1
              },
              {
                "id": 1,
                "type": 1,
                "mission": "COLLECT 450 COINS IN SINGLE RACE",
                "coin_bonus": 250,
                "c_progress": 225,
                "t_progress": 450,
                "p_percent": 50,
                "btn_status": 1
              },
              {
                "id": 1,
                "type": 1,
                "mission": "COLLECT 450 COINS IN SINGLE RACE",
                "coin_bonus": 250,
                "c_progress": 225,
                "t_progress": 450,
                "p_percent": 50,
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
        var response = UTILS.error();
        res.send(response);
    }
    finally {
        await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */
