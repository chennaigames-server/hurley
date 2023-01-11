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
        let next_upgr_coins = 0;

        console.log(data,"data?:::::::::");
        let powerup_details = await dbobj.db.collection("app_user_profile_details").findOne({ aid: aid });
        console.log(powerup_details.details.upgr[(upgr_id - 1)]);

        if (powerup_details) {
            let upgr_cost = await dbobj.db.collection("app_upgrades_cost").find({ level: {$gte:(powerup_details.details.upgr[(upgr_id - 1)].c_level) }}).limit(2).toArray();
            console.log({ level: {$gte:(powerup_details.details.upgr[(upgr_id - 1)].c_level) + 1 }});
            console.log(upgr_cost,"xuqwtf" );
            let c_coins = await dbobj.db.collection("app_coins").findOne({ aid: aid });
            console.log(c_coins.coin_balance );

            if (c_coins.coin_balance >= upgr_cost[0].coins) {
                let deduct_query = { aid: aid };
                let deduct_update = { $inc: { coin_balance: -upgr_cost[0].coins } };
                let deduct = await dbobj.db.collection("app_coins").updateOne(deduct_query, deduct_update);
                console.log(deduct, "deduct");

                let lvl_inc = ((powerup_details.details.upgr[(upgr_id - 1)].c_level) + 1);
                let p_p = (lvl_inc/powerup_details.details.upgr[(upgr_id - 1)].t_level)*100;
                let cs_btn = "Y";

                console.log(lvl_inc,"lvl inc::::::");
                console.log(p_p);

                if (upgr_cost.length > 1) {
                    next_upgr_coins = upgr_cost[1].coins
                }
                else{
                    next_upgr_coins = upgr_cost[0].coins
                }

                if (p_p === 100) {
                    cs_btn = "N"
                    next_upgr_coins = upgr_cost[0].coins
                }
                console.log(next_upgr_coins,"nuc:::::");
                let improve = await dbobj.db.collection("app_user_profile_details").updateOne({ aid: aid, 'details.upgr.id': upgr_id }, {$set:{'details.upgr.$.c_level':lvl_inc,'details.upgr.$.p_percent': p_p,'details.upgr.$.upgr_cost':next_upgr_coins,'details.upgr.$.cs_btn':cs_btn } });
                console.log(improve, "improve");

                let c_coins = await dbobj.db.collection("app_coins").findOne({ aid: aid });
                console.log(c_coins.coin_balance ); 
                response.status = status;
                response.msg = "SUCCESS";
                response.upgr_cost = next_upgr_coins;
                response.p_p = p_p;
                response.c_level = lvl_inc;
                response.coin_balance = c_coins.coin_balance
                response.cs_btn = cs_btn; 
            }
            else {
                response.status = "E"
                response.msg = "INSUFFICIENT BALANCE"
            }
            response.app_config = app_config;
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
        await dbobj.dbclose();
    }
})
module.exports = router;
/* MAIN SCRIPT ENDS */