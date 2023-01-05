let express = require('express');
let router = express.Router();
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* DEFAULT VALUES */
    let response = {};
    let status = "S";
    let app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    const dbconn = require('../../common/inc.dbconn');
    const dbobj = new dbconn();

    /* LOGGER MODULE */
    let loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    try {
        /* REQUEST PARAMETERS */
        let data = req.body;
        let aid = data.aid;
        let unit_id = parseInt(data.unit_id);
        let unit_type = parseInt(data.unit_type);

        console.log(data,"data char details");
        let collection_name = "";
        if(unit_type == 1) collection_name = "app_non_tradable_assets";
        if(unit_type == 2) collection_name = "app_tradable_assets_master";

        let query_parameter = {aid:aid,unit_id:unit_id};
        let options = {projection:{_id:0,crd_on:0,stat:0,aid:0}}
        let char_details = await dbobj.db.collection(collection_name).findOne(query_parameter,options);

        if(char_details){
            response.status = status;
            response.msg = "SUCCESS";
            response.app_config = app_config;
            response.char_details = char_details;
        }

        /* LOGGER */
        logger.log({ level: 'info',type: 'Response',message: response });
        /* OUTPUT */
        console.log(response,"char_details:::");
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error',message: err });
        /* ERROR OUTPUT */
        res.send(UTILS.error())
    }
    finally {
        await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */

function random_number(min, max) {
	let number = Math.floor(Math.random() * (max - min + 1)) + min;
	return number;
}