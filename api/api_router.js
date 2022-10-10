const express = require('express').Router;
const TOKEN_AUTH = require('./middleware/token_auth');
const APP_CONFIG = require('./middleware/app_config');

class api_router {

    create() {
        let route = express();

        /* ROUTING TO MIDDLEWARE FOR X-API-KEY AND TOKEN AUTHENTICATION */
        route.use('/', APP_CONFIG, TOKEN_AUTH);

        /* API ENDPOINTS */
        
        return route;
    }
}

module.exports = new api_router();