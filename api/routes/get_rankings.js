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
    // var dbconn = require('../../common/inc.dbconn');
    // var dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var email_id = data.email_id;

        /* BUILD RESPONSE */
        response = {
            "status": "S",
            "app_config": {
                "f_u": "N",
                "m": "N",
                "i_d": "N",
                "m_t": 0
            },
            "lb": {
                "n": "Event 1",
                "i_d": "N",
                "e_time": 2563,
                "lb_dur": ""
            },
            "winners": [
                {
                    "p": 1,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 2,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 3,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 4,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 5,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 6,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 7,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 8,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 9,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 10,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                }
            ],
            "current_player": [
                {
                    "p": 77,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                }
            ],
            "position_list": [
                {
                    "p": 77,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 78,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 79,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 80,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 81,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
                },
                {
                    "p": 82,
                    "n": "Liam",
                    "l": "II",
                    "o_u": "N",
                    "s": "15000",
                    "c_p": "N",
                    "w": 50
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
        //await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */