const CONFIG = require('../common/inc.config');
const jwt = require('jsonwebtoken');
const dbconn = require('../common/inc.dbconn');

const fs = require('fs')
const nodemailer = require('nodemailer');
const { default: dist } = require('@redis/search');
//const classes = require('./redis_file')



function get_app_config() {
    /* APPLICATION CONFIG BUILDER FOR MAINTANANCE MODE AND FORCED UPDATE */


    let converted_time = convert_maintanance_time(CONFIG.MAINTANANCE_TIME);
    let app_config = {
        f_u: CONFIG.FORCED_UPDATE,
        url: CONFIG.FORCED_UPDATE_URL,
        // url: "https://play.google.com/store/apps/details?id=com.chennaigames.mrracer",
        //url: 'https://chennaigamespvtltd-my.sharepoint.com/:u:/r/personal/hari_chennaigames_com/Documents/Details/RaddX/Builds/Android/Dev/Build_7/Raddx_P_0.1.10_10_31-10-2022.apk?csf=1&web=1&e=2tdhmf',
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
function CURRENT_DATE(date) {
    //return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    return date
}

function convert_maintanance_time(maintenance_time) {

    let seconds = get_remaining_seconds(maintenance_time);

    let m_t = 0;
    let i_d = 'N';
    if (seconds >= 86400) {
        i_d = 'Y';
        m_t = Math.ceil(seconds / 86400);
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
    var countDownDate = (new Date(targettime)).getTime();
    console.log("countDownDate", countDownDate);
    // Get today's date and time
    var now = (new Date()).getTime();
    console.log("now", now);
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    console.log("distance", distance);
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
    var date = (new Date(value)).getDate();
    if (date < 10) {
        date = '0' + date;
    }
    var month = (new Date(value)).getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var year = (new Date(value)).getFullYear();
    var hour = (new Date(value)).getHours();
    if (hour < 10) {
        hour = '0' + hour;
    }
    var Minutes = (new Date(value)).getMinutes();
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

function send_otp(email_data) {
    /**
     * email_data:{
     *  email_id:'xyz@gmail.com'
     *  otp: 12345,
     *  type: "Register or Login"
     * }
     */


    var transporter = nodemailer.createTransport({
        host: "email-smtp.ap-south-1.amazonaws.com",
        auth: {
            user: "AKIATDYJ22YDM4JKTNGA",
            pass: "BAxmccbhf6kakLhh6PRkJ9ZvSBvcGo2d+Xp8uG/BRrc3",
        },
    });

    var mailOptions = {
        from: {
            name: 'RADDX',
            address: 'info@raddxmeta.com'//'id@chennaigames.com'
        },
        to: email_data['email_id'],
        headers: { "X-SES-CONFIGURATION-SET": "raddx_otp" },
        subject: 'Your OTP for RADDX - Racing Metaverse Game - ' + email_data['otp'],
        html: '<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="format-detection" content="telephone=no"><meta name="format-detection" content="date=no"><meta name="format-detection" content="address=no"><meta name="format-detection" content="email=no"><meta name="color-scheme" content="only"><title>RADDX ACCOUNT VERIFICATION</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"><style type="text/css">body{margin:0!important;padding:0!important;display:block!important;min-width:100%!important;width:100%!important;-webkit-text-size-adjust:none}table{border-spacing:0;mso-table-lspace:0;mso-table-rspace:0}table td{border-collapse:collapse;mso-line-height-rule:exactly}td img{-ms-interpolation-mode:bicubic;max-width:auto;height:auto;margin:auto;display:block!important;border:0}td p{margin:0;padding:0}td div{margin:0;padding:0}td a{text-decoration:none;color:inherit}.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:inherit}.ReadMsgBody{width:100%;background-color:#fff}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}u+#body a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}.undoreset a,.undoreset a:hover{text-decoration:none!important}.yshortcuts a{border-bottom:none!important}.ios-footer a{color:#aaa!important;text-decoration:none}@media only screen and (max-width:799px) and (min-width:601px){.outer-table.row{width:640px!important;max-width:640px!important}.inner-table.row{width:580px!important;max-width:580px!important}}@media only screen and (max-width:600px) and (min-width:320px){table.row{width:100%!important;max-width:100%!important}td.row{width:100%!important;max-width:100%!important}.img-responsive img{width:100%!important;max-width:100%!important;height:auto!important;margin:auto}.center-float{float:none!important;margin:auto!important}.center-text{text-align:center!important}.container-padding{width:100%!important;padding-left:15px!important;padding-right:15px!important}.container-padding10{width:100%!important;padding-left:10px!important;padding-right:10px!important}.hide-mobile{display:none!important}.menu-container{text-align:center!important}.autoheight{height:auto!important}.radius6{border-radius:6px!important}.fade-white{background-color:rgba(255,255,255,.8)!important}.rwd-on-mobile{display:inline-block!important;padding:5px!important}.center-on-mobile{text-align:center!important}.rwd-col{width:100%!important;max-width:100%!important;display:inline-block!important}.type48{font-size:35px!important;line-height:58px!important}}</style><style type="text/css" class="export-delete">.composer--mobile table.row{width:100%!important;max-width:100%!important}.composer--mobile td.row{width:100%!important;max-width:100%!important}.composer--mobile .img-responsive img{width:100%!important;max-width:100%!important;height:auto!important;margin:auto}.composer--mobile .center-float{float:none!important;margin:auto!important}.composer--mobile .center-text{text-align:center!important}.composer--mobile .container-padding{width:100%!important;padding-left:15px!important;padding-right:15px!important}.composer--mobile .container-padding10{width:100%!important;padding-left:10px!important;padding-right:10px!important}.composer--mobile .hide-mobile{display:none!important}.composer--mobile .menu-container{text-align:center!important}.composer--mobile .autoheight{height:auto!important}.composer--mobile .radius6{border-radius:6px!important}.composer--mobile .fade-white{background-color:rgba(255,255,255,.8)!important}.composer--mobile .rwd-on-mobile{display:inline-block!important;padding:5px!important}.composer--mobile .center-on-mobile{text-align:center!important}.composer--mobile .rwd-col{width:100%!important;max-width:100%!important;display:inline-block!important}.composer--mobile .type48{font-size:48px!important;line-height:58px!important}</style></head><body data-bgcolor="Body" style="margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#000;" bgcolor="#000000"><span class="preheader-text" data-preheader-text style="color:transparent;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;width:0;display:none;mso-hide:all"></span><div data-primary-font="Roboto Slab" data-secondary-font="Roboto" style="display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all"></div><table border="0" align="center" cellpadding="0" cellspacing="0" width="100%" style="width:100%;max-width:100%"><tr><tr data-element="black-header-image" data-label="Image" id="banner"><td align="center" class="img-responsive"><img class="auto-width" style="display:block;max-width:100%;border:0" data-image-edit data-url data-label="Image" width="580" src="https://raddxapi.chennaigames.com/raddx_api/assets/email/banner.jpg" border="0" editable="true" alt="picture"></td></tr><td align="center" data-bgcolor="Body" bgcolor="#000000" class="container-padding" data-composer><table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px" data-module="black-logo"></table><table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px" data-module="black-intro-2b"></table><table data-outer-table border="0" align="center" cellpadding="0" cellspacing="0" class="outer-table row" role="presentation" width="580" style="width:580px;max-width:580px" data-module="black-fwd-image-2"><tr data-element="black-intro-2b-headline" data-label="Intro Headline"><td class="type48" data-text-style="Intro Headline" align="center" style="font-family:\'Roboto Slab\',Arial,Helvetica,sans-serif;font-size:64px;line-height:84px;font-weight:700;font-style:normal;color:#fff;text-decoration:none;letter-spacing:0"><singleline><div mc:edit data-text-edit>WELCOME!</div></singleline></td></tr><tr data-element="black-intro-2b-paragraph" data-label="Intro Paragraph"><td data-text-style="Intro Paragraph" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:18px;line-height:32px;font-weight:400;font-style:normal;color:#fff;text-decoration:none;letter-spacing:0"><singleline><div mc:edit data-text-edit>Use the below verification code to ' + email_data["type"] + '.</div></singleline></td></tr><tr><td height="30" style="font-size:100px;line-height:30px" data-height="Footer spacing top">&nbsp;</td><tr data-element="black-intro-usercode" data-label="User Code"><td align="center"><table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="row" width="580" style="width:580px;max-width:580px"><tr><td align="center" data-border-radius-default="0,6,36" data-border-radius-custom="User Code" data-bgcolor="User Code" bgcolor="#000000" style="border-radius:10px;border:3px dotted #0c99b2"><table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center" class="row" width="580" style="width:580px;max-width:580px"><tr><td height="26" style="font-size:26px;line-height:26px">&nbsp;</td></tr><tr><td class="center-text" data-text-style="Use Code" align="center" style="font-family:\'Roboto Slab\',Arial,Helvetica,sans-serif;font-size:40px;line-height:25px;font-style:normal;color:#999;text-decoration:none;letter-spacing:16px"><singleline><div mc:edit data-text-edit><span style="color:#fff">' + email_data["otp"] + '</span></div></singleline></td></tr><tr><td height="26" style="font-size:26px;line-height:26px">&nbsp;</td></tr></table></td></tr></table></td></tr></table><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="580" style="width:580px;max-width:580px" data-module="black-footer"><tr><td height="30" style="font-size:50px;line-height:30px" data-height="Footer spacing top">&nbsp;</td></tr><tr data-element="black-intro-2b-paragraph" data-label="Intro Paragraph"><td data-text-style="Intro Paragraph" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:18px;line-height:28px;font-weight:400;font-style:normal;color:#fff;text-decoration:none;letter-spacing:0"><singleline><div mc:edit data-text-edit>You received this email because you requested to ' + email_data["type"] + ' to your RADDX Racing Metaverse game. If you didn\'t request to ' + email_data["type"] + ', You can safely ignore this email.</div></singleline></td></tr><tr><td height="20" style="font-size:20px;line-height:20px" data-height="Footer spacing top">&nbsp;</td></tr><tr data-element="black-footer-links" data-label="Footer Links"><td align="center"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="center-on-mobile"><td data-element="black-footer-1st-link" data-label="1st Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0"><singleline><a href="https://chennaigames.com/our_story.html" target="_blank" mc:edit data-button data-text-style="Footer Links" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0;display:inline-block;vertical-align:middle"><span>About Us</span></a></singleline></td><td data-element="black-footer-gap-2" data-label="2nd Gap" class="hide-mobile" align="center" valign="middle"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td width="10"></td><td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:28px;line-height:28px;font-weight:100;font-style:normal;color:#444;text-decoration:none;letter-spacing:0">|</td><td width="10"></td></tr></table></td><td data-element="black-footer-3rd-link" data-label="3rd Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0"><singleline><a href="https://chennaigames.com/privacy_policy.html" target="_blank" mc:edit data-button data-text-style="Footer Links" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0;display:inline-block;vertical-align:middle"><span>Privacy Policy</span></a></singleline></td><td data-element="black-footer-gap-3" data-label="3rd Gap" class="hide-mobile" align="center" valign="middle"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td width="10"></td><td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:28px;line-height:28px;font-weight:100;font-style:normal;color:#444;text-decoration:none;letter-spacing:0">|</td><td width="10"></td></tr></table></td><td data-element="black-footer-4th-link" data-label="4th Link" data-text-style="Footer Links" class="rwd-on-mobile center-text" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0"><singleline><a href="https://chennaigames.com/get_in_touch.html" target="_blank" mc:edit data-button data-text-style="Footer Links" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:14px;line-height:28px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0;display:inline-block;vertical-align:middle"><span>Contact Us</span></a></singleline></td></tr></table></td></tr><tr data-element="black-footer-links" data-label="Footer Links"><td height="20" style="font-size:20px;line-height:20px" data-height="Spacing under footer links">&nbsp;</td></tr><tr data-element="black-footer-social-icons" data-label="Social Icons"><td align="center"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="width:100%;max-width:100%"><tr><td align="center"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="center-on-mobile"><td data-element="black-footer-facebook" data-label="Facebook" class="rwd-on-mobile" align="center" valign="middle" height="28" style="height:28px"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center"><a href="https://www.facebook.com/thechennaigames" target="_blank"><img style="width:28px;border:0;display:inline!important" src="https://raddxapi.chennaigames.com/raddx_api/email_temp/HTML/images/facebook.png" width="28" border="0" editable="true" data-icon data-image-edit data-url data-label="Facebook" data-image-width alt="icon"></a></td><td width="7"></td></tr></table></td><td data-element="black-footer-twitter" data-label="Twitter" class="rwd-on-mobile" align="center" valign="middle" height="28" style="height:28px"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td width="7"></td><td align="center"><a href="https://twitter.com/ChennaiGames" target="_blank"><img style="width:28px;border:0;display:inline!important" src="https://raddxapi.chennaigames.com/raddx_api/email_temp/HTML/images/twitter.png" width="28" border="0" editable="true" data-icon data-image-edit data-url data-label="Twitter" data-image-width alt="icon"></a></td><td width="7"></td></tr></table></td><td data-element="black-footer-instagram" data-label="Instagram" class="rwd-on-mobile" align="center" valign="middle" height="28" style="height:28px"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td width="7"></td><td align="center"><a href="https://www.instagram.com/thechennaigames" target="_blank"><img style="width:28px;border:0;display:inline!important" src="https://raddxapi.chennaigames.com/raddx_api/email_temp/HTML/images/instagram.png" width="28" border="0" editable="true" data-icon data-image-edit data-url data-label="Instagram" data-image-width alt="icon"></a></td><td width="7"></td></tr></table></td><td data-element="black-footer-youtube" data-label="YouTube" class="rwd-on-mobile" align="center" valign="middle" height="28" style="height:28px"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td width="7"></td><td align="center"><a href="https://www.youtube.com/channel/UCmAmLi_l3-dnE_fJSncqxSg" target="_blank"><img style="width:28px;border:0;display:inline!important" src="https://raddxapi.chennaigames.com/raddx_api/email_temp/HTML/images/youtube.png" width="28" border="0" editable="true" data-icon data-image-edit data-url data-label="YouTube" data-image-width alt="icon"></a></td></tr></table></td></tr></table></td></tr></table></td></tr><tr data-element="black-footer-buttons" data-label="Buttons"><td height="20" style="font-size:20px;line-height:20px" data-height="Spacing under buttons">&nbsp;</td></tr><tr><td align="center" height="8" data-border-color="dotted-dividers" style="font-size:8px;line-height:8px;border-top:4px dotted #333">&nbsp;</td></tr><tr data-element="black-footer-buttons" data-label="Buttons"><td height="10" style="font-size:20px;line-height:10px" data-height="Spacing under buttons">&nbsp;</td></tr><tr data-element="black-footer-paragraphs" data-label="Paragraphs"><td align="center"><table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="480" style="width:480px;max-width:480px"><tr><td class="center-text" data-text-style="Paragraphs" style="float:left"><img src="https://www.chennaigames.com/images/logo.png" style="width:100px"></td><td class="center-text" data-text-style="Paragraphs" align="center" style="font-family:Roboto,Arial,Helvetica,sans-serif;font-size:12px;line-height:24px;font-weight:400;font-style:normal;color:#999;text-decoration:none;letter-spacing:0"><multiline><div mc:edit data-text-edit>© 2022 ChennaiGames Studio Pvt. Ltd.</div></multiline></td></tr></table></td></tr><tr data-element="black-footer-paragraphs" data-label="Paragraphs"><td height="20" style="font-size:20px;line-height:20px" data-height="Spacing above tags">&nbsp;</td></tr></table></td></table></body></html>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            //console.log(error);
        } else {
            //console.log('Email sent: ' + info.response);
        }
    });
    return 'S';
}

async function free_car_for_signup(gid, unit_id, dbobj) {
    var is_free_car_already_available = await dbobj.db.collection('app_non_tradable_assets').find({ gid: gid, unit_id: unit_id }).toArray()
    if (is_free_car_already_available.length == 0) {
        var inbox_func = new inbox_class()
        var master_data = await dbobj.db.collection('app_non_tradable_assets_master').find({ unit_id: unit_id, unit_type: 1 }).project({ _id: 0 }).toArray()
        if (master_data.length > 0) {
            var lf = new Date()
            master_data[0].crd_on = new Date()
            master_data[0].gid = gid;
            master_data[0].charge.l_f = lf;
            master_data[0].charge.l_s = lf.getUTCHours();
            await dbobj.db.collection('app_non_tradable_assets').insertOne(master_data[0])
            var ownership_for_new_car = {
                gid: gid,
                unit_id: unit_id,
                unit_type: 1,
                car_type: 2,
                last_selected: 'N',
                ownership: 'O',
                crd_on: new Date(),//UTILS.CURRENT_DATE(new Date()),
                status: 'A',
            }
            await dbobj.db.collection("app_nft_ownership").insertOne(ownership_for_new_car);
            await inbox_func.add_msg(8, gid, dbobj, 'Registration Bonus', 'Free car unlocked', 'Thank you for Registering in RADDX.<color = #E5AD0F>CARBON</color> car has been unlocked specialy for you.\nVisit your garage to check out your new car.')
        }
    }
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
            "color": ug_color_code
        },
        "trails": t_id,
        "rim_lights": {
            "id": rim_id,
            "color": rim_color_code
        },
        "led": {
            "id": led_id,
            "color": body_led
        }
    }
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

async function create_aid(dbobj) {
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
    var countDownDate = (new Date(date_value));
    var now = (new Date());
    var res = Math.abs(now - countDownDate) / 1000
    var hours = Math.floor(res / 3600)
    return hours
}
async function transaction_log(is_log, dbobj) {
    if (is_log === 'Y') {
        let insert = {}
        for (let i = 2; i < arguments.length; i++) {
            var a = Object.assign(insert, arguments[i])
        }
        var insert_db = await dbobj.db.collection('transaction_log').insertOne(insert)
    }
}
function reward(rank, prize_pool, rewarding_participants, race_mode) {
    var reward = prize_pool / 100;
    var rc_reward = '-';
    if (rewarding_participants == 100 && race_mode == 2) // TOURNAMENTS 100
    {
        if (rank === 1) rc_reward = Math.round(reward * 12.5);
        if (rank === 2) rc_reward = Math.round(reward * 11.25);
        if (rank === 3) rc_reward = Math.round(reward * 10);
        if (rank === 4) rc_reward = Math.round(reward * 8.75);
        if (rank === 5) rc_reward = Math.round(reward * 7.5);
        if (rank === 6) rc_reward = Math.round(reward * 6.25);
        if (rank === 7) rc_reward = Math.round(reward * 5);
        if (rank === 8) rc_reward = Math.round(reward * 3.75);
        if (rank === 9) rc_reward = Math.round(reward * 2.5);
        if (rank === 10) rc_reward = Math.round(reward * 1.25);
        if (rank >= 11 && rank <= 50) rc_reward = Math.round(reward * 0.625);
        if (rank >= 51 && rank <= 100) rc_reward = Math.round(reward * 0.125);
    }
    else if (rewarding_participants == 500 && race_mode == 2) // TOURNAMENTS 500
    {
        if (rank === 1) rc_reward = Math.round(reward * 5);
        if (rank === 2) rc_reward = Math.round(reward * 3.5);
        if (rank === 3) rc_reward = Math.round(reward * 3);
        if (rank === 4) rc_reward = Math.round(reward * 1.5);
        if (rank === 5) rc_reward = Math.round(reward * 1);
        if (rank === 6) rc_reward = Math.round(reward * 0.95);
        if (rank === 7) rc_reward = Math.round(reward * 0.90);
        if (rank === 8) rc_reward = Math.round(reward * 0.85);
        if (rank === 9) rc_reward = Math.round(reward * 0.80);
        if (rank === 10) rc_reward = Math.round(reward * 0.75);
        if (rank >= 11 && rank <= 25) rc_reward = Math.round(reward * 0.4);
        if (rank >= 26 && rank <= 50) rc_reward = Math.round(reward * 0.32);
        if (rank >= 51 && rank <= 100) rc_reward = Math.round(reward * 0.275);
        if (rank >= 101 && rank <= 150) rc_reward = Math.round(reward * 0.17);
        if (rank >= 151 && rank <= 200) rc_reward = Math.round(reward * 0.16);
        if (rank >= 201 && rank <= 250) rc_reward = Math.round(reward * 0.15);
        if (rank >= 251 && rank <= 300) rc_reward = Math.round(reward * 0.14);
        if (rank >= 301 && rank <= 350) rc_reward = Math.round(reward * 0.13);
        if (rank >= 351 && rank <= 400) rc_reward = Math.round(reward * 0.12);
        if (rank >= 401 && rank <= 450) rc_reward = Math.round(reward * 0.11);
        if (rank >= 451 && rank <= 500) rc_reward = Math.round(reward * 0.10);
    }
    else if (rewarding_participants == 1000 && race_mode == 2) // TOURNAMENTS 1000
    {
        if (rank === 1) rc_reward = Math.round(reward * 4);
        if (rank === 2) rc_reward = Math.round(reward * 2.5);
        if (rank === 3) rc_reward = Math.round(reward * 2);
        if (rank === 4) rc_reward = Math.round(reward * 0.95);
        if (rank === 5) rc_reward = Math.round(reward * 0.90);
        if (rank === 6) rc_reward = Math.round(reward * 0.85);
        if (rank === 7) rc_reward = Math.round(reward * 0.80);
        if (rank === 8) rc_reward = Math.round(reward * 0.75);
        if (rank === 9) rc_reward = Math.round(reward * 0.70);
        if (rank === 10) rc_reward = Math.round(reward * 0.65);
        if (rank >= 11 && rank <= 25) rc_reward = Math.round(reward * 0.4);
        if (rank >= 26 && rank <= 50) rc_reward = Math.round(reward * 0.32);
        if (rank >= 51 && rank <= 100) rc_reward = Math.round(reward * 0.268);
        if (rank >= 101 && rank <= 200) rc_reward = Math.round(reward * 0.085);
        if (rank >= 201 && rank <= 300) rc_reward = Math.round(reward * 0.08);
        if (rank >= 301 && rank <= 400) rc_reward = Math.round(reward * 0.075);
        if (rank >= 401 && rank <= 500) rc_reward = Math.round(reward * 0.07);
        if (rank >= 501 && rank <= 600) rc_reward = Math.round(reward * 0.065);
        if (rank >= 601 && rank <= 700) rc_reward = Math.round(reward * 0.06);
        if (rank >= 701 && rank <= 800) rc_reward = Math.round(reward * 0.055);
        if (rank >= 801 && rank <= 900) rc_reward = Math.round(reward * 0.05);
        if (rank >= 901 && rank <= 1000) rc_reward = Math.round(reward * 0.045);
    }
    else if (rewarding_participants == 10 && race_mode == 1) // DAILY LEADERBOARD
    {
        if (rank === 1) rc_reward = Math.round(reward * 18.181);
        if (rank === 2) rc_reward = Math.round(reward * 16.363);
        if (rank === 3) rc_reward = Math.round(reward * 14.545);
        if (rank === 4) rc_reward = Math.round(reward * 12.727);
        if (rank === 5) rc_reward = Math.round(reward * 10.909);
        if (rank === 6) rc_reward = Math.round(reward * 9.09);
        if (rank === 7) rc_reward = Math.round(reward * 7.272);
        if (rank === 8) rc_reward = Math.round(reward * 5.454);
        if (rank === 9) rc_reward = Math.round(reward * 3.636);
        if (rank === 10) rc_reward = Math.round(reward * 1.818);
    }
    rc_reward = rc_reward.toString()
    return rc_reward;
}

async function SEASON_SWITCH(user_season_id, user_rr, league_id, highest_league, gid, dbobj) {
    var find_query = { 'season_details.s_expiry': { $gt: new Date() } }
    var project_query = { _id: 0, season_id: '$season_details.s_id' }
    var current_season = await dbobj.db.collection('app_season').find(find_query).project(project_query).limit(1).toArray()
    let rr = 0
    let leag_id = 0
    let high_league = 0
    if (user_season_id != current_season[0].season_id) {
        if (user_rr >= 0 && user_rr <= 1999) {// BRONZE
            rr = 0
            leag_id = 0
            high_league = 'BRONZE IV'
        }
        if (user_rr >= 2000 && user_rr <= 3999) { // SILVER
            rr = 0
            leag_id = 0
            high_league = 'BRONZE IV'
        }
        if (user_rr >= 4000 && user_rr <= 5999) { // GOLD
            rr = 2000
            leag_id = 4
            high_league = 'SILVER IV'
        }
        if (user_rr >= 6000 && user_rr <= 7999) { // PLATINUM
            rr = 4000
            leag_id = 8
            high_league = 'GOLD IV'
        }
        if (user_rr >= 8000) { // RADDX LEGEND
            rr = 6000
            leag_id = 12
            high_league = 'PLATINUM IV'
        }
        var filter_query = { gid: gid }
        var update_query = { $set: { 'c_league.c_l': leag_id, 'c_league.h_l_name': high_league, 'c_league.season_id': current_season[0].season_id, 'c_league.rr': rr } }
        await dbobj.db.collection('app_user_profile_details').updateOne(filter_query, update_query)
        var previous_season_log = {
            gid: gid,
            prev_season_id: user_season_id,
            prev_rr: user_rr,
            prev_highest_league: highest_league,
            prev_league_id: league_id,
            crd_on: new Date()
        }
        await dbobj.db.collection('app_user_season_logs').insertOne(previous_season_log)

    }
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

/* RC TRANSACTION LOG  */


async function rc_transaction_log(gid, reason, rc, type, dbobj) {



    let insert_data = {
        gid: gid,
        reason: reason,
        rc: rc,
        type: type,
        crd_on: new Date(),
        stat: 'A'
    }

    var find_query = { gid: gid }
    var project_query = { rc_balance: 1, _id: 0 }
    var rc_balance = await dbobj.db.collection('app_rc').find(find_query).project(project_query).toArray();
    if (rc_balance.length > 0) {
        insert_data.current_rc_balance = rc_balance[0].rc_balance;
    }

    await dbobj.db.collection('app_rc_transaction_log').insertOne(insert_data);
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
    reward,
    SEASON_SWITCH,
    rc_transaction_log,
    check_swear_word,
    free_car_for_signup
}