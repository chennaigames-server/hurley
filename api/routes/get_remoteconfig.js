const express = require('express');
const router = express.Router();
const UTILS = require("../../utils/util.functions");

router.post('/', (req, res) => {
     /* LOGGER MODULE */
     var loggerobj = require('../../classes/class.logger');
     let winston = new loggerobj(__filename);
     let logger = winston.logger();
     var app_config = UTILS.get_app_config();

    try {

        /* RESPONSE */
        let response = {
            "status": "S",
            "msg": "Success",
            "app_config":app_config
        }

        /* OUTPUT */
        logger.log({ level: 'info', type: 'Response', message: response });
        console.log(response);
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error', message: err });
    }
    finally {
    }
})
module.exports = router;