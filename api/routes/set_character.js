var express = require('express');
var router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* DEFAULT VALUES */
    var response = {};
    var status = "S";
    var app_config = UTILS.get_app_config();
    /* DATABASE REFERENCE */
    const dbconn = require('../../common/inc.dbconn');
    const dbobj = new dbconn();
    /* LOGGER MODULE */
    var loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    try {
        /* REQUEST PARAMETERS */
        let data = req.body;
        let aid = data.aid;
        let unit_id = parseInt(data.unit_id);
        let unit_type = parseInt(data.unit_type);

        console.log(data, "data");

        if ("aid" in data && aid) {
            let query_parameter = { aid: aid };
            let update_parameter = { $set: { last_selected: "N" } };
            await dbobj.db.collection("app_asset_ownership").updateMany(query_parameter, update_parameter);

            let query = { aid: aid, unit_id: unit_id, unit_type: unit_type };
            let update = { $set: { last_selected: "Y" } };
            await dbobj.db.collection("app_asset_ownership").updateOne(query, update);

            /* BUILD RESPONSE */
            response.status = status;
            response.response_code = 1;
            response.msg = "character assigned successfully";
            response.app_config = app_config;

        }
        else {
            response = UTILS.error();
        }

        /* LOGGER */
        logger.log({ level: 'info', type: 'Response', message: response });
        /* OUTPUT */
        console.log(response, "set character");
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error', message: err });
        res.send(UTILS.error())
    }
    finally {
        await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */
