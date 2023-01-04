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
//   const dbconn = require('../../common/inc.dbconn');
//   const dbobj = new dbconn();
  /* LOGGER MODULE */
  var loggerobj = require("../../classes/class.logger");
  let winston = new loggerobj(__filename);
  let logger = winston.logger();

  try {
    /* REQUEST PARAMETERS */
    var data = req.body;
    let aid = data.aid;
    let email_id = data.email_id;


      /* BUILD RESPONSE */
      response = {
        "status": "S",
        "app_config": {
          "f_u": "N",
          "m": "N",
          "i_d": "N",
          "m_t": 0
        },
        "lb": {
          "n": "Event 1",
          "i_d": "N",
          "e_time": 2563,
          "lb_dur": ""
        },
        "winners": [
          {
            "p": 1,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 2,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 3,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 4,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 5,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 6,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 7,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 8,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 9,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 10,
            "n": "Liam",
            "s": "15000",
            "c_p": "N",
            "r": 50
          },
          {
            "p": 100,
            "n": "Liam",
            "s": "15000",
            "c_p": "Y",
            "r": 50
          }
        ]
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