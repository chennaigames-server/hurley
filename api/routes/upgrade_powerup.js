const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {

    /* LOGGER MODULE */
    let loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();

    /* DEFAULT VALUES */
    let response = UTILS.error();
    let status = 'S';
    let msg = '';
    let app_config = UTILS.get_app_config();

    /* DATABASE REFERENCE */
    let dbconn = require('../../common/inc.dbconn');
    let dbobj = new dbconn();

    try {
        /* REQUEST PARAMETERS */
        let data = req.body;
        let aid = data.aid;
        let upgr_id = parseInt(data.u_id);
        console.log(data,"data?:::::::::");
        let powerup_details = await dbobj.db.collection("app_user_profile_details").findOne({ aid: aid });
        console.log(powerup_details.details.upgr[upgr_id - 1].c_level);

        if (powerup_details) {
            let upgr_cost = await dbobj.db.collection("app_powerups").find({ level: {$gte:(powerup_details.details.upgr[upgr_id - 1].c_level) + 1 }}).limit(2).toArray();
            console.log(upgr_cost,"xuqwtf" );
            let c_coins = await dbobj.db.collection("app_coins").findOne({ aid: aid });
            console.log(c_coins.coin_balance );

            if (c_coins.coin_balance >= upgr_cost[0].coins) {
                let deduct_query = { aid: aid };
                let deduct_update = { $inc: { coin_balance: -upgr_cost[0].coins } };
                let deduct = await dbobj.db.collection("app_coins").updateOne(deduct_query, deduct_update);
                console.log(deduct, "deduct");
                let lvl_inc = ((powerup_details.details.upgr[upgr_id - 1].c_level) + 1);
                let p_p = (lvl_inc/powerup_details.details.upgr[upgr_id - 1].t_level)*100;

                let improve = await dbobj.db.collection("app_user_profile_details").updateOne({ aid: aid, 'details.upgr.id': upgr_id }, {$set:{'details.upgr.$.c_level':lvl_inc,'details.upgr.$.p_percent': p_p,'details.upgr.$.upgr_cost':upgr_cost[1].coins } });
                console.log(improve, "improve");

                response.status = status;
                response.msg = "SUCCESS";
                response.upgr_cost = upgr_cost[1].coins;
                response.p_p = p_p;
                response.c_level = lvl_inc;
            }
            else {
                response.status = "E"
                response.msg = "INSUFFICIENT BALANCE"
            }
            response.app_config = { "f_u": "N", "m": "N", "i_d": "N", "m_t": 0 }
        }
        /* LOGGER */
        logger.log({ level: 'info', type: 'Response', message: response });
        /* OUTPUT */
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error', message: err });
        /* OUTPUT */
        response = UTILS.error();
        res.send(response);
    }
    finally {
        //await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */