const CONFIG = require('../common/inc.config');
const jwt = require('jsonwebtoken');
const dbconn = require('../common/inc.dbconn');
const fs = require('fs')
//const classes = require('./redis_file')



function get_app_config() {
    /* APPLICATION CONFIG BUILDER FOR MAINTANANCE MODE AND FORCED UPDATE */
    let converted_time = convert_maintanance_time(CONFIG.MAINTANANCE_TIME);
    let app_config = {
        f_u: CONFIG.FORCED_UPDATE,
        url: "https://play.google.com/store/apps/details?id=com.chennaigames.mrracer",
        m: CONFIG.MAINTANANCE_MODE,
        i_d: converted_time.i_d,
        m_t: converted_time.m_t
    }
    return app_config;
}

function log_file(req, res) {
    fs.appendFile(`request_response.txt`, '\n\nrequest::: ' + req + '\n\n' + 'response:::: ' + res, function (err) {
        if (err) throw err;
        //console.log('logged request response');
    });
}


function convert_maintanance_time(seconds) {
    let m_t = 0;
    let i_d = 'N';
    if (seconds >= 86400) {
        i_d = 'Y';
        m_t = Math.floor(seconds / 86400);
    }
    else {
        m_t = seconds;
    }
    let time_obj = { i_d: i_d, m_t: m_t }
    return time_obj;
}

function error() {
    return { status: 'E', msg: CONFIG.MESSAGES.SERVER_ERROR };
}

async function log_user_source(dbobj, data) {
    /* LOGGING USER SOURCE IF THEY COMES FROM GAME (OR) MARKETPLACE */
    let query_parameter = { email_id: data.email_id };
    var exist = await dbobj.db.collection('app_user_source_temp').find(query_parameter).limit(1).toArray();
    if (exist.length == 0) {
        await dbobj.db.collection('app_user_source_temp').insertOne(data);
    }
    return true;
}

async function get_player_exist_status(dbobj, data) {
    let is_gamedb = false;
    let is_mrdb = false;
    let gamedb_data = [];
    let mrdb_data = [];
    var query_parameter = { email_id: data.email_id };
    var gamedb_projection_parameter = { _id: 0, gid: 1, email_id: 1, active_device: 1, block_info: 1, logout: 1 };
    var exist_in_gamedb = await dbobj.db.collection('app_user_accounts').find(query_parameter).project(gamedb_projection_parameter).limit(1).toArray();
    var exist_in_mrracer = await dbobj.cgdb.collection('app_cg_id_master').find(query_parameter).limit(1).toArray();

    if (exist_in_gamedb.length > 0) {
        is_gamedb = true;
        gamedb_data = exist_in_gamedb[0];
    }

    if (exist_in_mrracer.length > 0) {
        is_mrdb = true;
        mrdb_data = exist_in_mrracer[0];
    }

    let response = { is_gamedb: is_gamedb, is_mrdb: is_mrdb, gamedb_data: gamedb_data, mrdb_data: mrdb_data };
    return response;
}

function generateReferralCode(length) {
    const str_result = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

    var r_code = '';
    for (let i = 0; i < length; i++) {
        r_code = r_code + (str_result.charAt(Math.floor(Math.random() * str_result.length)))
    }
    return r_code
}

async function generate_referral_code(dbobj) {
    let condition = true

    while (condition) {
        var r_code = generateReferralCode(CONFIG.REFERRAL_CODE_LENGTH);
        var find_r_code = await dbobj.db.collection('app_referral_code_master').find({ r_code: r_code }).toArray();
        if (find_r_code.length != 0) {
            condition = true
        } else {
            condition = false
        }
    }
    return r_code;
}

async function get_profile_details(dbobj, data) {

}

function encode_token(data) {
    var jwt = require('jsonwebtoken');
    var token = jwt.sign(data, CONFIG.JWT_SECERET_KEY);
    return token;
}

function get_remaining_seconds(targettime) {
    var countDownDate = new Date(targettime).getTime();
    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var maintenance_time = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;

    if (maintenance_time < 0 || maintenance_time == null || isNaN(maintenance_time)) {
        maintenance_time = 0;
    }

    return maintenance_time;
}

function format_inbox_date(value) {
    var date = new Date(value).getDate();
    if (date < 10) {
        date = '0' + date;
    }
    var month = new Date(value).getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var year = new Date(value).getFullYear();
    var hour = new Date(value).getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var Minutes = new Date(value).getMinutes();
    if (Minutes < 10) {
        Minutes = '0' + Minutes;
    }
    var format_date = (date) + '-' + month + '-' + year;
    var time = hour + ":" + Minutes;
    return { format_date, time }
}

async function map_data(dbobj, CAN_ENABLE_REDIS, c_date, race_id) {
    try {
        if (CAN_ENABLE_REDIS == "Y") {
            // console.log("first iffff");
            let map_count = await dbobj.db.collection("map_data").count({});
            // console.log(map_count, "mapcount.....");
            let data = await classes.modules.redis_get();
            // console.log(data, "data value");
            if (data && data < map_count) {
                //console.log("first if iffff");
                let Int_data = parseInt(data);
                // console.log(Int_data, "intdata");
                classes.modules.redis_set(Int_data + 1);
                let res = await dbobj.db.collection("map_data").findOne({ map_id: Int_data + 1 })
                // console.log(res);
                let return_json = {
                    map_id: res.map_id,
                    crd_on: c_date,
                    race_id: race_id
                }
                await dbobj.db.collection("map_data_record").insertOne(return_json);
                return res;
            }
            else {
                // console.log("first if elseee");
                // console.log("goingggg");
                let res = await dbobj.db.collection("map_data_record").find().sort({ map_id: -1 }).limit(1).toArray();
                // console.log("res[0]", res[0]);

                if (res.length > 0 && res[0].map_id < map_count) {
                    // console.log("iffff");
                    //callback(res[0]);
                    // console.log(res[0].map_id, "res[0]");
                    classes.modules.redis_set(res[0].map_id + 1);
                    let result = await dbobj.db.collection("map_data").findOne({ map_id: res[0].map_id + 1 })

                    let return_json = {
                        map_id: result.map_id,
                        crd_on: c_date,
                        race_id: race_id
                    }
                    await dbobj.db.collection("map_data_record").insertOne(return_json);
                    return result;
                }

                else {
                    //console.log("elseee");
                    let res = await dbobj.db.collection("map_data").findOne({ map_id: 1 });
                    classes.modules.redis_set(res.map_id);
                    let return_json = {
                        map_id: res.map_id,
                        crd_on: c_date,
                        race_id: race_id
                    }
                    await dbobj.db.collection("map_data_record").insertOne(return_json);
                    return res;
                }

            }
        }
        else {
            //console.log("first elseeeeee");
            let map_count = await dbobj.db.collection("map_data").count({});
            // console.log(map_count, "map_count");
            let res = await dbobj.db.collection("map_data_record").find().sort({ crd_on: -1 }).limit(1).toArray();
            // console.log(res[0].map_id, "mapid.....");
            if (res.length > 0 && res[0].map_id < map_count) {
                // console.log("iffffff");
                let result = await dbobj.db.collection("map_data").findOne({ map_id: res[0].map_id + 1 })
                var return_json = {
                    map_id: result.map_id,
                    race_id: race_id,
                    crd_on: c_date
                }
                await dbobj.db.collection("map_data_record").insertOne(return_json);
                return result;
            } else {
                //console.log("elseeeeee");
                let res = await dbobj.db.collection("map_data").findOne({ map_id: 1 });
                //classes.modules.redis_set(res.map_id + 1);
                let return_json = {
                    map_id: res.map_id,
                    crd_on: c_date,
                    race_id: race_id
                }
                await dbobj.db.collection("map_data_record").insertOne(return_json);
                //console.log(res);
                return res
            }
        }
    }
    catch (err) {
        //if (err) throw err;
    } finally {
        //dbobj.db_close();
    }
}

/* OTP MAILER */
async function send_otp(mail_id, OTP) {
    const nodemailer = require('nodemailer');

    let trannsporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chennais.game@gmail.com',
            pass: 'ilagsxlmijnzqfml'
        }

    })

    let mailOptions = {
        from: 'RADDX TEAM<chennais.game@gmail.com',
        to: mail_id,
        subject: 'RADDX OTP',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto;width:70%;padding:20px 0"><div style="border-bottom:1px solid #eee"><a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600"><h1>RADDX</h1></a></div><p style="font-size:1.1em">Hi,</p><p>Welcome to <b>RADDX METAVERSE GAMING</b>. Use the following OTP to complete your Registration. OTP is valid for 30 Seconds</p><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2> <p style="font-size:0.9em;">Regards,<br />Your Brand</p><hr style="border:none;border-top:1px solid #eee" /><div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300"> <p>RADDX GAME</p> <p>PRESTIGE POLYGON</p><p>CHENNAI</p></div> </div></div>`,
        //text:'click below www.google.com',
        //text:''

    }

    trannsporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Mail sent to " + mailOptions.to)
        }
    })
}
function car_animation(car_level, ug_color_code, rim_color_code, body_led) {
    let ug_id = 0
    let t_id = 0
    let rim_id = 0
    let led_id = 0

    if (car_level > 5 && car_level <= 10) {
        ug_id = 1
    } else if (car_level > 10 && car_level <= 15) {
        ug_id = 2
    }
    else if (car_level > 15) {
        ug_id = 2
        rim_id = 1
        if (car_level > 20) {
            t_id = 1
        }
        if (car_level > 25) {
            led_id = 1
        }
    }
    var anime_obj = {
        "ug": {
            "id": ug_id,
            "color": "C1ED30"
        },
        "trails": t_id,
        "rim_lights": {
            "id": rim_id,
            "color": "0FD7F8"
        },
        "led": {
            "id": led_id,
            "color": "65ff00"
        }
    }
    console.log('anime_obj', anime_obj);
    return anime_obj;
}

function generate_otp() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

function generate_gid(length) {
    const str_result = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890zxcvbnmasdfghjklqwertyuiop';
    var gid = '';
    for (let i = 0; i < length; i++) {
        gid = gid + (str_result.charAt(Math.floor(Math.random() * str_result.length)))
    }
    return gid
}

async function create_gid(dbobj) {
    let condition = true
    while (condition) {
        var gid = generate_gid(16);
        var find_gid = await dbobj.db.collection('app_user_accounts').find({ gid: gid }).toArray();
        if (find_gid.length != 0) {
            condition = true
        } else {
            condition = false
        }
    }
    return gid;
}

async function get_remaining_hours(date_value) {
    var countDownDate = new Date(date_value);
    var now = new Date();
    var res = Math.abs(now - countDownDate) / 1000
    var hours = Math.floor(res / 3600)
    return hours
}
async function transaction_log(is_log, dbobj) {
    console.log(is_log); //  Y/N
    if (is_log === 'Y') {
        let insert = {}
        for (let i = 2; i < arguments.length; i++) {
            var a = Object.assign(insert, arguments[i])
        }
        var insert_db = await dbobj.db.collection('transaction_log').insertOne(insert)
        console.log(insert_db);
    }
}

module.exports = {
    get_remaining_seconds,
    get_app_config,
    error,
    log_user_source,
    get_player_exist_status,
    generateReferralCode,
    generate_referral_code,
    encode_token,
    get_profile_details,
    log_file,
    format_inbox_date,
    map_data,
    create_gid,
    generate_otp,
    send_otp,
    get_remaining_hours,
    convert_maintanance_time,
    car_animation,
    transaction_log
}