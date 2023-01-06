module.exports = {

    share_txt : 'Hey Buddy,\nI enjoy playing RADDX - Racing Metaverse game!\nIt is a virtual world with stunning locations, Real-Time Multiplayer racing with attractive cars, chasing cops, power-ups, Mystery Box, rewards for Premium Tournaments & much more!\n\nUse my referral code ' +  "r_code" + ' to get 5,000 RADDX Coins (RC) for free!\nTry it out:',
    /* GUARDIAN MARKETPLACE API CREDENTIALS */
    GUARDIAN_API_SECRET_KEY: '07cae3427871921bdd6b22b45d60b242cf57d9f0c6396f60cf2e2ed3cc6ea643',
    GUARDIAN_API_URL: 'https://baseapi.guardiangames.trade/api/v1',
    GUARDIAN_MARKETPLACE_API_URL: 'https://marketplaceapi.guardiangames.trade/api/v1',

    /* APP CONFIG PARAMETERS */
    FORCED_UPDATE: "N",
    MAINTANANCE_MODE: "N",
    // MAINTANANCE_TIME: 600,
    MAINTANANCE_TIME: 3600,
    FORCED_UPDATE_URL: 'https://play.google.com/store/apps/details?id=com.raddx.metaverse',

    /* ADDRESSABLE URL */
    PROFILE_PIC_URL: 'https://testchennaigamesassets.s3.ap-south-1.amazonaws.com/ProfilePics/v5/catalog_2022.07.06.08.48.22.json',
    BANNER_URL: 'https://testchennaigamesassets.s3.ap-south-1.amazonaws.com/Banner/v2/catalog_2022.06.14.10.11.29.json',

    /* DEPLOYMENT PARAMETERS */
    API_PORT: 52300,

    /* AUTHENTICATION PARAMETERS */
    X_API_KEY: 'DJnbMCJpdbUZvpCL',
    JWT_SECERET_KEY: 'jvxCBpsy3eoo1OYs1WMpSd7mH301isqCy51XP2e59W1JTDhAbRnkl70rZMVzvxiD',

    /* DATABASE CREDENTIALS */
    //DB_ENDPOINT: 'mongodb+srv://hrxrace:racing2022@cluster0.4x0of.mongodb.net/hrx?retryWrites=true&w=majority',
    // DB_ENDPOINT: 'mongodb://hrxrace:racing2022@3.109.110.92:27017/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',

    DB_ENDPOINT: 'mongodb://admin:RrSEWZ6DzDozJkg@3.6.99.7:16006/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',
    // DB_ENDPOINT: 'mongodb://admin:RrSEWZ6DzDozJkg@172.31.16.65:16006/?directConnection=true&tls=false&authMechanism=DEFAULT&authSource=admin',

    // DB_ENDPOINT:'mongodb://192.168.15.252:27017',
    DB_NAME: 'hurley_dev',
    CGDB_NAME: 'chennaigames',
    MRDB_NAME: 'mr_racer',

    /* LEADERBOARD REWARD */
    LEADERBOARD_PRICE: 400000,
    REWARD_PARTICIPANTS: 100,
    DAILY_LEADERBOARD_REWARD: 10,

    /* REDIS */
    REDIS_URL: 'redis://43.205.158.192:5268',
    REDIS_PASSWORD: 'raddxredis',

    /* REFER & EARN */
    REFERRAL_CODE_LENGTH: 6,
    REFERRAL_BONUS: 5000,// IN UT

    /* COMMON UI PARAMETERS */
    DEFAULT_CAR_UNIT_ID: 0,
    GAME_TIPS_COUNT: 10,
    OTP_RETRY: 3,
    OTP_RESEND_DURATION: 60,
    NAME_PLATE_PRICES: {
        1: 500,
        2: 1000,
        3: 1500,
        4: 2000,
        5: 2500
    },
    COMPETITIVE_MODE: 'Y',
    TRAINING_MODE: 'Y',
    MEGA_RACE_TOURNAMENT: 'Y',
    NICKNAME_EDIT_DURATION: 168,

    /* MEGA RACE TOURNAMENT PRIZE */
    MEGA_RACE_TOURNAMENT_PRIZE: '200,000 INR',

    /* ACTIVATION CODE GENERATING LENGTH */
    ACTIVATION_CODE_LENGTH: 50,

    /* TRANSACTION LOG */
    TRANSACTION_LOG: 'N',

    /* GARAGE CARS LIMIT */
    GARAGE_CARS: 10000,
    INBOX_MSG: 10,

    /* REFER & EARN */
    DEFAULT_CAR_UNIT_ID: 0,

    /* BASE URLS */
    // MULTIPLAYER_BASE_URL: "ws://raddxmultiplayer.chennaigames.com:52400",
    // API_BASE_URL: "http://43.205.158.192:52300/api",
    PRIVACY_URL: "https://chennaigames.com/privacy_policy.html",

    /* STATIC API VERSIONS */
    STATIC_API: {
        s: 4,   // Settings Screen
        h: 10,   // Help Content
        c: 3    // Community Page
    },

    /* NICK_NAME CHANGE */
    nick_name_hours: 168,

    /* LEADERBOARD SCORE */
    EVENT_TYPE: 'HOURLY',
    LEADERBOARD_DURATION: 12,
    LEADERBOARD_LIMIT: 10,
    LEADERBOARDS_TYPE: ['score', 'drift', 'turner', 'racer'],
    /* MESSAGE TEXTS */
    MESSAGES: {
        SUCCESS: 'SUCCESS!',
        REG_SUCCESS: 'REGISTRATION SUCCESSFUL',
        LOGIN_SUCCESS: 'LOGIN SUCCESSFUL',
        LOGOUT: 'LOGOUT SUCCESSFUL',
        OTP_SENT: 'OTP sent successfully',
        OTP_SENT_ALREADY: 'OTP has been sent already',
        OTP_VALID: 'OTP validated successfully',
        INVALID_OTP: 'INVALID OTP',
        REGISTERED: "Account already taken!",
        NO_ACCOUNT: "Account does not exist. Please REGISTER your account.",
        BLOCKED: 'This account has been blocked',
        INVALID_REFERRAL: 'You have entered invalid referral code',
        OTHER_DEVICE: 'Your account is signed in on another device.\n Press CONTINUE to sign in.',
        SERVER_ERROR: 'Operation could not be done! Please try after some time',//'Operation Failed. Please try again later.',
        MAINTANANCE_MODE: 'Our servers are currently under maintenance, We\'ll be back shortly!',
        ERROR: 'Operation could not be done! Please try after some time',
        NFT_NOT_FOUND: 'You are not the owner of the requested car.',
        INSUFFICIENT_UT: "You don’t have enough RC. Visit our shop to buy more.",
        UPGR_SUCCESS_MSG: "UPGRADED SUCCESSFULLY",
        TUNE_SUCCESS_MSG: "YOUR CAR TUNED SUCCESSFULLY",
        INSUFFICIENT_RP: "Insufficient RP. Please upgrade your car to next level to get more RP",
        CHANGE_NUMBERPLATE: "Changing number plate will cost 100 RC. Do you want to proceed?",
        CAR_UPGRADE: "Upgrading car will cost 1500 RC. Do you want to proceed?",
        NO_OF_REFERRED: "NUMBER OF PLAYERS REFERRED.",
        REFERRAL_SUCCESS_MSG: 'SUCCESS!\n<color=#E5AD0F>PLAY ONE COMPETITIVE RACE</color>',// MUST CAPS
        REFERRAL_BONUS: "BOTH PLAYERS WILL GET 5000 RC.",
        REFERRAL_NOTE: '<color=#E5AD0F>NOTE : YOUR FRIEND SHOULD PLAY ATLEAST ONE COMPETITIVE RACE SO THAT YOU BOTH WILL GET REFERRAL BONUS.</color>',
        INSUFFICIENT_CHARGE: "Selected car doesn't have any charge left. Wait for it to recharge.",
        LAST_RACE: 'The last race is still active, do you want to continue the race?',
        INVALID_CLAIM: 'Invalid Claim.',
        NO_MAP: "NO MAP ACQUIRED\nBUT THERE ARE 6000+ MAPS OWNED BY OTHER PLAYERS\nCHECKOUT IN GAMES'S WEBSITE",
        REPAIR: "Selected car needs to be repaired"
    },

    CAREER_JOURNEY_MESSAGES: {
        1: {
            temp_id: 18,
            title: 'Welcome To RaddX! ',
            subtitle: 'Career Journey Day 1 ',
            desc: 'Welcome to RaddX Racing Metaverse, RaddX is a real-time Multiplayer racing arena where you can race with other global players on different tracks. You can train your racing skills in Training mode and you can race against other players in Competitive mode and climb your way to top the rank league. We are happy to give you 8,000 RC as a welcome bonus! So, gear up and start racing!!! '
        },
        2: {
            temp_id: 19,
            title: 'Refer And Earn ',
            subtitle: 'Career Journey Day 2',
            desc: 'Running low on RC? Then go to the referral section immediately and claim <color=#E5AD0F>5000 RC </color>for each player you have referred!!! There is no limit on how many you refer! <color=#E5AD0F>Keep Referring, Keep Earning!</color>\n\n<color=green>Note:</color> The racer you have referred to must play one competitive race to claim the reward. '
        },
        3: {
            temp_id: 18,
            title: 'Spin Wheel',
            subtitle: 'Career Journey Day 3 ',
            desc: 'Feeling Lucky? Then go and get your lucky reward from the<color=#E5AD0F> Spin Wheel </color>for free! You will get a free Spin every day so don’t forget to use it and get an exciting reward! Your Luck is determined based on your car’s <color=#E5AD0F>Luck Factor</color>. If you own more than one car then the car with the<color=#E5AD0F> Most Luck Factor</color> will be used to determine your luck. '
        },
        4: {
            temp_id: 3,
            title: 'Missions',
            subtitle: 'Career Journey Day 4 ',
            desc: 'Hello Soldier! You got some missions to accomplish. Go to the<color=#E5AD0F> Missions Panel</color> right now and complete your everyday tasks. You will be <color=#E5AD0F>rewarded with RC</color> for every mission you complete. New missions will be given every day so don’t forget to complete them! Over and out! '
        },
        5: {
            temp_id: 10,
            title: 'Competitive and Tournament Mode ',
            subtitle: 'Career Journey Day 5',
            desc: 'If you want to challenge yourself by playing against skilled real-life players then we got the right thing for you! Play against global players in<color=#E5AD0F> Competitive and Tournament Mode Races!</color>\n\n<color=#E5AD0F>Competitive Mode:</color> In this mode you can pay the entry fee (there is a free entry pot as well) and race in any pot race against other players. Each race <color=#E5AD0F>consumes one charge</color> from that car. Play and earn money, Car XP, Profile XP, Rank RR and most importantly earn<color=#E5AD0F> Daily Leaderboard</color> points which will be used to win rewards.\n\n<color=#E5AD0F>Tournament Mode: </color>This mode is same as the competitive mode, but you don’t have to pay any entry fee and Tournament Leaderboard gives more rewards than<color=#E5AD0F> Daily Leaderboard</color>. This mode will only be available for a short time when there is a Tournament going on. '
        },
        6: {
            temp_id: 18,
            title: 'League System ',
            subtitle: 'Career Journey Day 6 ',
            desc: 'Hey there, are you ready to become the <color=#E5AD0F>RaddX Legend</color>? RaddX has a ranking system in which you can climb your way to the top from Bronze IV to RaddX Legend by winning multiplayer races and gaining Ranked Rating (RR). Players will be matched against other players with a difference of<color=#E5AD0F> +/- 1000 RR</color> for matchmaking.\n\nEach race will have an entry cost of Ranked Rating (RR) based on the current league,\nBronze = Free \nSilver = 10 \nGold = 20 \nPlatinum = 30 \nRaddX Legend = 35\n\nAccording to the result of each race, Ranked Rating (RR) points will be awarded,\nPos 1 = 45\nPos 2 = 40\n Pos 3 = 35\nPos 4 = 0\nPos 5 = 0\n\n<color=green>Note:</color> Once the Season ends, players will be demoted to the bottom most rank of the previous League from their current League. '
        },
        7: {
            temp_id: 18,
            title: 'RaddX Shop ',
            subtitle: 'Career Journey Day 7 ',
            desc: 'Running out of RC? Getting more is very easy! Head to our <color=#E5AD0F>RaddX Shop </color>and grab those exciting deals to get a lot of <color=#E5AD0F>RaddX Coins!!</color>'
        },
        8: {
            temp_id: 5,
            title: 'Leaderboards',
            subtitle: 'Career Journey Day 8',
            desc: 'If you are tired of winning small amount of RC from races then don’t worry because your wins will give you<color=#E5AD0F> Leaderboard points!</color> In Leaderboard get more points than other players and get a huge amount of RC as a reward. There are two leaderboards, <color=#E5AD0F>Competitive Leaderboard </color>and <color=#E5AD0F>Tournament Leaderboard</color>.\n\n<color=#E5AD0F>Competitive Leaderboard:</color> Rewards are given every day based on the points a player gained on that day by playing Competitive Multiplayer Races.\n\n<color=#E5AD0F>Tournament Leaderboard:</color> Rewards are given at the end of the Tournament based on the points a player gained on that particular Tournament. Tournament Leaderboard gives a lot more rewards than Competitive Leaderboard.'
        },
        9: {
            temp_id: 11,
            title: 'Training Mode ',
            subtitle: 'Career Journey Day 9',
            desc: 'Sometimes every pro racer will be having a bad day, if you are having one too then go to the training mode and play against AI Bots and evade the police chase to train yourself and get back to form. Don’t worry about the charge or damage because training mode <color=#E5AD0F>won’t consume any charge </color>and <color=#E5AD0F>won’t cause any damage</color>. You can’t earn any RC, Player XP, Car XP or anything else in training mode except skills. So, try new things, different tactics and improve your skills in Training Mode. '
        },
        10: {
            temp_id: 8,
            title: 'Car Unlocking ',
            subtitle: 'Career Journey Day 10 ',
            desc: 'If you are feeling like you are bored of your current car or your car’s performance is not up to the mark, then head to the <color=#E5AD0F>Garage</color> to unlock new awesome cars with stunning looks and beast like performance and start setting the tracks on fire!!! And one more thing, you can also customize your car’s <color=#E5AD0F>Nameplate </color>anytime you want in the Garage. '
        },
        11: {
            temp_id: 8,
            title: 'Car Performance ',
            subtitle: 'Career Journey Day 11',
            desc: 'Your car’s performance is not a frozen showcase value, it can change based on your usage. There are two factors that affects your car’s performance, <color=#E5AD0F>Car Damage </color>and <color=#E5AD0F>Races Count</color>.\n\n<color=#E5AD0F>Races Count:</color> The performance shown when you bought the car is just the base value. It will gradually increase based on the number of multiplayer races you played using that car. The car will reach its maximum performance when you complete Thousand races using that car.\n\n<color=#E5AD0F>Car Damage:</color> Your car’s current damage has an impact on your car’s performance. Higher the damage is, higher the impact will be. So, repair your car regularly to maintain your car’s performance. '
        },
        12: {
            temp_id: 8,
            title: 'Car Upgrades and Tune-Ups ',
            subtitle: 'Career Journey Day 12',
            desc: 'You might’ve noticed a <color=#E5AD0F>Car XP slider</color> in race result screen and in Garage and be wondering what it is. Well, it’s the car’s XP which is used to <color=#E5AD0F>upgrade your car!</color> For each race you complete with a car, that car’s XP will increase. When the car XP is full, you can upgrade that car to its next level <color=#E5AD0F>(Upgrade costs RC)</color>. You can upgrade your car to a maximum level of<color=#E5AD0F> thirty</color> and upgrading your car has two use cases, <color=#E5AD0F>Visual Upgrade </color>and <color=#E5AD0F>Race Points (RP)</color>.\n\n<color=#E5AD0F>Visual Upgrades:</color> Your car will get a grand visual upgrade at levels 6, 11, 16, 21 and 26. Keep upgrading your car to unlock it.\n\n<color=#E5AD0F>Race Points (RP):</color> Each time you upgrade your car you will get some RP which can be spent on <color=#E5AD0F>Tuning Up </color>your car to make your experience better. There are four tune ups,<color=#E5AD0F> Body Durability</color>,<color=#E5AD0F> Tyre Durability</color>, <color=#E5AD0F>Luck Factor</color> and<color=#E5AD0F> AI Learning</color>. Body Durability and Tyre Durability will reduce the damage taken by a car so that you don’t have to repair your car frequently. Luck Factor increases your luck in Spin Wheel and will increase the probability of getting special powerups in Competitive Race. AI Learning will upgrade the AI Chip and will allow your car’s AI to learn your playstyle faster and better. '
        },
        13: {
            temp_id: 8,
            title: 'Car Body Damage',
            subtitle: 'Career Journey Day 13 ',
            desc: 'Wondering why you have to repair your car’s Body regularly? Here’s why. In <color=#E5AD0F>Competitive and Tournament Races</color> every time you hit an object or a wall or a police car your car will take some damage based on the impact of the hit, you can get a maximum of 1% damage in a single race and once your car reaches 100% damage you can’t play anymore Competitive or Tournament races using that car. Moreover, your car’s <color=#E5AD0F>Top Speed</color> will be reduced based on the body damage it has. So, repair your car regularly to avoid these worst cases.\n\n<color=green>Note:</color> Higher the damage is, higher the repair cost will be. '
        },
        14: {
            temp_id: 8,
            title: 'Car Tyre Damage',
            subtitle: 'Career Journey Day 14 ',
            desc: 'Wondering why you have to repair your car’s Tyre regularly? Here’s why. In <color=#E5AD0F>Competitive and Tournament Races</color> every time you drift your car will take some damage based on the distance you drifted, you can get a maximum of 1% damage in a single race and once your car reaches 100% damage you can’t play anymore Competitive or Tournament races using that car. Moreover, your car’s Handling and Braking will be affected based on the Tyre damage it has. So, repair your car regularly to avoid these worst cases.\n\n<color=green>Note:</color> Higher the damage is, higher the repair cost will be.'
        },
        15: {
            temp_id: 18,
            title: 'Power-Ups',
            subtitle: 'Career Journey Day 15',
            desc: 'Let’s talk about something you love... <color=#E5AD0F>PowerUps!!!</color> Everyone loves powerups but you should know about them completely for more clarity. First of all, powerups are only <color=#E5AD0F>spawned in Competitive Races</color> and some powerups are disadvantageous, there are two types of powerups, <color=#E5AD0F>Normal Powerups</color> and <color=#E5AD0F>Special Powerups</color>.\n\n<color=#E5AD0F>Normal Powerups </color>consists, Booster which will give a speed boost, Dragger which will reduce the current speed, Changer which will keep on changing between Booster and Dragger in a particular time interval, Ramps which is cool and gives a speed boost but not as much as a Booster, and Explosions which will blast your car away and make it recover.\n\n<color=#E5AD0F>Special Powerups</color> consists, RC which will give some RC reward, Charge which will give your car a few charges, Repair which will repair your car’s body damage instantly, Teleport which will teleport you a few meters ahead, Mystery Box which will contain any one of the special powerups except Teleport (sometimes it will contain explosive).\n\nSpecial Powerups are much more useful than Normal Powerups but much harder to take than Normal Powerups. All Normal Powerups will spawn in every race for sure. There can only be one Special Powerup in a race and the probability of getting a Special Powerup is based on your <color=#E5AD0F>Car’s Luck factor</color>.\n'
        },
        16: {
            temp_id: 18,
            title: 'Mystery Box ',
            subtitle: 'Career Journey Day 16 ',
            desc: 'You would’ve seen a KeyCard Powerup in a race. It’s the Mystery Box’s KeyCard. Mystery box is a special powerup which will spawn a KeyCard on the track somewhere. When you collect that KeyCard a Mystery Box will be spawned nearby which you should collect again. The KeyCard is only visible to the player who got the mystery box powerup but once the key is picked up, the spawned Mystery Box will be spawned commonly for everyone, <color=#E5AD0F>whoever picks it first will get it</color> .\n\nMystery Box may contain a special powerup or an explosive based on your <color=#E5AD0F>Car’s Luck Factor</color> , the possible powerups in Mystery Box are <color=#E5AD0F>RC, Charge, Repair </color> or <color=#E5AD0F>Explosive.</color>  '
        },
        17: {
            temp_id: 18,
            title: 'Car Charge System ',
            subtitle: 'Career Journey Day 17 ',
            desc: 'Ever went to a matchmaking and got kicked out because you don’t have enough <color=#E5AD0F>Charge?</color> That\'s because you can’t enter a <color=#E5AD0F>Competitive or Tournament Race</color>  without Charge. You can see your car’s remaining Charge in the <color=#E5AD0F>Garage Attributes Panel</color> . Since all of our cars are <color=#E5AD0F>Electric</color>  you need charge instead of fuel and you’ll get some charge every <color=#E5AD0F>Two Hours</color> . You can also get Charge from <color=#E5AD0F>Spin Wheel</color>  or <color=#E5AD0F>Charge Powerup</color> . There is a <color=#E5AD0F>maximum capacity</color>  for a car’s Charge, the Charge you get every two hours won’t exceed the maximum capacity but the Charge you get from Charge Powerup or Spin Wheel can exceed the maximum capacity. At the end of the day if your car has more Charge than the maximum capacity then that <color=#E5AD0F>extra Charge</color> will be removed. '
        },
        18: {
            temp_id: 18,
            title: 'Perfect Racer, Drifter and Turner Points ',
            subtitle: 'Career Journey Day 18 ',
            desc: '<color=#E5AD0F>Perfect Racer, Drifter and Turner points</color> are added to the <color=#E5AD0F>Leaderboard points</color> at the end of a race. These points might be very useful to reach the top in the Leaderboard. Here’s what you should do to get these points,\n\n<color=#E5AD0F>Perfect Racer Points</color>: This is calculated by checking whether you have stayed in the center of the road or not. Keep going in the <color=#E5AD0F>center of the road</color> instead of going at the edges to get more points.\n\n<color=#E5AD0F>Perfect Drifter Points</color>: Drift as much as possible to get more drifter points but drifting in the same position won’t be calculated.\n\n<color=#E5AD0F>Perfect Turner Points</color>: This point is awarded based on the <color=#E5AD0F>Raceline</color> you follow, find the correct Raceline and stay in that Raceline to get more points. '
        },
        19: {
            temp_id: 18,
            title: 'Race History',
            subtitle: 'Career Journey Day 19 ',
            desc: 'True racers will always look back at what they have accomplished or failed. You can do that too! Go to the Race History Panel from Home Screen and checkout all of your previous race’s history whenever you want. '
        },
        20: {
            temp_id: 6,
            title: 'Profile',
            subtitle: 'Career Journey Day 20 ',
            desc: 'Whether you want to change your <color=#E5AD0F>Nickname</color>, change your <color=#E5AD0F>Avatar</color> or anything else related to your Profile, just open the <color=#E5AD0F>Profile Panel </color>and do all that in one place! '
        },
        21: {
            temp_id: 18,
            title: 'My Winnings ',
            subtitle: 'Career Journey Day 21 ',
            desc: 'Are you earning a lot of RC and don’t know where to keep track of it? We got you! Open you Profile and click on <color=#E5AD0F>My Winnings</color> and stay updated on all of your winnings in races and leaderboards in one place! '
        },
        22: {
            temp_id: 18,
            title: 'Matchmaking ',
            subtitle: 'Career Journey Day 22 ',
            desc: 'Want to know how we choose your opponents? Well, it\'s very simple! Matchmaking will put you in a match with players who are in <color=#E5AD0F>+/- 1000 RR </color>from your RR so that you can play with player who can give you a tough competition. '
        },
        23: {
            temp_id: 18,
            title: 'Autonomous Races in the Future ',
            subtitle: 'Career Journey Day 23 ',
            desc: 'The <color=#E5AD0F>AI Mode</color> section in <color=#E5AD0F>Garage Attributes Panel</color> might seem weird to you because it doesn’t affect anything, but in the next phase of the game <color=#E5AD0F>Autonomous Races</color> will start!! You can just sit back and relax and your <color=#E5AD0F>AI</color> will automatically go to races and keep earning RC for you! The AI Mode section shows the current intelligence level of your car’s AI which is used to read your <color=#E5AD0F>Playstyle</color> and play like you in Autonomous Races. So, Stay Tuned for the <color=#E5AD0F>Autonomous Mode</color>. '
        },
        24: {
            temp_id: 18,
            title: 'AI Learning for Autonomous Race',
            subtitle: 'Career Journey Day 24',
            desc: 'When <color=#E5AD0F>Autonomous mode</color> is unlocked, your car will go to races and will start playing like you! But how does it play like you? That’s what we are going to see here. The AI will keep on tracking your <color=#E5AD0F>Playstyle</color> for <color=#E5AD0F>Hundreds of races</color> and use that information to <color=#E5AD0F>simulate your Playstyle</color>. So, you have to play well to make your AI play well. If you want to improve your car’s <color=#E5AD0F>AI Learning Ability</color> then Tune Up your car’s AI Learning to make it learn better and faster from you. Start preparing your car’s AI now!! '
        },
        25: {
            temp_id: 18,
            title: 'Car Visual Upgrades ',
            subtitle: 'Career Journey Day 25 ',
            desc: 'You already know that your car will get <color=#E5AD0F>Visual Upgrades</color>. So, here is a brief description of what your car will get,\n\n<color=#E5AD0F>At Car Level 6:</color> Bottom Neon Lights\n<color=#E5AD0F>At Car Level 11:</color> Blinking Bottom Neon Lights\n<color=#E5AD0F>At Car Level 16:</color> Neon Rim Lights \n<color=#E5AD0F>At Car Level 21:</color> Trail Behind the Car When Going Fast\n <color=#E5AD0F>At Car Level 26:</color> Full Body Moving Neon Strip Lights \n\nGet these upgrades as fast as you can to be flashier like a lightning on the streets! '
        },
        26: {
            temp_id: 18,
            title: 'Police Chase ',
            subtitle: 'Career Journey Day 26',
            desc: 'We all love to watch a Police Chase but what if you were the one being chased? Experience it in RaddX, evade from the hardworking Police men because their goal is to make the streets safe but our goal is to become the RaddX Legend with thousands of victories. So, race ahead and reach the finish line by evading the cops. Here are a few tips that might help you,\n\nPolice car will stop chasing you if hit them when they are straight in front of you. Police car will stop chasing if you move far away from them. Use the Indicator and Mini-Map to know the police car’s accurate location and steer away accordingly. Police car will stop chasing you if you drive under 80Kmph. Police car’s only objective is to stop in front of you and block you.\n\nHope these tips might help you reach the finish line faster.'
        },
        27: {
            temp_id: 11,
            title: 'Bots in Training Mode',
            subtitle: 'Career Journey Day 27 ',
            desc: 'Sometimes we want to play against opponents but we might not want to play against real players. That’s why <color=#E5AD0F>Bots</color> are here! To give you a sweet challenge with no pressure and to train you. The bots won’t always go easy on you, as you complete more <color=#E5AD0F>Training Sessions</color> the bots and police will get more difficult in <color=#E5AD0F>Training Mode</color>. Pro racers never stop training and you shouldn’t too.  '
        },
        28: {
            temp_id: 10,
            title: 'Opponents Ghosting in Multiplayer ',
            subtitle: 'Career Journey Day 28 ',
            desc: 'Are you fed up by the police in multiplayer races? Then imagine what would happen if your opponent does that to you as well! That\'s why we are <color=#E5AD0F>Ghosting </color>your opponents in <color=#E5AD0F>Multiplayer Races </color>to avoid collisions so that no one can sabotage your game.'
        },
        29: {
            temp_id: 7,
            title: 'Community and Feedback ',
            subtitle: 'Career Journey Day 29 ',
            desc: 'As you already know, we value our player’s satisfaction more than anything! So, help us make RaddX better by sending us your feedback from the <color=#E5AD0F>Feedback Panel</color> in Home Screen or communicate with us through social media (Links in <color=#E5AD0F>Community Panel</color>). Help us improve your experience in <color=#E5AD0F>RaddX!</color> '
        },
        30: {
            temp_id: 18,
            title: 'The Journey of a Racer ',
            subtitle: 'Career Journey Day 30 ',
            desc: 'Hello Racer, you have been in our family for 30 Days now! Our team thanks you for your dedication as a racer. But this is just the beginning! There are still a lot more tracks to rock, opponents to beat, tournaments to win, rivals to race against and Leagues to climb.\n  <color=#E5AD0F>Let the journey of a RaddX Legend Begin!!!</color> '
        },

    }
}