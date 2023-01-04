let express = require('express');
let router = express.Router();
const CONFIG = require('../../common/inc.config');
const UTILS = require('../../utils/util.functions');

/* MAIN SCRIPT STARTS */
router.post('/', async (req, res) => {
    /* DEFAULT VALUES */
    let response = {};
    let player_details = {};
    let status = "S";
    let app_config = UTILS.get_app_config();
    /* DATABASE REFERENCE */
    const dbconn = require('../../common/inc.dbconn');
    const dbobj = new dbconn();
    /* LOGGER MODULE */
    let loggerobj = require('../../classes/class.logger');
    let winston = new loggerobj(__filename);
    let logger = winston.logger();
    let xp_val = random_number(1,50);

    try {

        /* REQUEST PARAMETERS */
        let data = req.body;
        let aid = data.aid;
        let unit_id = data.unit_id;
        let unit_type = data.unit_type;

        let collection_name = "";
        if(unit_type == 1) collection_name = "app_non_tradable_assets";
        if(unit_type == 2) collection_name = "app_tradable_assets_master";

        let query_parameter = {aid:aid,unit_id:unit_id};
        let char_details = await dbobj.db.collection(collection_name).findOne(query_parameter);

        if(char_details){
        

            response.status = status;
            response.msg = "SUCCESS";
            response.app_config = app_config;
            response.char_details = char_details;

        }





                /* BUILD RESPONSE */
                // response = {
                //     "status": "S",
                //     "msg": "Success",
                //     "app_config": {
                //         "f_u": "N",
                //         "m": "N",
                //         "i_d": "N",
                //         "m_t": 0
                //     },
          
                //         "char_details": {
                //             "gender": 1,
                //             "b_id": "1",
                //             "c_id": "1",
                //             "avatar": "1",
                //             "xp_level": 1,
                //             "c_xp": xp_val,
                //             "t_xp": 500,
                //             "p_p": Math.round((xp_val/500)*100),
                //             "d_xp": xp_val+"/500 XP",
                //             "rarity": "RARE",
                //             "char_name": "sachin_sloth",
                //             "asset_details": {
                //                 gender: 2,
                //                 board: 1,
                //                 top_dress: 3,
                //                 bottom_dress: 1,
                //                 back: 1,
                //                 face: 13,
                //                 glass: 2,
                //                 head: 8,
                //                 hair: 4,
                //                 hand: 1,
                //                 leg: 10,
                //                 claw: 5,
                //                 ornament: 1,
                //             },
                //             "attr": {
                //                 "agility": random_number(1,100),
                //                 "stamina": random_number(1,100),
                //                 "energy": random_number(1,100),
                //                 "durability": random_number(1,100),
                //                 "speed": random_number(1,100),
                //                 "damage": random_number(1,50)
                //             },
                //             "repair_cost": 500,
                //             "animations": [
                //                 1,
                //                 2,
                //                 3
                //             ]
                //         },
        
              
                // }

        /* LOGGER */
        logger.log({ level: 'info',type: 'Response',message: response });
        /* OUTPUT */
        console.log(response,"char_details:::");
        res.send(response);
    }
    catch (err) {
        /* LOGGER */
        logger.log({ level: 'error',message: err });
        /* ERROR OUTPUT */
        res.send(UTILS.error())
    }
    finally {
        //await dbobj.dbclose();
    }
})

module.exports = router;
/* MAIN SCRIPT ENDS */

function random_number(min, max) {
	let number = Math.floor(Math.random() * (max - min + 1)) + min;
	return number;
}