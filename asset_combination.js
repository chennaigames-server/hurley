var back_attachment = [1];
var topdress_attachment = [1, 3, 5, 8, 10];
var bottomdress_attachment = [1, 2, 3, 5, 6];
var face_attachment = [2, 9, 11, 12, 13, 14, 15];
var glass_attachment = [1, 2, 3, 4, 5, 6, 7];
var hair_attachment = [1, 2, 3, 4, 5, 6, 7];
var head_attachment = [2, 4, 5, 6, 8, 9, 10];
var hand_attachment = [1, 2, 5, 6, 7, 8, 9];
var leg_attachment = [1];
var claws_attachment = [1];
var ornaments_attachment = [1];
var board_attachment = [1];
var rarity = ["rare","common","legendary","epic"]
var gender = [1, 2]; // 1-Male, 2-Female
var CHARACTER_COUNT = 200;
 
(async () => {
var dbconn = require('./common/inc.dbconn');
var dbobj = new dbconn();

for (let index = 101; index <= CHARACTER_COUNT; index++)
{
    var insert_parameter = await generate_random_character(2,index);

    console.log(insert_parameter);
     await dbobj.db.collection("app_tradable_assets_master").insertOne(insert_parameter)

}

await dbobj.dbclose();
})()
.catch(err => console.error(err));


 function generate_random_character(gender,index) {
    var character = {
        unit_type:2,
        unit_id:index,
        gender:gender,
        avatar_id:index,
        b_id:index,
        c_id:index,
        xp_level:1,
        c_xp:50,
        t_xp:500,
        p_p:1,
        d_xp:"50/500XP",
        rarity:get_combination(rarity),
        char_name:"sloth_"+index,
        asset_details:{
        gender: gender,
        board: get_combination(board_attachment),
        top_dress: get_combination(topdress_attachment),
        bottom_dress: get_combination(bottomdress_attachment),
        back: get_combination(back_attachment),
        face: get_combination(face_attachment),
        glass: get_combination(glass_attachment),
        head: get_combination(head_attachment),
        hair: get_combination(hair_attachment),
        hand: get_combination(hand_attachment),
        leg: get_combination(topdress_attachment),
        claw: get_combination(topdress_attachment),
        ornament: get_combination(ornaments_attachment),
        },
        attr:{
            agility:0,
            stamina:0,
            energy:0,
            durability:0,
            speed:0,
            damage:0
        },
        repair_cost:0,
        animations:[1,2,3],
        crd_on:new Date()
    };
    return character;
}

function get_combination(arr) {
    var attachment = 0;
    attachment = arr[Math.round(Math.random() * ((arr.length - 1) - 0) + 0)];
    return attachment;
}



