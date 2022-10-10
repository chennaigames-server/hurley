module.exports = {
    
    /* APP CONFIG PARAMETERS */
    FORCED_UPDATE: "N",
    MAINTANANCE_MODE: "N",
    MAINTANANCE_TIME: 60,
    FORCED_UPDATE_URL: 'https://chennaigamespvtltd-my.sharepoint.com/:u:/g/personal/hari_chennaigames_com/EWgDKsoz4jdApIuCT45lEOkB0eMC9g2MVBagaedUA-kLqQ',

  

    /* DEPLOYMENT PARAMETERS */
    API_PORT: 3000,

    /* AUTHENTICATION PARAMETERS */
    X_API_KEY: 'ABCD123',
    JWT_SECERET_KEY: 'jvxCBpsy3eoo1OYs1WMpSd7mH301isqCy51XP2e59W1JTDhAbRnkl70rZMVzvxiD',

    /* DATABASE CREDENTIALS */
    //DB_ENDPOINT: 'mongodb+srv://hrxrace:racing2022@cluster0.4x0of.mongodb.net/hrx?retryWrites=true&w=majority',
    // DB_ENDPOINT: 'mongodb://hrxrace:racing2022@3.109.110.92:27017/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',

    DB_ENDPOINT: 'mongodb://admin:RrSEWZ6DzDozJkg@3.6.99.7:16006/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',
    // DB_ENDPOINT: 'mongodb://admin:RrSEWZ6DzDozJkg@172.31.16.65:16006/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',

    DB_NAME: 'hurley_dev',
    

    /* REDIS */
    // REDIS_URL: 'redis://43.205.158.192:5268',
    // REDIS_PASSWORD: 'raddxredis',
    REDIS_URL: 'redis://127.0.0.1:6379',
    REDIS_PASSWORD: '',
   
    /* COMMON UI PARAMETERS */
   
    OTP_RETRY: 3,
    OTP_RESEND_DURATION: 60,
 
    /* TRANSACTION LOG */
    TRANSACTION_LOG: 'Y',

    API_BASE_URL: "http://raddxapi.chennaigames.com:3000/api",
    PRIVACY_URL: "https://chennaigames.com/privacy_policy.html",


    /* MESSAGE TEXTS */
    MESSAGES: {
        SUCCESS: 'SUCCESS!',
        REG_SUCCESS: 'REGISTRATION SUCCESSFUL',
        LOGIN_SUCCESS: 'LOGIN SUCCESSFUL',
        LOGOUT: 'LOGOUT SUCCESSFULLY',
        OTP_SENT: 'OTP SENT SUCCESSFULLY',
        OTP_SENT_ALREADY: 'OTP HAS ALREADY BEEN SENT',
        OTP_VALID: 'OTP VALIDATED SUCCESSFULLY',
        INVALID_OTP: 'INVALID OTP',
        REGISTERED: "ACCOUNT ALREADY TAKEN!",
        NO_ACCOUNT: "ACCOUNT DOESN'T EXIST!",
        BLOCKED: 'This account has been blocked by admin',
        INVALID_REFERRAL: 'You have entered invalid referral code',
        OTHER_DEVICE: 'THIS ACCOUNT HAS ALREADY BEEN USED ON A ANOTHER DEVICE',
        SERVER_ERROR: 'OPERATION COULD NOT BE DONE! PLEASE TRY AFTER SOME TIME',
        MAINTANANCE_MODE: 'SERVERS ARE CURRENTLY UNDER MAINTENANCE, PLEASE TRY AFTER SOME TIME!',
        ERROR: 'OPERATION COULD NOT BE DONE! PLEASE TRY AFTER SOME TIME',
        NFT_NOT_FOUND: 'YOU ARE NOT THE OWNER OF THE REQUESTED CAR.',
        INSUFFICIENT_UT: "RC BALANCE IS INSUFFICIENT, VISIT OUR SHOP FOR MORE RC.",
        UPGR_SUCCESS_MSG: "UPGRADE SUCCESSFULLY",
        TUNE_SUCCESS_MSG: "YOUR CAR TUNED SUCCESSFULLY",
        INSUFFICIENT_RP: "INSUFFICIENT RP POINTS, PLEASE UPGRADE YOUR CAR TO NEXT LEVEL TO GET MORE RP POINTS",
        MEGA_RACE_TOURNAMENT_INFO: 'MEGA RACE TOURNAMENT',
    }
}