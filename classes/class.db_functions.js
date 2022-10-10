const CONFIG = require('../common/inc.config');
const UTILS = require('../utils/util.functions');

module.exports = class db_functions {
    constructor() {

    }

    async log_marketplace_data(data) {
        /* DATABASE REFERENCE */
        // var dbconn = require('../common/inc.dbconn');
        // var dbobj = new dbconn();
        // await dbobj.db.collection('app_mp_api_logs').insertOne(data);
        // await dbobj.dbclose();
    }

    async get_last_selectedcar(dbobj, gid) {
        //LAST SELECTED CAR ID
        var query_parameter = { gid: gid, last_selected: "Y" };
        var projection_parameter = { _id: 0, unit_id: 1 };
        var last_selected_car = await dbobj.db.collection('app_nft_ownership').find(query_parameter).project(projection_parameter).toArray();
        if (last_selected_car.length > 0) {
            if (last_selected_car[0].unit_id > 17) {
                var collection_name = 'app_nft_master'
                var match_query = {
                    unit_type: 1,
                    unit_id: last_selected_car[0].unit_id,
                }
            } else {
                var collection_name = 'app_non_tradable_assets'
                var match_query = {
                    gid: gid,
                    unit_type: 1,
                    unit_id: last_selected_car[0].unit_id,
                }
            }
            var query_parameter = [
                {
                    $match: match_query
                },
                {
                    $lookup: {
                        from: "app_nameplates",
                        pipeline: [
                            {
                                $match: {
                                    gid: gid,
                                    unit_id: last_selected_car[0].unit_id,
                                    stat: 'A'
                                }
                            },
                        ],
                        as: "nameplate_data",
                    },
                }
            ];
            var nft = await dbobj.db.collection(collection_name).aggregate(query_parameter).toArray();

            if (nft.length > 0) {
                var nameplate_details = {
                    "v": nft[0].nft_details.car_name,
                    "btn_txt": "CHANGE NAME PLATE",
                    "cs": "Y"
                }
                if (nft[0].nameplate_data.length > 0) {
                    nameplate_details = {
                        "v": nft[0].nameplate_data[0].nameplate,
                        "btn_txt": "CHANGE NAME PLATE",
                        "cs": "Y"
                    }
                }

                if (nft[0].unit_id > 0) {
                    var is_unit = 'Y'
                } else {
                    var is_unit = 'N'
                }

                var selected_car = {
                    is_unit: is_unit,
                    car_details: {
                        unit_id: nft[0].unit_id,
                        unit_status: 0,
                        car_name: nft[0].nft_details.car_name,
                        car_cat: nft[0].nft_details.car_cat,
                        car_type: nft[0].nft_details.car_type,
                        b_car_id: nft[0].nft_details.b_car_id,
                        n_plate: nameplate_details,
                        body: nft[0].nft_details.body,
                        rim: nft[0].nft_details.rim,
                        skirt: nft[0].nft_details.skirt,
                        spoil: nft[0].nft_details.spoil,
                        rails: nft[0].nft_details.rails,
                        brake_c: nft[0].nft_details.brake_c,
                        add_l: nft[0].nft_details.add_l,
                        attr: nft[0].nft_details.attr,
                        ai: nft[0].nft_details.ai,
                        xp: nft[0].nft_details.xp,
                        upgr: nft[0].nft_details.upgr,
                        repair: nft[0].nft_details.repair,
                        rarity: nft[0].nft_details.rarity,
                        charge: nft[0].nft_details.charge,
                        upgr_visualization: nft[0].nft_details.upgr_visualization
                    }
                }
            } else {
                selected_car = CONTENT.selected_car
            }
        }
        else {
            selected_car = {};
        }
        return selected_car;
    }

    async get_game_tips(dbobj, num) {
        var query_parameter = [
            {
                $sample:
                {
                    size: num
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 'GAME TIPS',
                    desc: '$tips'
                }
            }
        ];
        var tips = await dbobj.db.collection('app_game_tips').aggregate(query_parameter).toArray();
        return tips;
    }

    async create_referral_code(dbobj) {

        let condition = true;
        while (condition) {
            var r_code = this.generate_referral_code(CONFIG.REFERRAL_CODE_LENGTH);
            var query_parameter = { r_code: r_code };
            var find_r_code = await dbobj.db.collection('app_referral_code_master').find(query_parameter).toArray();
            (find_r_code.length != 0) ? condition = true : condition = false;
        }
        return r_code;
    }

    generate_referral_code(length) {
        const charcters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var r_code = '';
        for (let i = 0; i < length; i++) {
            r_code = r_code + (charcters.charAt(Math.floor(Math.random() * charcters.length)))
        }
        return r_code
    }
}