const axios = require('axios');
const CONFIG = require('../common/inc.config');
const db_functions = require('../classes/class.db_functions');
const e = require('express');

class guardiangames {

    constructor() {
        this.db_functions = new db_functions();
        this.success_codes = [200, 201, 422];
    }

    async guardian_source(request_tag, request_payload) {
        var config = {};

        if (request_tag === 'REGISTER') {

            /* MARKETPLACE REGISTRATION ENDPOINT */
            config = {
                method: 'post',
                url: CONFIG.GUARDIAN_API_URL + '/register',
                headers: {
                    'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
                },
                data: request_payload
            };
        }
        else if (request_tag === 'SEND_OTP') {
            /* TO SENDING OTP */
            config = {
                method: 'post',
                url: CONFIG.GUARDIAN_API_URL + '/send_email_otp',
                headers: {
                    'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
                },
                data: request_payload
            };
        }
        else if (request_tag === 'LOGIN') {
            /* VALIDATING OTP */
            config = {
                method: 'post',
                url: CONFIG.GUARDIAN_API_URL + '/login_with_otp',
                headers: {
                    'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
                },
                data: request_payload
            };
        }
        else if (request_tag === 'LOGOUT') {
            /* VALIDATING OTP */
            config = {
                method: 'delete',
                url: CONFIG.GUARDIAN_API_URL + '/logout',
                headers: {
                    'Authorization': request_payload.jwt_token,
                    'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
                },
                //data : data
            };
        }

        return await this.request_marketplace(config);
    }

    async request_marketplace(config) {
        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let response_data = {};
            let requestMp = await axios(config);
            var api_response_status = this.success_codes.includes(requestMp.status);
            if (api_response_status === true) {
                /* RESPONSE SUCCESS */
                //response_data = 
                response_data.api_status = 'S';
                response_data.message = 'SUCCESS';
                response_data.data = await Promise.resolve(requestMp.data);
            }
            else {
                /* TRIGGER ALARM TO DEVELOPER */
                /* WHEN MARKETPLACE SERVERS RESPONDS WITH DIFFERENT SERVER CODES */
                response_data = { api_status: 'E', message: 'RINVALID SERVER CODE FROM MARKETPLACE SERVER', data: requestMp.data };
            }

            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            let response_data = {};
            if (err.response) {
                var request_data = err.response.data;
                var api_response_status = this.success_codes.includes(err.response.status);
                if (api_response_status === true) {
                    /* RESPONSE SUCCESS */
                    //response_data = await Promise.resolve(err.response.data);
                    response_data.api_status = 'S';
                    response_data.message = 'SUCCESS';
                    response_data.data = await Promise.resolve(err.response.data);
                }
                else {
                    /* TRIGGER ALARM TO DEVELOPER */
                    /* WHEN MARKETPLACE SERVERS RESPONDS WITH DIFFERENT SERVER CODES */
                    response_data = { api_status: 'E', message: 'INVALID SERVER CODE FROM MARKETPLACE SERVER', data: err.response.data };
                }
            }
            else {
                /* TRIGGER ALARM TO DEVELOPER */
                /* IF ENDPOINT IS NOT REACHED OR NOT WORKING */
                response_data = { api_status: 'E', message: 'MARKETPLACE SERVER UNAVAILABLE' };
            }
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
    }

    async testurl(data) {
        let config = {
            method: 'post',
            //timeout:1000,
            url: 'http://192.168.19.144:3000/',
            headers: {
                'Authorization': data.jwt_token,
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data
        };
        var request_marketplace = await this.request_marketplace(config);
        var response_data = await Promise.resolve(request_marketplace);
        return response_data;
    }

    async register(data) {
        let config = {
            method: 'post',
            url: CONFIG.GUARDIAN_API_URL + '/register',
            headers: {
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data
        };

        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            //console.log(err);
            var response_data = await Promise.resolve(err.response.data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;

            if (err.response.status == 200) {
                var response_data = await Promise.resolve(err.response.data);
                log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
                await this.db_functions.log_marketplace_data(log_data);
                return response_data;
            }
            else {
                var response_data = { status: 500, message: '[MARKETPLACE SERVER] ' + err.response.status + '-' + err.response.statusText };
                return response_data;
            }
        }
    }

    async login(data) {
        let config = {
            method: 'post',
            url: CONFIG.GUARDIAN_API_URL + '/login_with_otp',
            headers: {
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data
        };

        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            console.log(err);
            console.log(err.response.status);
            if (err.response.status == 200) {
                var response_data = await Promise.resolve(err.response.data);
                log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
                await this.db_functions.log_marketplace_data(log_data);
                return response_data;
            }
            else {
                var response_data = { status: 500, message: '[MARKETPLACE SERVER]' + err.response.status + '-' + err.response.statusText };
                return response_data;
            }

        }
    }

    async send_email_otp(data) {
        let config = {
            method: 'post',
            url: CONFIG.GUARDIAN_API_URL + '/send_email_otp',
            headers: {
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data
        };
        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            //console.log(err);
            //console.log(err.response.status);
            if (err.response.status == 200) {
                var response_data = await Promise.resolve(err.response.data);
                log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
                await this.db_functions.log_marketplace_data(log_data);
                return response_data;
            }
            else {
                var response_data = { status: 500, message: '[MARKETPLACE SERVER] ' + err.response.status + '-' + err.response.statusText };
                return response_data;
            }
        }
    }

    async logout(data) {
        let config = {
            method: 'delete',
            url: CONFIG.GUARDIAN_API_URL + '/logout',
            headers: {
                'Authorization': data.jwt_token,
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            //data : data
        };
        console.log(config);

        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            var response_data = await Promise.resolve(err.response.data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
    }

    async owned_nft(data) {
        let config = {
            method: 'get',
            url: CONFIG.GUARDIAN_MARKETPLACE_API_URL + '/users/owned?page=' + data.page,
            headers: {
                'Authorization': data.jwt_token,
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data
        };
        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        //console.log(config);
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            var response_data = await Promise.resolve(err.response.data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
    }

    async gift_nft(data) {
        let config = {
            method: 'post',
            url: CONFIG.GUARDIAN_MARKETPLACE_API_URL + '/nfts/gift_nft',
            headers: {
                'Authorization': data.jwt_token,
                'x-api-key': CONFIG.GUARDIAN_API_SECRET_KEY
            },
            data: data.game_id
        };
        let log_data = {};
        log_data = { ...log_data, ...{ req_data: config, req_time: new Date() } };
        try {
            let requestMp = await axios(config);
            var response_data = await Promise.resolve(requestMp.data);
            console.log(response_data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
        catch (err) {
            var response_data = await Promise.resolve(err.response.data);
            log_data = { ...log_data, ...{ res_data: response_data, res_time: new Date() } };
            await this.db_functions.log_marketplace_data(log_data);
            return response_data;
        }
    }

    /* DEV FUNTIONS */
    async reward_coins(coins, aid, dbobj) {
        var find_query = { aid: aid }
        var user = await dbobj.db.collection('app_coins').find(find_query).toArray();

        if (user.length == 0) {
            var user_rc_data = {
                aid: aid,
                coin_balance: coins
            }
            await dbobj.db.collection('app_coins').insertOne(user_rc_data)

        } else {
            var increment_query = { $inc: { coin_balance: coins } }
            await dbobj.db.collection('app_coins').updateOne(find_query, increment_query)
        }
    }

    async rc_balance(gid, dbobj) {
        var find_query = { gid: gid }
        var project_query = { rc_balance: 1, _id: 0 }
        let rc = 0;

        var rc_balance = await dbobj.db.collection('app_rc').find(find_query).project(project_query).toArray();

        if (rc_balance.length > 0) {
            rc = parseFloat(rc_balance[0].rc_balance);
        }


        return rc;
    }

    async deduct_rc(rc_value, gid, dbobj) {
        // DECREMENT VALUES 
        var find_query = { gid: gid }
        var decrement_query = { $inc: { rc_balance: -rc_value } }

        var deduct_rc = await dbobj.db.collection('app_rc').updateOne(find_query, decrement_query)
        return true;
    }
}

module.exports = guardiangames;