const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    try {
        /* LOGGER MODULE */
        var loggerobj = require('../../classes/class.logger');
        let winston = new loggerobj(__filename);
        let logger = winston.logger();

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