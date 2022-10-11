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
        route.use('/login_user',require('./routes/login_user'));
        route.use('/logout',require('./routes/logout'));
        route.use('/register_user',require('./routes/register_user'));
        route.use('/validate_otp',require('./routes/validate_otp'));
        /* MISSIONS */
        route.use('/get_missions',require('./routes/get_missions'));
        /* GAME DASHBOARD */
        route.use('/get_dashboarddetails',require('./routes/get_dashboarddetails'));
        /* RANKING */
        route.use('/get_rankings',require('./routes/get_rankings'));
        /* UPGRADE */
        route.use('/upgrades',require('./routes/upgrades'));
        route.use('/get_upgrades',require('./routes/get_upgrades'));
        /* REWARD CLAIM */
        route.use('/claim_reward',require('./routes/claim_reward'));
        /* EDIT_NICKNAME */
        route.use('/update_nickname',require('./routes/update_nickname'));
        /* SCORE */
        route.use('/update_score',require('./routes/update_score'));
        /* IAP RECIEPT VALIDATION */
        route.use('/validate_reciept',require('./routes/validate_reciept'));

        return route;
    }
}

module.exports = new api_router();