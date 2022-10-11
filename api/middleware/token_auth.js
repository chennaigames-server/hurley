const jwt = require('jsonwebtoken');
const CONFIG = require('../../common/inc.config');

module.exports = async (req, res, next) => {
    try {
        //Pre-Login endpoints which does not have Authorization token
        let X_API_KEY = req.headers['x-api-key'];
        let AUTHORIZATION = req.headers['authorization'];
        let only_x_api_key_endpoints = [];

        let requested_url = req.url.replace('/', '')
        if (only_x_api_key_endpoints.includes(requested_url)) {
            /* CHECKING X-API-KEY WITH SERVER VALUE WHICH IS VALID OR NOT */
            (X_API_KEY == CONFIG.X_API_KEY) ? next() : res.send({ status: "UA", msg: "Un Authorized Access!" });
            return false;
        }
        else {
            /* POST LOGIN API's WHICH HAVE VALID AUTHORIZATION JWT TOKEN */
            let decode_token = jwt.verify(AUTHORIZATION, CONFIG.JWT_SECERET_KEY);

            const dbconn = require('../../common/inc.dbconn');
            const dbobj = new dbconn();
            var query_parameter = { gid: decode_token.gid, 'active_device.id': decode_token.device_id };
            var get_device = await dbobj.db.collection('app_user_accounts').find(query_parameter).toArray();
            if (get_device.length > 0) {
                next();
            }
            else {
                res.send({ status: "UA", msg: "Wait a minute, Who are you..! Un Authorized Access!" });
                return false;
            }
            await dbobj.dbclose()
        }
    } catch (error) {
        return res.send({ status: "UA", msg: "Wait a minute, Who are you..! Un Authorized Access!" });
    }
};