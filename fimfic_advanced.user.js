// ==UserScript==
// @name        FimFiction Advanced
// @description Adds various improvements to FimFiction.net
// @version     4.2
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        https://raw.githubusercontent.com/Sollace/FimFiction-Advanced/master/logo.png
// @include     http://www.fimfiction.net/*
// @include     https://www.fimfiction.net/*
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/ThreeCanvas.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/Events.user.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.core.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.settings.js
// @grant       none
// @run-at      document-start
// ==/UserScript==
const VERSION = '4.2',
      GITHUB = '//raw.githubusercontent.com/Sollace/FimFiction-Advanced/master',
      DECEMBER = (new Date()).getMonth() == 11, CHRIST = DECEMBER && (new Date()).getDay() == 25,
      CURRENT_LOCATION = (document.location.href + ' ').split('fimfiction.net/')[1].trim().split('#')[0];
if (CURRENT_LOCATION.indexOf('login-frame') != -1) throw 'Stopped: Login Frame';
//==================================================================================================
const settingsMan = {
    __get: (key, parse, def) => settingsMan.has(key) ? parse(localStorage[key]) : def,
    keys: () => Object.keys(localStorage),
    has: key => localStorage[key] !== undefined,
    remove: key => localStorage.removeItem(key),
    get: (key, def) => settingsMan.__get(key, a => a, def),
    bool: (key, def) => settingsMan.__get(key, a => a == 'true' || a == '1' || !!a, def),
    int: (key, def) => settingsMan.__get(key, parseInt, def),
    float: (key, def) => settingsMan.__get(key, parseFloat, def),
    set: (key, val, def) => {
        if (def === undefined) def = '';
        if (val === def) return settingsMan.remove(key);
        localStorage[key] = val;},
    setB: (key, bool, def) => settingsMan.set(key, bool ? '1' : '', def),
    flag: (key, value) => {
        let current = (document.lastChild.getAttribute('FimFic_Adv') || '').split(',').filter(i => i != key && i != '');
        if (value) current.push(key);
        document.lastChild.setAttribute('FimFic_Adv', current.join(','));}
};

//-------------------------------------------DATA---------------------------------------------------
const defaultSig = "%message%\n\n--[i]%name%[/i]";
const backgroundImages = [
    BG("Light",`url(${GITHUB}/backgrounds/cloth.png)`),
    BG("Dark",`url(${GITHUB}/backgrounds/cloth_dark.png)`),
    BG("Rain",`url(${GITHUB}/backgrounds/rain.png)`),
    BG("Wave",`url(${GITHUB}/backgrounds/wave.png)`),
    BG("Zecora",`url(${GITHUB}/backgrounds/zecora.png)`),
    BG("Sunny Skies",`url(${GITHUB}/backgrounds/sunny_days.png)`),
    BG("Pinkie Pie",`url(${GITHUB}/backgrounds/pinkie_0.png) fixed right,url(${GITHUB}/backgrounds/pinkie_0.png), url(${GITHUB}/backgrounds/pinkie_1.png)`),
    BG("Diary",`url(${GITHUB}/backgrounds/book_0.png) fixed bottom -150px right -50px no-repeat, url(${GITHUB}/backgrounds/star.png)`),
    BG("School House", `url(${GITHUB}/backgrounds/house_0.png) bottom 100px left no-repeat, url(${GITHUB}/backgrounds/whispy2.png) top 30px center`),
    BG("Sky", `url(${GITHUB}/backgrounds/whispy.png) top 30px center, url(${GITHUB}/backgrounds/star.png) fixed`),
    BG("Twilight Sparkle", `url(${GITHUB}/backgrounds/twilight_1.png) fixed right,url(${GITHUB}/backgrounds/twilight_sparkle.png),url(${GITHUB}/backgrounds/twilight_2.png) fixed right`),
    BG("Rarity", `url(${GITHUB}/backgrounds/rarity_1.png),url(${GITHUB}/backgrounds/cloth.png),url(${GITHUB}/backgrounds/rarity_0.png)`),
    BG("Cobble", `url(${GITHUB}/backgrounds/cobble.png)`),
    BG("Glass", `url(${GITHUB}/backgrounds/glass.png) top center`),
    BG("Sonic Rainboom", "url(//fc00.deviantart.net/fs70/f/2012/132/1/d/sonic_rainboom_by_knight33-d4zgfjy.jpg) fixed 100% center", "//knight33.deviantart.com/art/Sonic-Rainboom-301417918"),
    CBG('kp', '60% 60%', BG("Rainbow Dash", "url('//fc01.deviantart.net/fs71/i/2013/269/9/8/rainbow_dash_by_up1ter-d6nz0tp.png') top left -500px no-repeat, url('//fc09.deviantart.net/fs70/i/2012/067/2/0/rainbow_dash_by_up1ter-d4s3nbk.png') bottom -30px right -500px no-repeat, url('//fc02.deviantart.net/fs70/i/2012/032/d/8/rainbow_dash_by_up1ter-d4obti3.png') bottom 270px left -60px no-repeat", "//up1ter.deviantart.com/")),
    CBG('d', BG("PinkieScape", `url(${GITHUB}/backgrounds/land.png) no-repeat fixed top 200px center / 100% auto, url(${GITHUB}/backgrounds/sky.png) local top left -300px / 100% auto`)),
    BG("Wool", `url(${GITHUB}/backgrounds/wool.png)`),
    BG("Lunar Nights", `url(${GITHUB}/backgrounds/lunar_nights.png)`),
    BG("Plain Denim", `url(${GITHUB}/backgrounds/feather.png),url(${GITHUB}/backgrounds/noise.png)`),
    BG("Buy Some Apples", `url(${GITHUB}/backgrounds/feather.png),url(//fc03.deviantart.net/fs71/i/2014/039/9/3/applejack_noms_an_apple_by_dasprid-d75nj5r.png) no-repeat fixed bottom right / 100% auto,url(${GITHUB}/backgrounds/noise.png)`, "//benybing.deviantart.com/art/Applejack-noms-an-Apple-432759231"),
    CBG('c', BG("Classic", `url(${GITHUB}/backgrounds/classic.png) bottom 270px center repeat-x, url(${GITHUB}/backgrounds/noise.png)`)),
    BG("Whispy", `url(${GITHUB}/backgrounds/whispy.png) top 30px center, url(${GITHUB}/backgrounds/noise.png)`),
    BG("Poni 2.0", `url(${GITHUB}/backgrounds/poni_2.png)`)
];
const icons = ["adjust","adn","align-center","align-justify","align-left","align-right","ambulance","anchor","android","angellist","angle-double-down","angle-double-left","angle-double-right","angle-double-up","angle-down","angle-left","angle-right","angle-up","apple","archive","area-chart","arrow-circle-down","arrow-circle-left","arrow-circle-o-down","arrow-circle-o-left","arrow-circle-o-right","arrow-circle-o-up","arrow-circle-right","arrow-circle-up","arrow-down","arrow-left","arrow-right","arrow-up","arrows","arrows-alt","arrows-h","arrows-v","asterisk","at","automobile","backward","ban","bank","bar-chart","bar-chart-o","barcode","bars","beer","behance","behance-square","bell","bell-o","bell-slash","bell-slash-o","bicycle","binoculars","birthday-cake","bitbucket","bitbucket-square","bitcoin","bold","bolt","bomb","book","bookmark","bookmark-o","briefcase","btc","bug","building","building-o","bullhorn","bullseye","bus","cab","calculator","calendar","calendar-o","camera","camera-retro","car","caret-down","caret-left","caret-right","caret-square-o-down","caret-square-o-left","caret-square-o-right","caret-square-o-up","caret-up","cc","cc-amex","cc-discover","cc-mastercard","cc-paypal","cc-stripe","cc-visa","certificate","chain","chain-broken","check","check-circle","check-circle-o","check-square","check-square-o","chevron-circle-down","chevron-circle-left","chevron-circle-right","chevron-circle-up","chevron-down","chevron-left","chevron-right","chevron-up","child","circle","circle-o","circle-o-notch","circle-thin","clipboard","clock-o","close","cloud","cloud-download","cloud-upload","cny","code","code-fork","codepen","coffee","cog","cogs","columns","comment","comment-o","comments","comments-o","compass","compress","copy","copyright","credit-card","crop","crosshairs","css3","cube","cubes","cut","cutlery","dashboard","database","dedent","delicious","desktop","deviantart","digg","dollar","dot-circle-o","download","dribbble","dropbox","drupal","edit","eject","ellipsis-h","ellipsis-v","empire","envelope","envelope-o","envelope-square","eraser","eur","euro","exchange","exclamation","exclamation-circle","exclamation-triangle","expand","external-link","external-link-square","eye","eye-slash","eyedropper","facebook","facebook-square","fast-backward","fast-forward","fax","female","fighter-jet","file","file-archive-o","file-audio-o","file-code-o","file-excel-o","file-image-o","file-movie-o","file-o","file-pdf-o","file-photo-o","file-picture-o","file-powerpoint-o","file-sound-o","file-text","file-text-o","file-video-o","file-word-o","file-zip-o","files-o","film","filter","fire","fire-extinguisher","flag","flag-checkered","flag-o","flash","flask","flickr","floppy-o","folder","folder-o","folder-open","folder-open-o","font","forward","foursquare","frown-o","futbol-o","gamepad","gavel","gbp","ge","gear","gears","gift","git","git-square","github","github-alt","github-square","gittip","glass","globe","google","google-plus","google-plus-square","google-wallet","graduation-cap","group","h-square","hacker-news","hand-o-down","hand-o-left","hand-o-right","hand-o-up","hdd-o","header","headphones","heart","heart-o","history","home","hospital-o","html5","ils","image","inbox","indent","info","info-circle","inr","instagram","institution","ioxhost","italic","joomla","jpy","jsfiddle","key","keyboard-o","krw","language","laptop","lastfm","lastfm-square","leaf","legal","lemon-o","level-down","level-up","life-bouy","life-buoy","life-ring","life-saver","lightbulb-o","line-chart","link","linkedin","linkedin-square","linux","list","list-alt","list-ol","list-ul","location-arrow","lock","long-arrow-down","long-arrow-left","long-arrow-right","long-arrow-up","magic","magnet","mail-forward","mail-reply","mail-reply-all","male","map-marker","maxcdn","meanpath","medkit","meh-o","microphone","microphone-slash","minus","minus-circle","minus-square","minus-square-o","mobile","mobile-phone","money","moon-o","mortar-board","music","navicon","newspaper-o","openid","outdent","pagelines","paint-brush","paper-plane","paper-plane-o","paperclip","paragraph","paste","pause","paw","paypal","pencil","pencil-square","pencil-square-o","phone","phone-square","photo","picture-o","pie-chart","pied-piper","pied-piper-alt","pinterest","pinterest-square","plane","play","play-circle","play-circle-o","plug","plus","plus-circle","plus-square","plus-square-o","power-off","print","puzzle-piece","qq","qrcode","question","question-circle","quote-left","quote-right","ra","random","rebel","recycle","reddit","reddit-square","refresh","remove","renren","reorder","repeat","reply","reply-all","retweet","rmb","road","rocket","rotate-left","rotate-right","rouble","rss","rss-square","rub","ruble","rupee","save","scissors","search","search-minus","search-plus","send","send-o","share","share-alt","share-alt-square","share-square","share-square-o","shekel","sheqel","shield","shopping-cart","sign-in","sign-out","signal","sitemap","skype","slack","sliders","slideshare","smile-o","soccer-ball-o","sort","sort-alpha-asc","sort-alpha-desc","sort-amount-asc","sort-amount-desc","sort-asc","sort-desc","sort-down","sort-numeric-asc","sort-numeric-desc","sort-up","soundcloud","space-shuttle","spinner","spoon","spotify","square","square-o","stack-exchange","stack-overflow","star","star-half","star-half-empty","star-half-full","star-half-o","star-o","steam","steam-square","step-backward","step-forward","stethoscope","stop","strikethrough","stumbleupon","stumbleupon-circle","subscript","suitcase","sun-o","superscript","support","table","tablet","tachometer","tag","tags","tasks","taxi","tencent-weibo","terminal","text-height","text-width","th","th-large","th-list","thumb-tack","thumbs-down","thumbs-o-down","thumbs-o-up","thumbs-up","ticket","times","times-circle","times-circle-o","tint","toggle-down","toggle-left","toggle-off","toggle-on","toggle-right","toggle-up","trash","trash-o","tree","trello","trophy","truck","try","tty","tumblr","tumblr-square","turkish-lira","twitch","twitter","twitter-square","umbrella","underline","undo","university","unlink","unlock","unlock-alt","unsorted","upload","usd","user","user-md","users","video-camera","vimeo-square","vine","vk","volume-down","volume-off","volume-up","warning","wechat","weibo","weixin","wheelchair","wifi","windows","won","wordpress","wrench","xing","xing-square","yahoo","yelp","yen","youtube","youtube-play","youtube-square"];
const logos = 'Default;Rainbow Dash;Twilight Sparkle;Pinkie Pie;Rarity;Applejack;Fluttershy;Lyra Heartstrings;Octavia;Vinyl Scratch;Derpy Hooves;Celestia;Luna;Sunset Shimmer;Starlight Glimmer;Coloratura'.split(';').map(LOGO);
var banners = [];
let theme = 0;
let customBanner, customBannerindex = -1;
const animator = new Animator();
const slider = new Slider();
const bannerController = new BannerController([
    { name: "Default", items: [
        Ban("zecora", "//aeronjvl.deviantart.com/art/Hanging-by-the-Edge-327757722", "#A46E3C"),
        Ban("aeron_fluttershy", "//aeronjvl.deviantart.com/art/Nature-326303180", "#A47A3C"),
        Ban("aeron_philomena", "//ajvl.deviantart.com/art/Philomena-Equestria-s-Finest-Phoenix-310217164", "#4C7A7E"),
        Ban("aeron_celestia", "//aeronjvl.deviantart.com/art/Path-to-Canterlot-340639474", "#4C7E6E"),
        Ban("derpy_dash", "//ponykillerx.deviantart.com/art/Full-Armour-D-vs-D-288729315", "#57666F"),
        Ban("ponykiller_trixie", "//ponykillerx.deviantart.com/art/No-Title-Wallpaper-Version-287646346", "#534C79"),
        Ban("maplesunrise_pinkiedash", "//derpibooru.org/67621", "rgb(151, 113, 83)"),
        Ban("yamio_fluttershy", "//yamio.deviantart.com/art/Fluttershy-285372865", "#8C9753"),
        Ban("smitty_derpy", "//smittyg.deviantart.com/art/Derpy-for-Kiyoshi-296594056", "rgb(128, 128, 128)"),
        Ban("smitty_twi", "//smittyg.deviantart.com/", "rgb(79, 101, 156)"),
        Ban("ratofdrawn_1", "//ratofdrawn.deviantart.com/art/Wet-Fun-317158001", "#92A43C"),
        Ban("ratofdrawn_rarijack", "//ratofdrawn.deviantart.com/art/Differences-343226962", "#6485BE"),
        Ban("jinzhan_applejack", "http://jinzhan.deviantart.com/art/Applejack-325292534", "rgb(164, 68, 60)"),
        Ban("jinzhan_group", "//jinzhan.deviantart.com/art/There-are-alligators-in-the-lake-271094454", "rgb(105, 126, 133)"),
        Ban("solar_luna", "//soapie-solar.deviantart.com/art/Chibi-Luna-Star-Fishing-340002341", "#483CA4"),
        Ban("solar_group", "//soapie-solar.deviantart.com/art/Forest-Foundation-283012970", "#83A43C"),
        Ban("uc77_1", "//uc77.deviantart.com/art/Ponies-Dig-Giant-Robots-281071953", "#A4873C"),
        Ban("cmaggot_fluttershy", "//cmaggot.deviantart.com/art/Dangerous-Mission-342068171", "#4D3CA4"),
        Ban("rainbow_ss", "//derpibooru.org/41558", "#A4723C"),
        Ban("rainbow_markerpone", "//derpibooru.org/131068", "#456460"),
        Ban("rainbow_roseluck", "//derpibooru.org/50361", "#A43C98"),
        Ban("jj_trixie", "//johnjoseco.deviantart.com/art/Trixie-s-Life-is-so-Hard-340685374", "#3C72A4"),
        Ban("anima_1", "https://derpibooru.org/90167", "#3C76A4"),
        Ban("mew_pinkie", "//mewball.deviantart.com/art/Reflect-338427890", "#3C93A4"),
        Ban("tsitra_dash", "//tsitra360.deviantart.com/art/Morning-Flight-331710988", "#3A59A4"),
        Ban("knifeh_scoots", "//knifeh.deviantart.com/art/Scootaloo-326771443", "#A47F3C"),
        Ban("noben_celestia", "//noben.deviantart.com/art/Sunrise-in-Equestria-280309698", "#A4593C"),
        Ban("ep_shady_trough", "//equestria-prevails.deviantart.com/art/The-Shady-Trough-319986368", "#4D3CA4"),
        Ban("spittfire_1", "//spittfireart.deviantart.com/art/The-Report-Commission-340421670", "#3C55A4"),
        Ban("blitzpony_luna", "//blitzpony.deviantart.com/art/S-hard-to-say-359899432", "#4B4D55"),
        Ban("gsphere_scoots", "//lionel23.deviantart.com/art/The-Newbie-set-an-Academy-Record-356826950", "#477FB3"),
        Ban("stoic_celestia", "//thestoicmachine.deviantart.com/art/Radiant-Malevolence-213959523", "#706CA7"),
        Ban("moe_canterlot", "//derpibooru.org/25", "#867D58"),
        Ban("alasou_costumes", "//alasou.deviantart.com/art/Costume-Swap-party-381670764", "#775886"),
        Ban("pridark_luna", "//pridark.deviantart.com/art/A-Wonderful-Night-381504014", "#525A8F"),
        Ban("gign_flutterdash", "//gign-3208.deviantart.com/art/In-the-attic-377732207", "#A55744"),
        Ban("goben_forest", "//noben.deviantart.com/art/Giggling-at-the-Ghosties-356451219", "#556B80"),
        Ban("devinian_lyra_bonbon", "//devinian.deviantart.com/art/Story-of-the-bench-373750983", "#68885A"),
        Ban("devinian_fluttershy", "//devinian.deviantart.com/art/Picnic-with-Kindness-351639714", "#749142"),
        Ban("jackalynn_pinkiedash", "//jack-a-lynn.deviantart.com/art/Following-the-Rainbow-288432950", "#4584B6"),
        Ban("yakovlev_fluttershy", "//yakovlev-vad.deviantart.com/art/Simple-curiosity-468468925", "#5E7520"),
        Ban("yakovlev_twilight", "//yakovlev-vad.deviantart.com/art/Time-to-wash-3-490390076", "#9E75A9"),
        Ban("mymagicdream_twilight", "//my-magic-dream.deviantart.com/art/Twilight-453477065", "#77599A")
    ]},
    { name: "Advanced", items: [
        Ban2("sleeping_bath_bloom", "//derpibooru.org/262355", "#921B57"),
        Ban2("flutterby_dash", "//derpibooru.org/250982", "#D771A4"),
        Ban2("mommy_derp", "//derpibooru.org/96418", "rgb(189,198,205)"),
        Ban2("flutter_bite", "//johnjoseco.deviantart.com/art/Just-One-Bite-422922104", "#6E1414"),
        Ban2("movie_night", "//dracodile.deviantart.com/art/Movie-night-343553193", "#704582"),
        Ban2("antipodes", "//www.fimfiction.net/user/ToixStory", "#ECBC6A"),
        Ban2("steampunk", "//hinoraito.deviantart.com/art/MLP-FIM-Commission-Steampunk-ponies-293033624", "#764D17"),
        Ban2("flutter_bee", "//atteez.deviantart.com/art/Flutterbee-437641542", "#92A43C"),
        Ban2("cmc_roped", "//spittfireart.deviantart.com/art/Cutie-Mark-Crusaders-365513354", "#6485BE"),
        Ban2("twi_revenge", "//zacatron94.deviantart.com/art/Revenge-446974245", "#4B2164"),
        Ban2("solar_flare", "//zodiacnlh.deviantart.com/art/solar-flare-457056305", "#AD160B", ["right",0,"center",0]),
        Ban2("serene", "//rain-gear.deviantart.com/art/A-Quiet-Place-to-Read-434204811", "#2E737A"),
        Ban2("nightwork", "//yakovlev-vad.deviantart.com/art/Nightwork-493323738", "#9E75A9"),
        Ban2("shamanguli_princess", "//shamanguli.deviantart.com/art/Playground-for-a-Princess-512544966", "#6E6756"),
        Ban2("yakovlev_trap", "//yakovlev-vad.deviantart.com/art/The-trap-Patreon-reward-548854581", "#694255", ["center",0,"bottom",0])
    ]}
]);
const colours = {Mapping: {}, Keys: [], Names: [], NamesLower: [], Sets: {
    'Standard Colours': [false, [0,73,70,68,107,59,103,24,112]],
    'FimFiction': [false, range(113,127)],
    'Mane Six': [false, range(128, 133)],
    'More Colours': [true, range(0,112)] }
};
'White:#FFFFFF;Pink:#FFC0CB;PeachPuff:#FFDAB9;Gainsboro:#DCDCDC;LightPink:#FFB6C1;Moccasin:#FFE4B5;NavajoWhite:#FFDEAD;Wheat:#F5DEB3;LightGray:#D3D3D3;PaleTurquoise:#AFEEEE;PaleGoldenRod:#EEE8AA;Thistle:#D8BFD8;PowderBlue:#B0E0E6;LightBlue:#ADD8E6;PaleGreen:#98FB98;LightSteelBlue:#B0C4DE;LightSkyBlue:#87CEFA;Silver:#C0C0C0;Aquamarine:#7FFFD4;LightGreen:#90EE90;Plum:#DDA0DD;Khaki:#F0E68C;LightSalmon:#FFA07A;SkyBlue:#87CEEB;Violet:#EE82EE;LightCoral:#F08080;Salmon:#FA8072;HotPink:#FF69B4;BurlyWood:#DEB887;DarkSalmon:#E9967A;Tan:#D2B48C;MediumSlateBlue:#7B68EE;SandyBrown:#F4A460;DarkGray:#A9A9A9;CornFlowerBlue:#6495ED;Coral:#FF7F50;PaleVioletRed:#DB7093;MediumPurple:#9370DB;RosyBrown:#BC8F8F;Orchid:#DA70D6;DarkSeaGreen:#8FBC8B;Tomato:#FF6347;MediumAquamarine:#66CDAA;GreenYellow:#ADFF2F;IndianRed:#CD5C5C;MediumOrchid:#BA55D3;DarkKhaki:#BDB76B;SlateBlue:#6A5ACD;RoyalBlue:#4169E1;Turquoise:#40E0D0;DodgerBlue:#1E90FF;MediumTurquoise:#48D1CC;DeepPink:#FF1493;LightSlateGray:#778899;BlueViolet:#8A2BE2;Peru:#CD853F;SlateGray:#708090;Gray:#808080;Magenta:#FF00FF;Blue:#0000FF;DeepSkyBlue:#00BFFF;CadetBlue:#5F9EA0;Cyan:#00FFFF;SpringGreen:#00FF7F;Lime:#00FF00;LimeGreen:#32CD32;Chartreuse:#7FFF00;YellowGreen:#9ACD32;Yellow:#FFFF00;Gold:#FFD700;Orange:#FFA500;DarkOrange:#FF8C00;OrangeRed:#FF4500;Red:#FF0000;DarkOrchid:#9932CC;LawnGreen:#7CFC00;Steelblue:#4682B4;MediumSpringGreen:#00FA9A;GoldenRod:#DAA520;Crimson:#DC143C;Chocolate:#D2691E;MediumSeaGreen:#3CB371;MediumVioletRed:#C71585;FireBrick:#B22222;DarkViolet:#9400D3;LightSeaGreen:#20B2AA;DimGray:#696969;DarkTurquoise:#00CED1;Brown:#A52A2A;MediumBlue:#0000CD;Sienna:#A0522D;DarkSlateBlue:#483D8B;DarkGoldenRod:#B8860B;SeaGreen:#2E8B57;OliveDrab:#6B8E23;ForestGreen:#228B22;SaddleBrown:#8B4513;DarkOliveGreen:#556B2F;DarkMagenta:#8B008B;DarkBlue:#00008B;DarkCyan:#008B8B;DarkRed:#8B0000;MidnightBlue:#191970;Indigo:#4B0082;Purple:#800080;Navy:#000080;Teal:#008080;Green:#008000;Olive:#808000;Maroon:#800000;DarkSlateGray:#2F4F4F;DarkGreen:#006400;Black:#000000;Grey:#666666;Light Grey:#CCCCCC;Dark Grey:#383838;Red:#BE4343;Orange:#BE7A43;Yellow:#AFA426;Lime Green:#7AAF26;Green:#2CAF26;Turquoise:#26AF6D;Light Blue:#26A4AF;Blue:#265DAF;Purple:#3C26AF;Violet:#9426AF;Pink:#AF2673;Brown:#5F4432;Twilight Sparkle:#A66EBE;Rarity:#5E51A3;Applejack:#E97135;Pinkie Pie:#EA80B0;Rainbow Dash:#6AAADD;Fluttershy:#E6B91F'.split(';').forEach(a => {
    a = a.split(':');
    colours.Keys.push(a[1]);
    colours.Names.push(a[0]);
    colours.NamesLower.push(a[0].toLowerCase());
    colours.Mapping[a[1]] = a[0];
});
let snower, userToolbar;

//--------------------------------------BOILER PLATE------------------------------------------------

patchEvents();
//Run it a second time in global scope to ensure greasmonkey doesn't mess with the context
window.override = override;
RunScript(patchEvents, true);
earlyStart();
document.addEventListener("DOMContentLoaded", () => {
    if (!document.querySelector('.body_container')) return;
    initGlobals();
    let stage = 'Ready-init';
    const start = (new Date()).getTime();
    try {
        addFooterData(`Page running <a>FimFiction Advanced ${VERSION}</a>`);
        document.lastChild.setAttribute('FimFic_Adv', '');
        stage = 'Init';
        initFimFictionAdvanced();
        stage = 'Settings Tag';
        FimFicSettings.SettingsTab('Advanced', 'Advanced Settings', 'fimfiction_advanced', 'fa fa-wrench', 'My Account', 'cog', buildSettingsTab);
        stage = 'Events';
        registerEvents();
        stage = 'End-init';
        addFooterData(`Script applied in <a>${((new Date()).getTime() - start)/1000} seconds</a>`);
    } catch (e) {
        console.error(`FimficAdv: Unhandled Exception in ${stage}`);
        console.error(e);
    }
});

function patchEvents() {
    override(EventTarget.prototype, 'addEventListener', function(ev, f, c) {
        if (!this.eventListeners) this.eventListeners = {};
        if (!this.eventListeners[ev]) this.eventListeners[ev] = [];
        this.eventListeners[ev].push(f);
        return EventTarget.prototype.addEventListener.super.apply(this, arguments);
    });
    override(EventTarget.prototype, 'removeEventListener', function(ev, f) {
        let l = this.getEventListeners(ev), i = l.indexOf(f);
        if (i > -1) l.splice(i, 1);
        return EventTarget.prototype.removeEventListener.super.apply(this, arguments); 
    });
    EventTarget.prototype.removeEventListeners = function(event) {
        this.getEventListeners(event).forEach(f => this.removeEventListener(event, f));
    };
    EventTarget.prototype.getEventListeners = function(event) {
        return (this.eventListeners && this.eventListeners[event]) ? this.eventListeners[event] : [];
    };
    override(window.Function.prototype, 'bind', function(context) {
        const result = this.bind.super.apply(this, arguments);
        result.unbound = this;
        result.context = context;
        return result;
    });
}

//---------------------------------------SCRIPT BODY------------------------------------------------

function initGlobals() {
    if (!userToolbar) userToolbar = document.querySelector('.user_toolbar');
}

function earlyStart() {
  (function css() {
      if (document.body) {
        if (bannerController.getEnabled()) (function banner() {
            if (canLoadBanners()) return bannerController.build();
            requestAnimationFrame(banner);
        })();
        return addCss();
      }
      requestAnimationFrame(css);
  })();
  
  function canLoadBanners() {
    if ((userToolbar = userToolbar || document.body.querySelector('.user_toolbar'))) {
      return !!document.querySelector('.user-page-header, .story-page-header, .footer');
    }
    return false;
  }
}

function initFimFictionAdvanced() {
    updateLogo();
    initCommentArea();
    applyBackground(getBGColor());
    applyCustomFont();
    applyChapterButtons();
    if (isMyBlogPage()) initBlogPage();
    bannerController.buildAll();
    initBBCodeController();
    if (getBlockLightbox()) lightboxblocker();
    if (getPinUserbar()) barScrollOn();
    bannerController.initFancy();
    if (CURRENT_LOCATION.indexOf('feed') == 0) {
        applyFeedFix();
        animator.on('feed', pinnerFunc('.feed-toolbar', 'feed'));
    }
    applyCodePatches();
    if (getSweetieEnabled()) setupSweetie();
    if (slider.getSlide()) slider.updateSlide();
    applySnowing(getBGSnow(), getSnowing());
}

function registerEvents() {
    FimFicEvents.on('aftereditmodule aftercomposepm afterpagechange afteraddcomment', initCommentArea);
    FimFicEvents.on('aftertoolbar', addExtraToolbarLinks);
    if (CURRENT_LOCATION.indexOf('manage_user/messages/') != 0) startCommentHandler();
}

//--------------------------------------------------------------------------------------------------
//----------------------------------------FUNCTIONS-------------------------------------------------
//--------------------------------------------------------------------------------------------------

function buildSettingsTab(tab) {
    tab.StartEndSection("General Settings");
    tab.AddCheckBox("pub", "Sticky Userbar", getPinUserbar()).addEventListener('change', setPinUserbar);
    tab.AddCheckBox("wat", "Wide Author's Notes", getWideNotes()).addEventListener('change', setWideNotes);
    tab.AddCheckBox("unsp", "Always show posted Images", getAlwaysShowImages()).addEventListener('change', setAlwaysShowImages);
    tab.AddCheckBox("unlit", "Block Lightboxes (image popups)", getBlockLightbox()).addEventListener('change', setBlockLightbox);
    tab.AddCheckBox("sb", "Show Sweetie Scepter", getSweetieEnabled()).addEventListener('change', setSweetieEnabled);

    fillFontOptGroups(tab.AddDropDown("ffs", "Site Font", []));

    const chapWid = tab.AddTextBox("cwt", "Chapter Width");
    addTooltip("Acceps values in three formats:em, px, and %<br />Eg. 80px, 5em, 100%<br />If no format is specified em will be used<br />Default: 46em", chapWid);
    chapWid.value = getStoryWidth();
    chapWid.addEventListener('change', setStoryWidth);
    
    tab.StartEndSection("Banners");
    tab.AddCheckBox("eb", "Enable Banners", bannerController.getEnabled()).addEventListener('change', compose(bannerController.setEnabled, updateBannersOptions));
    tab.AddCheckBox("fancyB", "Enable Fancy Banners", bannerController.getFancy()).addEventListener('change', bannerController.setFancy);
    tab.AddCheckBox("hb", "Compact Banner", getTitleHidden()).addEventListener('change', setTitleHidden);
    const enableSlide = tab.AddDropDown("sl", "Banner Slide Show", slider.labels(), slider.getSlide());
    enableSlide.addEventListener('change', e=> slider.setSlide(e, updateSliderOptions));
    tab.AddCheckBox("shuf", "Shuffle Slide Show", slider.getShuffle()).addEventListener('change', slider.setShuffle);
    updateSliderOptions();
    
    tab.StartEndSection("Christmasy Stuff");
    const enableUSnow = tab.AddDropDown("us", "Snow", ["Always On", "Default", "Always Off"], getSnowing());
    enableUSnow.addEventListener('change', compose(setSnowing, updateSnowOptions));
    tab.AddCheckBox("uss", "Snow In Banner", getBGSnow()).addEventListener('change', setBGSnow);
    tab.AddCheckBox('pus', 'Pause Snow when lost focus', getSaveFocus()).addEventListener('change', setSaveFocus);
    updateSnowOptions();
    
    tab.StartEndSection("Colours and Customization");
    var oldLogo = tab.AddDropDown("ologo", "Logo Image", getLogoNames(), getLogo());
    oldLogo.innerHTML = '<option value="-1">Random</option>' + oldLogo.innerHTML;
    oldLogo.addEventListener('change', setLogo);
    var bgcolor = getBGColor();
    var backgroundImg = null;
    makeStyle(".body_container {transition: background-color 0.125s ease;}", "Fimfiction_Advanced_T");
    const colorPick = tab.AddColorPick("bg", "Background Colour", bgcolor == 'transparent' ? '' : bgcolor, me => {
        me.value = me.value.trim();
        if (me.value.length) {
            if (me.value.indexOf('#') !== 0) {
                me.value = rgbToHex(extractColor(me.value));
            }
        }
        
        applyBackground(setBGColor(me.value));
        var i = backgroundImg.length - 1;
        while (i--) backgroundImg[i].children[0].style.backgroundColor = me.value;
    });
    const camera = tab.AppendButton(colorPick, '<i class="fa fa-camera"></i>From Toolbar');
    camera.addEventListener('click', () => {
        colorPick.value = rgb2hex(userToolbar.dataset.backgroundColor);
        colorPick.change();
    });
    camera.style.marginLeft = '10px';
		
    backgroundImg = tab.AddPresetSelect("bgI", "Background Image", backgroundImages.length + 2, true, 1);
    backgroundImg.add(el => populateBGSelect(el, 'None', '', () => {
        setBackgroundImg(-2);
        applyBackground(getBGColor());
    }))
    backgroundImg.add(el => populateBGSelect(el, 'Default', window.getComputedStyle(document.body).backgroundImage, () => {
			setBackgroundImg(-1);
			colorPick.value = '';
			colorPick.change();
			setBGColor('transparent');
			applyBackground(getBGColor());
    }));
    backgroundImages.forEach((a,  i) => backgroundImg.add(el => a.Setup(el, bgcolor, i)));
    
    function populateBGSelect(element, title, bgimg, callback) {
        element.children[1].innerHTML = title;
        element.children[0].style.backgroundColor = bgcolor;
        element.children[0].style.opacity = 0.8;
        element.style.backgroundImage = bgimg;
        element.addEventListener('click', callback);
    }
    
    addDelegatedEvent(backgroundImg.element, '.premade_settings', 'click', (e, target) => {
        const other = backgroundImg.element.querySelector('.premade_settings_selected');
        if (other) other.classList.remove('premade_settings_selected');
        target.classList.add('premade_settings_selected');
    });
    
    const bgIndex = backgroundImg.element.querySelector(`[data-index="${getBGIndex() + 2}"]`);
    if (bgIndex) bgIndex.classList.add('premade_settings_selected');
    
    tab.AddPresetSelect("bannerCust", "Custom Banner", 1, false).add(el => {
        el.children[1].innerHTML = '<i class="fa fa-pencil fa-5x"></i>';
        el.style.width = '100%';
        el.style.textAlign = 'center';
        el.children[0].style.color = 'black';
        el.children[0].style.textShadow = '1px 1px 0px rgba(255, 255, 255, 0.15)';
        el.style.backgroundSize = '100%';
        el.addEventListener('click', () => createCustomBannerPopup(el));
        if (customBanner) repaintBannerButton(el, customBanner);
    });
    updateBannersOptions();
    
    tab.StartEndSection("Signatures");
    
    const sigText = tab.AddTextArea("sig", '', getSig());
    sigText.style.minHeight = '150px';
    sigText.style.minWidth = '100%';
    sigText.style.resize = 'vertical';
    addTooltip(`<u>Magic Strings</u><br ><div style='display:table;white-space:nowrap;'><div style='display:table-cell;padding-right:5px;'>
    ${['%name% - the name of the current user',
       '%message% - posted comment',
       '%year% - The Year eg: 2014',
       '%MONTH% - Month of year',
       '%DAY% - Day of month',
       '%month% - Name of month',
       '%day% - Day of Week',
       '%hour% - Current hour in 24 hour format',
       '%min% - Minute',
       '%sec% - Second'].join('<br>')}</div></div>`, sigText);
    sigText.insertAdjacentHTML('afterend', '<div class="sigPreview" style="min-height:150px;min-width:100%"></div>');
    const sigPrev = sigText.nextSibling;
    sigText.addEventListener('change', () => setSig(sigText.value));
    tab.AppendResetButton(sigText).addEventListener('click', () => {
        sigText.value = defaultSig;
        setSig(sigText.value);
    });
    
    let sig = sigText.parentNode.parentNode.parentNode.firstChild;
    const userTile = getUserCommentThumb(128);
    userTile.insertAdjacentHTML('beforeend', `<style type="text/css">
        .properties td.label .comment .author .avatar {margin-left: 0;margin-right: 0;}
        .properties td.label .comment .author {float: right;}</style>`);
    sig.style.verticalAlign = 'top';
    sig.style.paddingTop = '0px';
    sig.appendChild(userTile);
    
    const previewButton = tab.AppendButton(sigText, 'Preview');
    previewButton.classList.add('previewButton');
    previewButton.addEventListener('click', e => {
        previewButton.innerHTML = sigText.classList.contains('sigPreviewing') ? 'Preview' : 'Edit';
        previewButton.classList.toggle('styled_button_green');
        previewButton.classList.toggle('styled_button_blue');
        sigText.classList.toggle('sigPreviewing');
        sigPrev.innerHTML = previewSig();
    });
    
    function updateBannersOptions() {
        tab.SetEnabled(`#fancyB,#hb,#sl,#shuf,#bannerCust${enableUSnow.selectedIndex < 2 ? ',#uss' : ''}`, bannerController.getEnabled());
    }
    
    function updateSliderOptions() {
        tab.SetEnabled('#shuf', enableSlide.selectedIndex);
    }
    
    function updateSnowOptions() {
        tab.SetEnabled('#pus' + (bannerController.getEnabled() ? ',#uss' : ''), enableUSnow.selectedIndex < 2);
    }
    
    function repaintBannerButton(cban, banner) {
        cban.children[0].innerHTML = banner.url.split('/').reverse()[0].split('.')[0];
        cban.children[0].style.backgroundColor = banner.colour;
        cban.style.backgroundImage = `url("${banner.url}")`;
        cban.style.backgroundPosition = banner.position;
    }
    
    function createCustomBannerPopup(cban) {
        const pop = makePopup("Edit Custom Banner", "fa fa-pencil", 10);
        pop.SetWidth(700);
        pop.SetContent('<table class="properties"><tbody /></table><div style="margin:5px;" id="add_banner_error" class="error-message hidden">Select a Color</div>');
        pop.content.insertAdjacentHTML('beforeend', '<div class="drop-down-pop-up-footer"></div>');
        new FimFicSettings.OptionsBuilder(pop.content.querySelector('tbody'), null, builder => {
            const footer = pop.content.lastChild;
            const input = builder.AddOption('', 'Image Url\n(1300x175px)', '<input type="url" placeholder="Banner Image" style="background-repeat: no-repeat;background-position: 7px"></input>');

            let row = builder.AddOption('', 'Image Position', '<div></div>');
            const alignVert = builder.AppendControl(row, '<select style="display:inline-block;width:25%;"><option>top</option><option>center</option><option>bottom</option></select>');
            const posY = builder.AppendControl(row, '<input style="display:inline-block;width:25%;" type="text" placeholder="auto"></input>');
            const alignHor = builder.AppendControl(row, '<select style="display:inline-block;width:25%;"><option>left</option><option>center</option><option>right</option></select>');
            const posX = builder.AppendControl(row, '<input style="display:inline-block;width:25%;" type="text" placeholder="auto"></input>');

            row = builder.AddColorSliders('bc', 'Banner Colour', true);

            const updateFields = color => {
                color = cssToRgb(color);
                upd(row.red, color[0]);
                upd(row.green, color[1]);
                upd(row.blue, color[2]);
                upd(row.alpha, color.length == 4 ? color[3] : 1);
            };
            const getColor = () => `rgba(${[val(row.red),val(row.green),val(row.blue),val(row.alpha)].join(',')})`;
            const upd = (me, v) => me[0].value = me[1].value = parseFloat(v);
            const val = me => parseFloat(me[1].value) || 0;
            const ch = me => me[0].value && me[0].value.length && !me[0].value.match(/[^0-9]/);

            let hasPre = false;
            const addBannerError = pop.content.querySelector('#add_banner_error');
            const paintView = (state, callback) => () => {
                hasPre = state;
                if (ch(row.red) && ch(row.green) && ch(row.blue) && ch(row.alpha)) {
                    callback(input.value, getColor(), alignVert.value, alignHor.value, parseInt(posX.value) || 0, parseInt(posY.value) || 0);
                    addBannerError.classList.add('hidden');
                } else {
                    addBannerError.classList.remove('hidden');
                }
            };

            builder.AppendControl(footer, '<button class="styled_button"><i class="fa fa-save"></i>Save</button>').addEventListener('click', paintView(false, (url, color, vert, hor, x, y) => {
                setCustomBanner(url, color, [hor, x, vert, y]);
                customBanner = Banner('Custom', url, url, color, [hor, x, vert, y]);
                if (customBannerindex > -1) {
                    banners[customBannerindex] = customBanner;
                } else {
                    customBannerindex = banners.length;
                    banners.push(customBanner);
                }
                repaintBannerButton(cban, customBanner);
                bannerController.pick(customBannerindex, true);
                pop.Close()
            }));
            builder.AppendControl(footer, '<button class="styled_button styled_button_blue"><i class="fa fa-eye"></i>Preview</button>').addEventListener('click', paintView(true, (url, color, vert, hor, x, y) => {
                bannerController.changeBanner(null, url, color, Pos([hor, x, vert, y]));
            }));
            builder.AppendControl(footer, '<button class="styled_button styled_button_red"><i class="fa fa-trash-o"></i>Reset</button>').addEventListener('click', () => {
                unsetCustomBanner();
                if (customBannerindex > -1) {
                    banners.splice(customBannerindex, 1);
                    if (bannerController.getCurrent() == 'Custom') bannerController.pick(-1, true);
                    customBannerindex = -1;
                }
                cban.children[0].innerHTML = '';
                cban.children[0].style.background = '#fff';
                bannerController.finalise();
                pop.Close();
            });
            builder.AppendControl(pop.content.querySelector('.color-selector'), '<button class="styled_button styled_button_blue"><i class="fa fa-camera"></i>Guess from Current</button>').addEventListener('click', () => {
                let color = userToolbar.dataset.backgroundColor || '';
                if (color == '') color = 'rgb(146,27,87)';
                updateFields(color);
            });

            pop.element.querySelector(".close_button").addEventListener('mousedown', () => {
                if (hasPre) bannerController.finalise();
            });

            customBanner = getCustomBanner();
            if (customBanner) {
                input.value = customBanner.url;
                updateFields(customBanner.colour);
                const poss = customBanner.position;
                let i = 0;
                alignHor.value = poss['position-x'];
                if (poss[i] != 'center') posX.value = poss.x;
                i++;
                alignVert.value = poss['position-y'];
                if (poss[i] != 'center') posY.value = poss.y;
            }
            pop.Show();
        });
    }
}

function barScrollOn() {animator.on('userbar', pinnerFunc('.user_toolbar', 'userbar'));}
function barScrollOff() {
    animator.off('userbar');
    document.body.classList.remove('fix_userbar');
}

function pinnerFunc(target, pinClass, bounder) {
    target = document.querySelector(target);
    return () => {
        if (bounder) {
            const max = offset(bounder).top + bounder.offsetHeight - 100;
            if (window.scrollY >= max) {
                return document.body.classList.remove('fix_' + pinClass);
            }
        }
        const min = window.scrollY + (document.body.classList.contains('pin_nav_bar') ? 45 : 0);
        if (document.body.classList.contains('fix_' + pinClass)) {
            if (min < parseInt(document.body.dataset[pinClass + 'Pos'])) {
                document.body.classList.remove('fix_' + pinClass);
            }
            return;
        }
        const top = offset(target).top;
        if (min >= top) {
            document.body.dataset[pinClass + 'Pos'] = top;
            document.body.classList.add('fix_' + pinClass);
        }
    };
}

function applyChapterButtons() {
    const immediateText = el => [].filter.call(el.childNodes, a => a.nodeType == Node.TEXT_NODE).map(a => a.nodeValue).join('');
    
    addDelegatedEvent(document, '.story_container a[data-click="minimise"]', 'click', (e, target) => target.closest('article').classList.toggle('chapters_compact'));
    addDelegatedEvent(document, '.story_container a[data-click="expand"]', 'click', (e, target) => target.closest('article').classList.toggle('all-shown'));
    
    const highlight = (e, target) => target.closest('article').querySelector('.unread-chapter').classList.toggle('chapter-highlighted');
    
    addDelegatedEvent(document, '.story_container a[data-focus]', 'mouseover', highlight);
    addDelegatedEvent(document, '.story_container a[data-focus]', 'mouseout', highlight);
    
    all('ul.chapters', me => {
        const chapters = me.querySelectorAll('li .chapter-read-icon').length;
        let unreadChap = me.querySelector('.read-progress, .chapter-read-icon:not(.chapter-read)');

        if (chapters < 2 && !unreadChap) return;
        
        me.insertAdjacentHTML('beforebegin', `<div class="chapter-options-header">
            <a class="compact${chapters < 2 ? ' ffa-hidden' : ''}" data-click="minimise">
                <span class="on">Maximize</span><span class="off">Minimize</span>
            </a>
            <a class="compact_chapters" data-click="expand">Collapse Chapters</a>
        </div>
        <div class="all-chapters-hidden">${chapters} chapters hidden. <a data-click="minimise" >Show</a></div>`);
        
        if (!unreadChap) return;
        
        unreadChap = unreadChap.closest('li');
        unreadChap.classList.add('unread-chapter');
        me = me.previousElementSibling.previousElementSibling;
        const titleData = [
            unreadChap.querySelector('.chapter-title').innerText.trim(),
            immediateText(unreadChap.querySelector('.date')).trim(),
            `${unreadChap.querySelector('.word-count-number').innerText.trim()} words`
        ];
        const progress = unreadChap.querySelector('.read-progress');
        if (progress) titleData.push(`${progress.style.width} complete`);
        
        me.insertAdjacentHTML('afterbegin', `<a class="ffa-right" data-focus="unread" href="/story/continue/${getStoryId()}" title="${titleData.join('\n - ')}">Continue Reading <i class="fa fa-chevron-right"></i></a>`);
    });
    all('.chapter_expander', a => {
        a.parentNode.classList.add('chapter-expander-toggle');
        a.querySelector('a').dataset.click = "expand";
    });
}

function applyFeedFix() {
    addDelegatedEvent(document, '.feed_body img.thumbnail_image', 'click', (e, target) => {
        e.preventDefault();
        const a = target.closest('a');
        if (a.href && a.href.length) {
            a.title = a.href;
        }
    });
}

function applyCodePatches() {
    if (document.querySelector('.chapter-container')) {
        function formatChapter(chapter) {
            var style = window.getComputedStyle(chapter);
            var holder = document.querySelector('.story_content_box');
            holder.style.backgroundColor = style.backgroundColor;
            var footer = document.querySelector('.chapter_footer');
            footer.style.color = style.color;
        }
        override(ChapterFormatController.prototype, 'apply', function (c) {
            this.apply.super.apply(this, arguments);
            formatChapter(this.chapter);
        });
        ChapterController.prototype.computeBackgroundColor = function() {
            ChapterController.prototype.computeBackgroundColor.patched.call(this, !0);
        }
        ChapterController.prototype.computeBackgroundColor.patched = function (c) {
            document.querySelector('.body_container')/*.body*/.style.backgroundColor = '';
            this.backgroundColor = extractColor(document.body.dataset.baseColor/*window.getComputedStyle(document.body).backgroundColor*/);
            var c = extractColor(window.getComputedStyle(this.chapterFormat.querySelector('.chapter')).backgroundColor);
            if ('undefined' != typeof this.backgroundColor) {
                var d = 127 > 0.39 * c[0] + 0.5 * c[1] + 0.11 * c[2];
                this.fadedBackgroundColor = colorMult(c, d ? 0.85 : 0.95);
                255 == c[0] && 255 == c[1] && 255 == c[2] && (this.fadedBackgroundColor = null);
                this.border_color = colorMult(c, d ? 1.4 : 0.82);
                this.updatePageBackgroundColor.patched.call(this, c);
            }
        };
        //Change styling target to the body container
        override(ChapterController.prototype, 'updatePageBackgroundColor', function(c) {
            if (!this.patched) {
                var scroll_events = document.getEventListeners('scroll');
                for (var i = 0; i < scroll_events.length; i++) {
                    if (scroll_events[i].context == this && !scroll_events[i].patched) {
                        document.removeEventListener('scroll', scroll_events[i]);
                    }
                }
                var ev = ChapterController.prototype.computeBackgroundColor.patched.bind(this);
                ev.patched = true;
                window.addEventListener('scroll', ev);
            }
            this.computeBackgroundColor.patched.call(this, c);
        });
        ChapterController.prototype.updatePageBackgroundColor.patched = function (c) {
            c = void 0 === c ? !1 : c;
            var d = this.elements.chapterContentBox.getBoundingClientRect(),
                d = 1 - saturate(5 * Math.min(2 - d.top / window.innerHeight, d.bottom / window.innerHeight) - 4);
            if (d != this.lastBackgroundBlendFactor || c) document.querySelector('.body_container')/*.body*/.style.backgroundColor = null != this.fadedBackgroundColor ? rgbToCSS(colorBlend(this.backgroundColor, this.fadedBackgroundColor, d))  : null,
                this.elements.chapterContentBox.style.borderLeftColor = rgbToCSS(this.border_color),
                this.elements.chapterContentBox.style.borderRightColor = rgbToCSS(this.border_color),
                this.elements.chapterContentBox.style.borderBottomColor = rgbToCSS(this.border_color)/**/
                this.lastBackgroundBlendFactor = d
        };
        //Force update chapter themes
        try {
            App.DispatchEvent(document, 'chapterColourSchemeChanged');
            formatChapter(document.querySelector('#chapter'));
        } catch (e) {
            console.log(e);
        }
    }
    //Fix error window popping up whenever an operation times out/is cancelled
    override(window, 'ShowErrorWindow', function(c) {
        if (arguments[0] !== 'Request Failed (0)') return window.ShowErrorWindow.super(c);
    });
}

function initCommentArea() {
    all('.bbcode-editor button[title="Text Colour"]', a => a.innerHTML = '<i class="fa fa-tint"></i>');
    all('.bbcode-editor button[title="Insert Image"]', a => a.innerHTML = '<i class="fa fa-picture-o"></i>');
    all('.bbcode-editor:not([data-fimficadv])', me => {
        me.dataset.fimficadv = '1';
        const controller = App.GetControllerFromElement(me);
        const main_button = makeButton(controller.toolbar.children[0], "More Options", "fa fa-flag");
        main_button.dataset.click = 'showFimficAdv';
        registerButton(main_button, controller, -1);
    });
}

function initBBCodeController() {
    extend(BBCodeEditorController.prototype, {
        showColourPicker: function(sender, event) {
            event.preventDefault();
            betterColours(sender.parentNode, this);
        },
        showSizePicker: function(sender, event) {
            event.preventDefault();
            if (!sender.parentNode.querySelector('div')) betterSizes(sender, this);
        },
        showFimficAdv: function(sender, event) {
            if (!sender.parentNode.querySelector('div')) buildAdvancedButton(sender, this);
        },
        showAllColours: function(sender, event) {
            initColourWindow(this, sender);
        },
        showColourCreator: function(sender, event) {
            insertColor(this);
        },
        right: function(sender, event) {
            this.insertTag('right');
        },
        figure: function(sender, event) {
            this.insertTags(`[figure=${sender.dataset.align}]`, '[/figure]');
        },
        sign: function(sender, event) {
            this.textarea.value = sign(this.textarea.value);
        },
        showIconPicker: function(sender, event) {
            const pop = makePopup('Insert Icon', 'fa fa-anchor');
            pop.SetWidth(400);
            pop.SetContent(`<div class="bookshelf-edit-popup">
                <div class="bookshelf-icons">
                    ${icons.map(icon => `<label class="bbcodeIcons" title="${normalise(icon)}">
                        <div><span class="bookshelf-icon-element fa fa-${icon}" data-icon-type="font-awesome"></span></div>
                        <input type="radio" value="${icon}" style="display:none;" name="icon"></input>
                    </label>`).join('')}
                </div>
            </div>`);
            addDelegatedEvent(pop.content, 'input', 'click', () => {
                controller.insertText(`[icon]${this.value}[/icon]${controller.getSelection()}`);
                pop.Close();
            });
            pop.Show();
        },
        showAddDirectImage: function(sender, event) {
            makeImagePopup(this);
        },
        find: function(sender, event) {
            makeReplacePopup(this);
        },
        blot: function(sender, event) {
            this.insertText(this.getSelection().replace(/[^\s\\]/g, "█"));
        },
        greentext: function(sender, event) {
            operateText(this, selected => {
                let toggle = true;
                selected = selected.map((line, i) => {
                    if (line.indexOf('[color=#789922]>') != 0) {
                        toggle = false;
                        return '[color=#789922]>' + line + '[/color]';
                    }
                    return line;
                });
                if (toggle) return selected.map(line => line.replace(/^\[color=#789922\]>(.*)\[\/color\]$/g, '$1'));
                return selected;
            });
        },
        makeUnorderedList: function(sender, event) {
            this.makeList((line,dotted,numbered,save) => {
                if (numbered) return save(line.replace(/\t\[b\]([0-9])*.\[\/b\] /g, '\t[b]·[/b] '));
                if (!dotted) return save(`\t[b]·[/b] ${line}`);
            });
        },
        makeOrderedList: function(sender, event) {
            this.makeList((line,dotted,numbered,save) => {
                if (dotted) return save(line.replace('\t[b]·[/b] ', `\t[b]${i + 1}.[/b] `));
                if (!numbered) return save(`\t[b]${i + 1}.[/b] ${line}`);
            });
        },
        makeList: function(func) {
            operateText(this, selected => {
                var toggle = true;
                selected = selected.map((line, i) => {
                    const dotted = /^\t[b]·[/b] /.test(line);
                    const numbered = /^\t\[b\]([0-9])*.\[\/b\] /.test(line);
                    toggle &= func(line, dotted, numbered, a => {
                        line = a;
                        toggle = false;
                    });
                });
                if (toggle) return selected.map(line => line.replace(/\t\[b\]([0-9]*.|·)\[\/b\] /g, ''));
                return selected;
            });
        }
    });
}

function operateText(controller, func) {
    const element = controller.textarea;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    
    const before = element.value.substring(0, start);
    const after = element.value.substring(end, element.value.length);
    
    let selected = (end - start) > 0 ? element.value.substring(start, end).split('\n') : [''];
    selected = func(selected).join('\n');
    
    const top = element.scrollTop;
    element.value = before + selected + after;
    element.selectionStart = start;
    element.selectionEnd = start + selected.length;
    element.scrollTop = top;
    element.focus();
}

function initBlogPage() {
    if (!document.querySelector('.content_box.blog-post-content-box')) {
        const name = getUserName();
        const page = document.querySelector("div.page_list");
        if (page) page.parentNode.previousSibling.insertAdjacentHTML('beforeend', `<div class="content_box blog_post_content_box" style="margin-top:0px; ">
    <div class="calendar" style="margin-top:0px">
		<div class="month">Jan</div>
		<div class="day">1
            <span style="font-size:0.6em;">st</span>
			<div class="year">1992</div>
		</div>
	</div>
    <div class="arrow"></div>
    <div class="blog-title show-buttons">
        <div class="right_box"><div class="button-group">
            <a href="/manage_user/edit_blog_post" class="styled_button button-icon-only styled_button_white"><i class="fa fa-pencil"></i></a>
            <a href="javascript:void(0);" class="styled_button button-icon-only styled_button_white"><i class="fa fa-trash-o"></i></a>
        </div>
    </div>
    <h2>
        <span class="resize_text" data-max-height="80" data-start-size="1.7" data-minimum-size="1.3" style="font-size: 1.7em;">
            <a href="/manage_user/edit_blog_post">You have no blog posts</a>
        </span>
    </h2>
</div>
<div class="main">
	<div class="blog_post_content" style="text-align:center">
        <p>Go to <b><i class="fa fa-user"></i> ' + name + '</b> &gt; <b><i class="fa fa-file-text"></i> Blog</b> &gt; <b><i class="fa fa-pencil"></i> New Blog Post</b> to create one.</p>
        <br><br>Or click <div class="button-group"><a href="/manage_user/edit_blog_post" class="styled_button button-icon-only styled_button_white"><i class="fa fa-pencil"></i></a></div> to create one now and start talking!
    </div>
	<div class="information_box">
		<a href="/user/' + urlSafe(name) + '"><b>' + name + '</b></a> <b class="dot">·</b> 0 views <b>·</b>
	</div>
</div>`);
    }
}

function startCommentHandler() {
    CommentListController.prototype.quoteComment = function (sender, event) {
        const id = sender.dataset.commentId;
        sender = sender.closest('.comment');
        let bbcode = sender.querySelector('.comment_data.bbcode').cloneNode(true);
        all('.comment', bbcode, a => a.parentNode.removeChild(a));
        all('a[href*="#comment/"]', bbcode, a => a.outerHTML = `>>${a.href.split('/').reverse()[0]}`);
        bbcode = (new HTMLToBBCode()).convert(bbcode.innerHTML.trim());
        const controller = App.GetControllerFromElement(document.querySelector('#add_comment_box .bbcode-editor'));
        const e = `${controller.getText() == '' ? '' : '\n'}>>${id}\n[quote]\n${bbcode}\n[/quote]\n`;
        
        controller.insertText(e, !event.ctrlKey && !event.shiftKey);
        event.preventDefault();
        if (!(event.ctrlKey || event.shiftKey)) {
            fQuery.scrollTop(document.getElementById('add_comment_box').getBoundingClientRect().top);
        }
    };
    
    
    FimFicEvents.on('afterpagechange aftereditcomment afteraddcomment', () => {
        all('.comment .buttons:not([data-parsed])', insertQuoteButton);
    })();
    
    if (!getAlwaysShowImages() && getExtraEmotesInit()) return;
    
    const unspoil = getAlwaysShowImages() ? me => {
        replaceWith(me.parentNode, `<img class="user_image" data-lightbox src="${me.href}></img>`);
    } : me => {
        let url = me.href.replace(/$(https:|http:)/g,'');
        const q = url.indexOf('?');
        if (q < 0 || url.substring(q + 1, url.length).indexOf('isEmote=true') < 0) return;
        me = me.parentNode;
        if (me.nextSibling && me.nextSibling.tagName != 'BR') {
            me.parentNode.insertBefore(document.createElement('BR'), me.nextSibling);
        }
        replaceWith(me, `<img class="user_image" src="${url}"></img>`);
    };
    
    FimFicEvents.on('afterpagechange aftereditcomment afteraddcomment', () => {
        all('.comment_data a.user_image_link', unspoil);
    })();
    
    function insertQuoteButton(me) {
        me.dataset.parsed = '1';
        const id = me.querySelector('[data-comment-id]').dataset.commentId;
        me.insertAdjacentHTML('afterbegin', `<a title="Quote ( hold ctrl to prevent jumping to reply box )" data-click="quoteComment" data-comment-id="${id}">
            <i class="fa fa-fw fa-quote-left"></i><span>Quote</span>
        </a>`);
    }
}

function lightboxblocker() {
    addDelegatedEvent(document.body, '[data-lightbox]', 'mouseover', (e, target) => {
        if (target.classList.contains('user_image')) {
            target.removeAttribute('data-lightbox');
            target.removeAttribute('title');
            target.dataset.resizeable = false;
            target.classList.remove('user_image');
            target.classList.add('user_image_no_lightbox');
        }
        target.classList.add('no-lightbox');
    });
}

function buildAdvancedButton(button, controller) {
    button.insertAdjacentHTML('beforebegin', '<div class="drop-down"><div class="arrow"></div><ul></ul></div>');
    const items = button.previousSibling.lastChild;
    addDropList(items, "BBCode Tags", a => {
        addOption(a, "Right Align").dataset.click = 'right';
        addOption(a, "Indent").dataset.click = 'indent';
        addOption(a, "Outdent").dataset.click = 'outdent';
        let b = addOption(a, "Left Figure");
        b.dataset.click = 'figure';
        b.dataset.align = 'left';
        b = addOption(a, "Right Figure");
        b.dataset.click = 'figure';
        b.dataset.align = 'right';
        addOption(a, "Ordered List").dataset.click = 'makeOrderedList';
        addOption(a, "Unordered List").dataset.click = 'makeUnorderedList';
        addOption(a, "Green Text").dataset.click = 'greentext';
        addOption(a, "Icon").dataset.click = 'showIconPicker';
    });
    addOption(items, "Sign").dataset.click = 'sign';
    addOption(items, "Insert Direct Image").dataset.click = 'showAddDirectImage';
    addOption(items, "Find/Replace Text").dataset.click = 'find';
    addOption(items, "Blotter").dataset.click = 'blot';
    inbounds(button);
}

function makeReplacePopup(controller) {
    const pop = makePopup('Find and Replace', 'fa fa-magic', false);
    pop.SetWidth(350);
    pop.SetContent(`<div style="padding:10px;">
        <input id="find" type="text" required="required" placeholder="Find" name="find"></input>
        <input id="replace" type="text" required="required" placeholder="Replace" name="replace"></input>
    </div>`);
    pop.SetFooter(`<button id="find_button" type="button" class="styled_button">Find</button>
                   <button id="replace_button" type="button" class="styled_button">Replace</button>
                   <button id="replace_all_button" type="button" class="styled_button">Replace All</button>`);
    const finder = pop.content.querySelector('#find');
    const replacer = pop.content.querySelector('#replace');
    let nextStart = 0;
    addDelegatedEvent(pop.content, '#find', 'change', () => nextstart = 0);
    addDelegatedEvent(pop.content, '#find_button', 'click', () => {
        let find = finder.value;
        if (!find.length) return;
        let text = controller.textarea.value.substring(nextStart, controller.textarea.value.length);
        let start = text.indexOf(find);
        let end = 0;
        if (start < 0) {
            start = controller.textarea.value.indexOf(find);
            nextStart = 0;
        }
        if (start > -1) {
            start += nextStart;
            end = start + find.length;
        }
        controller.textarea.selectionStart = start;
        controller.textarea.selectionEnd = end;
        controller.textarea.focus();
    });
    addDelegatedEvent(pop.content, '#replace_button', 'click', () => {
        let find = finder.value;
        if (!find.length) return;
        let start = controller.textarea.selectionStart;
        let end = controller.textarea.selectionEnd;
        if (start != end) {
            if (start > end) {
                var t = start;
                start = end;
                start = t;
            }
            let sel = controller.getText().substring(start, end);
            let replace = replacer.value;

            if (sel == find) {
                controller.setText(controller.textarea.value.substring(0, start) + replace + controller.getText().substring(start + sel.length, controller.getText().length));
                controller.textarea.selectionStart = start + replace.length;
                controller.textarea.selectionEnd = controller.textarea.selectionStart;
            }
        } else {
            finB.click();
            if (controller.textarea.selectionStart != controller.textarea.selectionEnd) {
                replB.click();
            }
        }
        controller.textarea.focus();
    });
    addDelegatedEvent(pop.content, '#replace_all_button', 'click', () => {
        if (finder.value.length) controller.setText(replaceAll(finder.value, replacer.value, controller.getText()));
    });
    pop.Show();
}

function makeImagePopup(controller) {
    controller.showAddImage();
    const input = document.getElementById('bbcode_image'),
          preview = document.getElementById('bbcode_image_preview'),
          error = document.getElementById('add_image_error'),
          form = document.getElementById('add_image');
    form.closest('.drop-down-pop-up-container').querySelector('h1').firstChild.nextSibling.textContent = 'Insert Direct Image';
    form.removeEventListeners('submit');
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!valid) return error.classList.remove('hidden');
        const url = input.value;
        controller.insertText(`[img]${url}${url.indexOf('?') > -1 ? '&' : '?'}isEmote=true[/img]`);
        form.closest('.drop-down-pop-up-container').querySelector('.close_button').click();
    });
}

function insertColor(controller) {
    const pop = makePopup("Custom Colour", 'fa fa-tint');
    
    pop.SetWidth(350);
    pop.content.insertAdjacentHTML('beforeend', `<div style="padding:10px;">
        <div id="color_preview" class="pattern-checkerboard" style="border: 1px solid #aaa;border-radius: 3px;margin-bottom: 10px;padding: 3px;width: 100%;height: 200px;display: flex;" >
            <b>${[30,20,10,5].map(a => `<span style="font-size:${a}px">The quick brown fox jumped over the lazy rabbit.</span>`).join(' ')}</b>
        </div>
        <input id="valid" type="hidden" value="0" name="valid"></input>
        <input id="color" type="text" placeholder="Text Colour"></input>
        <button id="use_colour" type="button" class="styled_button">Use Colour</button>
        <div id="color_error" class="error-message hidden">Invalid Hexidecimal Code</div>
    </div>`);
    pop.SetFooter(`Be mindeful of the colours you use.<br />Try to avoid colours that are very close to the background as it is difficult to read. If hiding is intended, consider using '[spoiler]text[/spoiler]'`);
    
    const valid = pop.content.querySelector('#valid');
    const color = pop.content.querySelector('#color');
    
    const check = e => {
        let c = e.target.value;
        let va = InvalidHexColor(c);
        valid.value = va == true ? 0 : 1;
        if (!c || va == true) {
            c = '';
        } else if (va == false) {
            if (c.indexOf('#') != 0) c = "#" + c;
        } else {
            c = colours.Keys[va];
            e.target.value = colours.Names[va];
        }
        pop.content.querySelector('#color_preview').style.color = c;
    };
    
    color.addEventListener('keyup', check);
    color.addEventListener('change', check);
    pop.content.querySelector('#use_colour').addEventListener('click', e => {
        let c = color.value.trim();
        if (!(c && c.length && valid.value === "1")) {
            return pop.content.querySelector('#color_error').classList.remove("hidden");
        }
        let i = colours.NamesLower.indexOf(c.toLowerCase());
        if (i > -1) c = colours.Keys[i];
        if (c.indexOf('#') == -1) c = '#' + c;
        addRecent(c);
        controller.insertTags("[color=" + c + "]", "[/color]");
        pop.Close();
    });
    pop.Show();
}

function previewSig() {
    return fillBBCode(sign(pickNext([
        'Ermahgerd! I wub u so much!!!11111one11!exclamation!!mark1',
        'I feel ya bro',
        'Sink X Dash is OTP! ' + emoteHTM('rainbowderp'),
        'Fräulein ' + emoteHTM('ajsmug'),
        'Bro Hoof /). ' + emoteHTM('rainbowlaugh'),
        'I\'ve seen better',
        'Sanity is overrated anyway.',
        '"0/10 needs more Maud" - IGN',
        'Tiny box Tim NOOOOOOOOOOOOOO!!!!!!!!!!!',
        'None more manly tears were ever shed',
        'Do you even goat brah?',
        'You Maud bro?',
        'I liek trains.',
        'Iets ryk soos kaas.',
        'I am best Pony!!!',
        'Your argument is invalid. <img class="user_image" src="//fc01.deviantart.net/fs71/f/2014/013/d/b/cslyra_by_comeha-d7220ek.png"></img>',
        'U is bestest pone!',
        '[size=10][i]Don\'t trust the parasprite.[/i][/size]',
        '[center]<img width="100px" height="100px" src="//fc00.deviantart.net/fs70/i/2012/200/b/e/sweepy_time__by_chubble_munch-d57scrc.png" /><br />Pweese?[/center]',
        '[url=//dileak.deviantart.com/art/Meanwhile-at-the-super-awesome-WUB-base-310634590]Epic WUB Time is now[/url]',
        '[u][b][color=#C2851B]N[/color][color=#BC801E]y[/color][color=#B67C22]a[/color][color=#B07826]n[/color][color=#AA742A] [/color][color=#A4702E]N[/color][color=#9F6C32]y[/color][color=#996836]a[/color][color=#936439]n[/color][color=#8D603D] [/color][color=#875C41]H[/color][color=#815745]a[/color][color=#7C5349]p[/color][color=#764F4D]p[/color][color=#704B51]y[/color][color=#6A4755] [/color][color=#644358]D[/color][color=#5E3F5C]e[/color][color=#593B60]r[/color][color=#533764]p[/color][color=#4D3368]y[/color][color=#472E6C] [/color][color=#412A70]T[/color][color=#3B2673]i[/color][color=#362277]m[/color][color=#301E7B]e[/color][color=#2A1A7F] [/color][color=#241683]Y[/color][color=#1E1287]a[/color][color=#180E8B]y[/color][/b][/u]'
    ])).replace(/\n/g, '<br />'));
}

function sign(text) {
    let formatted = getSig();
    const t = new Date();
    [
        ['%name%', getUserName()],
        ['%year%', t.getFullYear()],
        ['%MONTH%', t.getMonth() + 1],
        ['%DAY%', t.getDate()],
        ['%month%', (['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])[t.getMonth()]],
        ['%day%', (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])[t.getDay()]],
        ['%hour%', t.getHours()],
        ['%min%', t.getMinutes()],
        ['%sec%', t.getSeconds()]
    ].forEach(t => formatted = replaceAll(t[0], t[1], formatted));
    if (!hasSigned(text, formatted)) {
        if (formatted.indexOf("%message%") > -1) {
            text = formatted.replace("%message%", text);
        } else {
            text += formatted;
        }
    }
    return text;
}

function hasSigned(value, format) {
    return (new RegExp(encodeURI(format.replace(/%message%/g, ".*")))).test(encodeURI(value));
}

function emoteHTM(name) {
    return `<img src="${staticFimFicDomain()}/images/emoticons/${name}.png" style="height:27px;" ></img>`;
}

function betterSizes(me, controller) {
    const basic = [[0.5,0.5],  [0.75,0.75], [1.5,1.5],  ['2.0',2]];
    const sizes = [
        [10,0.714], [12,0.857], [14,1], [16,1.143], [18,1.286],
        [20,1.429], [22,1.571], [24,1.714], [26,1.857], [28,2]
    ];
    const mapper = (set,type) => set.map((v, i) => `<li><a data-${type} data-label="${v[0]}" data-size="${v[1]}">${v[0]}</a></li>`).join('');
    me.insertAdjacentHTML('afterend', `<div class="drop-down drop-size-pick" style="width:177px">
        <div class="arrow"></div>
        <ul>${mapper(basic, 'sizes')}${mapper(sizes, 'sizes')}${mapper(sizes, 'headings')}</ul>
    </div>`);
    me = me.parentNode.querySelector('ul');
    addDelegatedEvent(me, 'a[data-sizes]', 'click', (e, target) => controller.insertTags(`[size=${target.dataset.size}em]`, '[/size]'));
    addDelegatedEvent(me, 'a[data-headings]', 'click', (e, target) => controller.insertTags(`[size=${sizes[target.dataset.index][1]}em][h1]`, '[/h1][/size]'));
    addDelegatedEvent(me, 'a', 'mouseenter', (e, target) => {
        const sz = target.dataset.label;
        const pop = makeToolTip(target);
        pop[0].parentNode.style.margin = '15px 0 0 0';
        pop[0].parentNode.style.padding = '0';
        pop.append(`<div style="font-size: ${target.dataset.size}em !important; line-height:1;min-height:10px;height: ${sz < 10 ? sz < 1 ? 5 : 20 : sz}px;">Ab</div>`);
    });
    addDelegatedEvent(me, 'a', 'mouseleave', (e, target) => target.removeChild(target.childNodes[1]));
}

function betterColours(me, controller) {
    if (!me.querySelector('div')) {
        me.insertAdjacentHTML('beforeend', `<div class="drop-down drop-colour-pick" style="width:250px">
            <div class="arrow" ></div>
            <ul class="colour-holder">
                ${addColorTiles(colours.Sets['FimFiction'][1])}
                <li class="divider"></li>
                ${addColorTiles(colours.Sets['Mane Six'][1])}
                <li class="recent-part divider"><span>Recent</span></li>
                <span data-count="6" class="recent-part recent-colours"></span>
                <li class="divider"></li>
            </ul>
            <ul class="button-holder">
                <li><a data-click="showAllColours">More Colours</a></li>
                <li><a data-click="showColourCreator">Custom Colour</a></li>
            </ul>
        </div>`);
        registerColourInsertionEvent(controller, me.lastChild);
    }
    all('.recent-colours', me => {
        const recent = getRecentColours(parseInt(me.dataset.count));
        me.innerHTML = addColorTiles(recent);
        if (recent.length) {
            me.style.opacity = me.style.pointerEvents = '';
        } else {
            me.style.opacity = '0.3';
            me.style.pointerEvents = 'none';
        }
        all('.recent-part', me.parentNode, me => me.style.display = recent.length ? '' : 'none');
    });
}

function initColourWindow(controller, self) {
    all('.active_text_area', me => me.classList.remove('active_text_area'));
    controller.textarea.classList.add('active_text_area');
    
    const list = makePopup('All Colours', 'fa fa-tint', false, false);
    for (var i in colours.Sets) {
        addCollapseColorSection(list.content, colours.Sets[i][1], i, colours.Sets[i][0]);
    }
    
    const recent = getRecentColours(15);
    if (recent.length) {
        const recentSec = addColorSection(list.content, recent, 'Recent').querySelector('.colour-section-header');
        const ul = recentSec.parentNode.querySelector('ul');
        ul.classList.add('recent-colours');
        ul.dataset.count = 15;
        recentSec.insertAdjacentHTML('beforeend', '<a style="float:right;">Clear</a>');
        recentSec.lastChild.addEventListener('click', () => {
            clearRecentColours();
            ul.style.opacity = 0.3;
            ul.style.pointerEvents = 'none';
        });
    }
    
    registerColourInsertionEvent(controller, list.content);
    
    list.SetWidth(560);
    list.Show();
}

function addCollapseColorSection(panel, colors, title, collapse) {
    let section = addColorSection(panel, colors, title).querySelector('.colour-section-header');
    section.style.cursor = 'pointer';
    section.classList.add('collapsable');
    section.classList.toggle('collapsed', collapse);
    section.addEventListener('click', () => header.classList.toggle('collapsed'));
}

function addColorSection(panel, colors, title) {
    panel.insertAdjacentHTML('beforeend', `<div class="colour-section">
        <div class="colour-section-header">${title}</div>
        <ul class="colour-holder">${addColorTiles(colors)}</ul>
    </div>`);
    return panel.lastChild;
}

function addColorTiles(colors) {
    return colors.map(c => {
        var code, name;
        if (typeof c == 'string') return [c, colours.Mapping[c] || c];
        if (c < 0) return [''];
        return [colours.Keys[c], colours.Names[c] || code]
    }).map((a, c) => a[0] == '' ? '' : `<li class="colour-tile">
            <a title="${a[1]}" data-index="${c}" data-colour="${a[0]}">
                <span style="background-color:${a[0]} !important" class="color-tile"></span>
            </a>
        </li>`).join('');
}

function registerColourInsertionEvent(controller, holder) {
    addDelegatedEvent(holder, '.colour-tile a', 'click', (e, target) => {
        const t = controller || App.GetControllerFromElement(document.querySelector('.active_text_area').closest('.bbcode-editor'));
        t.insertTags('[color=' + target.dataset.colour + ']', '[/color]');
        addRecent(target.dataset.colour);
        t.focus();
    });
}

function getLogoNames() {
    return logos.filter(l => l.Able).map(l => l.Name);
}

function pickNextLogo() {
    return pickNext(logos.map((l,i) => [l, i]).filter(l => l[0].Able).map(l => l[1]));
}

function getLogoUrl(val) {
    return logos[val == -1 ? pickNextLogo() : val < 0 || val >= logos.length ? 0 : val].Css;
}

function addExtraToolbarLinks(e) {
    if (e.event.type == 'stories') {
        var ref = document.querySelector('#user_toolbar_story_list a[href^="/user/"]').parentNode;
        var link = ref.cloneNode(true);
        ref.parentNode.insertBefore(link, ref.nextSibling);
        link = link.querySelector('a');
        link.href = 'https://www.fimfiction.net/bookshelf/1/featured?q=' + getUserName();
        link.innerHTML = '<i class="fa fa-star-o"></i>View My Featured Stories';
    }
}

function addFooterData(data) {
    const footer = document.querySelector('.footer .block');
    if (footer) footer.insertAdjacentHTML('beforeend', '<br>' + data);
}

//-------------------------------------STYLESHEETS-------------------------------------------------

function addCss() {
    makeStyle(`
/*Footer overflow fix*/
div.footer { height: auto !important;}

/*Tables border fix*/
table.properties > tbody > tr.bookmark_entry:last-child td { border-bottom: 1px solid #DDD !important;}

/*Fix bleeding corners on dropdown menus*/
.user_toolbar > ul > li ul li:last-child a i { border-bottom-left-radius: 2px;}

/*Textarea fix*/
textarea[required] { box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.07) inset;}

/*Remove black line in chapter footers*/
.chapter_footer hr { border: none;}

/*Background-gradient fix*/
[fimfic_adv*=background] .topbar-shadow div.light-gradient {
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0)), color-stop(80px, rgba(255,255,255,0.5))) !important;
    background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 80px) !important;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 80px) !important;}
[fimfic_adv*=background] .topbar-shadow div.light-gradient::before {
    background: rgba(255,255,255,0.5) !important;
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0.5)), color-stop(80px, rgba(255,255,255,0))) !important;
    background: -webkit-linear-gradient(left, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80px) !important;
    background: linear-gradient(to right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80px) !important;}
[fimfic_adv*=background] .sidebar-shadow div.light-gradient {
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(80px, rgba(255,255,255,0.5))) !important;
    background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 80px) !important;
    background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 80px) !important;}
[fimfic_adv*=background] .sidebar-shadow div.light-gradient::before {
    background: rgba(255,255,255,0.5) !important;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(255,255,255,0.5)), color-stop(80px, rgba(255,255,255,0))) !important;
    background: -webkit-linear-gradient(top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80px) !important;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 80px) !important;}

/*Bookshelf icon colour fix*/
.story-toolbar .bookshelves li span {
    color: #777;
    transition: color 0.2s ease 0s;}
.user_toolbar > ul > li ul li:hover > a .bookshelf-icon-element span {
    color: #FFF !important;}

/*Start Enhancements*/
/*Modernised source links*/
.story_container .story_container__story_image { overflow: hidden;}
.story_container .story_container__story_image .source {
  display: block !important;
  background: #fff !important;
  color: #333 !important;
  border: none !important;
  border-radius: 5px 0 3px 0 !important;
  text-shadow: none !important;
  font-weight: 400 !important;
  opacity: 0;
  transition: bottom 0.5s ease, right 0.5s ease, opacity 0.01s ease 0.5s !important;
  bottom: -30px !important;
  right: -30px !important;}
.story_container .story_container__story_image:hover .source {
  bottom: 1px !important;
  right: 1px !important;
  opacity: 1 !important;
  transition: bottom 0.5s ease, right 0.5s ease !important;}

/*Extend chapter themes to the footer*/
.chapter_footer {
  background: rgba(0,0,0,0.05) !important;
  border-top-color: rgba(0,0,0,0.2) !important;}

/*Round the corners on group buttons*/
.group-header .menu .buttons {
    border-radius: 3px;
    overflow: hidden;}

.rating_container .like_button:not(.like_button_selected),
.rating_container .dislike_button:not(.dislike_button_selected) {
  color: inherit !important;}

/*Make the emoticon picker not look like plot*/
.emoji-selector__search {
  background: none !important;
  padding: 3px !important;}
.emoji-selector__search input {
  width: 100%;
  margin: 0;
  padding: 5px;
  border-radius: 4px;
  box-shadow: inset 0 0 5px 3px #fef;
  border: solid 1px #aaa;}
.format-toolbar .emoji-selector .emoji-selector__tabs,
.format-toolbar .emoji-selector .emoji-selector__list > li.emoji-selector__header {
  background: #f8f8f8 !important;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f8f8f8), color-stop(100%, #f2f2f2)) !important;
  background: -webkit-linear-gradient(top, #f8f8f8 0%, #f2f2f2 100%) !important;
  background: linear-gradient(to bottom, #f8f8f8 0%, #f2f2f2 100%) !important;}
.format-toolbar .emoji-selector .emoji-selector__tabs li {
  background: none !important;}
.format-toolbar .emoji-selector .emoji-selector__tabs li:hover,
.format-toolbar .emoji-selector .emoji-selector__tabs li.selected {
  background: rgba(0,0,0,0.1) !important;}

.format-toolbar .emoji-selector .emoji-selector__list > li {
  margin: 4px;
  vertical-align: middle;}
.format-toolbar .emoji-selector .emoji-selector__list > li:hover {
  border-radius: 100% !important;}
.format-toolbar .emoji-selector .emoji-selector__list > li.emoji-selector__header:hover {
  border-radius: 0 !important;}
/*Center pony emoticon images vertically*/
.format-toolbar .emoji-selector .emoji-selector__list > li a {
  height: 36px;}
.format-toolbar .emoji-selector .emoji-selector__list > li img {
  margin-top: 5px;}

.story-page-header > .inner h1 a, .user-page-header > .inner h1 a:hover {text-decoration: none;}

/*Better Feed End Marker*/
#feed_end_marker img { display: none; }
#feed_end_marker::before {
    display: inline-block;
    content: '';
    font-family: FontAwesome;
    font-size: 66px;
    color: rgba(0,0,0,0.6);
    -webkit-animation: fa-spin 2s infinite linear;
    animation: fa-spin 2s infinite linear;}

/*For snow in the background*/
body > canvas ~ .body_container .nav_bar,
body > canvas ~ .footer {
  z-index: 200000;
  position: relative;}

/*clean up embeds*/
.embed-container .placeholder::before {
  opacity: 0.8;
  transition: opacity 0.25s ease;}
.embed-container .placeholder .overlay::before {
  background: #eee;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);}
.embed-container .placeholder .overlay::after {
  color: #000;
  text-shadow: none;}
.embed-container:hover .overlay::after, .embed-container:hover .overlay::before {
  transform: scale(1.125) !important;}
.embed-container .placeholder,
.embed-container iframe {
  padding: 0 !important;}

/*Fixed, well, not fixed, but removed, hideous yellow*/
.user_cp .tabs ul li.tab_selected {
    background: rgba(120,120,120,0.1) !important;}

/*I'll have non'a that shit*/
.bbcode hr::after, .article hr::after { display: none !important; }

/*Now with 20% less cancer*/
.no-lightbox [data-lightbox] { cursor: default !important; }
.user_image_no_lightbox {
    max-width: 100%;
    max-height: 600px;
    border: 0;}

/*Clean up the featured box*/
.front_page .featured_box .left ul li.selected {background: #ccc !important;}
.front_page .featured_box .left ul li.selected::before, .front_page .featured_box .left ul li.selected::after {
    position: absolute;
    content: '';
    display: block;
    width: 0;
    height: 0;
    right: 0;
    border: solid 14px transparent;}
.front_page .featured_box .left ul li.selected::after {
    top: 0;
    border-right-color: #fff;}
.front_page .featured_box .left ul li.selected::before {
    top: -1px;
    border-width: 15px;
    border-right-color: rgba(0,0,0,0.3);}

/*Global Styles*/
.ffa-hidden {display: none !important;}
.ffa-left {float: left;}
.ffa-right {float: right}

/*Chapter Enhancements*/
.chapter-options-header {
    text-align: justify;
    overflow: hidden;
padding-right: 20px !important;}
.chapter-options-header a {
    display: inline-block;
    color: #333;
    background: #fff;
    font-size: .8125rem;
    font-weight: normal;
    padding: 3px 8px;
    border: 1px solid #0003;
    border-radius: 4px;
    text-align: center;
    line-height: 16px;
    margin-left: 5px;}
.chapter-options-header a:hover {
    background: #258bd4;
    color: #fff;
    text-decoration: none;}
.chapters_compact a.compact .off, a.compact .on {
    display: none;}
.chapters_compact a.compact .on, a.compact .off {
    display: inline;}
.all-chapters-hidden {
    display: none;
    text-align: center;}
.chapters_compact .all-chapters-hidden {display: block;}
.all-chapters-hidden {
    position: relative;
    padding: 10px;
    padding-left: 16px;
    padding-right: 100px;
    color: #888;
    border-bottom: 1px solid rgba(0,0,0,0.15);
    border-top: 1px solid #ddd;
    font-size: .9375rem;
    background-color: #f6f6f6;}
.story_container .chapters > li.chapter-highlighted {
    background: rgb(48, 250, 255);
    transition: background 0.5s ease !important;
    display: block !important;}
.story_container .chapters > li.unread-chapter {
    transition: background 0.5s ease 1s;}

a:hover .bg_source_link {
    opacity: 1;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;}
.bg_source_link {
    margin: 3px 3px 3px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    transition: opacity 0.25s ease;
    opacity: 0;
    line-height: 1em;
    background-color: rgba(0, 0, 0, 0.7);
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.7em;
    padding: 5px 10px;
    text-decoration: none;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2) inset;
    font-family: 'Segoe UI';
    text-shadow: 1px 1px rgba(0, 0, 0, 0.3);}
.titleHidden #title {height: 80px !important;}
.titleHidden #title, .titleHidden .user-page-header, .titleHidden .story-page-header {overflow: hidden;}
.titleHidden .user-page-header ~ .user_toolbar > ul, .titleHidden .story-page-header ~ .user_toolbar > ul {padding-left: 11.5rem;}
.titleHidden header.header .theme_selector a, .titleHidden header.header .theme_selector a {line-height: 75px !important;}
.drop-size-pick {
    margin-left: -90px !important;
    margin-right: auto !important;}
.drop-size-pick, .drop-size-pick ul {
    width: 178px !important;
    height: 172px !important;
    max-height: initial !important;}
.drop-size-pick a {
    padding: 5px 5px !important;}
.drop-size-pick ul {
    padding: 0 !important;
    max-height: initial;
    border-radius: 5px;
    overflow: hidden;}
.drop-size-pick ul li {
    display: inline-block !important;
    width: 24.7%;
    height: 13px;
    text-align: center;
    border-radius: none;}
.drop-size-pick ul li:nth-child(4) ~ li {width: 19.8%;}
.colour-holder .colour-tile {display: inline-block !important;}
.colour-holder .colour-tile a {padding: 1px !important;}
.colour-holder {padding: 10px;}
.colour-holder .divider {line-height: 0px;}
.drop-colour-pick {
    left: -32px !important;
    right: auto !important;}
.colour-section-header {
    color: #555;
    background: #EEE;
    line-height: 1.7em;
    border-bottom: 1px solid #ccc;
    padding: 5px 10px;
    margin: 1px;}
.collapsable.collapsed ~ * {display: none;}
.collapsable.collapsed:after {content: '' !important;}
.collapsable:after {
    color: #000;
    opacity: 0.2;}
.collapsable:after {
    content: '';
    float: right;
    font-size: 20px;
    color: #000;
    opacity: 0.2;
    font-family: 'FontAwesome';}
.color-tile {
    cursor:pointer;
    padding: 15px;
    margin: 3px;
    border-radius: 100%;
    display: inline-block;
    vertical-align: middle;
    box-shadow: 0 0 1px #000, 0 0 3px #222 inset;}
.colour-tile:hover a {background: none !important;}
.tooltip {
    position: relative;
    color: #444;
    text-shadow: none;
    padding: 4px;
    border-radius:5px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);}
.drop-down .drop-down {
    display: none !important;
    top: 0px !important;
    left: 150% !important;
    right: auto !important;}
.drop-down li:hover > .drop-down {display: block !important;}
.drop-down li:hover > .drop-down:before {
    font-family: 'FontAwesome';
    display: inline-block;
    content: '';
    position: absolute;
    top: 0px;
    left: -10px;
    line-height: 3em;}
.drop-down li.button-group:hover > .drop-down {display: none !important;}
.drop-down li.button-group.drop-down-show > .drop-down {display: block !important;}
.drop-down li.button-group {position: relative !important;}
.drop-down li.button-group > .drop-down {
    margin-top: 100%;
    margin-left: -320%;}
.bbcode-editor .button-group > .drop-down ul:not(.scrollable, .drop-down-emoticons) {overflow: visible !important;}
.drop-down li.button-group:hover > .drop-down::before {content: '';}
.colour-holder li.colour-tile a {border-radius: 0px !important;}
.button-group .drop-down ul ul li:first-child ~ li > a, .button-group-vertical .drop-down ul li:first-child ~ li > a, * + .button-holder > li:first-child > a {
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;}
.compact_chapters {display: none !important;}
.all-shown .chapters li.hidden {display: block;}
.all-shown .chapter-expander-toggle {display: none;}
.all-shown .compact_chapters {display: inline-block !important;}
.story_container .chapter-options-header {
    margin-top: 1.0rem;
    background-color: #efefef;
    color: #555;
    position: relative;
    padding: 10px;
    padding-left: 16px;
    padding-right: 100px;
    border-top: 1px solid rgba(0,0,0,0.15);
    font-size: 0.9em;}
.story_container .chapter-options-header ~ .chapters {margin-top: 0;}
.chapters_compact .chapters {display: none !important;}
.sigPreview {
    padding: 8px;
    color: rgb(68, 68, 68);
    width: 100%;
    border: 1px solid rgb(204, 204, 204);
    font-size: 1.1em;
    font-family: 'Segoe UI',Arial;
    -moz-box-sizing: border-box;
    outline: medium none;
    transition: border-color 0.25s ease 0s, background-color 0.25s ease 0s;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.07) inset;
    background-color: rgb(255, 255, 250);
    text-shadow: 1px 1px rgba(255, 255, 255, 0.8);
    vertical-align: middle;
    display: none;}
.sigPreviewing {display: none;}
.sigPreviewing ~ .sigPreview {display: inline-block;}
.previewButton {
    width: 100px !important;
    text-align: center;}
.comment .textarea_padding {
    padding-left: 0px !important;
    padding-right: 0px !important;}
.comment textarea:focus {
    background-color: rgb(232, 239, 246) !important;
    border-color: rgba(0, 0, 0, 0.2) !important;
text-shadow: none !important;}

.comment textarea {
    padding: 8px;
    color: rgb(68, 68, 68);
    border: 1px solid rgb(204, 204, 204);
    -moz-box-sizing: border-box;
    outline: medium none;
    transition: border-color 0.25s ease 0s, background-color 0.25s ease 0s;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.07) inset;
    background-color: rgb(255, 255, 250);
    text-shadow: 1px 1px rgba(244, 244, 244, 0.8);
    vertical-align: middle;
    min-height: 120px;
    border-radius: 0px !important;
    width: 100%;
    resize: vertical;
    left: 0px !important;}
.user_toolbar > .inner .button-first {
    margin-left: 0px !important;
    border-left: 1px solid rgba(0, 0, 0, 0.2) !important;}
.bright, .breadcrumbs.bright li:after {
    text-shadow: 1px 1px rgba(255, 255, 255, 0) !important;}
.bright {color: rgba(190,190,190,0.7) !important;}
.bright li:after {color: rgba(190,190,190,0.3) !important;}
.bright .story-title {text-shadow: 0 0 4px black;}
.user-card .external-accounts li img {
    max-height: 16px;
    max-width: 16px;}
.user-card .top-info .button-group .button-group {
  margin-right: 20px !important;
  margin-top: 30px !important;}
.user-card .top-info .button:first-child {border-top-left-radius: 5px;}
.user-card .top-info .drop-down-expander.button {border-radius: 0 5px 5px 0 !important;}
.user-card .top-info .button::after {
  background: rgba(0,0,0,0) !important;
  background: -webkit-gradient(linear, left top, left bottom, rgba(0,0,0,0), #2f538c, rgba(0,0,0,0)) !important;
  background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%) !important;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%) !important;}
#imgPreview {
    border-radius: 5px;
    max-width:100%;
    max-height:100%;
    padding: 3px;
    background: none repeat scroll 0% 0% padding-box #FFF;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);}
.content_format_pinkie #chapter_container,
.content_format_applejack #chapter_container,
.content_format_rarity #chapter_container,
.content_format_twilight #chapter_container,
.content_format_dash #chapter_container,
.content_format_fluttershy #chapter_container {
    box-shadow: 0 0 3px black;
    margin-top: 3px;
    background: rgba(0,0,0,0.1);
    margin-bottom: 3px;
    overflow: hidden;
    border-radius: 15px;}
#bookshelves-sidebar > li, #bookshelves-sidebar-community > li {
    background: #fff;
    margin: 5px;
    padding-left: 5px;
    border-width: 1px;
    border-style: solid;
    border-right: 1px solid #BEBAB4;
    border-color: #D6D1CB #BEBAB4 #BEBAB4 #D6D1CB;
    border-radius: 5px;}
.left-tabs {
    padding-left: 0px !important;
    padding-right: 10px;}
.left-tabs + div {
    padding-right: 0px !important;
    padding-left: 30px;}
.left-tabs > .sidebar-shadow {left: 220px !important;}
.chapter_content .authors-note:before {
    content: '';
    font-family: FontAwesome;}
.chapter_content > .inner_margin {max-width: 100% !important;}
.chapter_content #chapter_container${(getWideNotes() ? "" : ", .authors-note")} {
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: ${getStoryWidth()};}

@media all and (min-width: 700px) {
    .fix_userbar .user_toolbar {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        z-index: 1300;
        margin-top: -210px;
        padding-top: 200px;}
    .fix_userbar header.header {
        margin-bottom: 40px;}
    .pin_nav_bar.fix_userbar .user_toolbar {top: 45px;}

    .pin_nav_bar #chapter_toolbar_container[data-fixed] {top: 3rem;}
    .fix_userbar #chapter_toolbar_container[data-fixed] {top: 2.7rem;}
    .pin_nav_bar.fix_userbar #chapter_toolbar_container[data-fixed] {top: 5.5875rem !important;}
}

.fix_feed .feed-toolbar {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 1300;
    transition: background-color 0.3s linear;
    background-color: rgba(0,0,0,0.6);}
.fix_feed .content > .content_background > .inner {margin-top: 55px;}
.pin_nav_bar.fix_feed .feed-toolbar {
    top: 45px;}

.banner_credits {
    vertical-align: top;
    display: inline-block;
    width: 100%;
    padding-bottom: 100px;
    transition: all 0.5s ease;
    transform: translate(0%,0);}
.banner_credits .banner {
    border: 1px solid rgba(0,0,0,0.4);
    background-position: center;
    height: 173px;
    cursor: pointer;
    border-bottom: none;
  position: relative;}
.banner_credits input {display: none;}
.banner_credits .source a {color: inherit;}
.banner_credits .source {
    padding: 5px;
    color: #eee;}
.banner_credits input:checked + label .banner::before {
    content: '';
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    outline: solid 10px rgba(220,220,220,0.5);}
.banner_credits input:checked + label .banner::after {
    content: '\\f00c';
    font-family: 'FontAwesome';
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(220,220,220,0.5);
    padding: 5px;
    border-radius: 0 0 10px 0;}

#banner_selector {
    vertical-align: top;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: height 0.5s ease;}
#banner_selector > .content_box {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;}

#banner_switcher {height: 50px;}
#banner_switcher .inner {
    width: auto;
    position: relative;}
#save_banners {
    position: absolute;
    left: 10px;}
.fix_switcher #save_banners {
    background: transparent linear-gradient(to bottom, #444 0%, #404040 100%) repeat scroll 0% 0%;
    box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.1) inset;
    border: 1px solid rgba(0, 0, 0, 0.2);}
.fix_switcher #save_banners:hover {
    background: transparent linear-gradient(to bottom, #555 0%, #505050 100%) repeat scroll 0% 0%;}
.fix_switcher #save_banners:active {
    background: transparent linear-gradient(to bottom, #444 0%, #404040 100%) repeat scroll 0% 0%;
    box-shadow: 0px 3px 5px #373737 inset;}
.fix_switcher #save_banners, .fix_switcher #save_banners .fa {
    color: #FFF;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.1);
    font-weight: bold;}
.fix_switcher #banner_switcher {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 600;
    transition: background-color 0.3s linear;
    background-color: rgba(0,0,0,0.6);}
.fix_switcher #banner_switcher + form {
    margin-top: 50px;}
.pin_nav_bar.fix_switcher #banner_switcher {
    top: 45px;}

.pin_nav_bar.fix_userbar.fix_switcher #banner_switcher,
.pin_nav_bar.fix_userbar.fix_feed .feed-toolbar {top: 85px;}\
.fix_userbar.fix_switcher #banner_switcher,
.fix_userbar.fix_feed .feed-toolbar {top: 40px;}`, "FimFiction_Advanced_Stylesheet");
}

function addBannerCss() {
    makeStyle(`
body.pin_nav_bar div.page-nav-bars {
    position: static;
    top: 0;
    z-index: initial;
    box-shadow: none;}
body.pin_nav_bar div.page-nav-bars .nav_bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    box-shadow: 0px 0px 15px #0000004d;}
body.pin_nav_bar div.page-nav-bars {margin-top: 46px;}
/*Banners*/
.nav_bar .logo {
    z-index: 125;
    position: relative;}
.nav_bar .logo.tiny-logo {
    max-height: 32px;
    vertical-align: -10px;}
header.header { margin-left: auto; margin-right: auto; border-top: medium none; box-sizing: border-box; position: relative; }
header.header .title { height: 175px; background-position: center top; background-repeat: no-repeat; position: relative; display: none ! important; }
header.header .home_link { display: block; position: absolute; border-width: medium 1px; border-style: none solid; border-color: -moz-use-text-color rgba(0, 0, 0, 0.2); -moz-border-top-colors: none; -moz-border-right-colors: none; -moz-border-bottom-colors: none; -moz-border-left-colors: none; border-image: none; right: 0px; left: 0px; top: 0px; bottom: 0px; background-position: center top; overflow: hidden; transition: background-image 0.15s ease 0s; }
@media all and (max-width: 1000px) {
    header.header .home_link { background-position: -150px top; }
}
header.header .home_link div { position: absolute; left: 50%; }
@media all and (max-width: 1000px) {
    header.header .home_link div { left: 500px; }
}
header.header .home_link div img { margin-left: -500px; }
header.header .home_link_link { display: block; position: absolute; z-index: 10; right: 0px; left: 0px; top: 0px; bottom: 0px; }
header.header .banner-buttons { position: absolute; z-index: 30; visibility: hidden; opacity: 0; transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s; right: 64px; bottom: 10px; }
header.header .banner-buttons a {
    color: #efefef;
    font-size: 0.7rem;
    padding: 5px 10px;
    text-decoration: none;
    border-radius: 3px;
    font-family: "Open Sans",Arial,sans-serif;
    font-weight: 600;
    font-style: normal;
    text-transform: uppercase;}
header.header .banner-buttons a:hover {background-color: rgba(0, 0, 0, 0.1);}
header.header:hover .banner-buttons { visibility: visible; opacity: 1; }
@media all and (max-width: 950px) {
    header.header .banner-buttons {bottom: 30px;}}
header.header:hover .theme_selector a { opacity: 1; }
header.header .theme_selector { width: 120px; height: 100%; position: absolute; z-index: 11; transition: background 0.3s ease 0s; background: transparent linear-gradient(to right, transparent 0%, transparent 100%) repeat scroll 0% 0%; }
header.header .theme_selector a {
    color: rgb(255, 255, 255);
    position: absolute;
    height: 100%;
    width: 60px;
    opacity: 0;
    text-align: center;
    line-height: 175px;
    text-decoration: none;
    text-shadow: 0px 2px rgba(0, 0, 0, 0.5), 0px 0px 50px rgb(0, 0, 0);
    font-size: 32px;
    transition: opacity 0.3s ease 0s;
    outline: 0 !important;}
header.header .theme_selector_left { left: 0px; }
header.header .theme_selector_left:hover { background: transparent linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, transparent 100%) repeat scroll 0% 0%; }
header.header .theme_selector_left a::before { font-family: "FontAwesome"; content: ""; }
header.header .theme_selector_right { right: 0px; }
header.header .theme_selector_right:hover { background: transparent linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 100%) repeat scroll 0% 0%; }
header.header .theme_selector_right a { right: 0px; }
header.header .theme_selector_right a::before { font-family: "FontAwesome"; content: ""; }
@media all and (max-width: 700px) {
    header.header { width: 100%; }
    header.header .title { display: none ! important; }}

#banner_selector .theme .banner {background-size: auto 100% !important;}

header.header .home_link {border: none !important;}
@media all and (min-width: 701px) {
    header.header #title {display: block !important;}}
@media all and (min-width: 700px) {
    .user-page-header ~ header.header .theme_selector a,
    .story-page-header ~ header.header .theme_selector a {
        line-height: 275px;}
    header.header .title {
        transition: height 0.5s ease;}
    .user-page-header:hover ~  header.header .title,
    .story-page-header:hover ~ header.header .title {
        transition: height 0.2s 0.3s ease !important;}
    .user-page-header ~ header.header .home_link img,
    .story-page-header ~ header.header .home_link img {
        display: none;}
    .user_toolbar {
        background: -webkit-gradient(linear, left top, left bottom, rgba(60, 106, 179, 0), #3a66ac);
        background: -webkit-linear-gradient(top, rgba(60, 106, 179, 0) 0%, #3a66ac 85%);
        background: linear-gradient(to bottom, rgba(60, 106, 179, 0) 0%, #3a66ac 85%);
        margin-top: -45px;
        box-shadow: none;
        position: relative;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);}
    .user_toolbar > ul > li {
        margin-top: 10px;
        z-index: 10;}
     header.header .title {
        overflow: hidden;
        background-color: #1c1c1ce6;}
    .user_toolbar.transitionable {
        transition: background-color 0.25s linear;}
    .user_toolbar > ul > li {
        text-shadow: none;
        color: rgba(0, 0, 0, 0.85);}
    .user_toolbar > ul > li::before {
        right: 0;
        background: rgba(0,0,0,0);
        background: -webkit-gradient(linear, left top, left bottom, rgba(0,0,0,0), rgba(0,0,0,0.3), rgba(0,0,0,0));
        background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
        background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);}
    .user_toolbar > ul > li::after {
        right: -1px;
        background: rgba(150,150,150,0);
        background: -webkit-gradient(linear, left top, left bottom, rgba(150,150,150,0), rgba(150,150,150,0.3), rgba(150,150,150,0));
        background: -webkit-linear-gradient(top, rgba(150,150,150,0) 0%, rgba(150,150,150,0.3) 50%, rgba(150,150,150,0) 100%);
        background: linear-gradient(to bottom, rgba(150,150,150,0) 0%, rgba(150,150,150,0.3) 50%, rgba(150,150,150,0) 100%);}
    .user_toolbar > ul > li:hover {
        background: rgba(0, 0, 0, 0.1);
        background: -webkit-gradient(linear, left top, left bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
        background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 50%);
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 50%);
        color: #fff;}
    .user_toolbar > ul > li {
      text-shadow: 1px 1px rgba(0,0,0,0.3);
      color: #efefef;}
    header.header .home_link {
        height: 175px;
        background-size: cover !important;}
    #fade_banner_image {
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;}}

@media(max-width: 800px) {
  .user_toolbar > ul {
        padding-left: 1.7rem;}}
@media all and (max-width: 700px) {
  .user-page-header, .story-page-header {
        box-shadow: none;}}
@media all and (max-width: 950px) {
  .titleHidden .user-page-header ~ .user_toolbar > ul, .titleHidden .story-page-header ~ .user_toolbar > ul {
        padding-left: 7.5rem;}}
@media all and (max-width: 850px) {
  .titleHidden .user-page-header ~ .user_toolbar > ul, .titleHidden .story-page-header ~ .user_toolbar > ul {
        padding-left: 2rem;}}
@media all and (min-width: 700px) {
  .user-page-header, .story-page-header {
        height: 70px;
        transition: height 0.5s ease;
        border: none;
        box-shadow: none;}
  .user-page-header .info-container, .story-page-header .info-container {
        display: inline-block;
        overflow: hidden;
        height: 70px;
        transition: height 0.5s ease;}
  .story-page-header > .inner, .user-page-header > .inner {
        padding: 25px 0px 25px 15px;}
  .user-page-header .avatar-container, .story-page-header .image-container {
        position: relative !important;
        width: 1px; /*chrome fix*/
        z-index: 13 !important;}
  .user-page-header .patreon-sponsor {
        float: none !important;
        margin-top: 10px;
        display: inline-block;
        vertical-align: top;}
  .user-page-header .patreon-sponsor::before { content: "P";}
  .user-page-header .patreon-sponsor-gold:before { content: "G";}
  .user-page-header .patreon-sponsor-silver:before { content: "S";}
  .user-page-header .patreon-sponsor-bronze:before { content: "B";}
  .story-page-header {overflow: visible !important;}
  .user-page-header .tabs li a, .user-page-header .tabs li a:before, .user-page-header .tabs li a span {
        color: #ccc !important;
        text-shadow: none !important;}
  .user-page-header .tabs li a {
        transition: background 0.5s ease;
        border-radius: 4px;
        margin: 2px !important;
        background: #404040 !important;
        box-shadow: 0px 1px #555 inset !important;
        border: 1px solid #222 !important;
        text-shadow: -1px -1px rgba(0, 0, 0, 0.2) !important;}
  .user-page-header .tabs li a:hover {background: #353535 !important;}}
.story-page-header h1 .button-group .drop-down-expander,
.user-page-header h1 .button-group .drop-down-expander {
    background: transparent linear-gradient(to bottom, #555 0%, #444 100%) repeat scroll 0% 0%;
    border: 1px solid #444;
    color: #222;
    text-shadow: 1px 1px #222;}
.user-page-header, .story-page-header {
    background-color: rgba(28,28,28,0.9);
    color: #bbb;
    text-shadow: none;
    padding: 0 10px 0 10px;}
.user-page-header .tabs {
    margin-top: 10px;
    bottom: initial !important;}
/*Chrome Fix*/
.user-page-header .inner ol li {white-space: nowrap;}
.story-page-header > .inner hr, .user-page-header > .inner hr {border-color: rgba(28,28,28,0.9) rgba(0, 0, 0, 0.3) rgba(255, 255, 255, 0.1) !important;}
.user-page-header .mini-info-box, .story-page-header .mini-info-box {
    white-space: nowrap;
    direction: rtl;
    top: 0px;
    right: 3px;
    bottom: auto;
    left: auto;
    border: none;
    list-style: unset;
    background: none !important;}
.story-page-header > .inner h1, .user-page-header > .inner h1,
.user-page-header ol b, .story-page-header ol b {color: #fff;}
.story-page-header > .inner h1 .author {color: #bbb;}
.story-page-header > .inner, .user-page-header > .inner {
    width: 100%;
    padding: 15px 0px !important;}
.user-page-header .tabs li.selected a::after {display: none !important;}
.user-page-header .tabs li.selected a {z-index: 0 !important;}`, 'Fimfiction_Advanced_Banner_Stylesheet');
}

function makeBannerTransitionStyle(height) {
    const style = `
@media all and (min-width: 700px) {
    .user-page-header:hover ~  header.header .title, .story-page-header:hover ~ header.header .title { height: 40px;}
    .user-page-header:hover, .story-page-header:hover,
    .user-page-header:hover .info-container, .story-page-header:hover .info-container {
        transition: height 0.5s 0.6s ease;
        height: ${height}px;}}`;
    const id = 'Fimfiction_Advanced_Banner_Transition_Stylesheet';
    const el = document.getElementById(id);
    if (el) return el.innerHTML = style;
    makeStyle(style, id)
}

//-----------------------------------OPTION FUNCTIONS-----------------------------------------------

function getBlockLightbox() {return settingsMan.bool('block_lightbox', false);}
function setBlockLightbox(e) {settingsMan.setB('block_lightbox', e.target.checked, false);}

function getPinUserbar() {return settingsMan.bool('pin_userbar', false);}
function setPinUserbar(e) {
    if (getPinUserbar() != e.target.checked) {
        settingsMan.setB('pin_userbar', e.target.checked, false);
        if (e.target.checked) {
            barScrollOn();
        } else {
            barScrollOff();
        }
    }
}

function getAlwaysShowImages() {return settingsMan.bool('unspoiler_images', true);}
function setAlwaysShowImages(e) {settingsMan.setB('unspoiler_images', e.target.checked, true);}

function getSweetieEnabled() {return settingsMan.bool('sweetie_staff_enabled', false);}
function setSweetieEnabled(e) {
    settingsMan.setB("sweetie_staff_enabled", e.target.checked, false);
    if (!e.target.checked) {
        settingsMan.remove("sweetie_posX");
        settingsMan.remove("sweetie_posY");
        settingsMan.remove("sweetie_img_index");
    }
    const belle = document.querySelector('#belle');
    if (belle) {
        belle.style.display = e.target.checked ? "block" : "none";
    } else if (e.target.checked) {
        setupSweetie();
    }
}

function getSig() {return settingsMan.get("user_sig", defaultSig);}
function setSig(v) {settingsMan.set("user_sig", v, defaultSig);}

function getWideNotes() {return settingsMan.bool("wideAuthorNotes", true);}
function setWideNotes(e) {settingsMan.setB("wideAuthorNotes", e.target.checked, true);}

function getSaveFocus() {return settingsMan.bool('ultra_snow_save_focus', true);}
function setSaveFocus(e) {
    settingsMan.setB('ultra_snow_save_focus', e.target.checked, true);
    if (snower) snower.setSave(e.target.checked);
}

function getCustomFont() {return settingsMan.get('custom_font', 'Default');}
function applyCustomFont() {
    let val = getCustomFont();
    const id = 'customFontStyle';
    const style = document.getElementById(id);
    
    if (val == 'Classic') val = 'Arial';
    if (val == '' || val == 'Default') {
        if (style) style.parentNode.removeChild(style);
    } else {
        val = `html, body, .blog_post_content p, .resize_text, .styled_button, h2, .story_link, h1, .story-title, .title {font-family:${val} !important;}`;
        if (style) return style.innerHTML = val;
        makeStyle(val, id);
    }
}
function fillFontOptGroups(input) {
    ChapterFormatController.prototype.initFonts.apply({ font: getCustomFont(), inputs: {font: input} });
    input.insertAdjacentHTML('afterbegin', `<optgroup label="FimFiction">${['Default','Classic'].map(f => `<option value="${f}">${f}</option>`).join('')}</optgroup>`);
    input.addEventListener('change', () => {
        settingsMan.set('custom_font', input.value, 'Default');
        applyCustomFont();
    });
}

function getRecentColours(num) {
    const recent = settingsMan.get('colour_use_history', '');
    return recent.length ? ('#' + recent.replace(/;/g,';#')).split(';').reverse().splice(0, num) : [];
}
function clearRecentColours() {settingsMan.remove('colour_use_history');}
function addRecent(color) {
    let recent = settingsMan.get('colour_use_history', '');
    recent = recent.length ? ('#' + recent.replace(/;/g,';#')).split(';').filter(a => a !== color) : [];
    recent.push(color);
    if (recent.length > 15) recent.splice(0,1);
    settingsMan.set('colour_use_history', recent.join(';').replace(/#/g, ''));
}

function getStoryWidth() {
    const result = settingsMan.get('storyWidth', '46em');
    return parseInt(result) ? result : '46em';
}
function setStoryWidth(e) {
    let val = parseInt(e.target.value) || 46;
    let form = e.target.value.replace(val.toString(), '');
    if (['em','px','%'].indexOf(form) < 0) form = 'em';
    if (form == '%' && val > 100) val = 100;
    e.target.value = val + form;
    settingsMan.set("storyWidth", e.target.value, '46em');
}

function getCustomBanner() {
    if (!(settingsMan.has("customBannerUrl") && settingsMan.has("customBannerColor") && settingsMan.has("customBannerPosition"))) return null;
    const url = settingsMan.get("customBannerUrl", '');
    const pos = settingsMan.get("customBannerPosition", '').split(' ');
    pos[1] = parseInt(pos[1]) || 0;
    pos[3] = parseInt(pos[3]) || 0;
    return Banner("Custom", url, url, settingsMan.get("customBannerColor", ''), pos);
}
function unsetCustomBanner() {
    settingsMan.remove("customBannerUrl");
    settingsMan.remove("customBannerColor");
    settingsMan.remove("customBannerPosition");
}
function setCustomBanner(url, color, pos) {
    settingsMan.set("customBannerUrl", url);
    settingsMan.set("customBannerColor", color);
    settingsMan.set("customBannerPosition", typeof pos === 'string' ? pos.join(' ') : pos);
}

function getLogo() {return settingsMan.int("oldLogo", 0);}
function setLogo(e) {
    settingsMan.set("oldLogo", e.target.value, 0);
    updateLogo(e.target.value);
}

function updateLogo(v) {
    document.querySelector('#home_link img.logo').src = getLogoUrl(v || getLogo());
}

function getSnowing() {return settingsMan.int("snow_bg", 1);}
function setSnowing(e) {
    settingsMan.set("snow_bg", e.target.selectedIndex, 1);
    applySnowing(getBGSnow(), e.target.selectedIndex);
}
function getBGSnow() {return settingsMan.bool("snow_mode", false);}
function setBGSnow(e) {
    settingsMan.setB("snow_mode", e.target.checked, false);
    if (snower) {
        snower.stop();
        snower = null;
        applySnowing(e.target.checked, getSnowing());
    }
}

function applySnowing(g, v) {
    if (v < 2 && (v == 0 || DECEMBER)) {
        if (snower) return snower.start();
        const context = g ? document.querySelector('#title .home_link') : document.body;
        if (context) snower = snowBG(document.body, context, g, !g).start();
    } else if (snower) {
        snower.stop();
    }
}

function getTitleHidden() {return settingsMan.bool("titleHidden", false);}
function setTitleHidden(e) {
    settingsMan.setB("titleHidden", e.target.checked, false);
    document.body.classList.toggle('titleHidden', e.target.checked);
}

function getBGColor() {return settingsMan.get("bgColor", 'transparent');}
function setBGColor(c) {settingsMan.set("bgColor", c, 'transparent');return c;}
function getBGIndex() {return settingsMan.int("bgImg", -1);}
function setBackgroundImg(v) {settingsMan.set("bgImg", v, -1);}

function getBG() {
    let index = getBGIndex();
    if (index == -1) return 'none';
    if (index < 0) return '';
    return backgroundImages[index % backgroundImages.length];
}

function applyBackground(c) {
    let img = getBG();
    settingsMan.flag('background', !((c == '' || c == 'transparent') && img === 'none'));
    const bod = window.getComputedStyle(document.body);
    const bodc = document.querySelector('.body_container');
    if (img == 'none') img = bod.backgroundImage;
    if (c == '' || c == 'transparent') c = bod.backgroundColor;
    bodc.style.background = `${typeof img === 'string' ? img : img.Css} ${c}`;
    document.body.dataset.baseColor = c;
    c = window.getComputedStyle(bodc).backgroundColor.replace(/rgb|a|\(|\)| /g,'').split(',');
    if (brightness(c[0] >> 0,c[1] >> 0,c[2] >> 0) < 100 || (typeof img !== 'string' && img.Type.Key.indexOf('d') != -1)) {
        all('.breadcrumbs, .chapter-header, .user-stats > div > .section > h1', a => a.classList.add('bright'));
    } else {
        all('.bright', a => a.classList.remove('bright'));
    }
}

//---------------------------------------DATA STRUCTURES--------------------------------------------

function LOGO(name) {return BG(name, GITHUB + '/logos/' + name.replace(/ /g, '_') + '.png');}
function Ban(name, source, color, bg, pos) {return Banner(name, GITHUB + '/banners/' + name + (name.indexOf('.') < 0 ? '.jpg' : ''), source, color, bg, pos);}
function Ban2(name, source, color, bg, pos) {return Banner(name, GITHUB + '/banners2/' + name + (name.indexOf('.') < 0 ? '.jpg' : ''), source, color, bg, pos);}
function Banner(name, img, source, color, bg, pos) {
    if (typeof bg === 'object') pos = bg, bg = null;
    return {'id':name, 'url':img, 'source':source, 'colour':color, 'position': (pos ? Pos(pos) : null), 'background': bg};}

function Pos(poss) {
    const result = {
        'class': 'Pos',
        'position-x': '', x: 0,
        'position-y': '', y: 0,
        toString: () => {
            var string = result['position-x'];
            if (string != 'center') {
                string += ' ' + result['x'] + 'px';
            }
            string += ' ' + result['position-y'];
            if (result['position-y'] != 'center') {
                string += ' ' + result['y'] + 'px';
            }
            return string;
        }
    }
    let i = 0;
    result['position-x'] = poss[i++];
    if (poss[i] != 'center') result['x'] = poss[i];
    i++
    result['position-y'] = poss[i++];
    if (poss[i] != 'center') result['y'] = poss[i];
    return result;
}

function CBG(type, p, bg2) {
    if (typeof(p) !== 'string') return CBG(type, '', p);
    bg2.Type = { Key: type, param: p };
    return bg2;
}

function BG(name, css, source) {
    const words = ['top','left','right','bottom','center'];
    return {
        Able: typeof (name) == 'string',
        Type: { Key: '', param: '' },
        Css: css,
        Name: name,
        Setup: function(blank, c, i) {
            blank.children[1].innerHTML = name;
            blank.children[0].style.backgroundColor = c;
            blank.children[0].style.opacity = '0.8';
            var css = this.Css.replace(/ fixed/g, "");
            if (this.Type.Key.indexOf('k') != -1) {
                css = css.split(' ').map(a => {
                    return words.indexOf(a) > -1;
                }).join(' ');
            }
            blank.style.background = css;
            blank.dataset.bgIndex = i;
            if (this.Type.Key.indexOf('p') == -1) blank.style.backgroundPosition = "center center";
            if (this.Type.Key.indexOf('c') != -1) {
                blank.style.backgroundSize = 'contain';
            } else if (this.Type.Key.indexOf('k') != -1) {
                blank.style.backgroundSize = this.Type.param;
            } else {
                blank.style.backgroundSize = 'cover';
            }
            blank.addEventListener('click', () => {
                setBackgroundImg(i);
                applyBackground(getBGColor());
            });
            if (source) {
                blank.style.position = 'relative';
                blank.insertAdjacentHTML('beforeend', `<a class="bg_source_link" href="${source}" >Source</a>`);
            }
        }
    }
}

//--------------------------------------UTIL FUNCTIONS-----------------------------------------------

function override(obj, member, new_func) {
    new_func.super = obj[member].super || obj[member];
    obj[member] = new_func;
}

function addDelegatedEvent(node, selector, event, func, capture) {
    const k = ev => {
        const target = ev.target.closest(selector);
        if (!target) return;
        if (('mouseout' == event || 'mouseover' == event) && target.contains(ev.relatedTarget)) return;
        func.call(target, ev, target);
    };
    node.addEventListener(event, k, capture);
    return k;
}

function newEl(html) {
    const div = document.createElement('DIV');
    div.innerHTML = html;
    return div.firstChild;
}

function replaceWith(el, html) {
    el.insertAdjacentHTML('beforebegin', html);
    el.parentNode.removeChild(el);
}

function all(selector, holder, func) {return func ? Array.prototype.forEach.call(holder.querySelectorAll(selector), func) : all(selector, document, holder);}
function extend(onto, offof) {Object.keys(offof).forEach(key => onto[key] = offof[key]);return onto;}
function compose(one, two) {return (e) => { one(e), two(); };}
function range(from, to) {return Array.apply(null, Array(to - from + 1)).map((_, i) => from + i);}
function reverse(me) {return me && me.length > 1 ? me.split('').reverse().join('')  : me;}
function endsWith(me, it) {return reverse(me).indexOf(reverse(it)) == 0;}
function pickNext(arr) {return arr[Math.max((new Date()).getSeconds() % arr.length, 0)];}
function replaceAll(find, replace, me) {return me.replace(new RegExp(find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'g'), replace);}
function getExtraEmotesInit() {return !!document.querySelector('div#extraemoticons_loaded');}
function cssToRgb(css) {return css.replace(/[^0-9,]/g, '').split(',');}

function normalise(me) {
    if (!me) return me;
    let space = true;
    return me.split('').map(f => {
        f = space ? f.toUpperCase()  : f.toLowerCase();
        space = f == ' ';
        return f;
    }).join('');
}

function jule(s) {
    let a = '', len = s.length;
    for (var i = 0; i < len; i += 2) a += (i < len - 1 ? s[i + 1] : '') + s[i];
    return a;
}

function urlSafe(me) {
    const result = me.toLowerCase().replace(/['",;.?]/gi,'').replace(/[^a-z0-9_-]/gi, '-');
    while (result.indexOf('--') != - 1) result = result.replace(/--/g, '-');
    return result.replace(/-*$/g, '');
}

function InvalidHexColor(color) {
    const i = colours.NamesLower.indexOf(color.toLowerCase());
    if (i > -1) return i;
    color = color.replace(/#/g,'');
    return color.length == 3 && color.length == 6 && !/^[0-9a-f]+$/ig.test(color);
}

function rgbToHex(rgb) {
    rgb = rgb.map(a => parseInt(a) || 0);
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return rgbToHex([rgb[1], rgb[2], rgb[3]]);
}

function hexToRgb(hex){
    let c = hex.substring(1).split('');
    if (c.length == 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c= '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
}

//---------------------------------------VIRTUALISATIONS--------------------------------------------

function Animator() {
    let currentScroll, lastScroll;
    let listenerCount = 0;
    let isRunning = false;
    let callbacks = {};
    let dispatch = a => a;

    function bake() {
        dispatch = a => a;
        Object.keys(callbacks).filter(i => !!callbacks[i]).forEach(i => dispatch = compose(callbacks[i], dispatch));
    }

    function animate() {
        currentScroll = window.scrollY;
        if (currentScroll != lastScroll) {
            lastScroll = currentScroll;
            dispatch();
        }
        if (isRunning) requestAnimationFrame(animate);
    }

    return {
        on: (type, callback) => {
            if (!callbacks[type]) listenerCount++;
            callbacks[type] = callback;
            bake();
            if (!isRunning) {
                isRunning = true;
                animate();
            }
        },
        off: type => {
            if (!callbacks[type]) return;
            listenerCount--;
            callbacks[type] = null;
            if (listenerCount <= 0) {
                listenerCount = 0;
                isRunning = false;
            }
            bake();
        }
    };
}

function BannerController(sets) {
    let preloader = null;
    const done = e => e.target.parentNode.removeChild(img);
    const bannerScrollOn = () => animator.on('banners', updateBannerScroll);
    
    if (CHRIST) sets.push({name: "Festive", items: [Ban("christmas.png", "", "#4c7e6e")]});
    sets.forEach(set => banners.push.apply(banners, set.items));
    
    function preloadBanner(banner) {
        if (banner.catched) return;
        if (!preloader) {
            document.body.insertAdjacentHTML('beforeend', '<div id="imagePreload" style="position:absolute;overflow:hidden;width:0px;height:0px;top:-200;left:-200"></div>');
            preloader = document.body.lastChild;
            preloader.addEventListener('load', done);
            preloader.addEventListener('error', done);
        }
        preloader.insertAdjacentHTML('beforeend', `<img src="${banner.url}"></img>`);
        banner.catched = true;
    }
    
    function updateBannerScroll(position) {
        var home_link = document.querySelector('.home_link');
        if (home_link) {
            var top = offset(home_link).top;
            var off = (position && position.class === 'Pos') ? position : banners[theme].position;
            if (window.scrollY < top | window.scrollY - 1 >= top + home_link.offsetHeight) {
                home_link.style.backgroundPosition = off ? off : '';
                return;
            }

            top = (window.scrollY - top) * 0.6;
            var fX = off ? off['position-x'] : window.innerWidth < 1000 ? 'left' : 'center';
            var X = fX != 'center' ? (off ? off.x : '-150') + 'px ' : '';
            var fY = off ? off['position-y'] : 'top';
            var Y = '';
            if (off) {
                if (fY == 'center') {
                    Y = 'calc(50% + ' + top + 'px)';
                    fY = 'top';
                } else if (fY == 'bottom') {
                    Y = (off.y - top) + 'px';
                } else {
                    Y = (off.y + top) + 'px';
                }
            } else {
                Y = (top*0.6) + 'px';
            }
            home_link.style.backgroundPosition = fX + ' ' + X + fY + ' ' + Y;
        }
    }
    
    function toZeroAlpha(color) {
        if (color.indexOf('rgb(') == 0) {
            return color.replace('(','a(').replace(')', ',0)');
        }
        if (color.indexOf('rgba(') == 0) {
            color = color.split(',');
            color[color.length - 1] = '0)';
            return color.join(',');
        }
        color = hexToRgb(color);
        color[3] = 0;
        return 'rgba(' + color.join(',') + ')';
    }
    
    function computeAppropriateHeight(header) {
        const el = header.querySelector('ul.tabs, ul.tags');
        return el ? el.offsetTop + el.offsetHeight + 30 : 255;
    }
    
    const bannerScrollOff = () => {
        animator.off('banners');
        all('.home_link, #fade_banner_image', a => a.style.backgroundPosition = '');
    };
    
    let self;
    return self = {
        prev: _ => slider.goto(theme == 0 ? banners.length - 1 : theme - 1, true),
        next: _ => slider.goto(theme >= banners.length - 1 ? 0 : theme + 1, true),
        reset: function() {
            this.setCurrent('');
            slider.goto(-1, false);
        },
        initFancy: function() {
          if (this.getFancy() && this.getEnabled()) {
              bannerScrollOn();
              updateBannerScroll();
          }
        },
        getCurrent: function() {
            for (let d = document.cookie.split(';'), i = 0; i < d.length; i++) {
                let a = d[i].split('=');
                if (a[0].replace(/^\s+|\s+$/g, '') == 'selected_theme' && a[1].length) return unescape(a[1]);
            }
            return CHRIST ? 'christmas.png' : null;
        },
        setCurrent: function(value) {
          document.cookie = 'selected_theme=' + escape(value) + ';path=/';  
        },
        getEnabled: function() {
            return settingsMan.bool('banners', true);
        },
        setEnabled: function(e) {
            settingsMan.setB("banners", e.target.checked, true);
            settingsMan.flag('banners', e.target.checked);
            if (e.target.checked) {
                this.build(banners);
            } else {
                all('#Fimfiction_Advanced_Banner_Stylesheet, header.header > #title.title', s => s.parentNode.removeChild(s));
                document.querySelector('.user_toolbar').style.background = '';
            }
            bannerScrollOff();
            this.initFancy();
        },
        getFancy: function() {
            return settingsMan.bool('fancy_banners', false);
        },
        setFancy: function(e) {
            if (e.target.checked == self.getFancy()) return;
            settingsMan.setB('fancy_banners', e.target.checked, false);
            if (e.target.checked) {
                self.initFancy();
            } else {
                bannerScrollOff();
            }
        },
        addBannerCredits: function(sets) {
            const themeId = this.getCurrent();
            const category = CHRIST ? 2 : 0;
            replaceWith(document.querySelector('.front_page'), `<div id="banner-archive" class="content mobile-no-margin">
                <div class="content_box">
                    <div class="content_box_header">
                        <h2>Banner Archive</h2>
                    </div>
                    <div class="main" style="padding:15px; line-height:1.8em;">
                        The My Little Pony: Friendship is Magic community has churned out some incredible artwork from enormously talented artists. The banner selection on Fimfiction is just a small selection of what I consider to be some of the defining examples of artistic quality its members can produce. If you\'d like to suggest a piece of artwork for a banner, send <a href="/user/sollace">me a pm</a> and if I think it's high enough quality I might use it, but I'm pretty picky and need artwork that works on the site so please don't be offended if I'm not interested in what you send!
                        <br><br>
                        If you see a banner you'd like you use permanently on the site, just click it below!
                    </div>
                </div>
                <div id="banner_switcher" style="display:block;text-align:center">
                    <div class="inner">
                        <div class="toggleable-radio toggleable-radio-${sets.length}" >${sets.map((a, j) => 
                            `<input name="banner-group" id="${a.name}" type="radio" value="${a.name}"${(j == category ? ` checked="checked"` : '')} ></input><label for="${a.name}">${a.name}</label>`).join('')}<a></a>
                        </div>
                    </div>
                </div>
                <form id="banner_selector">${sets.map(a => 
                    `<div class="banner_credits" data-group="${a.name}" style="transform:translateX(-${category * 100}%)">${a.items.map(item => `
                        <input type="radio" id="banners[${item.id}]" value="${item.id}"${item.id == themeId ? ` checked="checked"` : ''} name="banners[]"></input>
                        <label for="banners[${item.id}]" class="theme">
                            <div class="banner" title="Click to select this banner" style="background-image:url(${item.url})${(item['position'] ? `;background-position:${item.position};` : '')}"></div>
                            <div class="source" style="background-color:${item.colour}">
                                ${(item['source'] ? ` Source: <a href="${item.source}">${item.source}</a>` : '')}
                            </div>
                        </label>`).join('')}
                    </div>`).join('')}
                </form>
            </div>`);
            
            const archive = document.querySelector('#banner-archive');
            addDelegatedEvent(archive, '#banner_selector input', 'change', (e, target) => {
                this.setCurrent(target.value);
                this.finalise();
            });
            addDelegatedEvent(archive, '#banner_switcher input', 'change', e => {
                const bannersets = document.querySelectorAll('.banner_credits');
                [].some.call(bannersets, (a, offset) => {
                    if (a.dataset.group == e.target.value) {
                        a.parentNode.style.height = `${a.offsetHeight + 50}px`;
                        Array.prototype.forEach.call(bannersets, a => a.style.transform = `translateX(-${offset * 100}%)`);
                        return true;
                    }
                });
            });
            
            animator.on('switcher', pinnerFunc('#banner_switcher', 'switcher', document.querySelector('#banner_selector')));
        },
        buildAll: function() {
            if (!this.getEnabled()) return;
            document.querySelector('.footer .block a[href="/staff"]').insertAdjacentHTML('afterend', '<br><a href="/?view=page&page=banner_credits">» Banner Credits</a>');
            if (CURRENT_LOCATION === '?view=page&page=banner_credits') this.addBannerCredits(sets);
        },
        build: function() {
            settingsMan.flag('banners', true);
            all('.patreon-sponsor', a => a.title = window.getComputedStyle(a, ':before').content.replace(/["']/g, ''));
            
            if (getTitleHidden()) document.body.classList.add("titleHidden");
            const subHeader = document.querySelector('.user-page-header, .story-page-header');
            if (subHeader) {
                userToolbar.insertAdjacentElement('beforebegin', subHeader);
                
                if (subHeader.classList.contains('story-page-header')) {
                    subHeader.querySelector('.inner').classList.add('content');
                }
                
                document.querySelector('.nav_bar .logo').classList.add('tiny-logo');
                
                const readyBannerAnim = () => {
                    makeBannerTransitionStyle(computeAppropriateHeight(subHeader));
                };

                window.addEventListener('resize', readyBannerAnim);
                window.addEventListener('DOMContentLoaded', readyBannerAnim);
                requestAnimationFrame(readyBannerAnim);
            }
            
            addBannerCss();
            userToolbar.insertAdjacentHTML('beforebegin', `<header class="header">
                <div id="title" class="title">
                    <div class="banner-buttons">
                        <a target="_blank" id="source_link">Source</a>
                        <a data-action="reset">Reset Selection</a>
                        <a href="/?view=page&page=banner_credits">Banner Selector</a>
                    </div>
                    <a href="/" class="home_link"><div id="fade_banner_image" ></div></a>
                    <a href="/" class="home_link_link"></a>
                    <div class="theme_selector theme_selector_left"><a href="#" data-action="prev"></a></div>
                    <div class="theme_selector theme_selector_right"><a href="#" data-action="next"></a></div>
                </div>
            </header>`);
            addDelegatedEvent(userToolbar.previousSibling, 'a[data-action]', 'click', (e, target) => {
                e.preventDefault();
                this[target.dataset.action]();
            });
            
            slider.ready();
            customBanner = getCustomBanner();
            if (customBanner) {
                customBannerindex = banners.length;
                banners.push(customBanner);
            }
            this.finalise();
            requestAnimationFrame(() => userToolbar.classList.add('transitionable'));
        },
        finalise: function() {
            const themeId = this.getCurrent();
            if (!(themeId && banners.some((a, i) => {
                if (a.id !== themeId) return;
                this.pick(i);
                return true;
            }))) this.pick(-1);
        },
        pick: function(id, save) {
            if (id < 0 || id > banners.length) {
                id = Math.floor(Math.random() * banners.length);
            }
            if (save) {
                this.setCurrent(id < 0 || id > banners.length ? '' : banners[id].id);
            }
            theme = id;
            this.changeBanner(banners[id].source, banners[id].url, banners[id].colour, banners[id].position);
            preloadBanner(banners[id == 0 ? banners.length - 1 : id - 1]);
            preloadBanner(banners[(id + 1) % banners.length]);
        },
        changeBanner: function(source, img, color, pos) {
            if (color && color.length) {
                userToolbar.dataset.backgroundColor = color;
                userToolbar.style.background = `linear-gradient(to bottom, ${toZeroAlpha(color)} 0%, ${color} 85%)`;
            }
            
            const homeLink = document.querySelector('#title a.home_link');
            if (!homeLink) return;
            homeLink.style.backgroundImage = `url('${img}')`;
            
            const sourceLink = document.querySelector('#source_link');
            sourceLink.classList.toggle('hidden', !(source && source.length));
            sourceLink.href = source;
            
            homeLink.style.backgroundSize = pos ? '1300px' : '';
            homeLink.style.backgroundPosition = pos || '';
            if (this.getFancy()) updateBannerScroll(pos);
        }
    };
}

function Slider() {
    const slideTimes = [-1, 60000, 180000, 300000, 600000, 1800000, 3600000],
          slideLabels = ["Off","One Minute","Three Minutes","Five Minutes","Ten Minutes","Half Hour","One Hour"];
    let fade, tit, isSliding, slideshowTimer;
    
    function loadImg() {
        userToolbar.style.transitionDuration = '3s';
        bannerController.chooose(theme);
        setTimeout(() => userToolbar.style.transitionDuration = '', 3000);
        fade.style.transition = 'opacity 3s linear';
        fade.style.opacity = 0;
        isSliding = false;
        me.updateSlide();
    }
    
    return {
        ready: _ => {
            fade = document.querySelector('#fade_banner_image');
            tit = document.querySelector('#title a.home_link');
        },
        getShuffle: _ => settingsMan.bool("shuffle_slideShow", true),
        setShuffle: e => settingsMan.setB("shuffle_slideShow", e.target.checked, true),
        labels: _ => slideLabels,
        getSlide: _ => settingsMan.int("slideShow", 0),
        setSlide: function(e, callback) {
            settingsMan.set("slideShow", Math.abs(e.target.selectedIndex % slideTime.length), 0);
            this.updateSlide();
            callback();
        },
        updateSlide: function() {
            if (isSliding) {
                clearTimeout(slideshowTimer);
                isSliding = false;
            }
            const slide = this.getSlide();
            if (slide && fade) {
                isSliding = true;
                slideshowTimer = setTimeout(() => {
                    fade.style.transition = 'none';
                    fade.style.opacity = 1;
                    fade.style.background = window.getComputedStyle(tit).background;
                    if (this.getShuffle()) {
                        theme = Math.floor(Math.random() * (banners.length - 1));
                    } else {
                        theme = theme + 1 >= banners.length ? 0 : theme + 1;
                    }
                    const img = document.createElement('IMG');
                    img.src = banners[theme].url;
                    img.addEventListener('load', loadImg);
                }, slideTimes[slide]);
            }
        },
        goto: function(index, save) {
            const cc = window.getComputedStyle(tit);
            fade.style.transition = 'none';
            fade.style.opacity = '1';
            fade.style.backgroundImage = cc.backgroundImage;
            fade.style.backgroundPosition = cc.backgroundPosition;
            fade.style.backgroundSize = cc.backgroundSize;
            bannerController.pick(index, save);
            fade.style.transition = 'opacity 0.25s linear';
            fade.style.opacity = '0';
        }
    };
}

function setupSweetie() {
    let x, y;
    let lastX = -1, lastY = -1;
    let lastClientX = -1, lastClientY = -1;
    let prefX = 0, prefY = 0;
    
    let timestamp;
    
    let grabbedImage = null;
    let hearter = null;
    
    const baseCursorUpgradeCost = 10;
    let cursorUpgradeCost = 0;
    const baseCursorCost = 4;
    let cursorCost = baseCursorCost;
    
    let score = 0;
    let bank = 0;
    let shaken = 0;
    let shakeCount = 0;
    
    let selected_image_index = 0;
    let dragging = false;
    
    const pointType = [0,0];
    const cookie = [
        'YFBMVEWQYzXhyW/QsFRzSiutjkr579bo04TTt21cOSKccTr05LisgT3q2KzBm0ecfk2oi2rbxIh/WTTKtIPHpU+0pIXEqWnv25lEKRnjzpm7j0G4mlyMlFeAdUTZvl7///////94/aVlAAAAIHRSTlP/////////////////////////////////////////AFxcG+0AAA8ySURBVHjazFqLlqSotgRETURQktIUFM///+WNwKxH16N7Zu6ctY49049cVTvYr9ixscR//suP+N8BeNxuj9t/EaBpmhshbk0jQmhu/y7AEabDi4MgjZg6mY2ocP8GAE7sp/s4tOc5KiOEKus5rL0WAmiPx+P/B3BrQhDTiadtz3mWXbFZ1n92yjpC3P4E8VuARvhuWmYYHLb72PfL3JdladtxGLpVdp0P4vYnL8TvTj/B9jz39/v9ZZpkzvO5DnJZ7vOwdrC/FiuQ7sdvc/EjQDheXnD0+9LLPHlvrNfLdsLwkuNSpJQdUFRJiBNT/yPIDwA3Qes4/0tWvcZBRZum+3lusyxRSyVLRwTgGJGEn5DyHyDE9z112R+2CUc/+2MPYrG5xkupqLSOakWIulKU9npu4Zf5AUF8az/UyjlfskdT9SmEJfS9RJYXJbVTVi/9opYenxWXNZCH1ovvm0/8aH8c5/vLGBjiwF9BeB910tY7mkSyl34deiXdMp7tKf33LnwFeKBX8Q0DSuc+FsOOFcIEARCB0CTjfb6vqFLUbVdiKXIZhmFd/dF819vi+/Ov430e7+PZ6YAyFIiEQUXCDTx+God1lneUFBJSlJLdOmyd3vfjmyiJL/abaRja+d7L86UdN2kCXAhSwpCgF8H7DqbRD7mTyjlAAGA7F30YFb76IL601wTWOZeMameeO5VQ5U0QBhUjECtTzjvMLchtXuQS49KjIdpV5cOX0nyhDvElPiNqYs5Jd/llGLteRRInMi1w3qNE4yXKd5m01otEeS4F1lccZLd2k19dEJ/i4xH/bV6yTamLqJMSra100NzC4W1RJvh+7fJ0TgsMS/T0CmbqZHQHAEzzmZrE5/ijWRfEtaRU8rJIlI2ylTQJEphokQlQUKogDlDG2pKZyq59slp8RhC/2gf53LO2yVmr0FhnV5xWFhVYOa3Os3CAsFftvWZx0gE0MhHwPfF5mB8AGJ+xz9aYaAyadThn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IlGgmo4D7e8PuHALt8fvb9+rhsbkhQqijGlbvkogCY89tiBqEhYtomOXemt1z/awOil3ddgHkvjp/UGV0YK3uIgTszHPGFPoDAnYSiII4lAmvgPjDQCOzRmD2DSh+fP1/oXApdfEEinGepVBTqoKRSAk7ZLElqvvJLq5jkhE3oZ6+q8v7b57h3MhcMYnlV1O2BdUbwmQVNLsK7SvywOvmHlbiq/kGD2O717ifPsW6kLgNair+tbuXmtIaahelYrjMHI236FAHBr/yJbDmbT4l9+jXWKFFw+GSiXuDmsnLwIdKQ1o8Eej3SOCZ7GkVwL96+/RXiFqN1Gk7VbHrl6CK02K47GNz7zQJ3MfbO3H33kT+B6mG69ZyX6Qemw/Cq+6zx8mtZLdcc2Nn1/J/vw29vGKgbUx2UsrOSgaaj7e8MbIPbK5rP/8yvc375OfurEKK9IzVO/O42shVETZk5KOp/nHP3th/XjDqOxAFPG8V6mjtHn84fh/fqf/eH1u15uoquea58Z3CYI/vHP/808lPN6f581IeLX8Z/N/9ccePmL88vyrPxnyNy3/o59t+TuW//d+eOYfPv8nwADzSJWtRsg9UAAAAABJRU5ErkJggg==',
        'wFBMVEXmik7aaCrfm53xrmu1QTGsOCdzFgz52bT88/FWDwnVbErJRR0iBwfheDK8OBnpjjr2w4rwzM/869GtKxnun0v51WmYNinqmWSZIhTUWySMLR+JHBDFTCr87Kn644rIWDi8T0qrNRy/QR13IxfLVCrGXk+ZJQzWdmzceExuJSPSYDajKw7OfpHms7+JIg7hgkrgjW6tNBDPTx+0MBWfLhy5TTVFGhj13eNeHBeiJBiOHxdFDQtjEg+AGBP///////+ZUr64AAAAQHRSTlP///////////////////////////////////////////////////////////////////////////////////8AwnuxRAAAEc1JREFUeNrMWg1zm8iyBfMlQDMggREM2AqDRCRkSxZCtvjc//+v3hlkJ04cJ7v77q26U65NKmv1me7pPn16RtJf/+Ul/e8AtF3Xdv9FgL7vOwHR9X3dNH33nwVgjcrSkOm6bva16juJV49w/wkA7FhTLcU1Ji9PZRg3EVEGVyG8ruFS27b/P4Cub5paHYZh4rovxTKSyx0nk8kwGL5MSwHR/QnitwB9rflqIcG+clhuklWx4TZPXFdxXV9xfD+NQ9P8gxfS73avwrYkEcuyvlRVpLj3w3Jta3y5cRUf9n3Zi/WunZrtvwFo2HqN2FgFcRK1quJcmhnGZKkeq4onsoOlSITzvGvNrjP1Tw/8E4CuFtax/3UiE05DXXeN2frmQQ12u10ul4Q4hBwKejyabazvtTDsP4GQfl1TV/vuQtU8OhAW6Pq9u354CDSW7Y/H3LMjnxTL1f1tkbVm+lUmK+8TBOmX9ht13P860VBUxI77pLu9twK2DViQpbt4l0QJr/h8Pr9bby/dw82Tm9a/Lj7pU/uKIllrpUEF9zEKrGGX5+dsm13Ydp9Vs5mcVsZ8bizVJbsED08vJP21Cx8BWtTqYAyuZa0thXiiYusw7PRpO32+ZCy7XC577XCIVk/z+eKsnc/nbXC2Dn7K+l/VtvTr/SuKJSmWMvi8Af/Ujkxj5KNY7fNlC3tFpA3z+VnV8BPs03VB0iBgv4iS9MF+r7quIVnEGdaGsnC8Bi7EhEQcCSMALpfkwSKLqNJcVw0CVVNZxrQbzcvqqPnog/ShvFQDB1AkSVSggid+xHvQURyGUcmR8J15fKiWsyRJ9/vgyzkYV7b/khyrrJJJ/4E6pA/xUZCeUmJzP/kCB4rSbnTT7HW9ISW92Eddt28Om0RLc6T/+YqQKUORX/LdwfnogvRTfDTEfyEVCbVtv0ySpKT5DjmE/2PGrPIiO+7i5EC49lKlaw0hChhj8/n9hsVtvkFO/ExN0s/xH2Bejgixucy5FlG+o3knKA2Hrfc6gqRXG0I1mT7eiDhlejafW+pZe9b704nXPyNIP9oH+VgJp3ZJaURW/PH+vtjvYlgB2SC88MTUM2f2eEirKn2yVupuz54miqaq50rvczuiPzP4e4AxPiShnhd5Hl+tDo9zw9hsu3y/eYn7vh15rdm4w9NK21VNXe0ibCT1bzcqcrUz93s4HtefAYCeQUCLAu2wqWtqkCK5mxtPy4Dp+Wpxquumjztdmw0TY5kes6gJw5NX0iMOCvYZa9ucR9Ep7H/MpO8AbaMpIn+8uma1RpfO42Y+V4Jgu8325WIlE8WvwtkEzc1aphWP0hp+1p6X8VxlFdM71h156bH6R4R3HtQEBFFwzysTO4pk6Ua6my9gn7H0acG54/jKzWE+d0EOnK2I53mOHbNUjna53u2/fFUv5nGXBnb9A2VI3x1ABklOpKmJNYCLN4vHR2WhbbfbB+28kQOvpo4vKXd3h/PyfK6ONj8hlk3sVTI95se1IW2fzS5PT5HdvBcc0vf+uxgzKEkGd1AOivT0eLNkbPvMtJxGlPV9w33X8hfF1+VyTSlPIxnR6O26lMoVdazgUpn6KaOIEmvajwAM/Vex7KQYQEXGMHmZPVo81Z8v6/2+sMMYkiskJLGK5frhnB65bRPhgdyEnkOi3eW5bVNVP4XIBpTeRw9GijBIRAYJfxmMxctsUxRcN/O9viu9EGTa9WEqz56+PnxNUjvitqzVLGBNX3s8vIAIW33NkWnYPwu+x+gNQNgfFlZEpMUCPrjKzPLv7jepvj/u97uaQTLiJyw26MTLJJJtObJp0CByyLqw6gRAe4x4GIoINaz9CUCUgKtIRSFJC0M0Y9/y58atVeX5sWeZLhi1r/s4rmwiy9FBLm1CAYB/lOw6jvuuaU1Tp3WYDj767AcP1LHFkyTCH0hWxd8c7uf3S63KnhF8HSfceJ5C6l6vI1veENu2uU2hUHtbMeBCTSNUul6GAHBku/nOSNLrCQj7h0jlh6t9Z2Hd3yuV1lzwm51ee8heQylRQ33IER3OaWnLNqobwBqlTnkKw1gPvVpVZCKjS70hvAIYyEx87kRXkmEYyoEc5Ns7MJqOJmY2qWr4ykBsr0aG97F3olg8IjaFBK7VSHZcGQzW91HpJU4ic/sDANKPoHp5unQnsO8QS/bJkmcXkRxcdgdDgjmPAqHVw5NNeWmD6UrGeqa4kJElgzzoFddTNIoEqJsfAPq0+LJc4gOpqi5cV3Ic4shywtMMv2Z6ru8KErQ9z7Y9bK2LTziDEiiov8YzhkKBTG0Y6NLBL2ncwV7eXBgB2GLiLizkpZLcPM5wAkAg6MEUHphx4ihwILFBsWUNMjbb/vbWOR5xDDJ0RFOjG2gaE1q+t6PCKwcE40eAZjJ5sZZ388H4+nDzuBDC1idEjqh2wQE7jmFYRBN83YDJzKkp3d8edrsTehKIrfdsdNJmHLF67MHjCwHwRqkCoFMnLwtrMZ/Mn6yH9deN7zsuvJAPlMLtGkqdrDUPg5n4Cc2p/tU98Co/UhsdsmtRC2UzWhdotWdLjgxCeudBX1svT+v5MLfWN+v1+kaC9B+DRFkQh+BpJ+FMGBcy0jSnjaryMDP7sPZGNde9ToeiLEAcpRJFtG7eedA3S8VaDnNBM+vzanNwQBWIkJ0G+AAhxCAauzrQ90jctk9HhQQAcMhoX6y+573ohSVq/QrQvoWolv3V00J5ulmf1TQhB8X3iVyW9IQsrGXZUeSgbsA5AgQeTKc5Pjw1Y+yWiNgAWviHeW6tOBA8TklHtngFgNqiHMMKX6tBdtlRDBdyVIJt0kDvxlKtsf+moRGqqjMhgqfCfmv2FSEArWsNrRZCBi0Ui3pGCRJ5YwvpKqepluc7Mc+1+gmlzkH3NMLcgZR8XTCERG3MUb2oRY8KP4ETUghM7MhwiOwMEggQFW1TatP3HkAOHbSwh33sLd7ZZbpLnVv5eGK9KeTQGOBrFLq2MTv1aTIweMBnGJ3UwXfIWDrIDNSqLZygCBEkWPd2yMowIRW4ShgKEz/Zha5xf0h4LoZIkR+iGQiaAE90+mAY95st2PkmCZtKnaBkUDSCaSJBsMhTFDwOG0rqDUBdKOhlL2STVtpqghk7mc3vrCW3d41+zUAbZSQmhb4PV7eGa6ns8vDAeRxqL/4GJ1aSEgQ7Gm5qzwcJCurovmURJ0W0XK1kWZ5MFjI/+fPJxlomPKKhoLeutkVEYT9+kfitq6yheR/U/JhX6kwiJQ5MxN6ThV1kAzgW/QOd+Q2gp3YkI3cQR0ORV2m+upeWSxXzcEnsqL/eGLQ4b80n2tFZqGcGBHQ77gzIZxtaqhYLccdBIddEVtTXK5mrByXME3E74AKgTOMqSbm6g1CTZYT3eichJn/D4UlZLs8Ve2BZp9u3934RRbwW9mFS2KeNsD9e+rzzALpQULSjKK7vR2GW73c7/IDZBTJxQAKotMEp5JWMPEkrlW0vZndwb+WioB4EadNfC70RMKMDdROIQ5Cuc6UAcMT9g+OXdrWPj0c1OR6PQkI6ZUJ8Ui7EFkhBCD/m+/1eDCX64larNLSeMG7G6ypo797zRiCB980DHCIV9DZSnFzyNM8Ld4D3dMd5xEX8nMgXBI4ajDi0KLQMyChMVEDtjmGoQ6eMUUR2ikCJuumv6ku6KveIOAqBC85h7GQLMec/Lau9vk85ZEQZcSDDHUGxHt0dc5RIf6rzfad3l7iPxzSAAygyxGZkFu97mgLAKYg4A99foG4e/cl8/vRFCy5oX3ouChOnmHI7En3uhIQ8cfsUx7sdziHPm34sFgA0pSqLWgZBeT7rv3e0rlYdR8JhQjtMpI18N5+vAy3YXp6fp6a+qyiVMclO0IXp6QTxeTpBU3hx2Gdidut089oUepsMLuGiIuoheZ3KrwCN5A6+RCQF8gUzOKa6YM3Y5fIsJu+G+OBRsy/sclWeBBd4No9OIjOFKMCQO7IJG0fsBYZd2Ss9kjTddw/68fJDkgwhSsnq9u4edbS92gdrFicqAEL0YJojWuAEkDKF0mKmWCBxJvhKyDfDSmwJrVCcwLsQNSAwxVrgvxNJLpX7J4bOcLleTkynXUy5rm8OlnJY8WNTi3OuAVGzmHVx23qd4J1OXKIMUmGTiHuiyt7pom70oBDCXdmsSqJsMDlB8b8CtLrtYQYrFcXCZJxjBh15AYuNHfPaNOuCpuABIZ+QrG8OvHkA05JVLKBK5TLnyy8XrG8Apl4SZrbaV+tJC/M4DmOvEaTmNYEor7FpisJKvARDMKRw6Hk/AkD8IvYYbiQfhXSqK5ZlW0xP06k+OhA7kehtqvFYiYuFtx7Xj5EZzWMwVWqv0ijHrNKEHCPID9q0bwr0yUJywQa2jUrVKsaC1zPuJkIXolF2j1Z10XV0oXFcQOKwKyvUmrYeIvV0oEW6j/tdWAffhqjX+WBU4fbgjLeJnO7SqgquAOYsCsXYaLZhR49oaOLupRkZjTVBANXoef6A9F4vV8vHhX9g+iUO2M8A2BGjnhwJsiElmj4ITR/lw80yHnlMPwEEYkgPACA8EPzJxGBE7IWD8UvavMwOc0NpOv2y/BahbzMaiKr0PM7LSHTXMUwmBMDTqhsbf9d5YWiOTU03BWOOJ8sCcXnlJ6qsuNLh5SlRZu4aBXaBWvh5CMRH614IaA8sgElkh8NENBCR9trNulAPUVR6iBMYHCp0QKOJ29Xx+qQqrFmU5gv3yxZD1zYzzb8+AvSv/cJLQQNhnCHRTHPUQfCgvrapeNTQYErRGmtNGie70qvjXSQ0iKchuZ/bi25+HMRhRhttILJxGGLcu9JAPyY6mLgRcVcU/IPXCLqs7cj2xf2kw8GsfZ4sG1OfttnztL1kv5j0/xrjcM1w1BIbAUKQEIaY+pqN4sItgScCALIUzSkhLhodTmxvzQ1LN0dRCYenvwbAXsuaNjUcwELS1La4/bm6JbR5PUjg1V52wBQeZgCPJgpGlTIqdxgd3eAi2Dve/vAw8v7GC8egOEhryPKdTRHHuI5ZLAbwUfTTWisirvZNWY6SVyiBFMMJcqIsDWMBNYbx6piLJvHZpWDnEZAFPaXk9l4eD7jTm1WMEIM9bW1wxNDU06uQB0jvRQgUpmYxZS3PIvwXZFD7m2tNujAg3uX55K7IRRKZeR9WRRgKs2QoioiJEkYR10L/hKkQHJTukvV6W20vAGB60H4OAARPlkvRM2+LVFSurjePm5uXBJHSXAOCAPw2nrm42Ks9TZJtO9tfKj0DwU+nz9n7q5xfXC2LW6E6Ku/nylmtujQ53LmP55tHKTkheRAh7gVX/qyhdNUD38wwD/H2+bnNEBtMPVn/BwCRSvHJd1Tw6V68QLhfHx5ugjSL41S2MaSOJAEE25KIVcxm89mthrTp83071c1L25vt72/fBS13u13GoImU+Xxys344s3wfNgtZg5qwx1FS5BAtxK3V3Yuxfs70GHLPNHHCmdn96f1AFApij+in8/nd1/WXIMDf9SaUPX46CUlSe8QlqioNk5ebe3ezfb5gU5cOargzzfbPLyBiwBNqpE+M+fJ8hv7C5499jCkOCDa0qCPeGq1hmCyKVYLyem7bXM8ykaDt33nDGZeZm+ijGsO6iEvdVXHa56eSclnMtUjOxB1cJ9HirtubugmPf86f37xCCfvimuWLFaA7izudDoMDgQsUIhVDgxiiE6gYmWOya/e9mUFj9l33t9/RrmEyL9vtlgXsuZuuDMNfQkJSm1OqYRxD20gcp6y8Js/0DruAvG7/wUtgO4604kUogz6dmsvb+w1EV2KnkD0UfMU8LUENn/pG17Mu0z+z/+lbZvsmiq7KwiOSxlN01FFcewLAxjzFQFNj3/j8Sfbz19h3CHoe91m23+dHxAjDtoeCo1Ek5sjxYbz9zZPvb96TvyG0gvWgJ/QdE/f5vK7liDVMUBJ7Nd/+uwfrbwAiqwTzoRW93quMrbRv/7D9P7/pt+1rF8QZQkMiF6Hn+teJr2v/aP7vfCuh/b7M681I82b5z+b/7tcevpt7Z/lvWP9n3wz5h5b/1Xdb/onl/70vz/zL9X8CDAD/kRF3et5nTgAAAABJRU5ErkJggg=='
    ].map(a => 'iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAA' + a);
    const imgLabels = 'Sweetie Belle;Scootaloo;Apple Bloom;Applejack;Twilight Sparkle'.split(';');
    const helpContent = 'iPkcpuD/or pmiga;ePSCA Eo(ev rmiga)eW-bolb emIgaseS;IHTFS+APECC-ooik elCciek;r+CPSCA-EeHrastH;S+APECS-ahekS;ahekV girouolsy';
    const imgs = [
        "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"
    ].map(a => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAAGACAYAAACOftF8AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG3QAABt0BFw7rjwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7L1' + a);
    
    imgs.unshift('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQwLjgwNzI2IDczNi4yNTMyNiIgaGVpZ2h0PSI3ODUuMzM2NzkiIHdpZHRoPSIyNTYuODYxMDgiPgoJPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyNS4xNDM0MywtMTUxLjU1NzMzKSI+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2U4YzA0MztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNDEuMzMyMTcsMzUyLjUxOTQxIDc2Ljg2MDM4LDQ1MC42NTQzMiAtMjEuMTczNTYsMy4zMTA3MSAtNzYuODYwMzgsLTQ1MC42NTQzMyIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojY2NhMjEzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDMyMy44MjQzNiwzNTYuMzEwNiA3Ni45NDI5NSw0NDYuMDIzMDUgLTQuMTk5NywwLjUxMzE4IC03NS42Mzc1NiwtNDQ1LjU4NDc2IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNmMmQ3NzY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzMzLjQzNTMxLDM1NC4xOTQ4NSA3Ni40NTEzLDQ0Ni41NDAzOSA3Ljk1NDk1LC0xLjE5OTU1IC03Ni4zOTI3OSwtNDQ2LjkyOTM4IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6MS44OTk5OTk5ODtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDM0MS4zMzIxNywzNTIuNTE5NDEgNzYuODYwMzgsNDUwLjY1NDMgLTIxLjE3MzU2LDMuMzEwNyAtNzYuODYwMzgsLTQ1MC42NTQzIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM5YzZjYWU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gNDQ2LjQyODU4LDg4MC4wMTI3NSAxOC4yNTg3OSwtMjkuOTA2MzIgLTk0LjcwMTgsMTMuODg5NiAzMS4zMTQ3MywyMy4zNTk3NyBjIDE1LjIwOCwtMS41Mjg3NSAzMC4xNTcyOCwtNC4zODM0NiA0NS4xMjgyOCwtNy4zNDMwNSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNiMjhkYzA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzk1LjExMzEyLDgyMC4wNTQzOSAtMjUuMzgwOTcsNDMuNzM2MzYgYyAxNi4xNDI2OCwwLjE4Mjc0IDk1Ljc4NDM2LC0xMC4zNjc3NCA5NC45NTUyMiwtMTMuNjg0MzIgTCA0MjYuMjUsODE1LjM5NzkgWiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eTowLjI2MDAwMDAxO3N0cm9rZTpub25lIiBkPSJtIDQ0Ni4zNzgzNiw4NTQuNzc4MzkgLTI4LjY2MzA4LC00MC43ODQ5MiAtNy4xOTczNCwxLjg5NDA0IDExLjM2NDIyLDQzLjE4NDAyIC0wLjEyNjI3LDI2LjAxMTQzIDE3LjUxNTg4LC0zLjcyODg4IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhOGZiNTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSA0MjUuMjk5MzIsODU4LjU0Mjc4IC0zMi4wODAyNCwzLjY4NTQ4IDEyLjEyMTgzLDI0LjQ5NjIgMTkuMTkyOSwtMi41MjUzOCB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM4ZDlmYzA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzkyLjk2NjU0LDg2Mi4xMDE5OSAxMC40ODAzNCwtNDYuNzE5NTUgNy41ODQwNCwtMS40MTI2NCAxNC4yNjg0LDQ0LjU3Mjk4IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6Izc5NWI4YTtzdHJva2Utd2lkdGg6MS4zOTk5OTk5ODtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDM5NC42NDI4Niw4MjAuNjY1NzUgLTI0LjkxMDcxLDQzLjEyNSAzMS4zMzkyOSwyMy4zMDM1OCBjIDE1LjczOTM2LC0xLjA5MDg3IDMxLjI4Mzg2LC0zLjYxMDU4IDQ1LjM1NzE0LC03LjA4MTU4IEwgNDY1LjA0NTk3LDg0OS45MDgxMyA0MjYuMjUsODE1LjM5NzkiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6Izc5NWI4YTtzdHJva2Utd2lkdGg6MS4zOTk5OTk5ODtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDM2OS43MzIxNSw4NjMuNzkwNzUgYyAyNi45ODQ2MywtMC4zMDA3NSA3Ny4yODg0MiwtNy4yODI4NiA5NS4zMTM4MiwtMTMuODgyNjIiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2U4YzA0MztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzMTAuNjYzMTQsMzQwLjQ2MTE4IDEuMzAxMTUsMTguNTA4MTUgYyAxMi4zODA5NSwtMy43NzI5MSAyNS44MzMzNCwtNS40MjE4OCAzOC43NTAwMSwtNi42MDcxNCBsIC00LjgyMTQzLC0xOC4wMzU3MiIgLz4KCQk8cGF0aCBkPSJtIDMzMy4wNjQwMSwzMzUuODE3NzIgMi45NTUxOSwxOC4xNzc1NCA5LjA5MTM4LC0xLjM4ODk1IC00LjkyNDUsLTE3LjgwMzk0IHoiIHN0eWxlPSJmaWxsOiNmMmQ3NzY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CgkJPHBhdGggZD0ibSAzMTkuNjA1NjYsMzM4LjM2ODgzIDIuOTU3OCwxNy42MjE2OSAtMTAuMzc3NjQsMi45Mzc4OCAtMS41MjI2OCwtMTguNDY3MjIiIHN0eWxlPSJmaWxsOiNjY2EyMTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6MS44OTk5OTk5ODtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDMxMC42NjMxNCwzNDAuNDYxMTggMS4zMDExNSwxOC41MDgxNSBjIDEyLjM4MDk1LC0zLjc3MjkxIDI1LjgzMzM0LC01LjQyMTg4IDM4Ljc1MDAxLC02LjYwNzE0IGwgLTQuODIxNDQsLTE4LjAzNTcyIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNlOGMwNDM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzkwLjgwMzU4LDgwMy41MjI5IDAuODkyODYsMTYuNDI4NTcgYyAxMC41ODg1OCwwLjY5ODM5IDI4LjEzMTQ2LC0yLjg0MTM2IDM3LjU4OTI5LC01LjgwMzU3IGwgLTUuMTc4NTcsLTE2LjI1IGMgLTcuNzA4NzEsMS41NzUxMyAtMC4wNzYxLDEuNDMyNTYgLTMzLjMwMzU4LDUuNjI1IHoiIC8+CgkJPHBhdGggZD0ibSA0MDcuNjA5NjUsODAxLjQyOTY0IDEuOTYxMjcsMTYuNzkzODYgMTMuODg5NiwtMi43Nzc5MiAtNC4wNzM0NSwtMTUuOTIwNTkgeiIgc3R5bGU9ImZpbGw6I2YyZDc3NjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojY2NhMjEzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDM5OC4yNzYwNCw4MDIuNjMzIDEuNjczMjMsMTcuMDI1NzggLTcuNDk5MTQsMC41MjQ5OSAtMS4yMTIxNSwtMTYuNjAxMzMiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6MS43OTk5OTk5NTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDM5MC44MDM1OCw4MDMuNTIyOSAwLjg5Mjg2LDE2LjQyODU3IGMgMTAuNTg4NTgsMC42OTgzOSAyOC4xMzE0NiwtMi44NDEzNiAzNy41ODkyOCwtNS44MDM1NyBsIC01LjE3ODU3LC0xNi4yNSBjIC03LjcwODcsMS41NzUxMyAtMC4wNzYxLDEuNDMyNTYgLTMzLjMwMzU3LDUuNjI1IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2U4YzA0MztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNTAsMzIxLjgyNjQ3IDUuMzU3MTUsMTAuODkyODUgYyAtMjEuMTExLDIuNTQ2ODkgLTM1LjU0OTc4LDUuMjU0MjEgLTUyLjEwMDkyLDkuMDgwOTggbCAtMC43Mjk1NywtMTguNzI4NiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZjJkNzc2O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDMzOS4zMDIxOSwzMjQuNTc0NTcgLTYuOTQ0OCwxLjY0MTQ5IDEuNzY3NzcsOS4yMTc2NSA4LjU4NjI5LC0xLjEzNjQxIHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2NjYTIxMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzMTQuNTcwMDcsMzI1LjYzOTg0IDEuNzAyMTYsMTMuNTEyNTQgLTE0LjM1MjgzLDMuMzQ4OTkgMS42NDg2NSwtMTkuMzE1NzYiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6MS44OTk5OTk5ODtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDM1MCwzMjEuODI2NDcgNS4zNTcxNSwxMC44OTI4NSBjIC0yMS4xMTEsMi41NDY4OSAtMzUuNTQ5NzgsNS4yNTQyMSAtNTIuMTAwOTIsOS4wODA5OCBsIC0wLjcyOTU3LC0xOC43Mjg2IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNlOGMwNDM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzAyLjUyNjY2LDMyMy4wNzE3IGMgMTQuNTUyOTYsNC43MDk2NiAzMC4zMzY4OCw1LjU3NDcyIDQ1LjQ5NjQyLC0wLjcyOTc1IDI3LjI5NDcsLTExLjM1MTE4IDQ0LjA0OTMzLC01Ni41ODUxNSAxMC41NDgzNSwtOTkuNjIyNjMgLTM4Ljc4NDk4LC00OS44MjU2NCAtMTA4LjAyMzI4LC0xNy4xMDYzIC0xMDQuNzcwNjEsMzYuMDQxNzYgMi44NjM4Myw0Ni43OTQyOSA0OC4zMTYzMiw2NC4xNzgwOSA0OC43MjU4NCw2NC4zMTA2MiB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNjY2EyMTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzY4Ljk3NTQyLDMwMi43MzAwMiBjIC0xNy4zMTQzMSwyNy41NzQ5MSAtNDcuNTM3MDEsMjguNzA2MTQgLTY3LjQyMzM2LDIwLjYwNzk3IC0zMC40MjY0NiwtMTIuMzkwMzMgLTQ3LjM3NDg5LC00MS40MzA2MyAtNDcuODIxNSwtNjguNDI4NDMgMTcuODQ2NDMsNTQuMTk4MjMgODkuMjE2MjMsODguMDA3OTIgMTE1LjI0NDg2LDQ3LjgyMDQ2IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6Mi4yOTk5OTk5NTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJtIDMwMi41MjY2NiwzMjMuMDcxNyBjIDE0LjU1Mjk2LDQuNzA5NjYgMzAuMzM2ODgsNS41NzQ3MiA0NS40OTY0MiwtMC43Mjk3NSAyNy4yOTQ3LC0xMS4zNTExOCA0NC4wNDkzMywtNTYuNTg1MTUgMTAuNTQ4MzUsLTk5LjYyMjYzIC0zOC43ODQ5OCwtNDkuODI1NjQgLTEwOC4wMjMyOCwtMTcuMTA2MyAtMTA0Ljc3MDYxLDM2LjA0MTc2IDIuODYzODMsNDYuNzk0MjkgNDguMzE2MzIsNjQuMTc4MDkgNDguNzI1ODQsNjQuMzEwNjIgeiIgLz4KCQk8cGF0aCBkPSJtIDM0Ni42OTY0MywyODMuNTMxMjUgYyAtMS4xNjA1LDYuOTQwNCA1LjcxMjUyLDguMjg5MzggOC4xOTE5NywzLjEyNTA1IC0zLjU2ODkxLDIuMzMyNCAtNy4zNDEzLDEuNzAxMTQgLTguMTkxOTcsLTMuMTI1MDUgeiIgc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojN2E1ZTAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDI4MC42MzIyMiwyMzUuNDY0MTMgYyAtMS40OTU3OSw4LjUxNjMxIDEwLjAxNzgzLDE4LjU3MTcgMjAuNTQ0MTIsMTEuNjkzNzkgLTEyLjQxMzYsMi4wMDkwMyAtMTkuMDgxMjcsLTcuNDY2MjIgLTIwLjU0NDEyLC0xMS42OTM3OSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM3YTVlMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMjc3LjAzMjc5LDI0My4wMjk5NCBjIC0xLjAzNDkyLDguMDExMDMgNi45MjM0NywxNC4yMzA5IDE5LjIxMjc1LDYuNzAwNTMgLTcuNjc3NTksMC44MDMzOSAtMTUuMjIzOSwyLjc5MDE2IC0xOS4yMTI3NSwtNi43MDA1MyB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM3YTVlMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMjc0Ljc3MTgxLDI1MS4wNjI2NCBjIC0wLjAzNjMsNC40NDE3OCA0LjU4NTM2LDExLjE1MDA3IDE1LjU1MzUzLDQuOTk5MyAtNS44NTI2MywwLjE0MzggLTExLjI2NDgxLDEuNTc0MDYgLTE1LjU1MzUzLC00Ljk5OTMgeiIgLz4KCQk8ZWxsaXBzZSBzdHlsZT0iZmlsbDojZjVlZGFmO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiB0cmFuc2Zvcm09Im1hdHJpeCgxLjI3Mzk3MjYsMCwwLjA4NDA3MDgsMS4zMTg1ODQsMS45ODkzODIxLC0xMzYuMzM4MDUpIiBjeD0iMjE5LjY0Mjg1IiBjeT0iMzA3LjcxOTMzIiByeD0iMTkuNTUzNTcyIiByeT0iMjAuMTc4NTcyIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNlN2JmMzg7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzEyLjUwMDAxLDI0My41MjI4OSBjIC0xNi41NDU2MSwyLjY4OTk0IC0yNC44OTQ0OCwxNC4xNzUxNCAtMjIuMzIxNDMsMjcuNTg5MjkgMi42ODc5OSwxNC4wMTMzNSAxMy44NDY3MiwyMi41MjQ2MyAyNS44OTI4NSwyMC4xNzg1OCAxMi40NjE3MywtMi40MjcgMTcuNjgzMTgsLTcuNTk0MzkgMTYuODc1LC0yNC44MjE0NCAtMC40NjE4OCwtOS44NDU0NCAtMTAuNzE3ODksLTI0LjUyODA3IC0yMC40NDY0MiwtMjIuOTQ2NDMgeiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojYjM5MTE3O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDMwNi45NjQyOSwyNTAuNzU1MDQgYyAtNi40NDI2MiwyLjkxMDEyIC0xMS4wOTkzMSw4Ljg5NTE1IC04LjAzNTcxLDIxLjUxNzg2IDMuNzA3NiwxNS4yNzYxNSAxNy40OTgzOSwxNy4xNzI1MiAyNi42OTY0MiwxMi4zMjE0MiAxMi4wMjIwOCwtNi4zNDA1MSA3LjYxOTYzLC0yMC40MTk4NyAzLjkyODU4LC0yNi42MDcxNCAtMy43MTY3MywtNi4yMzAzIC0xNS45Nzc3OCwtMTAuMjE4NTUgLTIyLjU4OTI5LC03LjIzMjE0IHoiIC8+CgkJPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I2Y1ZWRhZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgdHJhbnNmb3JtPSJtYXRyaXgoMS40NjMyMjI2LDAuNTgwMjI3NCwtMC41MTc5MjMzMSwxLjI4OTE2MTksMTQ5Ljc3NzIxLC0yNTIuMjIwOTkpIiBjeD0iMjEzLjY2MDcyIiBjeT0iMzAyLjcxOTMzIiByeD0iNS44OTI4NTcxIiByeT0iOS44MjE0MjgzIiAvPgoJCTxlbGxpcHNlIHN0eWxlPSJmaWxsOiNmNWVkYWY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDc0NzM1MSwtMC4xNjQzNjU1NiwtMC4wNjQxODEyNCwxLjEwOTA0MTksOTAuNjc2OTA3LC0zMy42NzUzMDQpIiBjeD0iMjMzLjM5Mjg1IiBjeT0iMzEyLjIyODI0IiByeD0iMy4wMzU3MTQ0IiByeT0iNC4wNjI1IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM3YTVlMDA7c3Ryb2tlLXdpZHRoOjEuODc1O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjEiIGQ9Im0gMjk5LjE0ODYzLDI0My4yNTcyOSBjIC0xMS4wMDYwNywyLjkyNDM5IC0xOS4xMTUsMTcuMjUyNTkgLTE1LjkwOTkxLDMxLjMxNDczIDIuODA5OSwxMi4zMjgyNiAxNi43OTAwOSwyNC4xNzUxOSAzMS4xODg0NiwyMC45NjA2NiAxNS41MDYzNSwtMy40NjE5IDIxLjE3Njg2LC0xOC41OTQ3NCAxOC41NjE1NiwtMzAuMDUyMDQgLTMuMDI5NSwtMTMuMjcxODMgLTE1LjUzNDgzLC0yNy4wODcxOCAtMzMuODQwMTEsLTIyLjIyMzM1IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2IzOTExNztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNDcuNTg5MjksMjM3LjU0MDc1IGMgLTcuODQwOTMsMi4wODc4NSAtMTIuMDA5NTUsMTEuNzE0NTMgLTcuNTg5MjgsMjIuOTQ2NDMgNC42NDI1NSwxMS43OTY3NCAxMy4wNzkzNCwxMy42MzYxNyAxOS4yODU3LDExLjg3NSA3LjExOTExLC0yLjAyMDE3IDguMTU1OTYsLTEyLjEyMjcxIDUuMjY3ODcsLTIxLjI1IC0yLjEwNzQ1LC02LjY2MDIxIC0xMC4yMTM4MiwtMTUuMzY4OTEgLTE2Ljk2NDI5LC0xMy41NzE0MyB6IiAvPgoJCTxlbGxpcHNlIHN0eWxlPSJmaWxsOiNmNWVkYWY7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOm5vbnplcm87c3Ryb2tlOm5vbmUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMTU1NjExNiwtMC4xMzY1NzU2OCwtMC4xNDM3MjU1MywxLjQ1MjkxMTMsODcuNjM1ODA2LC0xMzcuNDYxNzkpIiBjeD0iMjYwLjU4MDM1IiBjeT0iMjkwLjIxOTMzIiByeD0iNi4xMTYwNzEyIiByeT0iNi44NzUiIC8+CgkJPGVsbGlwc2Ugc3R5bGU9ImZpbGw6I2Y1ZWRhZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6bm9uZSIgdHJhbnNmb3JtPSJtYXRyaXgoMC44ODcyNDk4NSwtMC41MzAxNTk2MywwLjM0ODYxMTA5LDAuNjcyODMyNDQsNDIuMTExNzE0LDE3NS40Mzk5OSkiIGN4PSIyMzMuMzkyODUiIGN5PSIzMTIuMjI4MjQiIHJ4PSIzLjAzNTcxNDQiIHJ5PSI0LjA2MjUiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNjIuOTcyNywyMjMuMTQ5NTQgYyAtMC4xNzg5NCw0LjY5NjIzIC0yLjE4MTM0LDguMzYzMzMgLTQuNTUzMDMsOS45MTE2OSBsIDIuMDk4MTksMS41NjM3NyBjIDEuNzA4OTIsLTEuNjg3MjMgNC4zODc5NCwtMy45NTM1IDIuNDU0ODQsLTExLjQ3NTQ2IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNzAuMzc1NTksMjI4LjA4NjcyIGMgLTEuNjA0MzcsMy45MTAxNSAtMy42MjE5Nyw3LjY5NTMgLTYuNTc4MzgsOS40MzYyOCBsIDEuODE0NCwyLjMyMDc1IGMgMi41Mzc5OCwtMi42NDY5NiA1LjA0NTAxLC01Ljg1NzA0IDQuNzYzOTgsLTExLjc1NzAzIHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNzQuMjU3NjEsMjM3LjM3MjQ4IGMgLTEuODg4OTEsMy4xODExNCAtMy45NDE1Miw0LjQ1MTAyIC02LjY3NzI1LDYuMDMzNzcgbCAxLjE0Mjg2LDEuOTUwODkgYyAyLjYzNTI1LC0xLjQwNTU5IDQuODgzNTcsLTMuNzg1NCA1LjUzNDM5LC03Ljk4NDY2IHoiIC8+CgkJPHBhdGggZD0ibSAzNTEuNjk2NDMsMzExLjIwMTQ3IDAuNTM1NzIsLTEwLjE3ODU3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojN2E1ZTAwO3N0cm9rZS13aWR0aDoxLjM5OTk5OTk4O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjEiIC8+CgkJPHBhdGggZD0ibSAzNDMuNDgyMTUsMzEyLjk4NzE4IDMuOTI4NTcsLTEyLjQxMDcxIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZTojN2E1ZTAwO3N0cm9rZS13aWR0aDoxLjYwMDAwMDAyO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjEiIC8+CgkJPHBhdGggZD0ibSAzNDEuMDcxNDMsMjk4LjE2NTc1IC01LjA4OTI4LDguODM5MjkiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM3YTVlMDA7c3Ryb2tlLXdpZHRoOjEuNzAwMDAwMDU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KCQk8cGF0aCBkPSJtIDM1OC4xNzUyMiwyOTkuOTM0NzIgYyAtMi40MTMwNSwxOS4zNDA5OCAtMjYuNTI0ODgsMTkuNDI2NyAtMjUuOTQ5NDYsLTguMjY0NzYgMTEuNTc0OTUsMTAuOTQ4MSAyMC4wMDYzOSw5LjM1Mjk0IDI1Ljk0NDc3LDguMzI2NjQgNy4zNjMxNiwtMS4yNzI1NCAxMS41OTQ3OSwtMTIuMzY0NDcgOS44NjQzNCwtMTcuMzIzMzEgLTMuNTkyMTYsLTEwLjI5Mzg0IC0yMS4zNDIxOSwtMy4wMjYxNyAtMjcuMzQ1MTQsLTIxLjE4OTUzIC01Ljg1MjQyLC0xNy43MDc5MiAtMS41NzIzLC0yNi43ODE3MiA3LjI2NzMxLC0yOS40NDQ0IDUuNTkzMjEsLTEuNjg0NzkgMTYuNDA5NjEsMi4yMDMyIDIwLjk0Mzc1LDE0LjA4NzIzIDEwLjU4Nzk0LDI3Ljc1MTE1IC03LjEwMTcxLDMwLjY4Njg3IC03LjEwMTcxLDMwLjY4Njg3IiBzdHlsZT0iZmlsbDpub25lO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojN2E1ZTAwO3N0cm9rZS13aWR0aDoxLjg3NTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiAvPgoJCTxwYXRoIGQ9Im0gMjM1LjI2NTIzLDI0MS43MzQ1NSBjIC04LjcxOTM5LDM2LjAzODg4IC00LjI3Njg0LDUyLjMzODI2IDE1LjY4Mzg1LDgyLjg1ODI1IC0xNC43NTc0NiwzMy43MjczOCAzMC42MjI2NCw1OS4xODYgNDcuOTI2OTMsMjguODg3MjMgMjAuNTkzMzYsLTM2LjA1Nzc0IC0xNi40NDk2LC01Ny4yODIyNiAtMzUuMzEzNTYsLTYyLjMyMzc4IC01Ljc4Mjc2LC00MS4zNDE3OCAtMTkuNDg0MzQsLTQzLjEzNDA1IC0yOC4yOTcyMiwtNDkuNDIxNyB6IiBzdHlsZT0iZmlsbDojZThjMDQzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNjYmEyMGQ7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzAyLjY2ODA2LDM0Ny43MDQ0NSBjIC0xNC42NDg2MiwzOC45MTM2NiAtNzQuNTIzMjksMTAuOTIyNzIgLTUxLjQxODA2LC0yMy43MzUxMiAtMTIuODIwNzcsLTE0LjM5OTU5IC0xNi4xNjI5MywtMjIuNjMyMDEgLTIwLjE3ODU3LC00MS4yNSAxMy45NjE2NSwzNS41MjY3OSA1OC4xMDI4NCwxNS41ODkyMSA3MS41OTY2Myw2NC45ODUxMiB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNmMmQ3NzY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMjY1LjIxODc1LDI5MS42Njk2NCAtMC44NzUsMS42NzQxMSBjIDkuMTEzNzMsMi45OTgyOCAyOS45NzI1Myw4LjY0OTEzIDM4LjU2MjUsMzkuMTI1IGwgMS43MDUzNiwtMS4yODU3MSBjIC0yLjgxMDM0LC05Ljk3MDY1IC01LjgxNTY1LC0xOC4wOTU4NSAtMTAuMzU5NDksLTIzLjUzOTcyIC05LjgzMzI1LC0xMS43ODA5NSAtMjIuOTI1NTMsLTEzLjk2NDI5IC0yOS4wMzMzNywtMTUuOTczNjggeiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojN2E1ZTAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDI2My41NjI1LDI5MS4xNTYyNSAtNC4zODgyMiwxLjk2NDMxIGMgMCwwIDMyLjUyMDM1LC0wLjIxNDY5IDQxLjgyNTY3LDI4LjU2Njk0IDUuMTIxMTIsMTUuODM5NzcgLTEuNTA3NTksMzQuMzc2NzIgLTEyLjc1LDQwLjg0Mzc1IC0xNS42NjY3OCw5LjAxMjA4IC0zNy42MDM4LC0xLjI2NTMgLTM5LjY4NzUsLTIwLjM3NSAtMS4zNTg2OSwtMTIuNDYwNTQgMi4zNTIwMywtMTkuMDE3MzYgMTMuOTY4NzUsLTIxLjM0Mzc1IDcuODU2NjgsLTEuNTczMzkgMTQuNTE5NjQsMy40OTg3MSAxNS42NTc1MiwxMC4zMzg2NyAwLjc5Mzk2LDQuNzcyNjIgLTEuNjU0NTksMTAuNjY0NTUgLTYuNTM1MiwxMS4xNDMyMiAtNi4yODc4NCwwLjYxNjY5IC05LjA1MDIzLC0zLjM5NjYgLTYuNTkxMjMsLTkuMjg3MjUgLTUuODYxNjYsNS4zMTU1OSAtMC42MzQ5OCwxMi4yMzE1MyA2LjM0MzkxLDExLjM5OTExIDYuOTc2NTcsLTAuODMyMTQgOS44NTM0MSwtNy42MjE4OCA5LjAzMTI1LC0xMy4wOTM3NSAtMS40NTM1OSwtOS42NzQzMiAtMTAuMzc2ODMsLTE0LjYwOTU4IC0xOC40MDYyNSwtMTIuODQzNzUgLTEzLjkzMzA2LDMuMDY0MTUgLTE3LjI2ODQzLDExLjI4ODQ3IC0xNS44NDM3NSwyNCAyLjM5MjE5LDIxLjM0Mzk1IDI2LjIyNTUyLDMyLjE0Mzg1IDQzLjI4MTI1LDIyLjEyNSAxNC44NzA5LC04LjczNTQ0IDE4LjUwMTgzLC0yOC42NzkwNyAxMy44MTI1LC00My42ODc1IC01LjE2MTA3LC0xNi41MTgyNSAtMjEuMjk2NDcsLTI5LjA5MDQ5IC0zOS43MTg3LC0yOS43NSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM3YTVlMDA7c3Ryb2tlLXdpZHRoOjIuMDk5OTk5OTtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2Utb3BhY2l0eToxIiBkPSJNIDI1MS41Mjc5OSwzMjQuMDQyMiBDIDIzNS45NDM0NywzMDcuNzgxOSAyMjMuMjc0NTgsMjc5LjQyNzkyIDIzNS4yMTc2MSwyNDEuODkwNyIgLz4KCQk8cGF0aCBkPSJtIDM0Mi4wOTg5MywxNTQuMjI2MTggYyAtMTEuODAzOTYsLTAuMjg0NDIgLTI1LjM4NTk3LDAuODU2MTkgLTMxLjU1ODg3LDEuMzM1MjYgMTcuMzUwMTcsMTYuMjUxNzcgMjkuMDEzNTEsNDUuMTkzNiAzNy4wNjI0LDYxLjQwOTIxIDEyLjA0NjM1LC01LjgzNzUzIDIyLjUzMjAxLC0yOC4zOTIyMSAyOC41ODg0NSwtMzEuMzg2NzUgMTguMjMxNjYsLTE2LjY0NzE0IC0xNy45NTYzOCwtMzAuOTY4OTMgLTM0LjA5MTk4LC0zMS4zNTc3MiB6IiBzdHlsZT0iZmlsbDojZThjMDQzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNjYmEyMGQ7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMzEwLjMwOTY1LDIyNi4zMDQ1OSBjIC0yMS43MDUxMSwxMS44MzMxMiAtNDEuMTYyMjIsNi4yMTUxOCAtNDMuNTMzMjYsLTE1LjE4NTM4IGwgLTE3LjkyMjQ2LC0xNi4wMDIzMiBjIDE3Ljk3NTEzLC0yMC41NzA4OCAzNS40NzAwMywtMzIuMzM5MDQgNjEuNjg2MTMsLTM5LjU1NTQ1IDYuOTExMTksMC42MjQxMiAzNS43MDgxNSwxOS44Nzc3MSAzNy4wNjI0LDYxLjQwOTIxIGwgLTIxLjg0ODgsLTIyLjY5ODYgeiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZjJkNzc2O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDMxNi43MTI5NiwxNTUuMDgyMzcgYyAxOC44MDAxMiwwLjcwNzUyIDU3LjIzMDgsNS41MzU1NyA2Mi4yMjQ1NCwyNS42MzYzOCAxMi4wNjM1NiwtMTguMzk2NDYgLTUxLjg0ODI3LC0zNy4xMjg0NSAtNjIuMjI0NTQsLTI1LjYzNjM4IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6Mi44MTI1O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjEiIGQ9Im0gMzc0LjAxNzg1LDE4Ni45MTU3NiBjIDM1LjIwNiwtMjAuNjY1MTIgLTY1LjEyODU3LC02OC4yNTUwNCAtMTI1LjQ4OTc1LDcuOTg5NzUiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzdhNWUwMDtzdHJva2Utd2lkdGg6Mi44MTI1O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1vcGFjaXR5OjEiIGQ9Im0gMjY4Ljg5NDY1LDIxOC42NDY1OCBjIDQuNTA3MDMsMjQuODgxMDcgNTEuOTM1ODgsMTUuODQwNjggNDcuNzY0NSwtOC41Mzg1NSIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZThjMDQzO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lIiBkPSJNIDI2My44NzQ5NSwyNjQuOTY4MjggQyAyMjMuODg3NzEsMjQxLjg0NjMyIDIyMC41NzMsMjE3LjE4MTUzIDIzMS45NjQyOSwxODkuMTQ3OSBjIDIxLjQzNzgzLDMuNDYxMjggMzcuMDUyNiwxOS4zMzM4MSAzOS44MzAzNiw0MS4yMDQ3OCIgLz4KCQk8cGF0aCBkPSJtIDIyNy44MDY2LDIwMS4yMDk2OCBjIDEuMTg4MzcsMjQuMDc4NjcgMTEuNzY0NzUsNDAuOTYzMjEgMzYuMDY4MzUsNjMuNzU4NiAtMjYuNDk2NzgsLTE1Ljg2NyAtNDEuODkxMTgsLTM4LjEyMDk1IC0zNi4wNjgzNSwtNjMuNzU4NiB6IiBzdHlsZT0iZmlsbDojY2NhMjEzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM3YTVlMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMjM4LjQyNDExLDIwNS4wMjIzMiBjIC00LjE1MzcxLDE1LjEwNjg2IDMuNTQ5NjksMjkuMTU3NDEgMTUuOTY0MjksMzIuMjYzMzkgLTExLjU2NTM5LC02LjY1MDA2IC0xNi43ODU4OCwtMTguMjkyMzEgLTE1Ljk2NDI5LC0zMi4yNjMzOSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM3YTVlMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIGQ9Im0gMjMxLjI2Nzg2LDE4Ny42NTYyNSBjIC0xNC41OTkzNywzOS4wMjg4IC0yLjg1MDc5LDU3LjEzODcgMzIuNjA3MDksNzcuMzEyMDMgLTEuOTcxNTksLTEuNDkxMTUgLTIuOTM3ODMsLTMuNDA3MjYgLTQuODAzMDYsLTQuNzE2MzIgLTMzLjMwODk1LC0yMy4zNzY4IC0zNS4xOTg4LC0zOS42NjIyOSAtMjYuMzY2NTMsLTY5LjYyNjk2IDIwLjA1ODU0LDQuMDEyMTMgMzUuNDI5NDMsMTguMjI1MzkgMzkuMDg5MjksMzkuNzI3NjggMC43MjI2MiwtMjYuMDI0ODEgLTIwLjk5NzYzLC0zOS43ODQxIC00MC41MjY3OSwtNDIuNjk2NDMgeiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZThjMDQzO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjkzNzVweDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIgZD0ibSAyNTAuMjQ5NTEsMjY5LjE3ODI4IGMgMCwwIC03LjgxMjksLTE2LjMzNjA2IDkuMTE1MDUsLTE2LjIxNzY4IDE2LjkyNzk1LDAuMTE4MzcgMjIuNDc2NDMsMzQuODA5MzcgLTIuMTQzNSwzOC45NzYxOSIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZjJkNzc2O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDI1My43MzA1NiwyNTQuOTA5NTYgYyA5LjIxMjY0LC0xLjA1Nzg3IDE4Ljk0Njk4LDYuNjg4MTYgMTkuNjQ0NDUsMjEuNDM0MTkgNy42MjU1LC00LjIwODkzIC04Ljk1Mzk5LC0yOC4zNzI3OCAtMTkuNjQ0NDUsLTIxLjQzNDE5IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAyNDYuMjE4NzUsMjYyLjgxMjUgYyAtMC4wMzczLDYuMzI3MDkgNC4xMTI1OSw5LjY2MjM2IDcuODc1LDEwLjI4MTI1IDUuNzMxNzQsMC45NDI4NCA4LjAxNTkzLC01LjMwOTM2IDIuNjEyOTQsLTYuOTc4OSAyLjg4MjgsMi42ODM3NSAwLjQwNzI1LDUuMDUxNzYgLTIuMzAwNDQsNC42OTc2NSAtMi42OTc5OSwtMC4zNTI4NCAtNS44NjE0OCwtMi42MzgwNyAtNS45MDYyNSwtOC4wMzEyNSAtMC4wMzgzLC00LjYxODE2IDMuOTUyMTcsLTkuMTA4NzIgMTEsLTguMzEyNSA5LjIwNjc4LDEuMDQwMTMgMTQuOTUxNCwxMS45NTUwNiAxMy44NzUsMjAuNDM3NSAtMS41MTAyNiwxMS45MDE0MyAtMTYuMjg5MTEsMjAuOTU3NDMgLTI1LjMyMzI5LDEyLjY3NTQ0IDkuMzgzNCwxMy4zNTI1OSAyNi4yNTkzMywwLjM2NTMzIDI3LjYwNDU0LC0xMi4zOTQxOSAxLjA5OTUxLC0xMC40MjkgLTQuODM3NTMsLTIxLjk5NjUzIC0xNS45Mzc1LC0yMyAtOC44ODA0NSwtMC44MDI4MiAtMTMuNDY3MDksNS4wMzUwMiAtMTMuNSwxMC42MjUgeiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZThjMDQzO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lIiBkPSJtIDM0Ny42MDI0NiwyMTYuOTcwNjUgYyAyNS44MjQwNCwyMi45NTQ3IDUzLjY5NzA1LDMuMjAxMTQgNTAuODc3MDYsLTE0LjUxMzQ3IC0zLjAxNzA3LC0xOC45NTI2NCAtMzcuMDIxMTgsLTIwLjc0ODA3IC0zMy42OTE1OCwtNC41NTkyOSIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojZjJkNzc2O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO3N0cm9rZTpub25lIiBkPSJtIDM3NS44NzUsMTg3Ljk2ODc1IGMgMTEuODgzMzEsMi4zMjcwMiAyMC4wNzg1NiwxMC4yMjg3IDE5LjkwNjI1LDIyLjc1IDcuMzYwMjgsLTE3Ljk3MTk5IC0xNC43ODk0OCwtMjYuMDA2NjMgLTE5LjkwNjI1LC0yMi43NSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiM3YTVlMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjMuMDk5OTk5OTsiIGQ9Im0gMzYzLjg3NSwxOTMuNjU2MjUgYyAtMi41OTE4OSw3LjYxODU3IC0wLjc1MzA0LDE1LjkzNzQxIDUuNDA2MjUsMTkuNjg3NSA5LjYzMzA0LDUuODY1MDggMTkuNjY0NjMsLTMuNzkzNyAxNS40Nzc2OCwtMTEuMjIzMjEgLTMuNTA0MDUsLTYuMjE3NzUgLTEzLjQzMzExLC0yLjg2NTg4IC05LjcyNzY4LDIuOTgyMTQgMC41ODc5NCwtNS42NzYzIDUuNTE3NDMsLTQuNzMzOTIgNy4wMzY0MiwtMS41MzMzNiAyLjkxMTAxLDYuMTMzNTcgLTYuMDMzNTEsMTAuNTM0NTQgLTEwLjgxNzY3LDcuMzk5NDMgLTUuNDQ2MiwtMy41Njg5NSAtNi43NzUwNSwtMTAuMTY1MiAtNC40MDYyNSwtMTYuMzQzNzUgNS40NjUyMiwtMTQuMjU0OTQgMzMuMDUyMjMsLTIuMzg0MDYgMjkuNjI1LDEzLjIxODc1IC0zLjUzNDUsMTYuMDkxMTkgLTIyLjkzODkyLDIxLjY5NDQ1IC0zOS41NjI1LDEzLjI4MTI1IC0xNC43ODQ3OCwtNy40ODI1OSAtMTkuOTU0MjYsLTE2LjE1NjE2IC0yNS4zNTM3OSwtMjcuNzQxMDcgLTAuODA0NDEsMTMuNzc4NCAxNC42Nzc0MywyNS45NjIyOCAyMy45Nzg3OSwzMC40OTEwNyAyMS40NTE1NSwxMC40NDQ2NyA0MC4wOTQwNCwxLjQyMDkxIDQzLjk2ODc1LC0xNS4zNzUgNC43ODQ5OSwtMjAuNzQxNzUgLTI5Ljc4ODYzLC0zMS45OTkxMSAtMzUuNjI1LC0xNC44NDM3NSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNlOGMwNDM7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmUiIGQ9Im0gMzE3LjgyOTI0LDE5My43OTYzMiAxNy4zMTg3LDE2Ljc2OTMyIGMgMCwwIDIwLjY4MzUzLC0zNi44NTg2IDEzLjMxNzQ2LC00MS4yOTQ5OCAtNy4zNjYwNywtNC40MzYzOSAtMzAuNjM2MTYsMjQuNTI1NjYgLTMwLjYzNjE2LDI0LjUyNTY2IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2NjYTIxMztmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNDYuNTE3ODYsMTY4LjM0NDMyIGMgNS4wMjUwMywxMC44MTAxOSAtMTEuNDc4NCwyNi41NDE3NCAtMTEuMzY5OTIsNDIuMjIxMzIgNS45Njg3OCwtMTEuMDE4MDIgMjAuMDk3NzcsLTM5Ljk2ODE4IDExLjM2OTkyLC00Mi4yMjEzMiB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOiNlZWNmNjU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjQuOTAwMDAwMTsiIGQ9Im0gMzQzLjQ4NzgsMTY4LjgwOTkgYyAtOC45NDQwMyw3LjA0NzU1IC0xNi4yMjUwNywxMS4zODA4NyAtMjMuNzU1MDUsMjMuNTYxMjUgbCA0LjMyNTk2LDUuODE2MyBjIDQuODU5NDMsLTkuOTM3NTYgMTQuMjIxNTQsLTIxLjEzOTg4IDE5LjQyOTA5LC0yOS4zNzc1NSB6IiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM3YTVlMDA7c3Ryb2tlLXdpZHRoOjEuNzAwMDAwMDU7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLW9wYWNpdHk6MSIgZD0ibSAzMjguNjk2MTYsMTgxLjIzNjkxIGMgLTAuMTc1NjIsOC4zMTc5NCAyLjQyMzQ3LDE3LjM1ODIxIDEwLjg1NzQxLDE5LjUxODEzIiAvPgoJCTxwYXRoIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiM3YTVlMDA7c3Ryb2tlLXdpZHRoOjEuNjAwMDAwMDI7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLW9wYWNpdHk6MSIgZD0ibSAzMzguNjMyNzEsMTcwLjU3NTU2IGMgMS40OTQyOCw3LjU2ODU0IDEuNzgyODksMTEuNzMxOTcgOC4xMTQ5MywxNi43MTciIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6IzdhNWUwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgZD0ibSAzNDEuMTU1MjYsMTY4LjY0MjY3IGMgLTEwLjU3MDEsNS4xNjE5NyAtMjguMDUzMjIsMjguNjA5MDMgLTMwLjE0OTYxLDM1LjYwMjQyIDcuMzczLC04LjE3NjczIDIxLjY4LC0yOS42MzU1OSAzMS41MjU2MSwtMzQuMjEzODQgNi43MTQxMSwtMy4xMjIwOSA2LjY0NTE2LDMuNDk4NSA1LjQxOTUsOC41NTI1NyAtMi44NTEwNSwxMS43NTY0NCAtMTEuNDg1OSwyNC41NzU1IC0xMi45Njg2NywzMi40NTUwNCA2LjA2NzI5LC05LjkwNjgzIDEyLjMxMDEyLC0yMS40MTExNiAxNS4wNDkxNiwtMzIuMTk1MTEgMi4yNjA2NCwtOC45MDA0MyAtMC44NTUyOSwtMTQuMTE4MDMgLTguODc1OTksLTEwLjIwMTA4IHoiIC8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I2NiYTIwZDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZSIgZD0ibSAzMDUuMjgxMjYsMTg2LjQ1NTM2IGMgMTMuNTA0NTMsMC44MDI5MyAyMi42NjI4MiwxMC4xODY1OCAyMS41MDQ0NiwyNC41MDA1NyAtMS4xNzE4NywxNC40ODEwMiAtMTkuNjk0OTUsMTkuMzY2MzEgLTI5LjU0OCw5LjEyMzg3IC01LjgyNjM1LC02LjA1NjYxIC00LjE2MjMyLC0xOS41NDg5NiAzLjUxNTYyLC0yMS4zNDQ4NiIgLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojN2E1ZTAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiBkPSJtIDMwNS4yODEyNSwxODYuNDU1MzYgYyAxOC45Njg5NiwzLjkyNDA4IDIzLjA1MjUyLDE4LjEwNjQyIDE4Ljg0Mzc1LDI5Ljg4ODM5IC0zLjc4OTM3LDEwLjYwNzkxIC0yNS43NjA5NywxMS4xNDk2NSAtMjguNzgxMjUsLTIuODEyNSAtMy42NDgsLTE2Ljg2Mzk2IDE0LjQwMzQ4LC0xNi44NzA3NyAxNy41MzEyNSwtOS4zMTI1IDEuNjMwNTYsMy45NDAyNSAtMS4wNjgxOCw5Ljk2ODgyIC01LjUsOC4yNSAtMi44NDM3MSwtMS4xMDI4OSAtMy40MzgyLC01LjE4NzkxIC0xLjU3NTgyLC03LjI0MTA3IC00LjgwNTg5LDIuMTk1MzEgLTIuMzYzMjEsOC43MDc1NCAxLjU5ODIxLDkuNjE2MDcgNi4zNzM2MiwxLjQ2MTc1IDEwLjA1NzQxLC02LjUzNTgyIDcuNzE3NzUsLTExLjg3OTc2IC00LjcwMTk2LC0xMC43Mzk1OCAtMjYuNDk0NTQsLTguMTc1MTYgLTIyLjQyOTAyLDExLjA5ODUxIDMuMzY5NzIsMTUuOTc1MDIgMjguMjQwNTksMTcuMTgyMzYgMzMuODUzMjcsMy4zNjUwNyA2LjY1NjAxLC0xNi4zODU3NSAtNS4yMTk3MiwtMzIuNjE1NTMgLTIxLjI1ODE0LC0zMC45NzIyMSB6IiAvPgoJPC9nPgo8L3N2Zz4K');
    
    const curs = [
        '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'
    ];
    
    document.body.insertAdjacentHTML('beforeend', `<div id="belle" style="top:0;left:0">
        ${['options','speech'].map(a => `<div class="${a}_container"><div class="${a}" ></div></div>`).join('')}
    </div>`);
    const belle = document.querySelector('#belle');
    const speechContainer = belle.querySelector('.speech_container');
    const optionsContainer = belle.querySelector('.options_container');
    
    const canvas = newEl('<canvas id="belle_mask" width="131" height="384">');
    const img = newEl('<img width="131" height="384">');
    img.addEventListener('load', function() {
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
        canvas.getContext('2d').drawImage(this, 0, 0); 
    });
    
    initBelle();
        
    belle.addEventListener('mousedown', function(event) {
        dragging = true;
        toggleIframes(true);
        x = event.clientX - parseInt(this.style.left);
        y = event.clientY - parseInt(this.style.top);
        if (canvas.getContext("2d").getImageData(x, y, 1, 1).data[3] > 0) {
            document.body.addEventListener('mousemove', mouseMove);
            event.preventDefault();
        }
    });

    document.body.addEventListener('mousemove', event => {
        const x = event.clientX - parseInt(belle.style.left);
        const y = event.clientY - parseInt(belle.style.top);
        belle.style.pointerEvents = canvas.getContext("2d").getImageData(x, y, 1, 1).data[3] == 0 ? 'none' : '';
    });
    document.body.addEventListener('mouseup', stopMoving);
    document.body.addEventListener('blur', stopMoving);
    
    function stopMoving() {
        dragging = false;
        document.body.removeEventListener('mousemove', mouseMove);
        toggleIframes(false);
        lastX = -1;
    }
    
    function mouseMove(event) {
        setPrefPos(event.clientX - x, event.clientY - y);
        if (grabbedImage) {
            grabbedImage.style.top = `${event.pageY - grabbedImage.offsetHeight/2}px`;
            grabbedImage.style.left = `${event.pageX - grabbedImage.offsetWidth/2}px`;
        }
        if (lastX >= 0 && lastY >= 0) {
            const difX = Math.pow(event.pageX - lastX, 2);
            const difY = Math.pow(event.pageY - lastY);
            if (Math.sqrt(difX + difY) / (Date.now() - timestamp) > 30) shake();
        }

        lastClientX = event.clientX;
        lastClientY = event.clientY;
        lastX = event.pageX;
        lastY = event.pageY;
        timestamp = Date.now();
    }
    
    function toggleIframes(v) {
        all('iframe', me => me.style.pointerEvents = v ? 'none' : '');
    }
    
    let extra_key = 0;
    const pass = [71,85,77,66,65,76,76];
    let passLevel = 0;
    let no = false;
    let gameBg = null;
    document.body.addEventListener('keydown', event => {
        if (dragging) {
            event.preventDefault();
            if (event.keyCode == 32) {
                rotateObject(belle, 90);
                try {
                    belleAction(event);
                } catch(e) {
                    console.error(e);
                }
            } else {
                extra_key = event.keyCode;
            }
        }
        passLevel += event.keyCode == pass[passLevel] ? 1 : -passLevel;
    });
    
    function belleAction(event) {
        if (passLevel == pass.length) {
            help();
        } else if (extra_key == 67) {
            if (!gameBg) startGame();
            spawnCookie(true, lastX, lastY);
        } else if (extra_key == 72) {
            toggleHearts();
        } else if (!no) {
            no = true;
            if (!grabbedImage) {
                const img = getTargettedElement();
                if (img && img.tagName === "IMG") {
                    if (event.shiftKey) {
                        img.classList.toggle('wobbly_image');
                    } else {
                        doGrab(img);
                        if (!grabbedImage) doImg();
                    }
                }
            } else {
                grabbedImage.style.top = document.body.scrollTop + grabbedImage.offsetTop;
                grabbedImage.style.top = document.body.scrollLeft + grabbedImage.offsetLeft;
                grabbedImage.classList.remove('grabbed-image');
                grabbedImage = null;
            }
        }
    }
    
    document.body.addEventListener('keyup', event => {
        if (event.keyCode == 32) {
            rotateObject(belle, 0);
            no = false;
            if (dragging) event.preventDefault();
        } else if (event.keyCode == extra_key) {
            extra_key = 0;
        }
    });
    window.addEventListener('resize', event => setPos(prefX, prefY));
    window.addEventListener('mouseenter', initBelle);
            
    function setupImg(i) {
        selected_image_index = i;
        i = getImage(i);
        img.src = i;
        belle.style.backgroundImage = `url('${i}')`;
    }
    
    const randomX = () => document.scrollingElement.scrollLeft + (Math.random() * document.body.clientWidth);
    const randomY = () => document.scrollingElement.scrollTop + (Math.random() * document.body.clientHeight);
    const rRGB = () => Math.floor(Math.random() * 255);
    function toggleHearts() {
        if (hearter) {
            clearInterval(hearter);
            hearter = null;
        } else {
            hearter = setInterval(() => plusOne(Math.random() * document.body.clientWidth, Math.random() * document.body.clientHeight, '', a => {
                a.style.fontFamily = 'FontAwesome';
                a.style.fontSize = `${10 + Math.random() * 50}px`;
                a.style.color = `rgb(${rRGB()},${rRGB()},${rRGB()})`;
                a.style.position = 'fixed';
            }), 100);
        }
    }
    
    function getTargettedElement() {
        const oldX = belle.style.left;
        belle.style.left = "-1000px";
        const img = document.elementFromPoint(lastClientX , lastClientY);
        belle.style.left = oldX;
        return img;
    }
    
    function doImg() {
        if (Math.floor(Math.random() * 100) > 85) {
            const oldIndex = selected_image_index;
            let index = oldIndex;
            while (index == oldIndex) index = Math.floor(Math.random() * imgs.length);
            setupImg(index);
            updateSelection(index);
            settingsMan.set('sweetie_img_index', index, 0);
        }
    }

    function doGrab(img) {
        if (img.classList.contains('nopickup')) return;
        if (img.dataset.dragged) {
            img.classList.add('grabbed-image');
            img.parentNode.appendChild(img);
            img.style.top = (lastY - img.offsetHeight/2);
            img.style.left = (lastX - img.offsetWidth/2);
            grabbedImage = img;
            return;
        }
        
        const result = img.cloneNode();
        result.setAttribute('class', 'grabbed-image');
        result.removeAttribute('id');
        result.removeAttribute('data-lightbox');
        result.dataset.dragged = true;
        document.body.appendChild(result);
        result.style.width = img.offesetWidth;
        result.style.height = img.offsetHeight;
        result.style.top = (lastClientY - img.offsetHeight/2);
        result.style.left = (lastClientX - img.offsetWidth/2) 
        result.addEventListener("click", e => {
            if (e.shiftKey) {
                if (grabbedImage == result) grabbedImage = null;
                return result.parentNode.removeChild(result);
            }
            if (grabbedImage == result) {
                grabbedImage.classList.remove('grabbed-image');
                grabbedImage = null;
            } else {
                result.classList.add('grabbed-image');
                result.parentNode.appendChild(result);
                grabbedImage = result;
            }
        });
        grabbedImage = result;
    }
    
    function plusOne(x, y, text, func) {
        if (typeof(text) == 'number') {
            if (text == 0) return;
            text = (text > 0 ? '+' : '') + text;
        }
        
        document.body.insertAdjacentHTML('beforeend', `<span class="floater" style="position:absolute;transition:opacity 3s linear;opacity:1">${text}</span>`);
        const one = document.body.lastChild;
        one.style.top = `${y - one.offsetHeight/2}px`;
        one.style.left = `${x - one.offsetWidth/2}px`;
        setTimeout(() => {
            one.style.opacity = 0;
            setTimeout(() => one.parentNode.removeChild(one), 3000);
        }, 10);
        
        const floaters = document.querySelectorAll('.floater');
        for (let i = 31; i < floaters.length; i++) {
            floaters[i].parentNode.removeChild(floaters[i]);
        }
        
        if (func) func(one);
    }
    
    function getPointsName() {
        if (pointType[0] && pointType[1]) return 'Cookies/Ducks';
        if (pointType[0]) return 'Cookies';
        return 'Ducks';
    }
    
    function spawnCursor(smart) {
        var base = baseCursorCost;
        if (smart) bas *= 10;
        cursorUpgradeCost += base;
        document.body.insertAdjacentHTML('beforeend', `<div class="gameObj cursor_container">
            <div data-level="1" class="cursor click${smart ? ' smart' : ''}">
                <img class="nopickup" src="data:image/png;base64,' + curs[0] + '"></img>
            </div>
            <div class="label">
                <div>level <span class="level">1</span></div>
                <div>
                    <a>Sell for <span class="value">' + base + '</span></a>
                </div>
            </div>
        </div>`);
        const cursor = document.body.lastChild;
        const cursorCursor = cursor.querySelector('.cursor');
        cursor.addEventListener('remove', () => cursor.dataset.deleted = '1');
        cursor.querySelector('a').addEventListener('click', e => {
            const value = parseInt(cursorCursor.dataset.value) * base;
            bank += value;
            const pos = offset(cursor);
            plusOne(pos.left, pos.top, value);
            cursor.dispatchEvent(new Event('remove'));
            cursor.parentNode.removeChild(cursor);
            e.preventDefault();
        });
        const placing = event => {
            cursor.style.top = event.pageY + 'px';
            cursor.style.left = event.pageX + 'px';
        };
        const mouseup = event => {
            document.removeEventListener('mousemove', placing);
            document.removeEventListener('mouseup', mouseup);
            cursorCursor.classList.remove('click');
            checkClick();
            event.preventDefault();
        };
        
        document.addEventListener('mousemove', placing);
        document.addEventListener('mouseup', mouseup);
    }

    function checkClick(cursor) {
        const ref = offset(cursor);
        const distance = 100 + (50 * parseInt(cursor.dataset.level));
        let clicks = 5;
        [].some.call(document.querySelectorAll('.cookie'), (a) => {
            if (clicks <= 0) return true;
            if (!cursor.classList.contains('smart') || !a.classList.contains('wrath')) {
                const coo = offset(a);
                
                const cookieX = coo.left + a.offsetWidth/2;
                const cookieY = coo.top + a.offsetHeight/2;
                
                const dist = Math.sqrt(Math.pow(ref.left - cookieX, 2) + Math.pow(ref.top - cookieY, 2));
                if (dist <= distance) {
                    a.dispatchEvent(new Event('mousedown', {pageX: cookieX, pageY: cookieY}));
                    clicks--;
                }
            }
        });
        
        cursor.classList.add('click');
        setTimeout(() => cursor.classList.remove('click'), 500);
        
        if (cursor.dataset.deleted != '1') {
            setTimeout(() => checkClick(cursor), 5000);
        }
    }
    
    function buildShop(holder) {
        const totalCursors = document.querySelectorAll('.cursor').length;
        const handler = (e) => {
            const click = actions[e.target.dataset.click];
            if (click) click();
        };
        let purchase = (cost, multiplier, smart) => {
            if (bank >= cost) {
                bank-= cost;
                cursorCost += multiplier;
                say(getPointsName() + ': ' + bank + '</br>' + getPointsName() + ' Clicked: ' + score);
                spawnCursor(smart);
                holder.innerHTML = '';
                holder.parentNode.opacity = 0;
                holder.removeEventListener('click', handler);
            }
        };
        const actions = {
            buyCursor: _ => purchase(cursorCost, 4, false),
            buySmartCursor: _ => purchase(cursorCost * 10, 4, true),
            upgradeCursor: _ => {
                bank -= cursorUpgradeCost * totalCursors;
                all('.cursor', a => {
                    const level = parseInt(a.dataset.level) + 1;
                    if (level < 6) {
                        a.dataset.level = level;
                        a.parentNode.querySelector('.level').innerHTML = level;
                        a.parentNode.querySelector('.value').innerHTML = level * baseCursorCost;
                        if (level == 5) {
                            cursorUpgradeCost -= baseCursorUpgradeCost * (level - 1);
                        } else {
                            cursorUpgradeCost += baseCursorUpgradeCost;
                            a.style.transform = `scale(${level},${level})`;
                        }
                    }
                });
                say(`${getPointsName()}: ${bank}</br>${getPointsName()} Clicked: ${score}`);
            }
        };
        
        if (bank >= cursorCost) {
            holder.insertAdjacentHTML('beforeend', `<button data-click="buyCursor" class="styled_button">Buy 1 Cursor (${cursorCost})</button>`);
        }
        if (bank >= cursorCost * 2) {
            holder.insertAdjacentHTML('beforeend', `<button data-click="buySmartCursor" class="styled_button">Buy 1 Smart Cursor (${cursorCost * 10})</button>`);
        }
        if (totalCursors && cursorUpgradeCost && bank >= cursorUpgradeCost) {
            holder.insertAdjacentHTML('beforeend', `<button data-click="upgradeCursor" class="styled_button">Upgrade Cursors (${cursorUpgradeCost})</button>`);
        }
        
        addDelegatedEvent(holder, 'button[data-click]', 'click', handler);
    }
    
    function spawnCookie(scepter, x, y) {
        if (scepter && document.querySelector('.cookie')) {
            if (bank < 1) return;
            say(`${getPointsName()}: ${--bank}</br>${getPointsName()} Clicked: ${score}`);
        }
        
        options(buildShop);
        
        let diff = Math.log(score ? score : 1) * 300;
        let fadeTime = Math.max(2000 - diff, 100);
        let sitTime = Math.max(8000 - (diff * (score/100 < 1 ? 1 : score/100)), 50);
        let wrath = false;
        
        if (document.querySelectorAll('.cookie').length > document.querySelectorAll('.wrath').length) {
            for (var i = 0; i < (score/100 - 1) && !wrath && i < 10; i++) {
                wrath |= (Math.random() * 15 < 2);
            }
        }
        document.body.insertAdjacentHTML('beforeend', `<img src="data:image/png;base64,${cookie[wrath ? 1 : 0]}"
            class="gameObj cookie nopickup${wrath ? 'wrath' : ''}"
            style="position:absolute;transition:opacity ${fadeTime/1000}s linear, visibility ${fadeTime/1000}s linear;opacity:0;visibility:hidden"></img>`);
        let cook = document.body.lastChild, timer = null;
        
        x -= cook.offsetWidth / 2;
        y -= cook.offsetHeight /2;
        
        cook.style.top = `${y}px`;
        cook.style.left = `${x}px`;
        
        cook.addEventListener('mousedown', (e, a) => {
            try {
            e.preventDefault();
            if (!e.pageY) {
                e.pageY = a.pageY;
                e.pageX = a.pageX;
            }
            cook.parentNode.removeChild(cook);
            
            if (timer) clearTimeout(timer);
            timer = cook = null;
            
            score++;
            if (wrath) {
                let newBank = Math.floor(bank * 0.8);
                plusOne(e.pageX,e.pageY, newBank - bank, a => a.style.color = 'red');
                bank = newBank;
            } else {
                plusOne(e.pageX,e.pageY, 1);
                bank++;
                if (Math.random() < 0.5) {
                    playSong('eaK5_eJRzmA', () => belle.classList.remove('musical'), () => belle.classList.add('musical'));
                }
            }
            
            say(`Cookies: ${bank}</br>Cookies Clicked: ${score}`);
            let max = belle.classList.contains('musical') ? 3 : 1;
            for (let i = 0; i < max; i++) {
                if (Math.random() * 16 < max) spawnCookie(false, randomX(), randomY());
            }
            spawnCookie(false, randomX(), randomY());}catch(e){alert(e)}
        });
        
        requestAnimationFrame(() => {
            cook.style.opacity = 1;
            cook.style.visibility = '';
            timer = setTimeout(() => {
                if (!cook) return;
                cook.style.opacity = 0;
                timer = setTimeout(() => {
                    if (!cook) return;
                    cook.parentNode.removeChild(cook);
                    if (!document.querySelector('.cookie')) {
                        if (cook.classList.contains('wrath')) {
                            spawnCookie(false, randomX(), randomY());
                        } else {
                            endGame();
                        }
                    }
                }, fadeTime);
            }, fadeTime + sitTime);
        });
        
    }
    
    
    setInterval(() => all('.floater', me => {
        const t = parseInt(me.style.top) - 5;
        if (t <= 0) {
            me.parentNode.removeChild(me);
        } else {
            me.style.top = `${t}px`;
        }
    }), 50);
    
    function startGame() {
        document.body.insertAdjacentHTML('beforeend', '<div id="game-background" class="dimmer" style="background:none;display:block"></div>');
        gameBg = document.body.lastChild;
    }
    
    function endGame() {
        document.dispatchEvent(new CustomEvent('playerEnded'));
        all('.gameObj', gameBg, a => a.dispatchEvent(new Event('remove')));
        gameBg.parentNode.removeChild(gameBg);
        gameBg = null;
        bank = score = 0;
        cursorUpgradeCost = baseCursorUpgradeCost;
        cursorCost = baseCursorCost;
        say('Game Over :c', 2000, true);
    }
    
    function help() {
        const pop = makePopup(jule('wSeeit ecSpeet reSrcte snIedx'), 'fa fa-child', false);
        pop.SetWidth(700);
        pop.SetContent(`<table class="properties">
            <tr>
                <td class="label">${jule(helpContent).replace(/-/g, '</td></tr><tr><td class="label">').replace(/;/g, '</td><td>')}</td>
            </tr>
        </table>`);
        pop.SetFooter(`<button class="styled_button" type="button" id="belle_type" >Switch Scepter ( <span>${selected_image_index + 1}</span>/${imgs.length} )</button><span></span>`);
        pop.Show();
        pop.content.querySelector('#belle_type').addEventListener('click', () => {
            let index = (selected_image_index + 1) % imgs.length;
            setupImg(index);
            settingsMan.set('sweetie_img_index', index, 0);
            updateSelection(index);
            
        });
    }
    
    function playSong(ytid, ended, loaded) {
        if (!document.querySelector('#song_frame')) {
            document.body.insertAdjacentHTML('beforeend', '<iframe style="display:none;" id="song_frame"></iframe>');
        }
        const player = document.querySelector('#song_frame');
        player.src = `//www.youtube.com/embed/${ytid}?autoplay=1&enablejsapi=1`;
        const ready = () => {
            loaded();
            player.removeEventListener('load', ready);
        };
        player.addEventListener('load', ready);
        return player;
    }

    function updateSelection(index) {
        const me = document.querySelector('#belle_type');
        if (!me) return;
        me.querySelector('span').innerText = index + 1;
        me.nextSibling.innerHTML = `<span style="transition:opacity 0.5s linear">${imgLabels[index]}</span>`;
        let t = setTimeout(() => {
            me.nextSibling.firstChild.style.opacity = 0;
            t = null;
        }, 250);
        const cancel = () => {
            if (t) clearTimeout(t);
            me.removeEventListener('mousedown', cancel);
        };
        me.addEventListener('mousedown', cancel);
    }

    function shake() {
        if ((Math.floor(Math.random() * 31)) == 5) {
            shaken = (shaken + 1) % 3;
            if (shakeCount >= 0) shakeCount++;
            var count = 3 + Math.floor(Math.random() * 5) + 3 * shaken;
            all('.body_container, .footer', a => a.style.animation = 'shake_shake 0.17s linear ' + count);
            setTimeout(() => all('.body_container, .footer', a => a.style.animation = ''), count * 170);
        }
        if (shakeCount >= 20) {
            shakeCount = -1;
            say('Woah!</br>I\'m starting to feel a little dizzy here...', 5000);
        }
    }

    function say(text, duration, fadeOptions) {
        const speech = document.querySelector('#belle .speech');
        const speechContainer = document.querySelector('#belle .speech_container');
        if (speech.timeoutFunction) {
            clearInterval(speech.timeoutFunction);
        }
        speechContainer.style.display = 'block';
        speechContainer.style.opacity = text == '' ? 0 : 1;
        speech.innerHTML = text;
        
        if (duration) speech.timeoutFunction = setTimeout(() => {
            all('#belle .speech_container, #belle .options_container', a => a.style.opacity = 0);
            if (fadeOptions) speech.timeoutFunction = '';
            setTimeout(() => all('#belle .speech_container, #belle .options_container', a => a.style.display = ''), 2000);
        }, duration);
    }

    function options(factory) {
        const container = document.querySelector('#belle .options');
        container.innerHTML = '';
        factory(container);
        const optionsContainer = document.querySelector('#belle .options_container');
        optionsContainer.style.opacity = container.children.length ? 1 : 0;
        optionsContainer.style.display = 'block';
        if (!container.children.length) {
            setTimeout(() => optionsContainer.style.display = '', 2000);
        }
    }
    
    function getImage(i) { return imgs[i < 0 ? 0 : i >= imgs.length ? imgs.length - 1 : i]; }

    function initBelle() {
        setupImg(settingsMan.int('sweetie_img_index', 0));
        if (settingsMan.has("sweetie_posX") && settingsMan.has("sweetie_posY")) {
            setPrefPos(settingsMan.float("sweetie_posX"), settingsMan.float("sweetie_posY"));
        }
    }

    function setPrefPos(x, y) {
        prefX = x;
        prefY = y;
        setPos(x, y);
    }
    
    function setPos(x, y) {
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        
        const maxX = document.body.offsetWidth - (belle.offsetWidth * 0.75);
        const maxY = document.body.offsetHeight - (belle.offsetHeight * 0.75);
        
        if (x > maxX) x = maxX;
        if (y > maxY) y = maxY;
        
        settingsMan.set("sweetie_posY", belle.style.top = y + 'px');
        settingsMan.set("sweetie_posX", belle.style.left = x + 'px');
    }

    function rotateObject(obj, deg) {
        deg = deg % 360;
        obj.style.transform = deg == 0 ? '' : `rotate(${deg}deg)`;
    }

    makeStyle(`
#belle {
    transition: transform 0.07s linear;
    transform-origin: 85% 95%;
    z-index: 502;
    position: fixed;
    background-repeat: no-repeat;
    background-size: contain;
    width: 131px;
    height: 384px;}
#belle .speech_container, #belle .options_container {
    display: none;
    opacity: 0;
    position: absolute;
    top: 0px;
    width: 200px;
    transition: opacity 2s linear;}
#belle .speech_container {
    pointer-events: none;
    left: 100%;}
#belle .options_container {
    pointer-events: initial !important;
    left: -100%;}
#belle .speech, #belle .options {
    float: left;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 6px;
    border-radius: 10px;
    font-size: 0.8em;
    text-shadow: 1px 1px rgba(255, 255, 255, 0.4);
    line-height: 1.8em;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    margin-left: -20px;}
.cookie {
    z-index: 501;
    border-radius: 120px;
    position:absolute;
    cursor:pointer;}
.cursor_container .label, .cursor_container .label a {
    white-space: nowrap;
    display: inline-block;
    z-index: 900;
    color: #fff;
    font-weight: bold;}
.cursor_container .label {
    position: absolute;
    top: -20px;
    left: 10px;
    background: rgba(0,0,0,0.3);
    padding: 5px;
    opacity: 0;}
.cursor_container:hover .label {opacity: 1;}
.cursor, .cursor_container {
    z-index: 600;
    position: absolute;
    width: 0px;
    height: 0px;}
.cursor img {max-width: 13px;}
.cursor.click:before {
    content: "";
    position: absolute;
    top: -29px;
    left: -29px;
    border-radius: 50px;
    border: solid 5px rgba(0, 0, 255, 0.2);
    width: 50px;
    height: 50px;}
.cursor.click:after {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    border-radius: 50px;
    border: solid 1px rgba(0, 0, 255, 0.2);
    width: 30px;
    height: 30px;}
.cursor.smart.click:before, .cursor.smart.click:after {border-color: rgba(255, 0, 0, 0.2) !important;}
img.grabbed-image {
    outline: solid rgba(0,0,255,0.2) 10px;
    box-shadow: 1px 5px 5px rgba(0,0,0,0.7);}
img[data-dragged] {
    z-index: 501;
    position: absolute;}
.floater {
    z-index:500;
    color: white;
    pointer-events: none;
    text-shadow: 3px 3px 5px black;
    font-weight: bold;
    -{0}-animation: wobble 0.5s linear 0s infinite alternate;}
.wobbly_image {-{0}-animation: shake_shake 0.25s linear infinite;}
#belle_type + span span {
    background: rgba(255,255,255,0.6);
    border-radius: 5px;
    border: 3px solid #fff;
    padding: 5px;
    display: inline-block;
    vertical-align: middle;}
@-{0}-keyframes shake_shake {
    0% {transform: none;}
    25% {transform: rotate(-2deg);}
    50% {transform: none;}
    75% {transform: rotate(2deg);}
    100% {transform: none;}}
@-{0}-keyframes wobble {
    from {margin-left: -10px;}
    to {margin-left: 10px;}}
.musical {-{0}-animation: wub 0.8s linear 0s infinite alternate;}
@-{0}-keyframes wub {
    0% {transform: scale(1,1);}
    10% {transform: scale(1.00125,1.00125);}
    20% {transform: scale(1.0125,1.0125);}
    30% {transform: scale(1.00125,1.00125);}
    40% {transform: scale(1.0125,1.0125);}
    50% {transform: scale(1.00125,1.00125);}
    60% {transform: scale(1,1);}
    70% {transform: scale(0.99985,0.99985);}
    80% {transform: scale(1,1);}
    90% {transform: scale(1.0125,1.0125);}
    100% {transform: scale(1.00125,1.00125);}}`);
}

function snowBG(env, container, reverse, fix) {
    const randomRange = (min, max) => ((Math.random()*(max-min)) + min);
    const TO_RADIANS = Math.PI/180;
    const SCREEN_WIDTH = env.offsetWidth, SCREEN_HEIGHT = env.offsetHeight;
    
    function Particle3D(scene, material) {
        THREE.Particle.call(this, material);
        this.velocity = new THREE.Vector3(0,-8,0);
        this.velocity.rotateX(randomRange(-45,45));
        this.velocity.rotateY(randomRange(0,360));
        this.gravity = new THREE.Vector3(0,0,0);
        this.position = new THREE.Vector3(Math.random() * 2000 - 1000, Math.random() * 400 - 200, Math.random() * 2000 - 1000);
        this.scale.x = this.scale.y = 1;
        this.drag = 1;
        scene.add(this);
    }
    Particle3D.prototype = extend(new THREE.Particle(), {
        constructor: Particle3D,
        updatePhysics: function() {
            this.velocity.multiplyScalar(this.drag);
            this.velocity.addSelf(this.gravity);
            this.position.addSelf(this.velocity);
            with (this.position) {
                if (y < -300) y += 550;
                if (x > 1000) x -= 2000;
                else if (x < -1000) x += 2000;
                if (z > 1000) z -= 2000;
                else if (z < -1000) z += 2000;
            }
        }
    });
    
    function turn(angle, u, v) {
        const cosRY = Math.cos(angle * TO_RADIANS);
        const sinRY = Math.sin(angle * TO_RADIANS);
        return [(u*cosRY) + (v*sinRY),(u*-sinRY) + (v*cosRY)];
    }
    extend(THREE.Vector3.prototype, {
        rotateY: function(angle) { [this.x, this.z] = turn(angle, this.x, this.z); },
        rotateX: function(angle) { [this.y, this.z] = turn(angle, this.y, this.z); },
        rotateZ: function(angle) { [this.y, this.x] = turn(angle, this.y, this.x); }
    });
    
    let window_focused = true;
    let saveFocus = getSaveFocus();
    let mouseX = 0, mouseY = 0;
    let particles = [];
    let ticker;
    
    const camera = new THREE.PerspectiveCamera(20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 1000;
    
    const scene = new THREE.Scene();
    scene.add(camera);

    const renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    const material = new THREE.ParticleBasicMaterial({
        map: new THREE.Texture(newEl(`<img src="${staticFimFicDomain()}/scripts/img/ParticleSmoke.png">`))
    });
    
    for (let i = 0; i < 140; i++) particles.push(new Particle3D(scene, material));
    
    if (fix) {
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = renderer.domElement.style.left = 0;
    }
    renderer.domElement.style.pointerEvents = 'none';
		
    function mouseMoved(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    window.addEventListener('focus', () => window_focused = true);
    window.addEventListener('blur', () => window_focused = false);
    
    return {
        setSave: v => saveFocus = v,
        start: function () {
            if (ticker) return this;
            ticker = setInterval(() => {
                if (!window_focused && saveFocus) return;
                particles.forEach(particle => particle.updatePhysics());
                camera.position.x += (mouseX - camera.position.x) * 0.05;
                camera.position.y += (-mouseY - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                renderer.render(scene, camera);
            }, 50 / 3);
            container.insertAdjacentElement(reverse ? 'beforeend' : 'afterbegin', renderer.domElement);
            document.addEventListener('mousemove', mouseMoved);
            return this;
        },
        stop: function () {
            if (!ticker) return;
            clearInterval(ticker);
            ticker = null;
            renderer.domElement.parentNode.removeChild(renderer.domElement);
            document.removeEventListener('mousemove', mouseMoved);
        }
    };
}
