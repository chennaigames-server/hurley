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
        console.log(data, "req data::::");
        let collection_name = "app_non_tradable_assets";
        if (unit_type == 2) collection_name = "app_tradable_assets_master";

        let query_parameter = { aid: aid, unit_id: unit_id, unit_type: unit_type };
        let options = { projection: { _id: 0, damage: '$attr.damage' } };
        console.log(query_parameter, "query_parameter::::", collection_name);
        let rep_value = await dbobj.db.collection(collection_name).findOne(query_parameter, options);
        console.log(rep_value, collection_name);
        if (rep_value) {
            let query = { damage: rep_value.damage };
            let project = { projection: { _id: 0, repair_cost: '$total_repair_cost' } };
            let repair_cost = await dbobj.db.collection("app_repair_board_master").findOne(query, project);
            console.log(repair_cost, "rccc");
            if (repair_cost) {
                let c_coins = await dbobj.db.collection("app_coins").findOne({ aid: aid });
                console.log(c_coins,"c_coins:::");
                console.log(repair_cost,"repair_cost::::");
                if (c_coins.coin_balance >= repair_cost.repair_cost) {
                    let deduct_query = { aid: aid };
                    let deduct_update = { $inc: { coin_balance: -repair_cost.repair_cost } };
                    let deduct = await dbobj.db.collection("app_coins").updateOne(deduct_query, deduct_update);
                    console.log(deduct, "deduct");

                    let reduct_update = { $set: { 'attr.damage': 0, repair_cost: 0 } };
                    let reduct = await dbobj.db.collection(collection_name).updateOne(query_parameter, reduct_update);
                    console.log(reduct, "reduct");

                    /* BUILD RESPONSE */
                    response.status = status;
                    response.msg = "SUCCESS";
                    response.damage = 0;
                    response.cs_btn = "N";
                    response.repair_cost = 0;
                }
                else {
                    /* BUILD RESPONSE */
                    response.status = "E";
                    response.msg = "INSUFFICIENT_BALANCE";
                }
                let cur_coins = await dbobj.db.collection("app_coins").findOne({ aid: aid })
                response.coin_balance = cur_coins.coin_balance;
                response.app_config = app_config;
            }
            
        }
        else {
            response = UTILS.error();
        }

        /* LOGGER */
        logger.log({ level: 'info', type: 'Response', message: response });
        /* OUTPUT */
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error', message: err });
        response = UTILS.error()
        res.send(response)
    }
    finally {
        await dbobj.dbclose();
    }
});
module.exports = router;
/* MAIN SCRIPT ENDS */