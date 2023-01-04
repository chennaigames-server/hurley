var express = require("express");
var router = express.Router();
const CONFIG = require("../../common/inc.config");
const UTILS = require("../../utils/util.functions");

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
    let email_id = data.email_id;

    let query_parameter = { aid: aid };
    let player_profile = await dbobj.db.collection("app_user_profile_details").findOne(query_parameter);
    if (player_profile) {
      let nick_name = player_profile.details.nickname;
      let upgr = player_profile.details.upgr;
      let coins = 0;
      let referral_details = {};
      let char_details = {};

      let last_selected_unit = await dbobj.db.collection("app_asset_ownership").findOne({ aid: aid, last_selected: "Y" });
      if (last_selected_unit) {
        let collection_name = "";
        let query_parameter = { aid: aid, unit_id: last_selected_unit.unit_id };
        if (last_selected_unit.unit_type === 1) collection_name = "app_non_tradable_assets";
        if (last_selected_unit.unit_type === 2) collection_name = "app_tradable_assets_master";
        let char = await dbobj.db.collection(collection_name).findOne(query_parameter);
        char_details = char;
      }

      let share_details = await dbobj.db.collection("app_referral_code_master").findOne(query_parameter);
      if (share_details) referral_details.referral_code = share_details.referral_code, referral_details.players_referred = share_details.total_redeem, referral_details.cs_btn = (share_details.to_redeem) ? "N" : "Y", referral_details.share_txt = "you and your friend will be rewarded", referral_details.r_bonus = 5000;

      let coins_value = await dbobj.db.collection("app_coins").findOne(query_parameter);
      if (coins_value) coins = coins_value.coin_balance;

      player_details.nickname = nick_name;
      player_details.coin_balance = coins;
      player_details.char_details = char_details;

      response.status = "S";
      response.msg = "SUCCESS";
      response.app_config = app_config;

      response.player_details = player_details;
      response.referral_details = referral_details;
      response.upgr = upgr;
      response.settings = {
        info: "The account is used to save your game progress,Locations earned Hurley coins and other information",
        p_p: "https://www.hurley.com/account/login?return_url=%2Faccount",
        t_o_u: "http://hurley.com/",
        supp: "http://hurley.support.com/",
      };
    }
    else {
      response = UTILS.error();
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
    res.send(UTILS.error());
  }
  finally {
    // await dbobj.dbclose();
  }
});
module.exports = router;
/* MAIN SCRIPT ENDS */