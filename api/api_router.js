const express = require('express').Router;
const TOKEN_AUTH = require('./middleware/token_auth');
const APP_CONFIG = require('./middleware/app_config');

class api_router {
    create() {
        let route = express();

        /* ROUTING TO MIDDLEWARE FOR X-API-KEY AND TOKEN AUTHENTICATION */
        //route.use('/', APP_CONFIG, TOKEN_AUTH);

        /* API ENDPOINTS */
        /* PRE-LOGIN */
        route.use('/get_remoteconfig', require('./routes/get_remoteconfig'));

        /* LOGIN LOGOUT REGISTER VALIDATEOTP*/
        route.use('/register_user',require('./routes/register_user'));
        route.use('/login_user',require('./routes/login_user'));
        route.use('/guest_user',require('./routes/play_as_guest'));
        route.use('/validate_otp',require('./routes/validate_otp'));
        route.use('/logout',require('./routes/logout'));
        route.use('/check_logindetails',require('./routes/check_logindetails'));

        /* MISSIONS */
        route.use('/get_dailymissions',require('./routes/get_dailymissions'));

        /* GAME DASHBOARD */
        route.use('/get_dashboarddetails',require('./routes/get_dashboarddetails'));

        /* PROFILE DETAILS */
        route.use('/profile_details',require('./routes/profile_details'));
        route.use('/get_char_details',require('./routes/get_char_details'));
        route.use('/set_character',require('./routes/set_character'));

        /* RANKING */
        route.use('/get_rankings',require('./routes/get_rankings'));

        /* UPGRADE */
        route.use('/upgrade_powerup',require('./routes/upgrade_powerup'));
        // route.use('/upgrades',require('./routes/upgrades'));
        // route.use('/get_upgrades',require('./routes/get_upgrades'));

        /* REWARD CLAIM */
        route.use('/claim_reward',require('./routes/claim_reward'));

        /* EDIT REFERRAL AND NICKNAME */
        route.use('/update_referralandnickname', require('./routes/update_referralandnickname'));
        route.use('/update_nickname',require('./routes/update_nickname'));

        /* GAME START */
        route.use('/get_surf',require('./routes/get_surf'));
        
        /* REPAIR SURF BOARD */
        route.use('/repair_board',require('./routes/repair_board'));
 
        /* SCORE */
        // route.use('/update_score',require('./routes/update_score'));
        
        /* IAP RECIEPT VALIDATION */
        // route.use('/validate_reciept',require('./routes/validate_reciept'));

        /* SETTINGS */
        // route.use('/get_gamesettings',require('./routes/get_gamesettings'));

        return route;
    }
}

module.exports = new api_router();