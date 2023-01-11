var express = require("express");
var router = express.Router();
const UTILS = require("../../utils/util.functions");
const CONFIG = require("../../common/inc.config");


/* MAIN SCRIPT STARTS */
router.post("/", async (req, res) => {
  /* DEFAULT VALUES */
  var response = {};
  var player_details = {};
  var status = "S";
  var app_config = UTILS.get_app_config();

  /* DATABASE REFERENCE */
  const dbconn = require('../../common/inc.dbconn');
  const dbobj = new dbconn();

  /* LOGGER MODULE */
  var loggerobj = require("../../classes/class.logger");
  let winston = new loggerobj(__filename);
  let logger = winston.logger();

  try {
    /* REQUEST PARAMETERS */
    var data = req.body;
    let aid = data.aid;
    let trans_id = " ";

    let query_parameter = { aid: aid };
    let options = { projection: { _id: 0, stat: 0, aid: 0 } };
    let player_profile = await dbobj.db.collection("app_user_profile_details").findOne(query_parameter, options);
    if (player_profile) {
      let nick_name = player_profile.details.nickname;
      let upgr = player_profile.details.upgr;
      let coins = 0;
      let referral_details = {};
      let char_details = {};

      let last_selected_unit_query = { aid: aid, last_selected: "Y" };
      let l_options = { projection: { _id: 0 } };
      let last_selected_unit = await dbobj.db.collection("app_asset_ownership").findOne(last_selected_unit_query, l_options);
      if (last_selected_unit) {
        let collection_name = "";
        let query_parameter = { aid: aid, unit_id: last_selected_unit.unit_id };
        if (last_selected_unit.unit_type === 1) collection_name = "app_non_tradable_assets";
        if (last_selected_unit.unit_type === 2) collection_name = "app_tradable_assets_master";
        let char = await dbobj.db.collection(collection_name).findOne(query_parameter, options);
        if (char) char_details = char;
      }

      var transaction_id = await dbobj.db.collection('app_coins_transaction').aggregate([
        {
          $match: {
            aid: aid,
            reason: { $in: ['REFERRAL', 'REF_REDEEMED'] },
            is_claimed: 'N',
            stat: 'A'
          }
        },
        { $project: { _id: 0, ids: '$_id' } },
        { $group: { _id: 1, data: { $push: { $concat: [{ '$toString': '$ids' }, '||'] } } } },
        { $project: {
            uuid: {
              $reduce: {
                input: '$data',
                initialValue: "",
                in: { $concat: ['$$value', '$$this'] }
              }
            }
          }
        }
      ]).toArray();
      console.log(transaction_id, "transaction_id");
      if (transaction_id.length > 0) {
        trans_id = transaction_id[0].uuid
      }

      let share_details = await dbobj.db.collection("app_referral_code_master").findOne(query_parameter, options);
      if (share_details) referral_details.r_code = share_details.referral_code, referral_details.r_count = share_details.total_redeem, referral_details.is_redeemed = (share_details.claimed === "Y") ? "Y" : "N",referral_details.claim_btn = (share_details.to_redeem) ? "Y" : "N",referral_details.share_txt = CONFIG.share_txt, referral_details.r_bonus = share_details.to_redeem*500, referral_details.note = "you and your friend will be rewarded 500 hurley coins", referral_details.trans_id = trans_id;

      let coins_value = await dbobj.db.collection("app_coins").findOne(query_parameter, l_options);
      if (coins_value) coins = coins_value.coin_balance;

      const last_edited_on = UTILS.CURRENT_DATE(new Date(player_profile.details.last_edited_on));
      const current_date = UTILS.CURRENT_DATE(new Date());
      const diffTime = Math.abs(current_date - last_edited_on);
      const diff_value = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let rem_time = "";
      let cs_btn = "";

      if (nick_name) {
          if (diff_value >= 7) {
            cs_btn = "Y"
          } else {
            cs_btn = "N";
            let next_days = (7 - diff_value);
            rem_time = "YOUR NEXT NAME CHANGE CAN BE HAPPEN AFTER " + next_days + " DAYS"
            if (next_days == 1) {
              rem_time = "YOUR NEXT NAME CHANGE CAN BE HAPPEN AFTER " + next_days + " DAY"
            }
          }
      }

      player_details.nickname = nick_name;
      player_details.rem_time = rem_time;
      player_details.cs_btn = cs_btn;

      response.status = status;
      response.msg = "SUCCESS";
      response.app_config = app_config;
      /* COIN BALANCE */
      response.coin_balance = coins;
      /* PLAYER DETAILS */
      response.player_details = player_details;
      /* CHARACTER (OR) ASSET DETAILS */
      response.char_details = char_details;
      /* REFERRAL DETAILS */
      response.referral_details = referral_details;
      /* UPGRADES */
      response.upgr = upgr;
      /* SETTINGS */
      response.settings = {
        info: "The account is used to save your game progress,Locations earned Hurley coins and other information",
        p_p: "https://www.hurley.com/account/login?return_url=%2Faccount",
        t_o_u: "http://hurley.com/",
        supp: "http://hurley.support.com/",
      };
    }

    /* LOGGER */
    logger.log({ level: "info", type: "Response", message: response });
    console.log(response);
    /* OUTPUT */
    res.send(response);
  }
  catch (err) {
    /* LOGGER */
    logger.log({ level: "error", message: err });
    response = UTILS.error();
    res.send(response);
  }
  finally {
    await dbobj.dbclose();
  }
});
module.exports = router;
/* MAIN SCRIPT ENDS */