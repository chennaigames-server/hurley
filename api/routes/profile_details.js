let express = require('express');
let router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* DEFAULT VALUES */
    let response = {};
    let profile_details = {};
    var player_details = {};
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

        let query_parameter = { aid: aid };
        let player_profile = await dbobj.db.collection("app_user_profile_details").findOne(query_parameter);
        /* PLAYER PROFILE FOR NICKNAME */
        if (player_profile) {
            let nick_name = player_profile.details.nickname;
            let coins = 0;
            let char_details = {};
            let total_owned_char = [];
            /* LAST SELECTED TAKEN FOR CHARACTER DETAILS */
            let last_selected_unit = await dbobj.db.collection("app_asset_ownership").findOne({ aid: aid, last_selected: "Y" });
            if (last_selected_unit) {
                let collection_name = "";
                let query_parameter = { aid: aid, unit_id: last_selected_unit.unit_id };
                if (last_selected_unit.unit_type === 1) collection_name = "app_non_tradable_assets";
                if (last_selected_unit.unit_type === 2) collection_name = "app_tradable_assets_master";
                let options = {projection:{_id:0,crd_on:0,stat:0,aid:0}}
                let char = await dbobj.db.collection(collection_name).findOne(query_parameter,options);
                if (char) char_details = char;
            }

            let agg = [
                { $match: { aid: aid } },
                { $group: { _id: '$unit_type', list: { $push: '$unit_id' } } },
                { $project: { _id: 0, unit_type: "$_id", unit_id: "$list" } },
                { $unwind: '$unit_id' },
                {$sort:{unit_type:1}}
            ];
            let owned_char = await dbobj.db.collection("app_asset_ownership").aggregate(agg).toArray();
            console.log(owned_char, "owned char::::::");

            /* TOTAL OWNED CHARACTERS */
            if (owned_char.length > 0) total_owned_char = owned_char;

            /* AVAILABLE PLAYER COINS */
            let coins_value = await dbobj.db.collection("app_coins").findOne(query_parameter);
            if (coins_value) coins = coins_value.coin_balance;
            let cs_btn = "N";
            player_details.nickname = nick_name;
            if (char_details.attr['damage'] > 0) {
                cs_btn = "Y"
            }
            char_details.cs_btn = cs_btn;

            /* RESPONSE */
            response.status = status;
            response.msg = "SUCCESS";
            response.app_config = app_config;
            response.coin_balance = coins;
            response.owned_char = total_owned_char;
            response.player_details = player_details;
            response.char_details = char_details;
        }

        /* LOGGER */
        logger.log({ level: 'info', type: 'Response', message: response });
        console.log(response,"response:::::");
        /* OUTPUT */
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