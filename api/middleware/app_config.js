const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');
//const logger = require("../../classes/class.logger");
var loggerobj = require('../../classes/class.logger');
module.exports = (req, res, next) => {

    let requested_url = req.url.replace('/', '')
    let winston = new loggerobj(requested_url);
    let logger = winston.logger();

    logger.log({
        level: 'info',
        type: 'Request',
        message: req.body
    });

    var app_ver = parseInt(req.body.app_ver);

    if (CONFIG.MAINTANANCE_MODE == 'Y') {
        let response = {
            status: 'S',
            msg: "Servers maintanance la iruku. Wait pannunga",
            app_config: UTILS.get_app_config()
        }
        res.send(response);
    }
    else if (CONFIG.FORCED_UPDATE == 'Y') {
        let response = {
            status: 'S',
            msg: "New Update Available..!",
            app_config: UTILS.get_app_config()
        }
        res.send(response);
    }
    else {
        next();
    }
};