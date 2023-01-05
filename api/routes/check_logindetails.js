const express = require('express');
const router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {

  /* LOGGER MODULE */
  var loggerobj = require('../../classes/class.logger');
  let winston = new loggerobj(__filename);
  let logger = winston.logger();

  /* DEFAULT VALUES */
  var response = UTILS.error();
  var status = 'S';
  var response_code = 0;
  var od_login = 'N';
  var msg = '';
  var l_code = 0;
  var app_config = UTILS.get_app_config();
  var game_tips = [];


  /* DATABASE REFERENCE */
  var dbconn = require('../../common/inc.dbconn');
  var dbobj = new dbconn();

  /* COMMON DB FUNCTIONS */
  //   var dbfunctions = require('../../classes/class.db_functions');
  //   var dbfuncobj = new dbfunctions();

  // /* INBOX MODULE CLASS */
  // const inbox = require('../../classes/class.inbox');
  // var inboxobj = new inbox();

  try {
    /* REQUEST PARAMETERS */
    var data = req.body;
    var device_id = data.device_id;
    var email_id = data.email_id;
    var app_ver = (data.app_ver == '') ? 0 : parseInt(data.app_ver);
    var aid = data.aid;
    var platform = data.platform;
    var g_u = 'N'

    if (data.hasOwnProperty('email_id') && aid != false && data.hasOwnProperty("aid")) {

      /* GETTING RANDOM GAMETIPS */
      //   game_tips = await dbfuncobj.get_game_tips(dbobj, CONFIG.GAME_TIPS_COUNT);

      // /* SYNCING PERSONAL INBOX */
      // await inboxobj.sync_msg(aid, dbobj);
      // /*************************/

      var query_parameter = { aid: aid };
      var projection_parameter = { _id: 0, active_device: 1, block_info: 1, app_ver: 1, guest: 1 };

      var get_exist_data = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(projection_parameter).toArray();
      console.log(get_exist_data);
      if (get_exist_data.length > 0) {
        var query_data = get_exist_data[0];
        if (query_data.guest) g_u = 'Y';
        if (query_data.block_info.s == 'A') {
          if (query_data.active_device.id == device_id) {

            /* GET LANDING VALUE FROM GAME DB */
            var query_data = { aid: aid };

            var landing_data = await dbobj.db.collection('app_user_landing_screen').find(query_data).toArray();
            (landing_data.length > 0) ? l_code = landing_data[0].l_type : l_code = 0;

            // CHECK APP VERSION
            if (app_ver != get_exist_data[0].app_ver) {
              console.log("old_app_version", get_exist_data[0].app_ver);
              console.log("new app_version", app_ver);
              await dbobj.db.collection('app_user_accounts').updateOne({ aid: aid }, { $set: { app_ver: app_ver } })
            }
            od_login = 'N';
            msg = CONFIG.MESSAGES.SUCCESS;
          }
          else {
            od_login = 'Y';
            msg = CONFIG.MESSAGES.OTHER_DEVICE;
          }
          response_code = 1;
        }
        else {
          /* IF ACCOUNT BLOCKED */
          response_code = 2;
          msg = CONFIG.MESSAGES.BLOCKED;
        }
      }

      response = {
        status: status,
        msg: msg,
        l_code: l_code,
        g_u: g_u,
        r_bonus: CONFIG.REFERRAL_BONUS,
        od_login: od_login,
        response_code: response_code,
        app_config: app_config,
        game_tips: game_tips,
      }
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
