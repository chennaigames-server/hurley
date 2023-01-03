const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');
// const guardiangames = require('../../mp_classes/class.guardiangames');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {

    /* DEFAULT VALUES */
    var response = {};
    var status = 'S';
    var msg = 'Success';
    var app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    var dbconn = require('../../common/inc.dbconn');
    var dbobj = new dbconn();

    /* LOGGER MODULE */
    var loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();
    
    try {
        /* REQUEST PARAMETERS */
        var data = req.body;
        var aid = data.aid;

        if (aid != '' && data.hasOwnProperty("aid")) {
            let find = await dbobj.db.collection("app_user_profile_details").findOne({ aid: aid })
            const last_edited_on = UTILS.CURRENT_DATE(new Date(find.details.last_edited_on));
            const current_date = UTILS.CURRENT_DATE(new Date());
            const diffTime = Math.abs(current_date - last_edited_on);
            const diff_value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            var update_parameter = { $set: {} }

            if (data.hasOwnProperty('nickname')) {
                let nick_name = data.nickname;
                if (nick_name != '') {
                    if (diff_value >= 7) {
                        update_parameter = { $set: { 'details.nickname': nick_name, 'details.last_edited_on': UTILS.CURRENT_DATE(new Date()) } };
                        var query_parameter = { aid: aid };
                        await dbobj.db.collection('app_user_profile_details').updateOne(query_parameter, update_parameter);
                        response = {
                            status: status,
                            msg: msg,
                            app_config: app_config
                        }
                    } else {
                        let next_days = (7-diff_value);
                        response = UTILS.error();
                        response.msg = "YOU HAVE RECENTLY UPDATED YOUR NICKNAME,YOUR NEXT NAME CHANGE CAN BE HAPPEN AFTER "+next_days+" DAYS"
                        if (next_days == 1) {
                        response.msg = "YOU HAVE RECENTLY UPDATED YOUR NICKNAME,YOUR NEXT NAME CHANGE CAN BE HAPPEN AFTER "+next_days+" DAY"
                        }
                    }
                }
            }
        }
        else {
            /* INCASE OF MISSING PARAMETERS */
            response = UTILS.error();
        }
        /* LOGGER */
        logger.log({ level: 'info',type: 'Response',message: response });
        /* OUTPUT */
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error',message: err });
        response = UTILS.error();
        res.send(response);
    }
    finally {
        await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */