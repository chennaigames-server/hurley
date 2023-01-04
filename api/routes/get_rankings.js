var express = require("express");
var router = express.Router();
const CONFIG = require("../../common/inc.config");
const UTILS = require("../../utils/util.functions");

/* MAIN SCRIPT STARTS */
router.post("/", async (req, res) => {
    /* DEFAULT VALUES */
    var response = {};
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
        let lb_id = data.lb_id;
        let lb_type = data.lb_type;
        let event_id = 0;
        let collection_name = "";
        let lb = {};
        let winners = [];
        let exist_in_top10 = true;
        let type = "";

        if(lb_type) type = lb_type;
        else type = "DAILY";

         


        if (lb_id == 0) event_id = await UTILS.create_event(dbobj,type,1),console.log(event_id,"event_id");
        else event_id = lb_id;

        //   return false
        collection_name = "app_lb_" + event_id + "_event_1";
        console.log(collection_name);
        let event_details = await dbobj.db.collection("app_rank_master").findOne({event_id:event_id});

        lb.n = event_details.event_name;
        lb.i_d = "N";
        lb.e_time = UTILS.get_remaining_seconds(event_details.end_date);
        lb.lb_dur = "";

        if (event_id) {
            let rank_data = await dbobj.db.collection(collection_name).find({}).sort({ score: -1 }).project({ _id: 0, nickname: 1, score: 1, aid: 1 }).limit(10).toArray();
            console.log(rank_data, "rd");
            console.log(aid, "aid");

            for (let i = 0; i < rank_data.length; i++) {
                let winners_obj = {};

                winners_obj.p = i + 1;
                winners_obj.n = rank_data[i].nickname;
                winners_obj.s = rank_data[i].score;
                winners_obj.c_p = "N";
                winners_obj.r = 50;
                if (aid === rank_data[i].aid) {
                    winners_obj.c_p = "Y";
                    exist_in_top10 = false;
                };
                console.log(winners_obj);
                winners[i] = winners_obj;
            }

            if (exist_in_top10 == true) {
                let winners_obj = {};
                let player_score = await dbobj.db.collection(collection_name).find({ aid: aid, score: { $ne: 0 } }).project({ _id: 0, nickname: 1, score: 1, aid: 1 }).limit(1).toArray();
                if (player_score.length > 0) {
                    let pos = await dbobj.db.collection(collection_name).count({ score: { $gte: player_score[0].score } });
                    console.log(pos);
                    winners_obj.p = pos;
                    winners_obj.n = player_score[0].nickname;
                    winners_obj.s = player_score[0].score;
                    winners_obj.c_p = "Y";
                    winners_obj.r = 50;
                }
                winners.push(winners_obj)
            }
            console.log(winners, "winners");

            /* BUILD RESPONSE */
            response.status = status;
            response.msg = "SUCCESS";
            response.app_config = app_config;
            response.lb = lb;
            response.winners = winners;
        }
        else {
            response = UTILS.error();
        }

        /* LOGGER */
        logger.log({ level: "info", type: "Response", message: response });
        // console.log(response);

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