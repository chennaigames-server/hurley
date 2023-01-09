const express = require('express');
const router = express.Router();
// const UTILS = require('../../utils/util.functions');
// const CONFIG = require('../../common/inc.config');

router.post('/', async (req, res) => {

  /* DEFAULT VALUES */
//   var response = {};
//   var status = 'S';
//   var msg = '';
//   var app_config = UTILS.get_app_config();
//   var gid = req.body.gid;

//   var loggerobj = require('../../classes/class.logger');
//   let winston = new loggerobj(__filename);
//   let logger = winston.logger();
  // TYPE = 1-ADS, 2-RC, 3-JT, 4- IAP
  try {

    response = {
      "status": "S",
      "ut_balance": 20000,
      "jt_balance": 1000,
      "msg": "SUCCESS!",
      "app_config": {
        "f_u": "N",
        "url": "https://play.google.com/store/apps/details?id=com.chennaigames.mrracer",
        "m": "N",
        "i_d": "N",
        "m_t": 3600
      },
      "shop": [
        {
          "id": 1,
          "menu_title": "FREE COINS",
          "card_title": "FREE COINS",
          "layout_type": "LIST",
          "r_time": 3600,
          "data": [
            {
              "product_id": "1",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/rc.png",
              "desc": "50 RC",
              "type": 1,
              "offer_txt": "",
              "btn_txt": "FREE",
              "btn_status": 1,
              "btn_icon": "PLAY"
            },
            {
              "product_id": "2",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/rc.png",
              "desc": "100 RC",
              "type": 1,
              "offer_txt": "",
              "btn_txt": "FREE",
              "btn_status": 0,
              "btn_icon": "PLAY"
            },
            {
              "product_id": "3",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/rc.png",
              "desc": "150 RC",
              "type": 1,
              "offer_txt": "",
              "btn_txt": "FREE",
              "btn_status": 0,
              "btn_icon": "PLAY"
            },
            {
              "product_id": "4",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/rc.png",
              "desc": "200 RC",
              "type": 1,
              "offer_txt": "",
              "btn_txt": "FREE",
              "btn_status": 0,
              "btn_icon": "PLAY"
            }
          ]
        },
        {
          "id": 2,
          "menu_title": "LIMITED OFFER",
          "card_title": "LIMITED OFFER",
          "layout_type": "BANNER",
          "r_time": 3600,
          "data": [
            {
              "product_id": "starter_pack",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/banner.png",
              "desc": "",
              "type": 4,
              "offer_txt": "",
              "btn_txt": "",
              "btn_status": 1,
              "btn_icon": ""
            }
          ]
        },
        {
          "id": 3,
          "menu_title": "ACCESSORIES",
          "card_title": "ACCESSORIES",
          "layout_type": "GRID",
          "r_time": 3600,
          "data": [
            {
              "product_id": "1",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "SKULL HEAD",
              "type": 4,
              "offer_txt": "10% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "2",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "VIKING HELMET",
              "type": 2,
              "offer_txt": "20% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "3",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "RHINO HORN",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "500",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "4",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "DEER HORN",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "600",
              "btn_status": 0,
              "btn_icon": "JT"
            }, {
              "product_id": "3",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "UFO",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "500",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "4",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/a1.png",
              "desc": "META CROWN",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "600",
              "btn_status": 0,
              "btn_icon": "JT"
            }
          ]
        }, {
          "id": 4,
          "menu_title": "CHARGE",
          "card_title": "CHARGE",
          "layout_type": "GRID",
          "r_time": 3600,
          "data": [
            {
              "product_id": "1",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/charge.png",
              "desc": "5 CHARGES",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "2",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/charge.png",
              "desc": "15 CHARGES",
              "type": 2,
              "offer_txt": "20% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "3",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/charge.png",
              "desc": "20 CHARGES",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "500",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "4",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/charge.png",
              "desc": "25 CHARGES",
              "type": 2,
              "offer_txt": "10% OFF",
              "btn_txt": "600",
              "btn_status": 0,
              "btn_icon": "JT"
            }
          ]
        }, {
          "id": 5,
          "menu_title": "JT PACKS",
          "card_title": "JT PACKS",
          "layout_type": "GRID",
          "r_time": 3600,
          "data": [
            {
              "product_id": "1",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/jt.png",
              "desc": "50 JT",
              "type": 4,
              "offer_txt": "10% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "2",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/jt.png",
              "desc": "1000 JT",
              "type": 4,
              "offer_txt": "20% OFF",
              "btn_txt": "1000",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "3",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/jt.png",
              "desc": "5000 JT",
              "type": 4,
              "offer_txt": "10% OFF",
              "btn_txt": "500",
              "btn_status": 1,
              "btn_icon": "JT"
            },
            {
              "product_id": "4",
              "img": "https://raddxapi.chennaigames.com/raddx_api_dev/assets/shop/jt.png",
              "desc": "10000 JT",
              "type": 4,
              "offer_txt": "10% OFF",
              "btn_txt": "600",
              "btn_status": 0,
              "btn_icon": "JT"
            }
          ]
        }
      ]
    }
    res.send(response)
  }
  catch (err) {
    // response = UTILS.error()
    // res.send(response)
  }
  finally {
    // await dbobj.dbclose()
  }

})
module.exports = router;