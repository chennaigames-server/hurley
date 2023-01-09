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

function check_swear_word(word) {
    var response = false;
    var arr = ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "Fuck", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "qweir", "recktum", "rectum", "retard", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]
    var result = arr.filter(element => element.includes((word.toLowerCase())));

    if (result.length > 0) {
        response = true;
    }

    return response;
}

function log_file(req, res) {
    fs.appendFile(`request_response.txt`, '\n\nrequest::: ' + req + '\n\n' + 'response:::: ' + res, function (err) {
        if (err) throw err;
        //console.log('logged request response');
    });
}
function CURRENT_DATE(date) {
    //return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    return date
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

function generate_aid(length) {
    const str_result = 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890zxcvbnmasdfghjklqwertyuiop';
    var gid = '';
    for (let i = 0; i < length; i++) {
        gid = gid + (str_result.charAt(Math.floor(Math.random() * str_result.length)))
    }
    return gid
}

async function create_aid(dbobj) {
    console.log("logging:::::");
    let condition = true
    while (condition) {
        var gid = generate_aid(16);
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

async function create_event(dbobj, event_type, mode) {
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

    }
    else if (event_type === 'DAILY') {
        /* CREATING CURRENT DATE OBJECT */
        let start = new Date();
        let end = new Date();

        /* SET HOURS TO START AND END LIMIT */
        start.setUTCHours(0, 0, 0, 0);
        end.setUTCHours(23, 59, 59, 999);


        query_parameter = { start_date: start, end_date: end };
    }
    else if (event_type === 'WEEKLY') {
        /* CREATING CURRENT DATE OBJECT */
        let start = new Date();
        let end = new Date();

        /* SET HOURS TO START AND END LIMIT */
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        query_parameter = { start_date: start_of_week(start), end_date: end_of_week(end) };
    }
    else {
        return 'Invalid Event Type';
    }
    query_parameter.mode = mode;

    console.log(query_parameter);
    let get_exist_event = await dbobj.db.collection('app_rank_master').find(query_parameter).limit(1).toArray();
    console.log(get_exist_event, "get_exist_event");
    // return false

    if (get_exist_event.length > 0) {
        event_id = get_exist_event[0].event_id;
        /* EVENT ALREADY EXIST FOR DURATION */
    }
    else {

        /* EVENT DOESN'T EXIST NEED TO CREATE ONE */
        event_id = 1;
        /* GET LAST EVENT ID FROM DB COLLECTION */

        let get_last_event = await dbobj.db.collection('app_rank_master').find({ mode: mode }).sort({ _id: -1 }).limit(1).toArray();

        (get_last_event.length > 0) ? event_id = get_last_event[0].event_id + 1 : event_id = event_id;

        let insert_data = {
            event_id: event_id,
            group_id: event_type,
            mode: mode,
            event_name: format_date(query_parameter.start_date, event_type),
            start_date: query_parameter.start_date,
            end_date: query_parameter.end_date,
            crd_on: new Date(),
            stat: 'A'
        };

        /* INSERTING NEW EVENT DATA */
        await dbobj.db.collection('app_rank_master').insertOne(insert_data);
        console.log(insert_data);
    }
    console.log(event_id);
    return event_id;
}


function format_date(date, event_type) {
    let formated_string = 'CURRENT EVENT';
    if (event_type == 'DAILY') {
        let month_name = date.toLocaleString('default', { month: 'long' });  // Get Month full Name..
        let day = String(date.getUTCDate()).padStart(2, "0");   // Date Starts with 0
        formated_string = month_name + "-" + day + "-" + (date.getUTCFullYear());
    }
    else if (event_type === 'HOURLY') {
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        formated_string = (date.getUTCDate()) + "-" + (date.getMonth() + 1) + "-" + (date.getUTCFullYear()) + ' ' + hours + ':' + minutes + '' + ampm;
    }
    return formated_string;
}

function start_of_week(date) {
    let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function end_of_week(date) {
    let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 7);
    return new Date(date.setDate(diff));

}

function gameid_generate(num) {
    let arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numtostr = num.toString().split(''), final_str = "";
    numtostr.forEach(data => { final_str += arr[parseInt(data)] });
    return final_str;
}

async function coin_transaction_log(aid, reason, coins, type, dbobj) {
    let insert_data = {
        aid: aid,
        reason: reason,
        coin: coins,
        type: type,
        crd_on: new Date(),
        stat: 'A'
    }

    var find_query = { aid: aid }
    var project_query = { coin_balance: 1, _id: 0 }
    var coin_balance = await dbobj.db.collection('app_coins').find(find_query).project(project_query).toArray();
    if (coin_balance.length > 0) {
        insert_data.current_coin_balance = coin_balance[0].coin_balance;
    }
    await dbobj.db.collection('app_coins_transaction_log').insertOne(insert_data);
}

async function reward_coins(aid, inc_coins, dbobj) {
    let query = { aid: aid };
    let update = { $inc: { coin_balance: inc_coins } }
    await dbobj.db.collection("app_coins").updateOne(query, update);
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
    create_aid,
    generate_otp,
    send_otp,
    get_remaining_hours,
    convert_maintanance_time,
    car_animation,
    transaction_log,
    CURRENT_DATE,
    check_swear_word,
    create_event,
    gameid_generate,
    coin_transaction_log,
    reward_coins
}