
const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');



router.post('/', (req, res) => {
    try {
        /* LOGGER MODULE */
        var loggerobj = require('../../classes/class.logger');
        let winston = new loggerobj(__filename);
        let logger = winston.logger();

        var device_id = req.body.device_id;
        var api_url = CONFIG.API_BASE_URL;
        var app_version = parseInt(req.body.app_ver)

        /* RESPONSE */
        let response = {
            
                "status": "S",
                "msg": "Success",
                "api_base_url": "http://localhost:3000/api/",
                "app_config": {
                    "f_u": "N",
                    "m": "N",
                    "i_d": "N",
                    "m_t": 0
                }
                
            }
      
        /* OUTPUT */
        logger.log({
            level: 'info',
            type: 'Response',
            message: response
        });
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({
            level: 'error',
            message: err
        });
    }
    finally {
    }
})
module.exports = router;
