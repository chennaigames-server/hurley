const { response } = require('express');

module.exports = class leaderboard {
    constructor() {

    }

    async get_event_details(dbobj, event_type, event_id, mode) {
        var response = {};
        var query_parameter = {};
        if (event_type === 'COMPETITIVE') {
            var start = new Date();
            start.setUTCHours(0, 0, 0, 0);


            if (event_id == 0) {
                var query_parameter = { start_date: { $lte: start }, mode: mode };
            }
            else {
                var query_parameter = { event_id: event_id, stat: 'A', mode: mode };
            }

            var projection_parameter = { _id: 0, event_id: 1, start_date: 1, end_date: 1, event_name: 1, sponsors: 1 };
            var current_event = await dbobj.db.collection('app_lb_master').find(query_parameter).limit(1).project(projection_parameter).sort({ start_date: -1 }).toArray();
            //console.log(current_event);
            if (current_event.length > 0) {
                response = current_event[0];
            }
        }
        else if (event_type === 'TOURNAMENT') {

            if (event_id == 0) {
                var query_parameter = { start_date: { $lte: new Date() }, stat: 'A', race_mode: mode };
            }
            else {
                var query_parameter = { event_id: event_id, stat: 'A', race_mode: mode };
            }


            var projection_parameter = { _id: 0, event_id: 1, start_date: 1, end_date: 1, event_name: '$title', sponsors: 1, tour_img: 1, bg_img: 1, prize: 1, max_participants: 1 };
            console.log(query_parameter);
            var sorting_parameter = { start_time: -1 };
            var current_event = await dbobj.db.collection('app_tournaments').find(query_parameter).project(projection_parameter).sort(sorting_parameter).limit(1).toArray();
            if (current_event.length > 0) {
                response = current_event[0];
            }
        }
        // if (event_id == 0) {
        //     if (event_type === 'HOURLY') {

        //     }
        //     else if (event_type === 'DAILY') {
        //         let start = new Date();
        //         start.setUTCHours(0, 0, 0, 0);
        //         query_parameter = { start_date: start, mode: mode };

        //     }
        //     else if (event_type === 'WEEKLY') {

        //     }
        //     else if (event_type === 'MEGARACE') {
        //         let start = new Date();
        //         start.setUTCHours(10, 30, 0, 0);
        //         //start.setUTCHours(0, 0, 0, 0);
        //         query_parameter = { start_date: start, mode: mode };

        //     }
        // }
        // else {
        //     query_parameter = { event_id: event_id, mode: mode };
        // }

        // //console.log(query_parameter);

        // /* GETTING EVENT DETAILS FROM DB COLLECTION */
        // let projection_parameter = { _id: 0, event_id: 1, start_date: 1, end_date: 1, event_name: 1, sponsors: 1 };
        // var current_event = await dbobj.db.collection('app_lb_master').find(query_parameter).project(projection_parameter).toArray();
        // //console.log(current_event.length);
        // if (current_event.length > 0) {
        //     response = current_event[0];
        // }
        //console.log(response);
        return response;
    }

    async check_is_nft_owned(dbobj, gid) {
        var response = 'N';
        var get_data = await dbobj.db.collection('app_nft_ownership').find({ gid: gid, nft_id: { $ne: 0 }, status: 'A' }).limit(1).toArray();
        if (get_data.length > 0) {
            response = 'Y';
        }
        return response;
    }

    async get_top_ten_from_db() {

    }

    async get_top_ten_from_redis() {

    }

    async create_event(dbobj, event_type) {
        let query_parameter = {};
        let event_id = 1;
        if (event_type === 'HOURLY') {
            /* CREATING CURRENT DATE OBJECT */
            let start = new Date();
            let end = new Date();

            /* SET HOURS TO START AND END LIMIT */
            start.setUTCMinutes(0, 0, 0);
            end.setUTCMinutes(59, 59, 999);

            /* GETTING EVENT VALUE BY START HOUR AND END HOUR */
            query_parameter = { start_date: start, end_date: end };
            console.log(query_parameter);

        }
        else if (event_type === 'DAILY') {
            /* CREATING CURRENT DATE OBJECT */
            let start = new Date();
            let end = new Date();

            /* SET HOURS TO START AND END LIMIT */
            start.setUTCHours(0, 0, 0, 0);
            end.setUTCHours(23, 59, 59, 999);


            query_parameter = { start_date: start, end_date: end };
            console.log(query_parameter);
        }
        else if (event_type === 'WEEKLY') {
            /* CREATING CURRENT DATE OBJECT */
            var start = new Date();
            var end = new Date();

            /* SET HOURS TO START AND END LIMIT */
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            query_parameter = { start_date: this.start_of_week(start), end_date: this.end_of_week(end) };
            console.log(query_parameter);
        }
        else {
            return 'Invalid Event Type';
        }

        var get_exist_event = await dbobj.db.collection('app_lb_master').find(query_parameter).limit(1).toArray();

        if (get_exist_event.length > 0) {
            /* EVENT ALREADY EXIST FOR THIS DURATION */
        }
        else {

            /* EVENT DOESN'T EXIST NEED TO CREATE ONE */
            let event_id = 1;
            /* GET LAST EVENT ID FROM DB COLLECTION */
            var get_last_event = await dbobj.db.collection('app_lb_master').find().sort({ _id: -1 }).limit(1).toArray();
            (get_last_event.length > 0) ? event_id = get_last_event[0].event_id + 1 : event_id = event_id;

            let insert_data = {
                event_id: event_id,
                group_id: event_type,
                event_name: this.format_date(query_parameter.start_date, event_type) + ' UTC',
                start_date: query_parameter.start_date,
                end_date: query_parameter.end_date,
                crd_on: new Date(),
                stat: 'A'
            };

            ///console.log(insert_data);

            /* INSERTING NEW EVENT DATA */
            await dbobj.db.collection('app_lb_master').insertOne(insert_data);
        }
        return event_id;
    }

    format_date(date, event_type) {

        var formated_string = 'CURRENT EVENT';
        if (event_type == 'DAILY') {
            formated_string = (date.getUTCDate()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCFullYear());
        }
        else if (event_type === 'HOURLY') {
            var hours = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            formated_string = (date.getUTCDate()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCFullYear()) + ' ' + hours + ':' + minutes + '' + ampm;
            console.log('DATA :::' + formated_string);
        }
        return formated_string;
    }

    start_of_week(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

        return new Date(date.setDate(diff));

    }

    end_of_week(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 7);

        return new Date(date.setDate(diff));

    }


    async save_race_results(race_result) {
        /* PARSING RACE RESULT JSON */
        // var resultdata = JSON.parse(race_result);
        let dbconn = require('../common/inc.dbconn');
        let dbobj = new dbconn();
        try {
            let resultdata = race_result;
            // let db = await (await dbobj.connection).db(CONFIG.DB_NAME);
            let event_id = parseInt(resultdata.event_id);
            let score_set = resultdata.result;
            /* COLLECTION NAMES */
            let lb_cons_table = 'app_lb_event_' + event_id;
            let lb_log_table = 'app_lb_log_event_' + event_id;

            /* SUBMITING SCORES TO RESPECTIVE COLLECTION */
            let find_query_pot = { pot_id: parseInt(resultdata.pot_id) };
            let project_query = { _id: 0, pot_value: 1 };
            let pot_value = await dbobj.db.collection('app_pot_entries').find(find_query_pot).project(project_query).toArray();
            console.log("pot vlaue", pot_value);
            let total_pot_amount = pot_value[0].pot_value * score_set.length

            for (let index = 0; index < score_set.length; index++) {
                /* USER PARAMETERS */
                let gid = score_set[index].gid;
                let score = score_set[index].score;
                let drift = score_set[index].drift;
                let turner = score_set[index].turner;
                let racer = score_set[index].racer;
                let position = score_set[index].position


                let queryparameter = { gid: gid };
                let projectionparameter = { _id: 0 };
                let find_exist_data = await dbobj.db.collection(lb_cons_table).find(queryparameter).project(projectionparameter).limit(1).toArray();

                if (find_exist_data.length > 0) {
                    /* UPDATE SCORE DATA */
                    let myquery = { gid: gid };
                    let newvalues = { $inc: { score: score, drift: drift, turner: turner, racer: racer } };
                    await dbobj.db.collection(lb_cons_table).updateOne(myquery, newvalues);
                }
                else {
                    /* INSERT SCORE DATA */
                    let insert_score_data = {
                        gid: gid,
                        score: score,
                        drift: drift,
                        turner: turner,
                        racer: racer,
                        crd_on: new Date()
                    };
                    await dbobj.db.collection(lb_cons_table).insertOne(insert_score_data);
                }

                // REWARD UT
                let price_amount = 0;

                if (position == 1) {
                    price_amount = total_pot_amount / 100 * 50;
                }
                else if (position == 2) {
                    price_amount = total_pot_amount / 100 * 25
                }
                else if (position == 3) {
                    price_amount = total_pot_amount / 100 * 11
                }
                await this.reward_ut(price_amount, score_set[index].gid, dbobj)


                // TOTAL RACES PLAYED NFT CARS
                if (score_set[index].race_completion == 1) {
                    let nft_id_find_query = { nft_id: score_set[index].nft_id }
                    let nft_id_inc_query = { $inc: { races_held: 1 } }
                    await dbobj.db.collection('app_nft_master').updateOne(nft_id_find_query, nft_id_inc_query)
                    // console.log(nft_id_find_query);
                }


                // UPDATE PROFILE STATS 
                let find_query = { gid: gid }
                let user_profile_project_query = { _id: 0, details: 1, stats: 1, c_league: 1, t_p: 1 }
                let user_profile = await dbobj.db.collection('app_user_profile_details').find(find_query).project(user_profile_project_query).toArray();
                //console.log("Profile details::::", user_profile);
                if (user_profile.length > 0) {
                    let current_xp = user_profile[0].details.c_xp + score_set[index].earned_xp;
                    let user_level_find_query = { max_xp: { $gt: current_xp } }
                    let user_level = await dbobj.db.collection('app_xp_levels').find(user_level_find_query).sort({ _id: 1 }).limit(1).toArray()



                    let first_won = 0;
                    if (position == 1) {
                        first_won = user_profile[0].stats.w + 1
                    } else {
                        first_won = user_profile[0].stats.w
                    }
                    let wins = user_profile[0].stats.w
                    let total_played = 1;
                    if (user_profile[0].t_p) {
                        total_played = user_profile[0].t_p + 1
                    }

                    let win_ratio = ((100 * wins) / total_played);
                    let current_league_find_query = { max_rr: { $gt: 8000 } }
                    let current_league = await dbobj.db.collection('app_leagues').find(current_league_find_query).sort({ _id: 1 }).limit(1).toArray();
                    //console.log(current_league);
                    let c_l = current_league[0].league

                    let update_query = {
                        $set: {
                            'stats.w': first_won,
                            'stats.r': Math.round(win_ratio),
                            'details.c_xp': current_xp,
                            'c_league.rr': user_profile[0].c_league.rr + score_set[index].earned_rr,
                            'c_league.c_l': c_l,
                            'details.xp_level': user_level[0].level,
                            'details.t_xp': user_level[0].max_xp,
                            'details.p_p': Math.round((100 * current_xp) / user_level[0].max_xp),
                            'details.d_xp': `${current_xp}/${user_level[0].max_xp} XP`,
                            't_p': total_played
                        }
                    }
                    let update = await dbobj.db.collection('app_user_profile_details').updateOne(find_query, update_query)
                }
                else {
                    console.log("error");
                }
            }

            /* INSERTING LOG TABLE DATA */
            await dbobj.db.collection(lb_log_table).insertMany(score_set);

            /* INSERTING FULL RACE LOG DATA */
            await dbobj.db.collection('app_race_result_log').insertOne(resultdata);

            /* UPDATING TOP 10 WINNERS */

            let leaderboards = ['score', 'drift', 'turner', 'racer'];
            let winners = {};
            for (let lb_ind = 0; lb_ind < leaderboards.length; lb_ind++) {

                let sort = leaderboards[lb_ind];
                let query_parameter = {}
                let projection_parameter = { _id: 0, crd_on: 0 };
                let sorting_parameter = {}; /* For DESC */
                sorting_parameter[leaderboards[lb_ind]] = -1;
                let limit = 10;

                let sorted_result = await dbobj.db.collection(lb_cons_table).find(query_parameter).project(projection_parameter).sort(sorting_parameter).limit(limit).toArray();
                //console.log(sorted_result);
                if (sorted_result.length > 0) {

                    winners[leaderboards[lb_ind]] = new Array();
                    for (let sorted_ind = 0; sorted_ind < sorted_result.length; sorted_ind++) {
                        //if(sorted_result[sorted_ind].)
                        var score = 0;
                        if (leaderboards[lb_ind] == 'score') {
                            score = sorted_result[sorted_ind].score;
                        }
                        else if (leaderboards[lb_ind] == 'drift') {
                            score = sorted_result[sorted_ind].drift;
                        }
                        else if (leaderboards[lb_ind] == 'turner') {
                            score = sorted_result[sorted_ind].turner;
                        }
                        else if (leaderboards[lb_ind] == 'racer') {
                            score = sorted_result[sorted_ind].racer;
                        }


                        var profile_obj = {};
                        let query_parameter = { gid: sorted_result[sorted_ind].gid };
                        let projection_parameter = { _id: 0 };
                        let get_displayname = await dbobj.db.collection('app_user_profile_details').find(query_parameter).project(projection_parameter).limit(1).toArray();
                        //console.log(get_displayname);
                        if (get_displayname.length > 0) {
                            profile_obj.gid = sorted_result[sorted_ind].gid;
                            profile_obj.p = sorted_ind + 1;
                            profile_obj.n = get_displayname[0].details.nickname;
                            profile_obj.l = get_displayname[0].c_league.c_l;
                            profile_obj.o_u = 'Y';
                            profile_obj.s = score;
                            profile_obj.w = get_displayname[0].stats.w;
                        }
                        winners[leaderboards[lb_ind]].push(profile_obj);
                    }
                }
            }

            let toppers_obj = {};

            toppers_obj['event_id'] = event_id;

            toppers_obj['winners'] = winners;

            toppers_obj['stat'] = 'A';
            /* UPDATING THE WINNERS OBJECT */
            let winners_collection = 'app_lb_winners';
            let queryparameter = { stat: 'A', event_id: event_id };
            let projectionparameter = { _id: 0 };

            let find_exist_winners = await dbobj.db.collection(winners_collection).find(queryparameter).project(projectionparameter).limit(1).toArray();

            if (find_exist_winners.length > 0) {
                /* UPDATE WINNERS */
                let myquery = { stat: 'A', event_id: event_id };
                let newvalues = { $set: { winners: winners } };

                let update = await dbobj.db.collection(winners_collection).updateOne(myquery, newvalues);
                //console.log(update);
            }
            else {
                /* INSERT WINNERS */
                await dbobj.db.collection(winners_collection).insertOne(toppers_obj);
            }
            return true;
        }
        catch (err) {
            console.log(err);
        }
        finally {
            // dbobj.db_close();
        }
    }









    async reward_ut(ut_value, gid, dbobj) {

        let find_query = { gid: gid }
        let increment_query = { $inc: { ut_balance: ut_value } }
        let user = await dbobj.db.collection('app_ut').find(find_query).toArray()
        //console.log(user);

        if (user.length == 0) {
            let user_ut_data = {
                gid: gid,
                ut_balance: ut_value
            }
            await dbobj.db.collection('app_ut').insertOne(user_ut_data)
        } else {
            await dbobj.db.collection('app_ut').updateOne(find_query, increment_query)
        }
    }

    async get_top10(event_id, lb_type, lb_mode, dbobj) {
        var leaderboard_cons_table = 'app_lb_' + lb_mode + '_event_' + event_id;
        var query_parameter = {};
        query_parameter[lb_type] = { $ne: 0 };

        var limit_parameter = 10;

        var projection_parameter = { _id: 0 };
        projection_parameter.score = '$' + lb_type;
        projection_parameter.league = 1;
        projection_parameter.nickname = 1;
        projection_parameter.owned_unit = 1;
        projection_parameter.wins = 1;
        projection_parameter.gid = 1;
        //projection_parameter.crd_on = 1;

        let sorting_parameter = {}; /* For DESC */
        sorting_parameter[lb_type] = -1;
        sorting_parameter.crd_on = 1;

        var top_10_winners = await dbobj.db.collection(leaderboard_cons_table).find(query_parameter).project(projection_parameter).sort(sorting_parameter).limit(limit_parameter).toArray();
        //console.log(top_10_winners);
        return top_10_winners;
    }

}