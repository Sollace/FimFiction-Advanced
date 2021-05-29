// ==UserScript==
// @name        FimFiction Advanced
// @description Adds various improvements to FimFiction.net
// @version     4.6-beta-7
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        https://raw.githubusercontent.com/Sollace/FimFiction-Advanced/master/logo.png
// @include     /^http?[s]://www.fimfiction.net/.*/
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/ThreeCanvas.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/Events.user.js
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/FimQuery.core.js
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/FimQuery.color.js
// @require     https://github.com/Sollace/UserScripts/raw/Dev/Internal/FimQuery.reflect.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.settings.js
// @require     https://github.com/Sollace/FimFiction-Advanced/raw/master/settings_man.core.js
// @require     https://github.com/Sollace/FimFiction-Advanced/raw/master/sweetie_scepter.core.js
// @grant       none
// @inject-into page
// @run-at      document-start
// ==/UserScript==
const VERSION = '4.6-beta-7',
      GITHUB = '//raw.githubusercontent.com/Sollace/FimFiction-Advanced/Dev',
      DECEMBER = (new Date()).getMonth() == 11, CHRIST = DECEMBER && (new Date()).getDay() == 25,
      CURRENT_LOCATION = (document.location.href + ' ').split('fimfiction.net/')[1].trim().split('#')[0];
if (CURRENT_LOCATION.indexOf('login-frame') != -1) throw 'FimFAdv: Login Frame detected. Execution halted.';
if (document.querySelector('body[FimFic_Adv]')) throw 'FimFAdv: Repeated Execution detected. Execution halted.';
if (this['unsafeWindow'] && window !== unsafeWindow) {
  console.warn(`FimFAdv: Sandboxing is enabled. This script may not run correctly.
  Firefox users are recommended to use this script through ViolentMonkey: https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
  Greasemonkey is deprecated.`);
}
//-------------------------------------------DATA---------------------------------------------------
const backgrounds = BackgroundsController();
const backgroundPatterns = backgrounds.createSet('bgPattern', 'Background Pattern', [
  BG("None", ''),
  BG("Plaster", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/plaster.png)`),
  BG("Lines", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/lines.png)`),
  BG("Cloth",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/cloth.png)`),
  BG("Clouds", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/cloud_pattern.png)`),
  BG("Stars", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/stars.png)`),
  BG("Checkerboard", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/checkerboard.png) top left / 40px auto`),
  BG("Flowers 1", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_1.png)`),
  BG("Flowers 2", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_2.png)`),
  BG("Flowers 3", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_3.png)`),
  BG("Flowers 4", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_4.png)`),
  BG("Flowers 5", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_5.png)`),
  BG("Flowers 6", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/flowers_6.png)`),
  BG("Waves", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/waves.png)`),
  BG("Savannah",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/savannah.png)`),
  BG("Dots",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/dots.png)`),
  BG("Fans",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/fans.png)`),
  BG("Woodland",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/woodland.png)`),
  BG("Diamonds", `url(${GITHUB}/backgrounds/rarity_1.png)`),
  BG("Checker Wave",`url(${GITHUB}/backgrounds/classic_poni_2/patterns/checker_wave.png)`),
  BG("Noise", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/noise.png)`),
  BG("Feathers", `url(${GITHUB}/backgrounds/classic_poni_2/patterns/feather_0.png)`),
  BG("Wool", `url(${GITHUB}/backgrounds/patterns/wool.png)`),
  BG("Cobbles", `url(${GITHUB}/backgrounds/patterns/cobble.png)`),
  BG("Shards", `url(${GITHUB}/backgrounds/patterns/glass.png) top center`),
  BG("Zecora",`url(${GITHUB}/backgrounds/patterns/zecora.png)`),
  BG("Celestia",`url(${GITHUB}/backgrounds/patterns/sunny_days.png), url(${GITHUB}/backgrounds/patterns/starfield.png) fixed`),
  BG("Luna", `url(${GITHUB}/backgrounds/patterns/lunar_nights.png), url(${GITHUB}/backgrounds/patterns/starfield.png) fixed`),
  BG("Twilight Sparkle", `url(${GITHUB}/backgrounds/twilight_2.png)`),
  BG("Pinkie Pie",`url(${GITHUB}/backgrounds/pinkie_0.png) fixed right`),
  BG("Rarity", `url(${GITHUB}/backgrounds/rarity_1.png),url(${GITHUB}/backgrounds/rarity_0.png)`),
]);
const backgroundImages = backgrounds.createSet('bgImg', 'Background Image', [
  BG("None", ''),
  BG("Day Town", `url(${GITHUB}/backgrounds/classic_poni_2/day_town.png) no-repeat bottom center / 100% auto`, 'https://www.deviantart.com/boneswolbach/art/Ponyville-Road-View-320722001'),
  BG("Night Town", `url(${GITHUB}/backgrounds/classic_poni_2/night_town.png) no-repeat bottom center / 100% auto`, 'https://www.deviantart.com/foxy-noxy/art/Ponyville-Road-View-Night-341236895'),
  BG("Big City", `url(${GITHUB}/backgrounds/manehattan2.png) no-repeat bottom center / 100% auto`, 'https://www.deviantart.com/abion47/art/Manehatten-Skyline-425529568'),
  BG("School House", `url(${GITHUB}/backgrounds/school_house.png) no-repeat bottom center / 100% auto`, 'https://www.deviantart.com/tamalesyatole/art/Ponyville-Schoolhouse-Background-326034340'),
  BG("Old Apple House", `url(${GITHUB}/backgrounds/classic_poni_2/apple_house.png) no-repeat bottom center / 100% auto`, 'https://www.deviantart.com/timeimpact/art/Background-Scenery-Hillside-Farm-299365434'),
  BG("Memories", `url(${GITHUB}/backgrounds/classic_poni_2/apple_house_lowfi.png) repeat-x bottom center / 100% auto`, 'https://www.deviantart.com/timeimpact/art/Background-Scenery-Hillside-Farm-299365434'),
  BG("Christmas", `url(${GITHUB}/backgrounds/classic_poni_2/christmas.png) no-repeat fixed bottom center / 100% auto`),
  BG("Trees", `url(${GITHUB}/backgrounds/classic_poni_2/trees.old.png) bottom center repeat-x`),
  BG("Trees 2", `url(${GITHUB}/backgrounds/classic_poni_2/trees.new.png) bottom center repeat-x`),
  BG("Clouds", `url(${GITHUB}/backgrounds/classic_poni_2/cloud.png) no-repeat bottom center / 100% auto`),
 // BG("Rain",`url(${GITHUB}/backgrounds/rain.png)`),

  BG("Twilight Sparkle", `url(${GITHUB}/backgrounds/twilight_1.png) fixed right, url(${GITHUB}/backgrounds/twilight_2.png) fixed right`),
  BG("Pinkie Pie",`url(${GITHUB}/backgrounds/pinkie_0.png), url(${GITHUB}/backgrounds/pinkie_1.png)`),
 // BG("Applejack", `url(${GITHUB}/backgrounds/aj.png) no-repeat bottom right / 500px auto`, "//benybing.deviantart.com/art/Applejack-noms-an-Apple-432759231", {contain: true}),
  BG("Rainbow Dash", `url(${GITHUB}/backgrounds/rd.png) top 120px center`, "//up1ter.deviantart.com/"),

 // BG("Diary",`url(${GITHUB}/backgrounds/book_0.png) fixed bottom -150px right -50px no-repeat, url(${GITHUB}/backgrounds/patterns/starfield.png)`),
 // BG("Sonic Rainboom", `url('${GITHUB}/backgrounds/rainboom.jpg') fixed 100% center`, "//knight33.deviantart.com/art/Sonic-Rainboom-301417918"),
 // BG("PinkieScape", `url(${GITHUB}/backgrounds/land.png) no-repeat fixed top 200px center / 100% auto, url(${GITHUB}/backgrounds/sky.png) local top left -300px / 100% auto`, '', {darken: true})
]);
const icons = 'adjust;adn;align-center;align-justify;align-left;align-right;ambulance;anchor;android;angellist;angle-double-down;angle-double-left;angle-double-right;angle-double-up;angle-down;angle-left;angle-right;angle-up;apple;archive;area-chart;arrow-circle-down;arrow-circle-left;arrow-circle-o-down;arrow-circle-o-left;arrow-circle-o-right;arrow-circle-o-up;arrow-circle-right;arrow-circle-up;arrow-down;arrow-left;arrow-right;arrow-up;arrows;arrows-alt;arrows-h;arrows-v;asterisk;at;automobile;backward;ban;bank;bar-chart;bar-chart-o;barcode;bars;beer;behance;behance-square;bell;bell-o;bell-slash;bell-slash-o;bicycle;binoculars;birthday-cake;bitbucket;bitbucket-square;bitcoin;bold;bolt;bomb;book;bookmark;bookmark-o;briefcase;btc;bug;building;building-o;bullhorn;bullseye;bus;cab;calculator;calendar;calendar-o;camera;camera-retro;car;caret-down;caret-left;caret-right;caret-square-o-down;caret-square-o-left;caret-square-o-right;caret-square-o-up;caret-up;cc;cc-amex;cc-discover;cc-mastercard;cc-paypal;cc-stripe;cc-visa;certificate;chain;chain-broken;check;check-circle;check-circle-o;check-square;check-square-o;chevron-circle-down;chevron-circle-left;chevron-circle-right;chevron-circle-up;chevron-down;chevron-left;chevron-right;chevron-up;child;circle;circle-o;circle-o-notch;circle-thin;clipboard;clock-o;close;cloud;cloud-download;cloud-upload;cny;code;code-fork;codepen;coffee;cog;cogs;columns;comment;comment-o;comments;comments-o;compass;compress;copy;copyright;credit-card;crop;crosshairs;css3;cube;cubes;cut;cutlery;dashboard;database;dedent;delicious;desktop;deviantart;digg;dollar;dot-circle-o;download;dribbble;dropbox;drupal;edit;eject;ellipsis-h;ellipsis-v;empire;envelope;envelope-o;envelope-square;eraser;eur;euro;exchange;exclamation;exclamation-circle;exclamation-triangle;expand;external-link;external-link-square;eye;eye-slash;eyedropper;facebook;facebook-square;fast-backward;fast-forward;fax;female;fighter-jet;file;file-archive-o;file-audio-o;file-code-o;file-excel-o;file-image-o;file-movie-o;file-o;file-pdf-o;file-photo-o;file-picture-o;file-powerpoint-o;file-sound-o;file-text;file-text-o;file-video-o;file-word-o;file-zip-o;files-o;film;filter;fire;fire-extinguisher;flag;flag-checkered;flag-o;flash;flask;flickr;floppy-o;folder;folder-o;folder-open;folder-open-o;font;forward;foursquare;frown-o;futbol-o;gamepad;gavel;gbp;ge;gear;gears;gift;git;git-square;github;github-alt;github-square;gittip;glass;globe;google;google-plus;google-plus-square;google-wallet;graduation-cap;group;h-square;hacker-news;hand-o-down;hand-o-left;hand-o-right;hand-o-up;hdd-o;header;headphones;heart;heart-o;history;home;hospital-o;html5;ils;image;inbox;indent;info;info-circle;inr;instagram;institution;ioxhost;italic;joomla;jpy;jsfiddle;key;keyboard-o;krw;language;laptop;lastfm;lastfm-square;leaf;legal;lemon-o;level-down;level-up;life-bouy;life-buoy;life-ring;life-saver;lightbulb-o;line-chart;link;linkedin;linkedin-square;linux;list;list-alt;list-ol;list-ul;location-arrow;lock;long-arrow-down;long-arrow-left;long-arrow-right;long-arrow-up;magic;magnet;mail-forward;mail-reply;mail-reply-all;male;map-marker;maxcdn;meanpath;medkit;meh-o;microphone;microphone-slash;minus;minus-circle;minus-square;minus-square-o;mobile;mobile-phone;money;moon-o;mortar-board;music;navicon;newspaper-o;openid;outdent;pagelines;paint-brush;paper-plane;paper-plane-o;paperclip;paragraph;paste;pause;paw;paypal;pencil;pencil-square;pencil-square-o;phone;phone-square;photo;picture-o;pie-chart;pied-piper;pied-piper-alt;pinterest;pinterest-square;plane;play;play-circle;play-circle-o;plug;plus;plus-circle;plus-square;plus-square-o;power-off;print;puzzle-piece;qq;qrcode;question;question-circle;quote-left;quote-right;ra;random;rebel;recycle;reddit;reddit-square;refresh;remove;renren;reorder;repeat;reply;reply-all;retweet;rmb;road;rocket;rotate-left;rotate-right;rouble;rss;rss-square;rub;ruble;rupee;save;scissors;search;search-minus;search-plus;send;send-o;share;share-alt;share-alt-square;share-square;share-square-o;shekel;sheqel;shield;shopping-cart;sign-in;sign-out;signal;sitemap;skype;slack;sliders;slideshare;smile-o;soccer-ball-o;sort;sort-alpha-asc;sort-alpha-desc;sort-amount-asc;sort-amount-desc;sort-asc;sort-desc;sort-down;sort-numeric-asc;sort-numeric-desc;sort-up;soundcloud;space-shuttle;spinner;spoon;spotify;square;square-o;stack-exchange;stack-overflow;star;star-half;star-half-empty;star-half-full;star-half-o;star-o;steam;steam-square;step-backward;step-forward;stethoscope;stop;strikethrough;stumbleupon;stumbleupon-circle;subscript;suitcase;sun-o;superscript;support;table;tablet;tachometer;tag;tags;tasks;taxi;tencent-weibo;terminal;text-height;text-width;th;th-large;th-list;thumb-tack;thumbs-down;thumbs-o-down;thumbs-o-up;thumbs-up;ticket;times;times-circle;times-circle-o;tint;toggle-down;toggle-left;toggle-off;toggle-on;toggle-right;toggle-up;trash;trash-o;tree;trello;trophy;truck;try;tty;tumblr;tumblr-square;turkish-lira;twitch;twitter;twitter-square;umbrella;underline;undo;university;unlink;unlock;unlock-alt;unsorted;upload;usd;user;user-md;users;video-camera;vimeo-square;vine;vk;volume-down;volume-off;volume-up;warning;wechat;weibo;weixin;wheelchair;wifi;windows;won;wordpress;wrench;xing;xing-square;yahoo;yelp;yen;youtube;youtube-play;youtube-square'.split(';');
const logoController = LogoController('Default;Rainbow Dash;Twilight Sparkle;Pinkie Pie;Rarity;Applejack;Fluttershy;Lyra Heartstrings;Octavia;Vinyl Scratch;Derpy Hooves;Celestia;Luna;Sunset Shimmer;Starlight Glimmer;Coloratura'.split(';').map(LOGO));
var banners = [];
let customBanner, customBannerindex = -1;
const animator = Animator();
const feeder = FancyFeedsController();
const customBannerController = CustomBannerController();
const bannerController = BannerController([
  { name: "Default", items: [
    Ban("zecora", [{ href: "//aeronjvl.deviantart.com/art/Hanging-by-the-Edge-327757722", text: 'Artwork by AeronJVL'}], "#A46E3C"),
    Ban("aeron_fluttershy", [{ href: "//aeronjvl.deviantart.com/art/Nature-326303180", text: 'Artwork by AeronJVL'}], "#A47A3C"),
    Ban("aeron_philomena", [{ href: "//ajvl.deviantart.com/art/Philomena-Equestria-s-Finest-Phoenix-310217164", text: 'Artwork by AeronJVL'}], "#4C7A7E"),
    Ban("aeron_celestia", [{ href: "//aeronjvl.deviantart.com/art/Path-to-Canterlot-340639474", text: 'Artwork by AeronJVL'}], "#4C7E6E"),
    Ban("derpy_dash", [{ href: "//ponybooru.org/images/11585", text: 'Artwork by PonyKillerX'}], "#57666F"),
    Ban("ponykiller_trixie", [{ href: "https://ponybooru.org/11560", text: 'Artwork by PonyKillerX'}], "#534C79"),
    Ban("maplesunrise_pinkiedash", [{ href: "//derpibooru.org/67621", text: 'Artwork by MapleSunrise'}], "rgb(151, 113, 83)"),
    Ban("yamio_fluttershy", [{ href: "//yamio.deviantart.com/art/Fluttershy-285372865", text: 'Artwork by Yamio'}], "#8C9753"),
    Ban("smitty_derpy", [{ href: "https://derpibooru.org/31992", text: 'Artwork by SmittyG'}], "rgb(128, 128, 128)"),
    Ban("smitty_twi", [{ href: "https://derpibooru.org/5746", text: 'Artwork by SmittyG'}], "rgb(79, 101, 156)"),
    Ban("ratofdrawn_1", [{ href: "//ratofdrawn.deviantart.com/art/Wet-Fun-317158001", text: 'Artwork by RatofDawn'}], "#92A43C"),
    Ban("ratofdrawn_rarijack", [{ href: "//ratofdrawn.deviantart.com/art/Differences-343226962", text: 'Artwork by RatofDawn'}], "#6485BE"),
    Ban("jinzhan_applejack", [{ href: "//jinzhan.deviantart.com/art/Applejack-325292534", text: 'Artwork by JinZhan'}], "rgb(164, 68, 60)"),
    Ban("jinzhan_group", [{ href: "//jinzhan.deviantart.com/art/There-are-alligators-in-the-lake-271094454", text: 'Artwork by JinZhan'}], "rgb(105, 126, 133)"),
    Ban("solar_luna", [{ href: "//soapie-solar.deviantart.com/art/Chibi-Luna-Star-Fishing-340002341", text: 'Artwork by Soapi-Solar'}], "#483CA4"),
    Ban("solar_group", [{ href: "//soapie-solar.deviantart.com/art/Forest-Foundation-283012970", text: 'Artwork by Soapi-Solar'}], "#83A43C"),
    Ban("uc77_1", [{ href: "//uc77.deviantart.com/art/Ponies-Dig-Giant-Robots-281071953", text: 'Artwork by UC77'}], "#A4873C"),
    Ban("cmaggot_fluttershy", [{ href: "//cmaggot.deviantart.com/art/Dangerous-Mission-342068171", text: 'Artwork by cmaggot'}], "#4D3CA4"),
    Ban("rainbow_ss", [{ href: "//derpibooru.org/41558", text: 'Artwork by Rainbow'}], "#A4723C"),
    Ban("rainbow_markerpone", [{ href: "//derpibooru.org/131068", text: 'Artwork by Rainbow'}], "#456460"),
    Ban("rainbow_roseluck", [{ href: "//derpibooru.org/50361", text: 'Artwork by Rainbow'}], "#A43C98"),
    Ban("jj_trixie", [{ href: "//johnjoseco.deviantart.com/art/Trixie-s-Life-is-so-Hard-340685374", text: 'Artwork by JohnJoseco'}], "#3C72A4"),
    Ban("anima_1", [{ href: "//derpibooru.org/90167", text: 'Artwork by Anima-Dos'}], "#3C76A4"),
    Ban("mew_pinkie", [{ href: "//mewball.deviantart.com/art/Reflect-338427890", text: 'Artwork by Mewball'}], "#3C93A4"),
    Ban("tsitra_dash", [{ href: "//tsitra360.deviantart.com/art/Morning-Flight-331710988", text: 'Artwork by Tsitra'}], "#3A59A4"),
    Ban("knifeh_scoots", [{ href: "//knifeh.deviantart.com/art/Scootaloo-326771443", text: 'Artwork by KnifeH'}], "#A47F3C"),
    Ban("noben_celestia", [{ href: "//derpibooru.org/images/68012", text: 'Artwork by Noben'}], "#A4593C"),
    Ban("ep_shady_trough", [{ href: "//equestria-prevails.deviantart.com/art/The-Shady-Trough-319986368", text: 'Artwork by Equestria-Prevails'}], "#4D3CA4"),
    Ban("spittfire_1", [{ href: "//derpibooru.org/images/167976", text: 'Artwork by Nightcreepmax'}], "#3C55A4"),
    Ban("blitzpony_luna", [{ href: "//twibooru.org/2183279", text: 'Artwork by Blitzpony'}], "#4B4D55"),
    Ban("gsphere_scoots", [{ href: "//lionel23.deviantart.com/art/The-Newbie-set-an-Academy-Record-356826950", text: 'Artwork by Lionel'}], "#477FB3"),
    Ban("stoic_celestia", [{ href: "//thestoicmachine.deviantart.com/art/Radiant-Malevolence-213959523", text: 'Artwork by TheStoicMachine'}], "#706CA7"),
    Ban("moe_canterlot", [{ href: "//derpibooru.org/25", text: 'Artwork by Moe'}], "#867D58"),
    Ban("alasou_costumes", [{ href: "//alasou.deviantart.com/art/Costume-Swap-party-381670764", text: 'Artwork by Alasou'}], "#775886"),
    Ban("pridark_luna", [{ href: "//pridark.deviantart.com/art/A-Wonderful-Night-381504014", text: 'Artwork by Pridark'}], "#525A8F"),
    Ban("gign_flutterdash", [{ href: "//gign-3208.deviantart.com/art/In-the-attic-377732207", text: 'Artwork by Gign'}], "#A55744"),
    Ban("goben_forest", [{ href: "//derpibooru.org/images/255541", text: 'Artwork by Noben'}], "#556B80"),
    Ban("devinian_lyra_bonbon", [{ href: "//devinian.deviantart.com/art/Story-of-the-bench-373750983", text: 'Artwork by Devinian'}], "#68885A"),
    Ban("devinian_fluttershy", [{ href: "//devinian.deviantart.com/art/Picnic-with-Kindness-351639714", text: 'Artwork by Devinian'}], "#749142"),
    Ban("jackalynn_pinkiedash", [{ href: "//derpibooru.org/images/18806", text: 'Artwork by Jack-A-Lynn'}], "#4584B6"),
    Ban("yakovlev_fluttershy", [{ href: "//yakovlev-vad.deviantart.com/art/Simple-curiosity-468468925", text: 'Artwork by Yakovlev-vad'}], "#5E7520"),
    Ban("yakovlev_twilight", [{ href: "//yakovlev-vad.deviantart.com/art/Time-to-wash-3-490390076", text: 'Artwork by Yakovlev-vad'}], "#9E75A9"),
    Ban("yakovlev_zecora", [{ href: "//www.deviantart.com/yakovlev-vad/art/peaceful-place-request-367969466", text: 'Artwork by Yakovlev-vad'}], "rgb(90, 123, 126)"),
    Ban("mymagicdream_twilight", [{ href: "//my-magic-dream.deviantart.com/art/Twilight-453477065", text: 'Artwork by My-Magic-Dream'}], "#77599A")
  ]},{ name: "Extended", items: [
    Ban2("discorded_applebloom", [{ href: "//derpibooru.org/1735150", text: 'Artwork by Discorded'}], "#D0D3FC"),
    Ban2("flutterby_dash", [{ href: "//derpibooru.org/250982", text: 'Artwork by JunglePony'}], "#D771A4"),
    Ban2("mommy_derp", [{ href: "//derpibooru.org/96418", text: 'Artwork by JunglePony'}], "rgb(189,198,205)"),
    Ban2("flutter_bite", [{ href: "//johnjoseco.deviantart.com/art/Just-One-Bite-422922104", text: 'Artwork by JohnJoseco'}], "#6E1414"),
    Ban2("movie_night", [{ href: "//dracodile.deviantart.com/art/Movie-night-343553193", text: 'Artwork by Dracodile'}], "#704582"),
    Ban2("antipodes", [
      { href: "//www.fimfiction.net/user/ToixStory", text: 'Antipodes'}
    ], "#ECBC6A"),
    Ban2("steampunk", [
      { href: "//hinoraito.deviantart.com/art/MLP-FIM-Commission-Steampunk-ponies-293033624", text: 'Artwork by Hinoraito'},
      { href: '/story/9038/freeze-frame', text: 'Story by ToixStory'}
    ], "#764D17"),
    Ban2("flutter_bee", [{ href: "//atteez.deviantart.com/art/Flutterbee-437641542", text: 'Artwork by Atteez'}], "#92A43C"),
    Ban2("cmc_roped", [{ href: "//spittfireart.deviantart.com/art/Cutie-Mark-Crusaders-365513354", text: 'Artwork by Nightcreepmax'}], "#6485BE"),
    Ban2("twi_revenge", [{ href: "//zacatron94.deviantart.com/art/Revenge-446974245", text: 'Artwork by Zacatron94'}], "#4B2164"),
    Ban2("solar_flare", [{ href: "https://derpibooru.org/images/639721", text: 'Artwork by ZodiacNicola'}], "#AD160B", { position: ["right",0,"center",0] }),
    Ban2("serene", [{ href: "//rain-gear.deviantart.com/art/A-Quiet-Place-to-Read-434204811", text: 'Artwork by Rain-Gear'}], "#2E737A"),
    Ban2("nightwork", [{ href: "//yakovlev-vad.deviantart.com/art/Nightwork-493323738", text: "Artwork by Yakovlev-vad"}], "#9E75A9"),
    Ban2("shamanguli_princess", [{ href: "//shamanguli.deviantart.com/art/Playground-for-a-Princess-512544966", text: 'Artwork by Shamanguli'}], "#6E6756"),
    Ban2("yakovlev_trap", [{ href: "//yakovlev-vad.deviantart.com/art/The-trap-Patreon-reward-548854581", text: 'Artwork by Yakovlev-vad'}], "#694255", { position: ["center",0,"bottom",0] }),
    Ban2("buttercupsaiyan_dash", [{ href: '#', text: 'Anonymous Artist'}], "#4C7A7E", { position: ["center",0,"top",0] })
  ]}, { name: "Nostalgic", items: [
    Ban0("fields", [
      {href: "https://derpibooru.org/50676", text: 'Artwork by Qsteel'}
    ], "#295D62"),
    Ban0("fluttershypinkie", [
      { href: 'https://www.deviantart.com/are-you-jealous/art/Pinkie-Pie-likes-to-sit-305832091', text: 'Pinkie Pie by Are-you-jealous'},
      { href: 'http://mihaaaa.deviantart.com/art/Fluttershy-without-background2-213479935', text: 'Fluttershy by Mihaaaa'},
      { href: 'https://www.deviantart.com/mlp-vector-collabs/art/Group-Background-4-304749548', text: 'Background by MLP Vector Club Collab'}
    ], "#4C7A7E"),
    Ban0("fwf", [
      { href: 'https://www.deviantart.com/rainbowplasma/art/Mane-6-Project-Best-Friends-293382084', text: 'Characters by Rainbow Plasma'},
      { href: 'https://www.deviantart.com/silvervectors/art/Nomsters-319781719', text: 'Parasprites by Silver Vectors'},
      { href: 'https://www.deviantart.com/tgolyi/art/Running-of-the-leaves-314272905', text: 'Background by tgolyi'}
    ], "#9BA447"),
    Ban0("header_title_reu", [
      { href: 'https://derpibooru.org/images/10168', text: 'Fluttershy by Reuniclus'},
      { href: 'https://derpibooru.org/images/57598', text: 'Luna by Reuniclus'},
      { href: 'https://www.deviantart.com/quanno3', text: 'Background by Quanno3'}
    ], "#4EB99B"),
    Ban0("header_title_flittercloudchaser", [
      { href: 'https://www.deviantart.com/mysticalpha/art/Flitter-and-Cloudchaser-294990688', text: 'Characters by MysticAlpha'},
      { href: 'https://www.deviantart.com/timeimpact/art/Background-Scenery-Hillside-Farm-299365434', text: 'Background by TimeImpact'}
    ], "#4EB99B"),
    Ban0("rarijack", [
      { href: 'https://derpibooru.org/images/414388', text: 'Characters by Joey Darkmeat'},
      { href: 'https://www.deviantart.com/stinkehund/art/Sweet-Apple-Acres-svg-301920207', text: 'Background by Stinkehund'},
    ], "#436032"),
    Ban0("stealth", [
      { href: 'https://www.deviantart.com/timeimpact/art/Background-Scenery-Hillside-Farm-299365434', text: 'Artwork by TimeImpact'}
    ], "#7EA450"),
    Ban0("leporn", [
      { href: '#', text: 'Anonymous Artist'}
    ], "#7B123A", { nsfw: true }),
    Ban0("twidash", [
      { href: 'https://www.deviantart.com/goatanimedatingsim/art/Reading-Rainbow-283334545', text: 'Characters by Equestria-Prevails'},
      { href: 'https://www.deviantart.com/mrhavre/art/NATURE-i-love-you-316005359', text: 'Background by MrHavre'},
      { href: 'https://www.deviantart.com/kopachris/gallery/33658160/mlp-templates-and-reactions', text: 'Misc. Trees by Kopachris'}
    ], "#A27752"),
    Ban0("twixie", [
      { href: 'https://derpibooru.org/images/66106', text: 'Characters by Joey Darkmeat and Atmospark'},
      { href: 'https://www.deviantart.com/mrhavre/art/NATURE-i-love-you-316005359', text: 'Background by MrHavre'}
    ], "#C3A550")
  ]}
]);
const creditsController = BannerCreditsController(bannerController);
const snowController = SnowController();
const signatureController = SignatureController();
const adsController = AdsController();
const siteFontController = SiteFontController();
const commentSectionController = CommentSectionController();
const storyBoxController = StoryBoxController();
const colours = {
  Mapping: {},
  Keys: [], Names: [],
  NamesLower: [],
  Sets: {
    'Standard Colours': [0, [0,73,70,68,107,59,103,24,112]],
    'FimFiction': [0, range(113,127)],
    'Mane Six': [0, range(128, 133)],
    'More Colours': [1, range(0,112)]
  }
};
'White:#FFFFFF;Pink:#FFC0CB;PeachPuff:#FFDAB9;Gainsboro:#DCDCDC;LightPink:#FFB6C1;Moccasin:#FFE4B5;NavajoWhite:#FFDEAD;Wheat:#F5DEB3;LightGray:#D3D3D3;PaleTurquoise:#AFEEEE;PaleGoldenRod:#EEE8AA;Thistle:#D8BFD8;PowderBlue:#B0E0E6;LightBlue:#ADD8E6;PaleGreen:#98FB98;LightSteelBlue:#B0C4DE;LightSkyBlue:#87CEFA;Silver:#C0C0C0;Aquamarine:#7FFFD4;LightGreen:#90EE90;Plum:#DDA0DD;Khaki:#F0E68C;LightSalmon:#FFA07A;SkyBlue:#87CEEB;Violet:#EE82EE;LightCoral:#F08080;Salmon:#FA8072;HotPink:#FF69B4;BurlyWood:#DEB887;DarkSalmon:#E9967A;Tan:#D2B48C;MediumSlateBlue:#7B68EE;SandyBrown:#F4A460;DarkGray:#A9A9A9;CornFlowerBlue:#6495ED;Coral:#FF7F50;PaleVioletRed:#DB7093;MediumPurple:#9370DB;RosyBrown:#BC8F8F;Orchid:#DA70D6;DarkSeaGreen:#8FBC8B;Tomato:#FF6347;MediumAquamarine:#66CDAA;GreenYellow:#ADFF2F;IndianRed:#CD5C5C;MediumOrchid:#BA55D3;DarkKhaki:#BDB76B;SlateBlue:#6A5ACD;RoyalBlue:#4169E1;Turquoise:#40E0D0;DodgerBlue:#1E90FF;MediumTurquoise:#48D1CC;DeepPink:#FF1493;LightSlateGray:#778899;BlueViolet:#8A2BE2;Peru:#CD853F;SlateGray:#708090;Gray:#808080;Magenta:#FF00FF;Blue:#0000FF;DeepSkyBlue:#00BFFF;CadetBlue:#5F9EA0;Cyan:#00FFFF;SpringGreen:#00FF7F;Lime:#00FF00;LimeGreen:#32CD32;Chartreuse:#7FFF00;YellowGreen:#9ACD32;Yellow:#FFFF00;Gold:#FFD700;Orange:#FFA500;DarkOrange:#FF8C00;OrangeRed:#FF4500;Red:#FF0000;DarkOrchid:#9932CC;LawnGreen:#7CFC00;Steelblue:#4682B4;MediumSpringGreen:#00FA9A;GoldenRod:#DAA520;Crimson:#DC143C;Chocolate:#D2691E;MediumSeaGreen:#3CB371;MediumVioletRed:#C71585;FireBrick:#B22222;DarkViolet:#9400D3;LightSeaGreen:#20B2AA;DimGray:#696969;DarkTurquoise:#00CED1;Brown:#A52A2A;MediumBlue:#0000CD;Sienna:#A0522D;DarkSlateBlue:#483D8B;DarkGoldenRod:#B8860B;SeaGreen:#2E8B57;OliveDrab:#6B8E23;ForestGreen:#228B22;SaddleBrown:#8B4513;DarkOliveGreen:#556B2F;DarkMagenta:#8B008B;DarkBlue:#00008B;DarkCyan:#008B8B;DarkRed:#8B0000;MidnightBlue:#191970;Indigo:#4B0082;Purple:#800080;Navy:#000080;Teal:#008080;Green:#008000;Olive:#808000;Maroon:#800000;DarkSlateGray:#2F4F4F;DarkGreen:#006400;Black:#000000;Grey:#666666;Light Grey:#CCCCCC;Dark Grey:#383838;Red:#BE4343;Orange:#BE7A43;Yellow:#AFA426;Lime Green:#7AAF26;Green:#2CAF26;Turquoise:#26AF6D;Light Blue:#26A4AF;Blue:#265DAF;Purple:#3C26AF;Violet:#9426AF;Pink:#AF2673;Brown:#5F4432;Twilight Sparkle:#A66EBE;Rarity:#5E51A3;Applejack:#E97135;Pinkie Pie:#EA80B0;Rainbow Dash:#6AAADD;Fluttershy:#E6B91F'.split(';').forEach(a => {
  a = a.split(':');
  colours.Keys.push(a[1]);
  colours.Names.push(colours.Mapping[a[1]] = a[0]);
  colours.NamesLower.push(a[0].toLowerCase());
});
let userToolbar;
//--------------------------------------BOILER PLATE------------------------------------------------
requireRemoveEventListeners();
ready(() => {
  if (!document.querySelector('.body_container')) return;
  const start = (new Date()).getTime();
  initGlobals();
  let stage = 'Ready-init';
  try {
    addFooterData(`Page running <a href="/manage/local-settings#fimfiction_advanced">FimFiction Advanced ${VERSION}</a>`);
    document.lastChild.setAttribute('FimFic_Adv', '');
    stage = 'Init';
    initFimFictionAdvanced();
    stage = 'Settings Tab';
    const settingsButt = document.querySelector('.user_toolbar li a[href="/manage/local-settings"] + ul');
    settingsButt.insertAdjacentHTML('beforeend', `<li class="divider"></li><li><a href="/manage/local-settings#fimfiction_advanced"><i class="fa fa-gear"></i>Advanced Settings</a></li>`);
    stage = 'Events';
    registerEvents();
    stage = 'End-init';
    addFooterData(`Script applied in <a>${((new Date()).getTime() - start)/1000} seconds</a>`);
  } catch (e) {
    console.error(`FimficAdv: Unhandled Exception in ${stage}`);
    console.error(e);
  }

  function addFooterData(data) {
    const footer = document.querySelector('.footer .block');
    if (footer) footer.insertAdjacentHTML('beforeend', '<br>' + data);
  }
});

try {
  earlyStart();
} catch (e) {
  console.error(`FimficAdv: Unhandled Exception in Early Init`);
  console.error(e);
}
//---------------------------------------SCRIPT BODY------------------------------------------------
function initGlobals() {
  if (!userToolbar) userToolbar = document.querySelector('.user_toolbar');
}
function earlyStart() {
  (function css() {
    if (document.body && document.querySelector('#stylesheetMain')) {
      addCss();

      if (bannerController.getEnabled()) {
        addBannerCss();
        (function banner() {
          if (canLoadBanners()) {
            logoController.apply();
            return bannerController.build();
          }
          requestAnimationFrame(banner);
        })();
      }

      backgrounds.apply();
      FimFicSettings.SettingsTab('Advanced', 'Advanced Settings', 'fimfiction_advanced', 'fa fa-wrench', 'My Account', 'cog', buildSettingsTab);
      creditsController.buildAll();

      if (CURRENT_LOCATION.indexOf('feed') == 0) (function feed() {
        if (document.querySelector('.feed, .footer')) {
          return feeder.replaceFeedUI();
        }
        requestAnimationFrame(feed);
      })();

      return;
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
  commentSectionController.initCommentArea();
  siteFontController.apply();
  storyBoxController.apply();
  initBlogPage();
  commentSectionController.apply();
  bannerController.initFancy();
  feeder.apply();
  adsController.apply();
  applyCodePatches();
  applyFeatureBoxEnhancements();
  setTimeout(() => {
    if (bannerController.slider.getSlide()) {
      bannerController.slider.updateSlide();
    }
    snowController.apply();
  }, 300);
}
function registerEvents() {
  FimFicEvents.on('aftertoolbar', addExtraToolbarLinks);
  commentSectionController.registerEvents();
  if (CURRENT_LOCATION.indexOf('feed') == 0) FimFicEvents.on('afterloadfeed', feeder.initFeedItems);
  applyNightModeListener();
}
function buildSettingsTab(tab) {
  tab.StartEndSection("General Settings");
  commentSectionController.createOptions(tab);
  adsController.createOptions(tab);
  tab.AddCheckBox("sb", "Show Sweetie Scepter", getSweetieEnabled()).addEventListener('change', setSweetieEnabled);
  siteFontController.createOptions(tab);
  storyBoxController.createOptions(tab);
  tab.StartEndSection("Banners");
  bannerController.createOptions(tab, () => {
    tab.StartEndSection("Christmasy Stuff");
    snowController.createOptions(tab);
  });
  tab.StartEndSection("Colours and Customization");
  logoController.createOptions(tab);
  backgrounds.createOptions(tab);
  tab.StartEndSection("Signatures");
  signatureController.createOptions(tab);
}
//----------------------------------------FUNCTIONS-------------------------------------------------
function applyFeatureBoxEnhancements() {
  extend(FrontpageController.prototype, {
    prevFeaturedStory() {
      let c = this.featuredStory - 1;
      if (c < 1) {
        c = 10;
      }
      this.selectFeaturedStory(c);
    },
    bindKeyEvents(element) {
      const box = element.querySelector('.featured_box');
      if (box) {
        box.tabIndex = 1;
        box.addEventListener('keydown', e => {
          if (e.ctrlKey && (e.keyCode == 38 || e.keyCode == 40)) {
            this[`${e.keyCode == 38 ? 'prev' : 'next'}FeaturedStory`]();
            e.preventDefault();
          }
        });
      }
    }
  });
  override(FrontpageController.prototype, 'bind', function(element) {
    FrontpageController.prototype.bind.super.apply(this, arguments);
    bindKeyEvents(element);
  });

  const frontPage = document.querySelector('.front_page');
  if (frontPage) {
    const controller = App.GetControllerFromElement(frontPage);
    if (controller) {
      controller.bindKeyEvents(frontPage);
    }
  }
}
function applyNightModeListener() {
  window.addEventListener('darkmodechange', nightModeToggled);
  window.addEventListener('storage', c => {
    if (c.key == 'stylesheet') nightModeToggled();
  });
  override(NightModeController.prototype, 'update', function() {
    NightModeController.prototype.update.super.apply(this, arguments);
    window.dispatchEvent(new Event('darkmodechange'));
  });

  function nightModeToggled() {
    addCss();
    if (bannerController.getEnabled()) addBannerCss();
    backgrounds.apply();
  }
}
function applyCodePatches() {
  //Fix error window popping up whenever an operation times out/is cancelled
  override(window, 'ShowErrorWindow', function(c) {
    if (arguments[0] !== 'Request Failed (0)') return window.ShowErrorWindow.super(c);
  });
  if (!document.querySelector('.chapter-container')) return;
  function formatChapter(chapter) {
    const style = window.getComputedStyle(chapter);
    document.querySelector('.story_content_box').style.backgroundColor = style.backgroundColor;
    document.querySelector('.chapter_footer').style.color = style.color;
  }
  override(ChapterFormatController.prototype, 'apply', function(c) {
    if (!this.appliedFF) {
      this.appliedFF = true;
      this.inputs.colour_scheme.insertAdjacentHTML('beforeend', `
<optgroup label="Pony">
  <option value="twilight">Twilight Sparkle</option>
  <option value="pinkie">Pinkie Pie</option>
  <option value="applejack">Applejack</option>
  <option value="dash">Rainbow Dash</option>
  <option value="rarity">Rarity</option>
  <option value="fluttershy">Fluttershy</option>
  <option value="celestia">Princess Celestia</option>
  <option value="luna">Princess Luna</option>
</optgroup>`);
      this.inputs.colour_scheme.value = this.colour_scheme;
    }
    ChapterFormatController.prototype.apply.super.apply(this, arguments);
    formatChapter(this.chapter);
  });
  override(ChapterController.prototype, 'computeBackgroundColor', function() {
    ChapterController.prototype.computeBackgroundColor.patched.call(this, !0);
  });
  ChapterController.prototype.computeBackgroundColor.patched = patchFunc(ChapterController.prototype.computeBackgroundColor.super, body => {
    return body.replace('document.body.style.backgroundColor', `document.querySelector('.body_container').style.backgroundColor`)
      .replace('window.getComputedStyle(document.body).backgroundColor', `document.body.dataset.baseColor`)
      .replace('updatePageBackgroundColor(', `updatePageBackgroundColor.patched.call(this, `);
  });

  //Change styling target to the body container
  override(ChapterController.prototype, 'updatePageBackgroundColor', function(c) {
    if (!this.patched) {
      document.replaceEventListener('scroll', this, this.updatePageBackgroundColor.super, this.updatePageBackgroundColor.patched.bind(this));
      document.replaceEventListener('chapterColourSchemeChanged', this, this.updatePageBackgroundColor.super, this.updatePageBackgroundColor.patched.bind(this));
      document.replaceEventListener('chapterColourSchemeChanged', this, this.computeBackgroundColor.super, this.computeBackgroundColor.patched.bind(this));
      this.patched = true;
    }
    this.computeBackgroundColor.patched.call(this, c);
  });
  ChapterController.prototype.updatePageBackgroundColor.patched = patchFunc(ChapterController.prototype.updatePageBackgroundColor.super, body => {
    return body.replace('document.body.style.backgroundColor', `document.querySelector('.body_container').style.backgroundColor`)
      .replace('borderRightColor=', `borderRightColor=rgbToCSS(this.border_color),this.elements.chapterContentBox.style.borderBottomColor=`);
  });

  //Force update chapter themes
  try {
    App.DispatchEvent(document, 'chapterColourSchemeChanged');
    formatChapter(document.querySelector('#chapter'));
  } catch (e) {
    console.warn(e);
  }
}
function initBlogPage() {
  if (!isMyBlogPage() || document.querySelector('.content_box.blog-post-content-box')) return;
  const page = document.querySelector("div.page_list");
  if (!page) return;
  const name = getUserName();
  page.parentNode.previousSibling.insertAdjacentHTML('beforeend', `<div class="content_box blog_post_content_box" style="margin-top:0px; ">
    <div class="calendar" style="margin-top:0px">
          <div class="month">Jan</div>
          <div class="day">1<span style="font-size:0.6em;">st</span><div class="year">1992</div>
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
        <p>Go to <b><i class="fa fa-user"></i> ${name}</b> &gt; <b><i class="fa fa-file-text"></i> Blog</b> &gt; <b><i class="fa fa-pencil"></i> New Blog Post</b> to create one.</p>
        <br><br>Or click <div class="button-group"><a href="/manage_user/edit_blog_post" class="styled_button button-icon-only styled_button_white"><i class="fa fa-pencil"></i></a></div> to create one now and start talking!
    </div>
    <div class="information_box">
        <a href="/user/${urlSafe(name)}"><b>${name}</b></a> <b class="dot">·</b> 0 views <b>·</b>
    </div>
</div>`);
}
function addExtraToolbarLinks(e) {
  if (e.event.type == 'stories') {
    var ref = document.querySelector('#user_toolbar_story_list a[href^="/user/"]').parentNode;
    var link = ref.cloneNode(true);
    ref.parentNode.insertBefore(link, ref.nextSibling);
    link = link.querySelector('a');
    link.href = `/user/${getUserId()}/${getUserName()}/stories?q=bookshelf%3A1&order=latest`;
    link.innerHTML = '<i class="fa fa-star-o"></i>View My Featured Stories';
  }
}
//-------------------------------------STYLESHEETS-------------------------------------------------
function addCss() {
  const light = currentTheme() == 'light';
  const container_background = light ? '#fff' : '#29313f',
        container_foreground = light ? '#333' : '#a3abc3',
        container_border_base = light ? '#bebab5' : '#333d4f',
        container_border_highlight = light ? '#d6d2cb' : '#333d4f',
        container_subtext_foreground = light ? '#888' : '#7a829a',
        new_item_highlight_background = light ? '#fffbe0' : '#214171',
        chapter_footer_background = light ? '#efefef' : '#303949',
        chapter_message_background = light ? '#f6f6f6' : chapter_footer_background,
        chapter_options_button_background = light ? '#fff' : '#29313f',
        chapter_border_top = light ? '#ddd' : '#384356',
        chapter_border_left = light ? 'rgba(0,0,0,0.3)' : '#46536b',
        chapter_border_bottom = light ? 'rgba(0,0,0,0.15)' : chapter_border_top,
        chapter_highlight_background = light ? 'rgb(48, 250, 255)' : '#29497b',
        feature_selected_background = light ? '#ccc' : '#232a36',
        gradient_highlight = light ? '255,255,255' : '44,53,68',
        bookshelf_item_foreground = light ? '#777' : '#afceff',
        emoji_input_background = light ? '#fff' : '#252c39',
        emoji_input_foreground = light ? '#333' : '#a3abc3',
        emoji_input_shadow = 'rgba(0,0,0,0.1)',
        emoji_input_border = light ? '#aaa' : '#333d4f',
        emoji_header_background_min = light ? '#f8f8f8' : '#232a36',
        emoji_header_background_max = light ? '#f2f2f2' : '#333a46',
        emoji_header_border = light ? '#ddd' : container_border_base,
        emoji_focus_background = light ? '#eee' : '#336',
        color_section_background = light ? emoji_focus_background : '#5d3a7d',
        color_section_foreground = light ? '#555' : '#c6c6ff',
        color_section_border = light ? '#ccc' : '#5824ae';

  updateStyle(`
/*Footer overflow fix*/
div.footer { height: auto !important;}

/*Fix bleeding corners on dropdown menus*/
.user_toolbar > ul > li ul li:last-child a i { border-bottom-left-radius: 4px;}

/*Textarea fix*/
textarea[required] { box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.07) inset;}

/*Dark Theme fix*/
.user_toolbar > ul > li ul li ul ~ a::before {color: inherit !important;}

/*Bookshelf z-index fix*/
.story-top-toolbar .bookshelves li.selected {
    z-index: 0 !important;
}

/*Background-gradient fix*/
[fimfic_adv*=background] .topbar-shadow div.light-gradient {
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(${gradient_highlight},0)), color-stop(80px, rgba(${gradient_highlight},0.5))) !important;
    background: -webkit-linear-gradient(left, rgba(${gradient_highlight},0) 0%, rgba(${gradient_highlight},0.5) 80px) !important;
    background: linear-gradient(to right, rgba(${gradient_highlight},0) 0%, rgba(${gradient_highlight},0.5) 80px) !important;}
[fimfic_adv*=background] .topbar-shadow div.light-gradient::before {
    background: rgba(${gradient_highlight},0.5) !important;
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(${gradient_highlight},0.5)), color-stop(80px, rgba(${gradient_highlight},0))) !important;
    background: -webkit-linear-gradient(left, rgba(${gradient_highlight},0.5) 0%, rgba(${gradient_highlight},0) 80px) !important;
    background: linear-gradient(to right, rgba(${gradient_highlight},0.5) 0%, rgba(${gradient_highlight},0) 80px) !important;}
[fimfic_adv*=background] .sidebar-shadow div.light-gradient {
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(${gradient_highlight},0)), color-stop(80px, rgba(${gradient_highlight},0.5))) !important;
    background: -webkit-linear-gradient(top, rgba(${gradient_highlight},0) 0%, rgba(${gradient_highlight},0.5) 80px) !important;
    background: linear-gradient(to bottom, rgba(${gradient_highlight},0) 0%, rgba(${gradient_highlight},0.5) 80px) !important;}
[fimfic_adv*=background] .sidebar-shadow div.light-gradient::before {
    background: rgba(${gradient_highlight},0.5) !important;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(${gradient_highlight},0.5)), color-stop(80px, rgba(${gradient_highlight},0))) !important;
    background: -webkit-linear-gradient(top, rgba(${gradient_highlight},0.5) 0%, rgba(${gradient_highlight},0) 80px) !important;
    background: linear-gradient(to bottom, rgba(${gradient_highlight},0.5) 0%, rgba(${gradient_highlight},0) 80px) !important;}

/*Userpage modules fix (until knighty decides what he wants to do)*/
#user_page_editing_toolbar .modules {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;}
#user_page_editing_toolbar .modules li i {
    font-size: 30px;
    line-height: 35px;
      float: left;}
#user_page_editing_toolbar .modules li {
    flex-grow: 1;
    vertical-align: middle;
    margin: 0 5px;}
#user_page_editing_toolbar .modules li a {
    width: 100%;
    min-height: 60px;}

${light ? '' : `
/*Relight the belle*/
#belle svg {filter: hue-rotate(-250deg);}

/*Night mode controls*/
.toggleable-switch input:checked + a::before {color: #7dbd3a;}
.toggleable-switch a::before {
    background: #2a4494;
    border: 1px solid #32529e;
    color: #efb7b7;
    text-shadow: 1px 1px #32529e;}

.toggleable-radio {
    border: 1px solid #0a0d10;
    background: #1a2029;}
.toggleable-radio label {
    color: #fff;
    text-shadow: 1px 1px #191e27;
    border-right: 1px solid #0a0d10;}
.toggleable-radio label:hover {background: #000;}

/*fix loader colours in dark mode*/
.nav_bar .nav-bar-list > li > ul ul.loading::after, .nav_bar .nav-bar-list > li .nav-bar-drop-down ul.loading::after {
  color: inherit !important;
}`}

/*Bookshelf icon colour fix*/
.story-top-toolbar .bookshelves li:not(:hover) .bookshelf-icon-pony-emoji {
  color: ${bookshelf_item_foreground} !important;}
.user_toolbar > ul > li ul li:hover > a .bookshelf-icon-element span {
  color: #fff !important;}

/*Start Enhancements*/

/*Better Story Feeds*/
.off .on, .on .off {display: none;}
#mark-read-button.on::after {content: attr(data-count);}

.feed .feed_item.new {
  background: ${new_item_highlight_background};}
.feed > li.feed_item.new .arrow .inner_arrow {
  border-right: 12px solid ${new_item_highlight_background};}

.feed .simple {display: none;}
.simplified .feed .complex {display: none;}
.simplified .feed .simple {display: inline;}
.simplified .feed > li .feed_body ul.group_stories li::before {
  font-family: "fontawesome";
  content: "\\f02d";
  margin-right: 0.5em;
  color: #888;}
.simplified .feed > li .feed_body ul.group_stories li .folders {padding-left: 20px;}
.simplified .feed > li .feed_body ul.group_stories li .folders a::before {
  display: inline-block;
  font-family: "fontawesome";
  content: "\\f07b";
  margin: 0 0.3em;
  color: #888;}
.simplified .feed > li .feed_body ul.group_stories li .folders a:hover::before {text-decoration: none !important;}

.feed .feed_item::before {
  border-radius: 3px;
  height: auto;
  bottom: 1px;
  width: 7px;
}

/*Faster Compression (kinda)*/
.compressed .feed_item:not(.expanded) {
  font-size:.9375rem;
  margin-bottom:5px;
  border-radius:3px;
  padding:10px
}
.compressed .feed_item:not(.expanded) .feed_body,
.compressed .feed_item:not(.expanded) .comment_count,
.compressed .feed_item:not(.expanded) .arrow,
.compressed .feed_item:not(.expanded) .avatar {
  display:none;
}
.compressed .feed_item:not(.expanded) .feed_header {
  padding-bottom:0;
  border:none
}
.compressed .feed_item:not(.expanded) .feed_header .date {
  top:10px
}
.compressed .feed_item:not(.expanded) .feed_header i {
  font-size:18px
}
.compressed .feed_item:not(.expanded) .feed_header a.title {
  font-size:inherit;
  font-family:"Open Sans",Arial,Sans-serif
}

/*Differentiate blog posts*/
.distinguish .feed > li.feed_group_item .avatar {
    left: auto;
    right: -90px;}
.distinguish .feed > li.feed_group_item .arrow {
    border-left: 11px solid #d6d2cb;
    border-right: 11px solid transparent;
    left: auto;
    right: -24px;}
.distinguish .feed > li.feed_group_item .arrow .inner_arrow {
    border-right: 12px solid transparent;
    border-left: 12px solid #fff;
    left: -13px;}
.distinguish .feed > li.feed_group_item.new .arrow .inner_arrow {
  border-left: 12px solid #fffbe0;}

/*Inline checkboxes*/
.check-group li label input, .check-group li label input ~ i {
  display: none;
}
.check-group li label {
  display: block;
  position: relative;
}
.check-group li label input:checked ~ i {
  position: absolute;
  top: 50%;
  right: 5px;
  display: inline-block;
  line-height: 0;
}

/*Modernised source links*/
.story_container .story_container__story_image { overflow: hidden;}
.story_container .story_container__story_image .source {
  display: block !important;
  background: ${container_background} !important;
  color: ${container_foreground} !important;
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

${adsController.getFixAds() ? `
/*Remove annoyances*/
.chapter-page .advert {display: none !important;}

/*ins, .pw-ad-box, .ad-wrapped ins + div {display: none !important;}*/
.ad-wrapper ins, .ad-wrapper .pw-ad-box {display: block !important;}
@media all and (max-width: 700px) {
  .ad-wrapper.pw {display:none;}
}
.ad-wrapper {
  text-align: center;
  overflow: hidden;
  line-height: 1.4em;
}
.ad-wrapper.collapse {
  height: 0;
}
.ad-wrapper [data-click="hideAdvert"] {
  display: inline-block;
  margin-top:-10px;
  margin-bottom:10px;
}` : ''}

/*Make the emoticon picker not look like plot*/
.format-toolbar .emoji-selector .emoji-selector__search {
  background: none !important;
  padding: 3px !important;
  box-shadow: none;}
.emoji-selector__search input {
  width: 100%;
  margin: 0;
  padding: 5px;
  border-radius: 4px;
  background: ${emoji_input_background};
  color: ${emoji_input_foreground};
  box-shadow: inset 0 0 5px 3px ${emoji_input_shadow};
  border: solid 1px ${emoji_input_border};}
.format-toolbar .emoji-selector .emoji-selector__tabs,
.format-toolbar .emoji-selector .emoji-selector__list > li.emoji-selector__header {
  border-bottom: 1px solid ${emoji_header_border};
  border-top: 1px solid ${emoji_header_border};
  background: ${emoji_header_background_min} !important;
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, ${emoji_header_background_min}), color-stop(100%, ${emoji_header_background_max})) !important;
  background: -webkit-linear-gradient(top, ${emoji_header_background_min} 0%, ${emoji_header_background_max} 100%) !important;
  background: linear-gradient(to bottom, ${emoji_header_background_min} 0%, ${emoji_header_background_max} 100%) !important;}
.format-toolbar .emoji-selector .emoji-selector__tabs li {
  background: none !important;
  box-shadow: none;}
.format-toolbar .emoji-selector .emoji-selector__tabs li:hover,
.format-toolbar .emoji-selector .emoji-selector__tabs li.selected {
  background: rgba(0,0,0,0.1) !important;}
.format-toolbar .emoji-selector .emoji-selector__list > li:hover {
    background: ${emoji_focus_background};
    border-radius: 4px;
    box-shadow: 0 0 0 3px ${emoji_focus_background};
}

.format-toolbar .emoji-selector .emoji-selector__list > li {
  margin: 4px;
  vertical-align: middle;}
.format-toolbar .emoji-selector .emoji-selector__list > li:hover {
  border-radius: 100% !important;}
.format-toolbar .emoji-selector .emoji-selector__list > li.emoji-selector__header:hover {
  border-radius: 0 !important;}
/*Center pony emoticon images vertically*/
.format-toolbar .emoji-selector .emoji-selector__list > li a {height: 36px;}
.format-toolbar .emoji-selector .emoji-selector__list > li img {margin-top: 5px;}

.story-page-header > .inner h1 a, .user-page-header > .inner h1 a:hover {text-decoration: none;}

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
.user_cp .tabs ul li.tab_selected {background: rgba(120,120,120,0.1) !important;}

/*I'll have non'a that shit*/
.bbcode hr::after, .article hr::after { display: none !important; }

/*Now with 20% less cancer*/
.no-lightbox [data-lightbox] { cursor: default !important; }
.user_image_no_lightbox {
    max-width: 100%;
    max-height: 600px;
    border: 0;}

/*Clean up the featured box*/
.front_page .featured_box .left ul li.selected {background: ${feature_selected_background} !important;}
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
    border-right-color: ${container_background};}
.front_page .featured_box .left ul li.selected::before {
    top: -1px;
    border-width: 15px;
    border-right-color: ${chapter_border_left};}

/*Global Styles*/
.ffa-hidden {display: none !important;}
.ffa-left {float: left;}
.ffa-right {float: right}

/*Chapter Enhancements*/
.chapter-options-header {
    text-align: justify;
    overflow: hidden;
    padding-right: 20px !important;
    margin-top: 1.0rem;
    background-color: ${chapter_footer_background};
    position: relative;
    padding: 10px;
    padding-left: 16px;
    padding-right: 100px;
    border-top: 1px solid ${chapter_border_top};
    font-size: 0.9em;}
.chapter-options-header a {
    display: inline-block;
    color: ${container_foreground};
    background: ${chapter_options_button_background};
    font-size: .8125rem;
    font-weight: normal;
    padding: 3px 8px;
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    text-align: center;
    line-height: 16px;
    margin-left: 5px;}
.chapter-options-header a:hover {
    background: #258bd4;
    color: #fff;
    text-decoration: none;}
.all-chapters-hidden {
    position: relative;
    padding: 10px;
    padding-left: 16px;
    padding-right: 100px;
    background-color: ${chapter_message_background};
    color: ${container_subtext_foreground};
    border-top: 1px solid ${chapter_border_top};
    border-bottom: 1px solid ${chapter_border_bottom};
    font-size: .9375rem;
    text-align: center;}
.all-chapters-hidden,
.chapters_compact a.compact .off, a.compact .on {display: none;}
.chapters_compact a.compact .on, a.compact .off {display: inline;}
.chapters_compact .all-chapters-hidden {display: block;}
.story_container .chapters > li.chapter-highlighted {
    background: ${chapter_highlight_background};
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
    color: ${color_section_foreground};
    background: ${color_section_background};
    line-height: 1.7em;
    border-bottom: 1px solid ${color_section_border};
    padding: 5px 10px;
    margin: 1px;}
.collapsable {cursor: pointer;}
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
    box-shadow: 0 0 1px #000, 0 0 0px 1px rgba(155,155,255,0.5) inset;}
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
    top: 0 !important;
    left: 150% !important;
    right: auto !important;}
.drop-down li:hover > .drop-down {display: block !important;}
.drop-down .drop-down + a::after {
    font-family: 'FontAwesome';
    display: inline-block;
    content: '';
    font-size: 0.6em;
    float: right;}
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

a.premade_settings.custom_banner_button {
  width: 100%;
  text-align: center;
  background-size: 100%;
}
a.premade_settings.custom_banner_button .toolbar {
  color: black;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.15);
}

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
.user-card .top-info > .button-group::after {
    right: 19px;
    top: 29px;
    border: 1px solid #222;
    border-radius: 5px;}
.user-card .top-info .button:first-child {border-top-left-radius: 5px;}
.user-card .top-info .drop-down-expander.button {
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
}
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

${ponyThemes()}
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
    background: ${container_background};
    margin: 5px;
    padding-left: 5px;
    border: solid 1px ${container_border_base};
    border-top-color: ${container_border_highlight};
    border-left-color: ${container_border_highlight};
    border-radius: 5px;}

.left-tabs {
    padding-left: 0px !important;
    padding-right: 10px;}
.left-tabs + div {
    padding-right: 0px !important;
    padding-left: 30px;}
.left-tabs > .sidebar-shadow {left: 220px !important;}

.authors-note:before {
    content: '';
    font-family: FontAwesome;}
.chapter-container .bbcode {
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: ${storyBoxController.getWidth()};}

.fix_feed .feed-toolbar {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 10;
    transition: background-color 0.3s linear;
    background-color: rgba(0,0,0,0.6);}
.fix_feed .content > .content_background > .inner {margin-top: 55px;}

.banner-credits {
    vertical-align: top;
    display: inline-block;
    width: 100%;
    padding-bottom: 100px;
    transition: all 0.5s ease;
    transform: translate(0%,0);}
.banner-credits .banner {
    border: 1px solid rgba(0,0,0,0.4);
    background-position: center;
    height: 173px;
    cursor: pointer;
    border-bottom: none;
  position: relative;}
.banner-credits input {display: none;}
.banner-credits .source a {color: inherit;}
.banner-credits .source {
    padding: 5px;
    min-height: 33px;
    color: #eee;}
.banner-credits input + label .banner::before {
    content: '';
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: 1px;
    right: 1px;
    outline: solid 1px #333;
    transition: outline 0.5s ease;
    mix-blend-mode: color-dodge;}
.banner-credits input:checked + label .banner::before {
    top: 10px;
    bottom: 10px;
    left: 10px;
    right: 10px;
    outline: solid 10px #888;
}
.banner-credits input:checked + label .banner::after {
    content: '\\f00c';
    font-family: 'FontAwesome';
    position: absolute;
    top: 10px;
    left: 10px;
    background: #888;
    padding: 5px;
    border-radius: 0 0 10px 0;
    mix-blend-mode: color-dodge;}

#banner-archive .main {
  padding: 15px;
  line-height: 1.8em;
}

#banner-selector {
    vertical-align: top;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: height 0.5s ease;
}
#banner-selector > .content_box {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
}
#banner-selector .theme .banner {
  background-size: cover !important;
}

#banner-switcher {
  display: block;
  text-align: center;
  height: 50px;
}
#banner-switcher .inner {
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
    color: #fff;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.1);
    font-weight: bold;}
.fix_switcher #banner-switcher {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 600;
    transition: background-color 0.3s linear;
    background-color: rgba(0,0,0,0.6);}
.fix_switcher #banner-switcher + form {
    margin-top: 50px;}

@media all and (min-width: 700px) {
  .pin_nav_bar.fix_switcher #banner-switcher,
  .pin_nav_bar.fix_feed .feed-toolbar {top: 90px;}
}`, "FFA_Stylesheet");
}
function addBannerCss() {
    const light = currentTheme() == 'light';
    updateStyle(`
@media all and (min-width: 700px) {
  .pin_userbar #main_banner {
    position: sticky;
    top: -150px;
    z-index: 10;
  }
  .pin_userbar #main_banner[data-userpage] {top: -210px;}
  .pin_userbar.pin_nav_bar #main_banner {top: -115px;}
  .pin_userbar.pin_nav_bar #main_banner[data-userpage] {top: -180px;}

  .pin_userbar.titleHidden #main_banner {top: -40px;}
  .pin_userbar.titleHidden #main_banner[data-userpage] {top: -110px;}
  .pin_userbar.pin_nav_bar.titleHidden #main_banner {top: 10px;}
  .pin_userbar.pin_nav_bar.titleHidden #main_banner[data-userpage] {top: -60px;}

  .pin_nav_bar.fix_switcher #banner-switcher,
  .pin_nav_bar.fix_feed .feed-toolbar {top: 45px;}

  .pin_userbar.fix_switcher #banner-switcher,
  .pin_userbar.fix_feed .feed-toolbar {top: 50px;}

  .pin_nav_bar.pin_userbar.fix_switcher #banner-switcher,
  .pin_nav_bar.pin_userbar.fix_feed .feed-toolbar {top: 90px;}

  .pin_nav_bar #chapter_toolbar_container[data-fixed] {top: 3rem;}
  .pin_userbar #chapter_toolbar_container[data-fixed] {top: 2.7rem;}
  .pin_nav_bar.pin_userbar #chapter_toolbar_container[data-fixed] {top: 5.5875rem !important;}
}

.titleHidden #title {height: 80px !important;}
.titleHidden .user-page-header ~ .user_toolbar > ul,
.titleHidden .story-page-header ~ .user_toolbar > ul {padding-left: 11.5rem;}
.titleHidden header.header .theme_selector {line-height: 75px !important;}

.pin_nav_bar.pin_userbar .user_toolbar > ul {
  padding-left: 9.5rem;
}

.pin_userbar #pin_userbar .pin_link {
  opacity: 1 !important;
}
body:not(.pin_userbar) #pin_userbar .pin_link {
  opacity: 0.5 !important;
}

/*Banner preload*/
#imagePreload {
  position:absolute;
  overflow:hidden;
  width:0;
  height:0;
  top:-1px;
  left:-1px;
}

/*Banners*/
.nav_bar .logo {
    height: 5rem;
    margin-top: 0;
    margin-right: -20px;
    z-index: 100;
    position: relative;}
.nav_bar .logo.tiny-logo {
    max-height: 32px;
    vertical-align: -10px;}

header.header {
  position: relative;
}
header.header .title {
  height: 203px;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: none ! important;
}
header.header::after {
  display: block;
  position: absolute;
  content: " ";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-top: solid 1px #222;
  border-bottom: solid 1px #222;
  mix-blend-mode: color-dodge;
  pointer-events: none;
  z-index: 10;
}
header.header .home_link {
  display: block;
  position: absolute;
  overflow: hidden;
  right: 0px;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-position: center;
}

/*Banner Theming*/
body {
  --banner-bar-gradient-start: transparent;
  --banner-bar-gradient-end: black;
}

#main_banner .user_toolbar {
  background: linear-gradient(to bottom, var(--banner-bar-gradient-start) 0%, var(--banner-bar-gradient-end) 85%);
}

@media all and (max-width: 1000px) {
    header.header .home_link { background-position: -150px center; }
}
header.header .home_link div {
  position: absolute;
  left: 50%;
}
@media all and (max-width: 1000px) {
    header.header .home_link div { left: 500px; }
}
header.header .home_link div img {
  margin-left: -500px;
}
header.header .home_link_link {
  display: block;
  position: absolute;
  z-index: 10;
  right: 0px;
  left: 0px;
  top: 0px;
  bottom: 0px;
}
header.header .banner-buttons {
  position: absolute; z-index: 30;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
  right: 64px;
  bottom: 10px;
}
header.header .banner-buttons a {
  text-shadow: 1px 1px rgba(0,0,0,0.3);
  color: #fff;
  font-size: 0.7rem;
  padding: 5px 10px;
  text-decoration: none;
  border-radius: 3px;
  font-family: "Open Sans",Arial,sans-serif;
  font-weight: 600;
  font-style: normal;
  text-transform: uppercase;
}
header.header .banner-buttons a:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
@media all and (max-width: 950px) {
  header.header .banner-buttons {bottom: 30px;}
}
header.header .theme_selector {
  position: absolute;
  width: 120px;
  height: 100%;
  z-index: 11;
  transition: background 0.3s ease 0s, opacity 0.3s ease 0s;
  background: transparent linear-gradient(to right, transparent 0%, transparent 100%) repeat scroll 0% 0%;
  color: #fff;
  opacity: 0;
  line-height: 195px;
  text-decoration: none;
  text-shadow: 1px 1px rgba(0,0,0,0.3);
  font-size: 32px;
  padding: 0 10px;
  outline: 0 !important;}
header.header:hover .theme_selector,
header.header:hover .banner-buttons {
  visibility: visible;
  opacity: 1;
}
header.header .theme_selector::before {font-family: "FontAwesome";}
header.header .theme_selector_left::before { content: ""; }
header.header .theme_selector_right::before { content: ""; }

header.header .theme_selector_left { left: 0; }
header.header .theme_selector_right {
  right: 0;
  text-align: right;
}

header.header .theme_selector_left:hover {
  background: transparent linear-gradient(to right, rgba(0, 0, 0, 0.3) 0%, transparent 100%) repeat scroll 0% 0%;
}
header.header .theme_selector_right:hover {
  background: transparent linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.3) 100%) repeat scroll 0% 0%;
}

${light ? '' : `
.user_toolbar > ul > li ul {
  background-color: ${toRgb(toComponents(bannerController.getSelected().colour).map((i, k) => k < 3 ? i / 4 : 0.95))};
}
`}

@media all and (max-width: 700px) {
    header.header { width: 100%; }
    header.header .title { display: none ! important; }}
@media all and (min-width: 701px) {
    header.header .title {display: block !important;}}
@media all and (min-width: 700px) {
    .user-page-header ~ header.header .theme_selector,
    .story-page-header ~ header.header .theme_selector {
        line-height: 275px;}
    header.header .title {
        transition: height 0.5s ease;}
    .user-page-header:hover ~  header.header .title,
    .story-page-header:hover ~ header.header .title {
        transition: height 0.2s 0.3s ease !important;}
    .user-page-header ~ header.header .home_link img,
    .story-page-header ~ header.header .home_link img {display: none;}
    .user_toolbar {
        background: -webkit-gradient(linear, left top, left bottom, rgba(60, 106, 179, 0), #3a66ac);
        background: -webkit-linear-gradient(top, rgba(60, 106, 179, 0) 0%, #3a66ac 85%);
        background: linear-gradient(to bottom, rgba(60, 106, 179, 0) 0%, #3a66ac 85%);
        margin-top: -54px;
        box-shadow: none;
        position: relative;
        border-bottom: solid 1px rgba(0, 0, 0, 0.2);}
    .user_toolbar > ul > li {
        margin-top: 10px;
        z-index: 10;
        text-shadow: 1px 1px rgba(0,0,0,0.3);
        color: #fff;}
     header.header .title {
        overflow: hidden;
        background-color: #1c1c1ce6;}
    .banner-transitionable .user_toolbar {
        transition: background-color 0.25s linear;}
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
    header.header .home_link {
        height: 195px;
        background-size: cover !important;}
    #fade_banner_image {
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        transition: opacity 0.35s linear;
        opacity: 0;
    }
    #fade_banner_image.animating {
        transition: none;
        opacity: 1;
    }
}

@media(max-width: 800px) {
  .user_toolbar > ul {padding-left: 1.7rem;}
}
@media all and (max-width: 700px) {
  .user-page-header, .story-page-header {box-shadow: none;}
}
@media all and (max-width: 950px) {
  .titleHidden .user-page-header ~ .user_toolbar > ul, .titleHidden .story-page-header ~ .user_toolbar > ul {padding-left: 7.5rem;}
}
@media all and (max-width: 850px) {
  .titleHidden .user-page-header ~ .user_toolbar > ul, .titleHidden .story-page-header ~ .user_toolbar > ul {padding-left: 2rem;}
}
@media all and (min-width: 700px) {
  .user-page-header, .story-page-header {
        height: 70px;
        transition: height 0.5s ease;
        border: none;
        box-shadow: none;}
  .user-page-header .info-container, .story-page-header .info-container {
        overflow: hidden;
        height: 70px;
        transition: height 0.5s ease;}
  .story-page-header > .inner, .user-page-header > .inner {
        display: flex;
        padding: 25px 0px 25px 15px;}
  .user-page-header .avatar-container, .story-page-header .image-container {
        width: auto !important;
        position: relative !important;
        z-index: 13 !important;}
  .user-page-header .patreon-sponsor, .user-page-header .subscribe-star-sponsor {
        float: none !important;
        margin-top: 10px;
        display: inline-block;
        vertical-align: top;}
  .story-page-header {overflow: visible !important;}
  .user-page-header .edit-link,
  .user-page-header .tabs li a, .user-page-header .tabs li a:before, .user-page-header .tabs li a span {
        color: #ccc !important;
        text-shadow: none !important;}
  .user-page-header .tabs li a::after {
        display: none;}
  .user-page-header .edit-link,
  .user-page-header .tabs li a {
        transition: background 0.5s ease;
        border-radius: 4px;
        margin: 2px !important;
        background: #404040 !important;
        box-shadow: 0px 1px #555 inset !important;
        border: 1px solid #222 !important;
        text-shadow: -1px -1px rgba(0, 0, 0, 0.2) !important;}
  .user-page-header .tabs li a:hover {background: #353535 !important;}
  .user-page-header .bio form input {
        color: #d1d1d1;
        background: #222;
        border-color: #555;
        text-shadow: 1px 1px rgba(101, 101, 101, 0.8);}
}

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
    padding: 15px 0px !important;}
.user-page-header .tabs li.selected a::after {display: none !important;}
.user-page-header .tabs li.selected a {z-index: 0 !important;}
`, 'FFA_Banner_Stylesheet');
}
function makeBannerTransitionStyle(height) {
  updateStyle(`
@media all and (min-width: 700px) {
    .user-page-header:hover ~  header.header .title, .story-page-header:hover ~ header.header .title { height: 55px;}
    .user-page-header:hover, .story-page-header:hover,
    .user-page-header:hover .info-container, .story-page-header:hover .info-container {
        transition: height 0.5s 0.6s ease;
        height: ${height}px;}}`, 'FFA_Banner_Transition_Stylesheet');
}
function ponyThemes() {
  return `
/*Pinkie Pie*/
.content_format_pinkie .chapter {
  background-color: #f9b8d2 !important;
  color: #c01b75 !important;
}
.content_format_pinkie .chapter p {
  padding:10px;
  background-color:#c01b75 !important;
  color:#fff !important;
  margin-top:0px;
  padding-top:10px;
  padding-bottom:10px;
}
select[name="colour_scheme"] option[value="pinkie"] {
    background: #f9b8d2;
    color: #c01b75;
}
/*Twilight Sparkle*/
.content_format_twilight .chapter {
 background-color: #d4a4e8 !important;
 color: #273771 !important;
}
select[name="colour_scheme"] option[value="twilight"] {
 background: #d4a4e8;
 color: #273771;
}
.content_format_twilight .chapter p {
 padding:10px;
 background-color:#273771 !important;
 color:#b9c3e9 !important;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px;
}
.content_format_twilight .chapter p:nth-child(6n+3) {
 background-color:#622e86 !important;
 color:#e0c5f2 !important
}
.content_format_twilight .chapter p:nth-child(6n+4) {
 background-color:#e6458b !important;
 color:#f2cddd !important;
}
/*Applejack*/
.content_format_applejack .chapter {
 background-color: #f5efb3 !important;
 color: #ea403f !important;
}
select[name="colour_scheme"] option[value="applejack"] {
 background: #f5efb3;
 color: #ea403f;
}
.content_format_applejack .chapter p {
 padding:10px;
 background-color:#ea403f !important;
 color:#fff !important;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px
}
/*Rainbow Dash*/
.content_format_dash .chapter {
 background-color: #9dd9f8 !important;
 color: #285c85 !important;
}
select[name="colour_scheme"] option[value="dash"] {
 background: #9dd9f8;
 color: #285c85;
}
.content_format_dash .chapter p {
 padding:10px;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px
}
.content_format_dash .chapter p:nth-child(6n+1) {
 background-color:#ee4144 !important;
 color:#fff !important
}
.content_format_dash .chapter p:nth-child(6n+2) {
 background-color:#f37033 !important;
 color:#fff !important
}
.content_format_dash .chapter p:nth-child(6n+3) {
 background-color:#fdf6af !important;
 color:#1e98d3 !important
}
.content_format_dash .chapter p:nth-child(6n+4) {
 background-color:#62bc4d !important;
 color:#fff !important
}
.content_format_dash .chapter p:nth-child(6n+5) {
 background-color:#1e98d3 !important;
 color:#fff !important
}
.content_format_dash .chapter p:nth-child(6n+6) {
 background-color:#672f89 !important;
 color:#fff !important
}
/*Rarity*/
.content_format_rarity .chapter {
 background-color: #d0c9f3 !important;
 color: #4b1566 !important;
}
select[name="colour_scheme"] option[value="rarity"] {
 background: #d0c9f3;
 color: #4b1566;
}
.content_format_rarity .chapter p {
 padding:10px;
 background-color:#5e51a3 !important;
 color:#f0f2f3 !important;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px
}
/*Fluttershy*/
.content_format_fluttershy .chapter {
 background-color: #fff9b0 !important;
 color: #a98300 !important;
}
select[name="colour_scheme"] option[value="fluttershy"] {
 background: #fff9b0;
 color: #a98300;
}
.content_format_fluttershy .chapter p {
 padding:10px;
 background-color:#e77db3 !important;
 color:#fff !important;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px
}
/*Celestia*/
@-webkit-keyframes celestia-hair {
 0%, 100% {left:-20px}
 50% {left:20px}
}
@keyframes celestia-hair {
 0%, 100% {left:-20px}
 50% {left:20px}
}
.content_format_celestia .chapter {
 background-color:#fff !important;
 color:#444 !important
}
.content_format_celestia .chapter p {
 padding:10px;
 margin-top:0px;
 padding-top:10px;
 padding-bottom:10px;
 position:relative;
 -webkit-animation:celestia-hair 4s infinite;
 animation:celestia-hair 4s infinite;
 -webkit-animation-timing-function:cubic-bezier(0.445, 0.05, 0.55, 0.95);
 animation-timing-function:cubic-bezier(0.445, 0.05, 0.55, 0.95)
}
select[name="colour_scheme"] option[value="celestia"] {
 background: #50c8a1;
 color: #105C43;
}
.content_format_celestia .chapter p:nth-child(3n+1) {
 background-color: #50c8a1 !important;
 color: #105C43 !important
}
.content_format_celestia .chapter p:nth-child(3n+2) {
 background-color:#80a5eb !important;
 color:#193261 !important
}
.content_format_celestia .chapter p:nth-child(3n+3) {
 background-color:#e098f2 !important;
 color:#42194D !important
}
.content_format_celestia .chapter p:nth-child(10n+2) {
 -webkit-animation-delay:-0.8s;
 animation-delay:-0.8s
}
.content_format_celestia .chapter p:nth-child(10n+3) {
 -webkit-animation-delay:-1.2s;
 animation-delay:-1.2s
}
.content_format_celestia .chapter p:nth-child(10n+4) {
 -webkit-animation-delay:-1.6s;
 animation-delay:-1.6s
}
.content_format_celestia .chapter p:nth-child(10n+5) {
 -webkit-animation-delay:-2s;
 animation-delay:-2s
}
.content_format_celestia .chapter p:nth-child(10n+6) {
 -webkit-animation-delay:-2.4s;
 animation-delay:-2.4s
}
.content_format_celestia .chapter p:nth-child(10n+7) {
 -webkit-animation-delay:-2.8s;
 animation-delay:-2.8s
}
.content_format_celestia .chapter p:nth-child(10n+8) {
 -webkit-animation-delay:-3.2s;
 animation-delay:-3.2s
}
.content_format_celestia .chapter p:nth-child(10n+9) {
 -webkit-animation-delay:-3.6s;
 animation-delay:-3.6s
}
.content_format_celestia .chapter p:nth-child(10n+10) {
 -webkit-animation-delay:-4s;
 animation-delay:-4s
}
/*Luna*/
@-webkit-keyframes luna {
 0% {background-position:0px 0px}
 100% {background-position:408px 0px}
}
@keyframes luna {
 0% {background-position:0px 0px}
 100% {background-position:408px 0px}
}
.content_format_luna .chapter {
  background-color:#442d6c;
  background-image:url("${GITHUB}/backgrounds/classic_poni_2/luna.png");
  background-attachment:fixed;
  -webkit-animation:luna 20s infinite;
  animation:luna 20s infinite;
  background-position:0px 0px;
  -webkit-animation-timing-function:linear;
  animation-timing-function:linear
}
select[name="colour_scheme"] option[value="luna"] {
 background: #442d6c;
 color: #c4c6e9;
}
.content_format_luna .chapter .chapter-body {
  background:rgba(26,28,69,0.5);
  padding:10px 20px;
  margin-top:0px;
  padding-top:10px;
  padding-bottom:10px;
  color:#c4c6e9;
}
.content_format_luna .chapter .chapter-title {
  border-color:rgba(0,0,0,0.2);
}
.content_format_luna .chapter .chapter-title {
 color:#fff;
}
.content_format_luna .chapter p {
 background:#444784;
 padding:10px 20px;
 margin-top:0px
}
.content_format_luna .chapter p:nth-child(5n) {
 background:#2d3067
}`;
}
//---------------------------------------DATA STRUCTURES--------------------------------------------
function BG(name, css, source, params) {return { able: typeof (name) == 'string', attributes: params || {}, css, name, source };}
function LOGO(name) {return BG(name, GITHUB + '/logos/' + name.replace(/ /g, '_') + '.png');}
function Ban(name, source, color, args) {return Banner(name, GITHUB + '/banners/' + name + (name.indexOf('.') < 0 ? '.jpg' : ''), source.map ? source : [{href: source }], color, args);}
function Ban2(name, sources, color, args) {return Banner(name, GITHUB + '/banners2/' + name + (name.indexOf('.') < 0 ? '.jpg' : ''), sources, color, args);}
function Ban0(name, sources, color, args) {return Banner(name, GITHUB + '/banners0/' + name + (name.indexOf('.') < 0 ? '.jpg' : ''), sources, color, args);}
function Banner(id, url, sources, colour, args) {return {id, url, sources, colour, position: (args && args.position ? Pos(args.position) : null), options:args || {}};}
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
//--------------------------------------UTIL FUNCTIONS-----------------------------------------------
function replaceWith(el, html) {
  el.insertAdjacentHTML('beforebegin', html);
  el.parentNode.removeChild(el);
}
function pinnerFunc(target, clazz, bounder) {
  clazz = `fix_${clazz}`;
  target = document.querySelector(target);
  let pos = -1, attached = false;
  return ev => {
    pos = attached ? pos : target.offsetTop;
    const scroll = ev.scrollY;
    const nattached = (scroll >= pos) && (!bounder || scroll < (bounder.offsetTop + bounder.offsetHeight));
    if (nattached != attached) {
      document.body.classList.toggle(clazz, attached = nattached);
    }
  };
}
function Animator() {
  let lastScroll;
  let listenerCount = 0;
  let callbacks = {};
  let running = false;

  function animate() {
    const scroll = window.scrollY;
    if (scroll != lastScroll) {
      const ev = new Event('animator');
      ev.scrollY = lastScroll = scroll;
      document.dispatchEvent(ev);
    }
    running = listenerCount > 0;
    if (running) requestAnimationFrame(animate);
  }

  return {
    on(type, callback) {
      if (!callbacks[type]) listenerCount++;
      callbacks[type] = callback;
      document.addEventListener('animator', callback);
      listenerCount++;
      if (!running) animate();
    },
    off(type) {
      if (!callbacks[type]) return;
      listenerCount--;
      if (listenerCount <= 0) listenerCount = 0;
      document.removeEventListener('animator', callbacks[type]);
      callbacks[type] = null;
    }
  };
}
//---------------------------------------CONTROLLERS-------------------------------------------------
function StoryBoxController() {
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
  function applyBetterRatingBars() {
    all('.rating-bar > [style]', span => {
      span.parentNode.title = span.style.width;
    });
  }
  return {
    getWidth() {
      const result = settingsMan.get('storyWidth', '100%');
      return parseInt(result) ? result : '100%';
    },
    apply() {
      applyChapterButtons();
      applyBetterRatingBars();
    },
    createOptions(tab) {
      const chapWid = tab.AddTextBox("cwt", "Chapter Width");
      addTooltip("Accepts values in three formats:em, px, and %<br />Eg. 80px, 5em, 100%<br />If no format is specified em will be used<br />Default: 100% (was 46em)", chapWid);
      chapWid.value = this.getWidth();
      chapWid.addEventListener('change', e => {
        let val = parseInt(e.target.value) || 100;
        let form = e.target.value.replace(val.toString(), '');
        if (['em','px','%'].indexOf(form) < 0) form = '%';
        if (form == '%' && val > 100) val = 100;
        e.target.value = val + form;
        settingsMan.set("storyWidth", e.target.value, '100%');
      });
    }
  };
}
function CustomBannerController() {
  function get() {
    if (!(settingsMan.has("customBannerUrl") && settingsMan.has("customBannerColor") && settingsMan.has("customBannerPosition"))) {
      return null;
    }
    const url = settingsMan.get("customBannerUrl", '');
    const position = settingsMan.get("customBannerPosition", '').split(' ');
    position[1] = parseInt(position[1]) || 0;
    position[3] = parseInt(position[3]) || 0;
    return Banner("Custom", url, url, settingsMan.get("customBannerColor", ''), { position });
  }

  return {
    get,
    createOptions(tab) {
      tab.AddPresetSelect("bannerCust", "Custom Banner").add(el => {
        el.children[1].innerHTML = '<i class="fa fa-pencil fa-5x"></i>';
        el.classList.add('custom_banner_button');
        el.addEventListener('click', () => createCustomBannerPopup(el));
        if (customBanner) repaintBannerButton(el, customBanner);

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
              color = toComponents(color);
              upd(row.red, color[0]);
              upd(row.green, color[1]);
              upd(row.blue, color[2]);
              upd(row.alpha, color[3]);
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
              settingsMan.set("customBannerUrl", url);
              settingsMan.set("customBannerColor", color);
              settingsMan.set("customBannerPosition", [hor, x, vert, y].join(' '));

              customBanner = Banner('Custom', url, url, color, { position: [hor, x, vert, y] });
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
              bannerController.slider.animate(() => {
                bannerController.changeBanner(null, url, color, Pos([hor, x, vert, y]));
              });
            }));
            builder.AppendControl(footer, '<button class="styled_button styled_button_red"><i class="fa fa-trash-o"></i>Reset</button>').addEventListener('click', () => {
              settingsMan.remove("customBannerUrl");
              settingsMan.remove("customBannerColor");
              settingsMan.remove("customBannerPosition");

              if (customBannerindex > -1) {
                banners.splice(customBannerindex, 1);
                if (bannerController.getCurrent() == 'Custom') bannerController.pick(-1, true);
                customBannerindex = -1;
              }
              repaintBannerButton(cban, null);
              bannerController.slider.goto(bannerController.getCurrentId(), false);
              pop.Close();
            });
            builder.AppendControl(pop.content.querySelector('.color-selector'), '<button class="styled_button styled_button_blue"><i class="fa fa-camera"></i>Guess from Current</button>').addEventListener('click', () => {
              let color = userToolbar.dataset.backgroundColor || '';
              if (color == '') color = 'rgb(146,27,87)';
              updateFields(color);
            });

            pop.element.querySelector(".close_button").addEventListener('mousedown', () => {
              if (hasPre) bannerController.slider.goto(bannerController.getCurrentId(), false);
            });

            customBanner = get();
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

        function repaintBannerButton(cban, banner) {
          if (banner) {
            cban.children[0].innerHTML = banner.url.split('/').reverse()[0].split('.')[0];
            cban.children[0].style.backgroundColor = banner.colour;
            cban.style.backgroundImage = `url("${banner.url}")`;
            cban.style.backgroundPosition = banner.position;
          } else {
            cban.children[0].innerHTML = '';
            cban.children[0].style.background = '#fff';
            cban.style.backgroundImage = 'none';
          }
        }
      });
    }
  };
}
function CommentSectionController() {
  const getExtraEmotesInit = () => !!document.querySelector('.extraemoticons_loaded');
  const getAlwaysShowImages = () => settingsMan.bool('unspoiler_images', true);
  const getBlockLightbox = () => settingsMan.bool('block_lightbox', false);

  function startCommentHandler() {
    extend(CommentListController.prototype, {
      quoteComment(sender, event) {
        const id = sender.dataset.commentId;
        sender = sender.closest('.comment');
        let bbcode = sender.querySelector('.comment_data.bbcode').cloneNode(true);

        all('.comment', bbcode, a => a.parentNode.removeChild(a));
        all('a[href*="#comment/"]', bbcode, a => a.outerHTML = `>>${a.href.split('/').reverse()[0]}`);

        bbcode = new HTMLToBBCodeRenderer().render(new HTMLConverter().convert(bbcode.innerHTML.trim()));

        let who = sender.querySelector('.author a.name').innerText;
        who = who ? '=' + who.trim() : '';

        const controller = App.GetControllerFromElement(document.querySelector('#add_comment_box .bbcode-editor'));
        const e = `${controller.getText().length ? '\n' : ''}>>${id}\n[quote${who}]\n${bbcode}\n[/quote]\n`;

        controller.insertText(e, !event.ctrlKey && !event.shiftKey);
        event.preventDefault();
        if (!(event.ctrlKey || event.shiftKey)) {
          fQuery.scrollTop(document.getElementById('add_comment_box').getBoundingClientRect().top);
        }
      }
    });

    FimFicEvents.on('afterpagechange aftereditcomment afteraddcomment', () => {
      all('.comment .buttons:not([data-parsed])', me => {
        me.dataset.parsed = '1';
        const id = me.querySelector('[data-comment-id]').dataset.commentId;
        me.insertAdjacentHTML('afterbegin', `<a title="Quote ( hold ctrl to prevent jumping to reply box )" data-click="quoteComment" data-comment-id="${id}">
          <i class="fa fa-fw fa-quote-left"></i><span>Quote</span>
        </a>`);
      });
    })();

    if (!getAlwaysShowImages() || getExtraEmotesInit()) return;

    const unspoil = getAlwaysShowImages() ? me => {
      replaceWith(me.parentNode, `<img class="user_image" data-lightbox src="${me.href}"></img>`);
    } : me => {
      const url = me.href;
      if (!/\?.*isEmote/.test(url)) return;
      me = me.parentNode;
      if (me.nextSibling && me.nextSibling.tagName != 'BR') {
        me.insertAdjacentHTML('afterend', '<br>');
      }
      replaceWith(me, `<img class="user_image" data-lightbox src="${url}"></img>`);
    };

    FimFicEvents.on('afterpagechange aftereditcomment afteraddcomment', () => {
      all('.comment_data a.user_image_link', unspoil);
    })();
  }

  function initLightBoxBlocker() {
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

  function registerCommentButtons(me, recurs) {
    const controller = App.GetControllerFromElement(me);
    if (!recurs && !controller) return requestAnimationFrame(() => registerCommentButtons(me, 1));

    const main_button = makeButton(controller.toolbar.children[0], "More Options", "fa fa-flag");

    me.dataset.fimficadv = '1';
    main_button.dataset.click = 'showFimficAdv';
    registerButton(main_button, controller, -1);
  }

  function initBBCodeController() {
    function getRecentColours(num) {
      const recent = settingsMan.get('colour_use_history', '');
      return recent.length ? ('#' + recent.replace(/;/g,';#')).split(';').reverse().splice(0, num) : [];
    }

    function clearRecentColours() {
      settingsMan.remove('colour_use_history');
    }

    function addRecent(color) {
      let recent = settingsMan.get('colour_use_history', '');
      recent = recent.length ? ('#' + recent.replace(/;/g,';#')).split(';').filter(a => a !== color) : [];
      recent.push(color);
      if (recent.length > 15) recent.splice(0,1);
      settingsMan.set('colour_use_history', recent.join(';').replace(/#/g, ''));
    }

    function registerColourInsertionEvent(controller, holder) {
      addDelegatedEvent(holder, '.colour-tile a', 'click', (e, target) => {
        const t = controller || App.GetControllerFromElement(document.querySelector('.active_text_area').closest('.bbcode-editor'));
        t.insertTags(`[color=${target.dataset.colour}]`, '[/color]');
        addRecent(target.dataset.colour);
        t.textarea.focus();
      });
    }

    function insertColor(controller) {
      const pop = makePopup("Custom Colour", 'fa fa-tint');

      pop.SetWidth(350);
      pop.content.insertAdjacentHTML('beforeend', `<div class="std" style="padding:10px;">
            <div id="color_preview" class="pattern-checkerboard" style="border: 1px solid #aaa;border-radius: 3px;margin-bottom: 10px;padding: 3px;width: 100%;height: 200px;display: flex;" >
                <b>${[30,20,10,5].map(a => `<span style="font-size:${a}px">The quick brown fox jumped over the lazy dog.</span>`).join(' ')}</b>
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

    function initColourWindow(controller, self) {
      all('.active_text_area', me => me.classList.remove('active_text_area'));
      controller.textarea.classList.add('active_text_area');

      const list = makePopup('All Colours', 'fa fa-tint', false, false);
      Object.keys(colours.Sets).forEach(i => {
        addColorSection(list.content, colours.Sets[i][1], i, ` collapsable${colours.Sets[i][0] ? ' collapsed' : ''}`);
      })
      addDelegatedEvent(list.content, '.colour-section-header.collapsable', 'click', (e, target) => target.toggle('collapsed'));

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

    function addColorTiles(colors) {
      return colors.map(c => {
        if (typeof c == 'string') return [c, colours.Mapping[c] || c];
        if (c < 0) return [''];
        return [colours.Keys[c], colours.Names[c] || c]
      }).map((a, c) => a[0] == '' ? '' : `<li class="colour-tile">
                <a title="${a[1]}" data-index="${c}" data-colour="${a[0]}">
                    <span style="background-color:${a[0]} !important" class="color-tile"></span>
                </a>
            </li>`).join('');
    }

    function addColorSection(panel, colors, title, headerExtra) {
      panel.insertAdjacentHTML('beforeend', `<div class="colour-section">
            <div class="colour-section-header${headerExtra || ''}">${title}</div>
            <ul class="colour-holder">${addColorTiles(colors)}</ul>
        </div>`);
      return panel.lastChild;
    }

    function find() {
      const controller = this;
      const pop = makePopup('Find and Replace', 'fa fa-magic', false);
      pop.SetWidth(350);
      pop.SetContent(`<div class="std" style="padding:10px;">
        <input id="find" data-change="reset" type="text" placeholder="Find"></input>
        <input id="replace" type="text" placeholder="Replace"></input>
      </div>`);
      const finder = pop.content.querySelector('#find');
      const replacer = pop.content.querySelector('#replace');
      pop.SetFooter(`<button data-click="find" type="button" class="styled_button">Find</button>
                    <button data-click="replace" type="button" class="styled_button">Replace</button>
                    <button data-click="replaceAll" type="button" class="styled_button">Replace All</button>`);
      addDelegatedEvent(pop.content, '[data-click]', 'click', (e, target) => events[target.dataset.click]());
      addDelegatedEvent(pop.content, '[data-change]', 'change', (e, target) => events[target.dataset.change]());

      let nextStart = 0;
      const events = {
        reset() {
          nextstart = 0;
        },
        find() {
          const find = finder.value;
          if (!find.length) return;
          const text = controller.getText().substring(nextStart, controller.getText().length);
          let start = text.indexOf(find);
          let end = 0;
          if (start < 0) {
            start = controller.getText().indexOf(find);
            nextStart = 0;
          }
          if (start > -1) {
            start += nextStart;
            end = start + find.length;
          }
          controller.textarea.selectionStart = start;
          controller.textarea.selectionEnd = end;
          controller.textarea.focus();
        },
        replace() {
          const find = finder.value;
          if (!find.length) return;
          const text = controller.getText();
          const start = controller.textarea.selectionStart;
          const end = controller.textarea.selectionEnd;
          if (start != end) {
            const replace = replacer.value;

            if (sel == find) {
              controller.setText(text.substring(0, start) + replace + text.substring(end, text.length));
              controller.textarea.selectionStart = start + replace.length;
              controller.textarea.selectionEnd = controller.textarea.selectionStart;
            }
          } else {
            events.find();
            if (controller.textarea.selectionStart != controller.textarea.selectionEnd) {
              events.replace();
            }
          }
          controller.textarea.focus();
        },
        replaceAll: _ => {
          if (finder.value.length) controller.setText(replaceAll(finder.value, replacer.value, controller.getText()));
        }
      };

      pop.Show();
    }

    function showAddDirectImage() {
      this.showAddImage();
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
        this.insertText(`[img]${url}${url.indexOf('?') > -1 ? '&' : '?'}isEmote=true[/img]`);
        form.closest('.drop-down-pop-up-container').querySelector('.close_button').click();
      });
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

    function operateText(controller, func) {
      const element = controller.textarea,
            value = element.value,
            start = element.selectionStart,
            end = element.selectionEnd;

      const top = element.scrollTop;
      const selected = func((end - start) > 0 ? value.substring(start, end).split('\n') : ['']).join('\n');

      element.value = value.substring(0, start) + selected + value.substring(end, value.length);
      element.selectionStart = start;
      element.selectionEnd = start + selected.length;
      element.scrollTop = top;
      element.focus();
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
      addDelegatedEvent(me, 'a[data-headings]', 'click', (e, target) => controller.insertTags(`[size=${target.dataset.size}em][h1]`, '[/h1][/size]'));
      addDelegatedEvent(me, 'a', 'mouseenter', (e, target) => {
        const sz = target.dataset.label;
        const pop = makeToolTip(target);
        pop[0].parentNode.style.margin = '15px 0 0 0';
        pop[0].parentNode.style.padding = '0';
        pop.append(`<div style="font-size: ${target.dataset.size}em !important; line-height:1;min-height:10px;height: ${sz < 10 ? sz < 1 ? 5 : 20 : sz}px;">Ab</div>`);
      });
      addDelegatedEvent(me, 'a', 'mouseleave', (e, target) => target.removeChild(target.childNodes[1]));
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
        addOption(a, "Opacity").dataset.click = 'showOpacityDialogue';
      });
      addOption(items, "Sign").dataset.click = 'sign';
      addOption(items, "Insert Direct Image").dataset.click = 'showAddDirectImage';
      addOption(items, "Find/Replace Text").dataset.click = 'find';
      addOption(items, "Blotter").dataset.click = 'blot';
      inbounds(button);
    }

    extend(BBCodeEditorController.prototype, {
      showColourPicker(sender, event) {
        event.preventDefault();
        betterColours(sender.parentNode, this);
      },
      showSizePicker(sender, event) {
        event.preventDefault();
        if (!sender.parentNode.querySelector('div')) betterSizes(sender, this);
      },
      showFimficAdv(sender, event) {
        if (!sender.parentNode.querySelector('div')) buildAdvancedButton(sender, this);
      },
      showAllColours(sender, event) {
        initColourWindow(this, sender);
      },
      showColourCreator(sender, event) {
        insertColor(this);
      },
      right(sender, event) {
        this.insertTag('right');
      },
      figure(sender, event) {
        this.insertTags(`[figure=${sender.dataset.align}]`, '[/figure]');
      },
      sign(sender, event) {
        this.textarea.value = signatureController.applySignature(this.textarea.value);
      },
      showOpacityDialogue(sender, event) {
        const pop = makePopup('Opacity', 'fa fa-tint');
        pop.SetWidth(400);
        pop.SetContent(`
        <form>
          <div class="std properties">
            <div class="color-selector" style="padding:10px">
              <div class="pattern-checkerboard" style="border: 1px solid #aaa;border-radius: 3px;margin-bottom: 10px;padding: 3px;width: 100%;height: 200px;display: flex;">
                <b id="opacity_preview">
                  ${[30,20,10,5].map(a => `<span style="font-size:${a}px">The quick brown fox jumped over the lazy dog.</span>`).join(' ')}
                </b>
              </div>
              <div class="alpha">
                  <input value="1" type="number" min="0" max="1" step="0.01">
                  <input value="1" type="range" max="1" step="0.01">
              </div>
            </div>
          </div>
          <div class="drop-down-pop-up-footer-right">
            <button class="styled_button"><i class="fa fa-check"></i> Apply</button>
          </div>
        </form>`);

        const change = (e, target) => {
          pop.content.querySelector('#opacity_preview').style.opacity = target.value;

          all('input', pop.content, a => a.value = target.value);
        };

        addDelegatedEvent(pop.content, 'input', 'input', change);
        addDelegatedEvent(pop.content, 'form', 'submit', (e, target) => {
          e.preventDefault();

          const value = pop.content.querySelector('input').value;
          this.insertTags(`[opacity=${value}]`, '[/opacity]');

          pop.Close();
        });

        pop.Show();
      },
      showIconPicker(sender, event) {
        const iconsHTML = match => icons.filter(a => !match.length || a.indexOf(match) > -1).map(icon => `<label class="bbcodeIcons" title="${normalise(icon)}">
                          <div><span class="bookshelf-icon-element fa fa-${icon}" data-icon-type="font-awesome"></span></div>
                          <input type="radio" value="${icon}" style="display:none;" name="icon"></input>
                      </label>`).join('');
        const pop = makePopup('Insert Icon', 'fa fa-anchor');
        pop.SetWidth(400);
        pop.SetContent(`
              <div class="std">
                <input type="text" placeholder="Search Icons"></input>
              </div>
              <div class="bookshelf-edit-popup">
                  <div class="bookshelf-icons">${iconsHTML('')}</div>
              </div>`);
        addDelegatedEvent(pop.content, 'input[type="text"]', 'keyup', (e, target) => {
          pop.content.querySelector('.bookshelf-icons').innerHTML = iconsHTML(target.value.trim());
        });
        addDelegatedEvent(pop.content, 'input[type="radio"]', 'click', (s, target) => {
          this.insertText(`[icon]${target.value}[/icon]${this.getSelection()}`);
          pop.Close();
        });
        pop.Show();
      },
      showAddDirectImage,
      find,
      blot(sender, event) {
        this.insertText(this.getSelection().replace(/[^\s\\]/g, "█"));
      },
      greentext(sender, event) {
        operateText(this, selected => {
          let toggle = true;
          selected = selected.map((line, i) => {
            if (line.indexOf('[color=#789922]>') != 0) {
              toggle = false;
              return `[color=#789922]>${line}[/color]`;
            }
            return line;
          });
          if (toggle) return selected.map(line => line.replace(/^\[color=#789922\]>(.*)\[\/color\]$/g, '$1'));
          return selected;
        });
      },
      makeUnorderedList(sender, event) {
        this.makeList((line,dotted,numbered,save) => {
          if (numbered) return save(line.replace(/\t\[b\]([0-9])*.\[\/b\] /g, '\t[b]·[/b] '));
          if (!dotted) return save(`\t[b]·[/b] ${line}`);
        });
      },
      makeOrderedList(sender, event) {
        this.makeList((line,dotted,numbered,save) => {
          if (dotted) return save(line.replace('\t[b]·[/b] ', `\t[b]${i + 1}.[/b] `));
          if (!numbered) return save(`\t[b]${i + 1}.[/b] ${line}`);
        });
      },
      makeList(func) {
        operateText(this, selected => {
          let toggle = true;
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

  return {
    initCommentArea() {
      all('.bbcode-editor button[title="Text Colour"]', a => a.innerHTML = '<i class="fa fa-tint"></i>');
      all('.bbcode-editor button[title="Insert Image"]', a => a.innerHTML = '<i class="fa fa-picture-o"></i>');
      all('.bbcode-editor:not([data-fimficadv])', registerCommentButtons);
    },
    apply: initBBCodeController,
    registerEvents() {
      FimFicEvents.on('aftereditmodule aftercomposepm afterpagechange afteraddcomment', this.initCommentArea);

      if (getBlockLightbox()) {
        initLightBoxBlocker();
      }
      if (CURRENT_LOCATION.indexOf('manage_user/messages/') != 0) {
        startCommentHandler();
      }
    },
    createOptions(tab) {
      tab.AddCheckBox("unsp", "Always show posted Images", getAlwaysShowImages()).addEventListener('change', e => {
        settingsMan.setB('unspoiler_images', e.target.checked, true);
      });
      tab.AddCheckBox("unlit", "Block Lightboxes (image popups)", getBlockLightbox()).addEventListener('change', e => {
        settingsMan.setB('block_lightbox', e.target.checked, false);
      });
    }
  };
}
function SiteFontController() {
  const getCustomFont = () => settingsMan.get('custom_font', 'Default');
  return {
    apply() {
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
    },
    createOptions(tab) {
      const input = tab.AddDropDown("ffs", "Site Font", []);
      ready(() => {
        ChapterFormatController.prototype.initFonts.apply({ font: getCustomFont(), inputs: {font: input} });
        input.insertAdjacentHTML('afterbegin', `<optgroup label="FimFiction">${['Default','Classic'].map(f => `<option value="${f}">${f}</option>`).join('')}</optgroup>`);
        input.addEventListener('change', () => {
          settingsMan.set('custom_font', input.value, 'Default');
          this.apply();
        });
      });
    }
  };
}
function LogoController(logos) {
  const pickNextLogo = () => pickNext(logos.map((l,i) => [l, i]).filter(l => l[0].able).map(l => l[1]));
  const getUrl = val => logos[val == -1 ? pickNextLogo() : Math.max(0, val % logos.length)].css;
  const getCurrent = () => settingsMan.int("oldLogo", 0);
  return {
    getNames() {
      return logos.filter(l => l.able).map(l => l.name);
    },
    apply(v) {
      document.querySelector('#home_link img.logo').src = getUrl(v || getCurrent());
    },
    createOptions(tab) {
        const oldLogo = tab.AddDropDown("ologo", "Logo Image", logos.filter(l => l.able).map(l => l.name), getCurrent());
        oldLogo.innerHTML = '<option value="-1">Random</option>' + oldLogo.innerHTML;
        oldLogo.addEventListener('change', e => {
          settingsMan.set("oldLogo", e.target.value, 0);
          this.apply(e.target.value);
        });
    }
  };
}
function AdsController() {
  function removeAnnoyances() {
    const listBox = document.querySelector('.list_boxes');
    if (listBox) {
      all('.right.advert', a => {
        listBox.insertAdjacentElement('beforeend', a);
        all('.no-related', listBox.parentNode, a => a.classList.remove('no-related'));
      });
    }
    all('.story_content_box [data-ad-class], .story_content_box .advertisment', a => {
      a.parentNode.insertAdjacentElement('afterend', a);
    });
    all('.advertisment, [data-ad-class], [data-ad-client]', a => {
      if (a.closest('[data-ad-class] [data-ad-client]')) return;
      a.insertAdjacentHTML('afterend', `<div class="ad-wrapper collapse"><a data-click="hideAd">[hide]</a></div>`);
      const wrapper = a.nextSibling;
      if (a.classList.contains('pw-ad-box') || a.dataset.adClass == 'sidebar-responsive') wrapper.classList.add('pw');
      wrapper.insertAdjacentElement('afterbegin', a);
      const reminder = wrapper.parentNode.querySelector('.ad-wrapper ~ .patreon-reminder')
      if (reminder) {
        wrapper.insertAdjacentElement('beforeend', reminder);
      }
    });

    addDelegatedEvent(document.body, '.ad-wrapper [data-click="hideAd"]', 'click', (e, sender) => {
      const ls = sender.closest('.list_boxes');
      if (ls && !ls.querySelector('.stories')) ls.parentNode.querySelector('.chapter-comments').classList.add('no-related');
      sender.parentNode.parentNode.removeChild(sender.parentNode);
    });

    const updateDisplay = _ => all('.ad-wrapper', a => {
      const d = a.querySelector('ins, .pw-ad-box');
      a.classList.toggle('collapse', !d || !d.innerHTML.length);
    });

    setInterval(updateDisplay, 1000);
    updateDisplay();
  }

  function StyledWarning(message, ok, cancel) {
    const g = new PopUpMenu('', `<i class="fa fa-warning"></i> Warning`);
    g.SetFixed(1);
    g.SetCloseOnHoverOut(0);
    g.SetWidth(600);
    g.SetContent(`<div class="bbcode" style="padding:18px;overflow-y:auto;max-height:400px;">${message}</div>`);
    g.SetFooter(`<div style="text-align:right;">
      <button data-click="ok" class="styled_button"><i class="fa fa-check"></i> Continue</button>
      <button data-click="cancel" class="styled_button styled_button_red"><i class="fa fa-times"></i>  Cancel</button>
  </div>`);
    g.Show();
    addDelegatedEvent(g.content, '[data-click]', 'click', (e, target) => {
      e.preventDefault();
      g.Close();
      const callback = target.dataset.click == 'ok' ? ok : cancel;
      if (callback) callback();
    });
  }

  return {
    apply() {
      if (this.getFixAds()) {
        removeAnnoyances();
      }
    },
    getFixAds() {
      return settingsMan.bool('fix_ads', false);
    },
    createOptions(tab) {
      tab.AddCheckBox("btrds", "Improved Advertisements", this.getFixAds()).addEventListener('change', e => {
        if (e.target.checked) {
          StyledWarning(`
          <h1>Thar be Dragons!</h1>
          This feature is highly experimental and dubious at best. Advertisement breakages may occur, which makes for a sad knighty. ${emoteHTM('fluttercry')}
          <br><br>
          Proceed at your own peril.
          <br>
          <blockquote>
            <h3>Annoyances to be removed:</h3>
            <ol>
              <li>Ads are positioned outside of the main story container for uninterrupted c— horse fiction enjoyment.</li>
              <li>Scrolling sidebars only appear beside the comments, oh and they don't scroll either.</li>
              <li>Empty ad blocks remain hidden until their respective contents load. (No more empty spaces!)</li>
              <li>Links after every ad allows for easy removal (Just be sure to check out their <i>sweet</i> deals beforehand, okay? ;D )</li>
              <li>More convenient container class (.ad-wrapper) that works for google, kniggy (.advertisement), <i>and</i> Project Wonderful!</li>
            </ol>
          </blockquote>`, () => {
            settingsMan.setB('fix_ads', true, false);
          }, () => {
            e.target.checked = false;
          });
        } else {
          settingsMan.setB('fix_ads', e.target.checked, false);
        }
      });
    }
  };
}
function SignatureController() {
  const DEFAULT_SIG = "%message%\n\n--[i]%name%[/i]";
  const RANDOM_COMMENTS = [
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
  ];
  const hasSigned = (value, format) => (new RegExp(encodeURI(format.replace(/%message%/g, ".*")))).test(encodeURI(value));
  const getSig = () => settingsMan.get("user_sig", DEFAULT_SIG);
  const setSig = v => settingsMan.set("user_sig", v, DEFAULT_SIG);
  return {
    previewSignature() {
      return fillBBCode(this.applySignature(pickNext(RANDOM_COMMENTS)).replace(/\n/g, '<br />'));
    },
    applySignature(text) {
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
    },
    createOptions(tab) {
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
        sigPrev.innerHTML = this.previewSignature();
      });
    }
  };
}
function BackgroundsController() {
  const ALIGNMENTS = ['top','left','right','bottom','center'];
  const getColor = () => settingsMan.get("bgColor", 'transparent');

  function getOrDefaultColor() {
    const col = getColor();
    return !col || col == 'transparent' ? rgb2hex(window.getComputedStyle(document.body).backgroundColor) : col;
  }

  function apply() {
    let c = getColor();
    let img = backgroundImages.get();
    let pattern = backgroundPatterns.get();

    settingsMan.flag('background', !((c == '' || c == 'transparent') && img === 'none'));

    const bod = window.getComputedStyle(document.body);

    if (img == 'none') {
      img = bod.backgroundImage;
    }
    if (c == '' || c == 'transparent') {
      c = bod.backgroundColor;
    }

    updateStyle(`
      .body_container {
        background: ${[ img.css || img || '', pattern.css || pattern || '' ].filter(s => s.length).join()} ${c};
      }
      .quote_container .comment {
        background: ${[ pattern.css || pattern || '' ].filter(s => s.length).join()} ${c};
      }
    `, 'FFA_BODY_BACKGROUND');

    document.body.dataset.baseColor = c;
    c = window.getComputedStyle(document.querySelector('.body_container')).backgroundColor.replace(/rgb|a|\(|\)| /g,'').split(',');

    if (getBrightness(c[0] >> 0, c[1] >> 0, c[2] >> 0) < 100 || (typeof img !== 'string' && img.attributes.darken)) {
      all('.breadcrumbs, .chapter-header, .user-stats > div > .section > h1', a => a.classList.add('bright'));
    } else {
      all('.bright', a => a.classList.remove('bright'));
    }
  }

  function createSet(key, name, backgrounds) {
    function getIndex() {
      return Math.min(backgrounds.length - 1, Math.max(settingsMan.int(key, -1), 0));
    }

    function populateSelect(item, blank, index) {
      blank.children[1].innerHTML = item.name;
      blank.children[0].style.backgroundColor = getOrDefaultColor();
      blank.children[0].style.opacity = '0.8';

      let css = item.css.replace(/ fixed/g, "");
      if (item.attributes.custom) {
        css = css.split(' ').filter(a => ALIGNMENTS.indexOf(a) > -1).join(' ');
      }

      blank.style.background = css;
      blank.dataset.bgIndex = index;
      if (item.attributes.center) {
        blank.style.backgroundPosition = "center center";
      }
      blank.style.backgroundSize = item.attributes.contain ? 'contain' : item.attributes.custom || 'cover';
      if (item.source) {
        blank.style.position = 'relative';
        blank.insertAdjacentHTML('beforeend', `<a class="bg_source_link" href="${item.source}">Source</a>`);
      }

      blank.addEventListener('click', () => {
        settingsMan.set(key, index, -1);
        apply();
      });
    }

    return {
      get() {
        return backgrounds[getIndex()] || 'none';
      },
      createPresetSelect(tab) {
        const select = tab.AddPresetSelect(key, name, true, 0);

        backgrounds.forEach((a, i) => select.add(el => {
          populateSelect(a, el, i);
        }));

        addDelegatedEvent(select.element, '.premade_settings', 'click', (e, target) => {
          const other = select.element.querySelector('.premade_settings_selected');
          if (other) {
            other.classList.remove('premade_settings_selected');
          }
          target.classList.add('premade_settings_selected');
        });

        const bgIndex = select.element.querySelector(`[data-index="${getIndex()}"]`);
        if (bgIndex) {
          bgIndex.classList.add('premade_settings_selected');
        }
      }
    };
  }

  return {
    getColor,
    setColor(c) {
      settingsMan.set("bgColor", c, 'transparent');
      apply();
    },
    getOrDefaultColor,
    createSet,
    apply,
    createOptions(tab) {
      makeStyle(".body_container {transition: background-color 0.125s ease;}", "FFA_T");

      const colorPick = tab.AddColorPick("bg", "Background Colour", backgrounds.getColor(), me => {
        me.value = me.value.trim();
        if (me.value.length) {
          if (me.value.indexOf('#') !== 0) {
            me.value = toHex(extractColor(me.value));
          }
        }

        backgrounds.setColor(me.value);
        all('.toolbar', tab.container, a => a.style.backgroundColor = backgrounds.getOrDefaultColor());
      });

      tab.AppendButton(colorPick, '<i class="fa fa-camera"></i>From Toolbar').addEventListener('click', () => {
        colorPick.value = rgb2hex(userToolbar.dataset.backgroundColor);
        colorPick.change();
      });
      tab.AppendButton(colorPick, '<i class="fa fa-undo"></i>Revert to default').addEventListener('click', () => {
        colorPick.value = '';
        colorPick.change();
      });

      backgroundPatterns.createPresetSelect(tab, false);
      backgroundImages.createPresetSelect(tab, colorPick);
    }
  };
}
function FancyFeedsController() {
  let computedUnreadCount = 0;
  let unreadCount = getUnreadCount();

  function getFancyFeeds() {return settingsMan.int('feed_compressed', 0);}

  function getSimpleFeeds() {return settingsMan.bool('simple_feeds', true);}
  function getDistinguishedFeeds() {return settingsMan.bool('distinguished_feeds', false);}

  function getFeedRead() {return settingsMan.int('feedRead', 0);}
  function getUnreadCount() {return settingsMan.int('unread_count', 0);}

  function setUnreadCount(count, sender) {
    count = Math.max(0, count);
    unreadCount = count;
    settingsMan.set('unread_count', count);
    if (sender) {
      sender.classList.toggle('on', count > 0);
      sender.classList.toggle('off', count <= 0);
      sender.dataset.count = count;
    }
  }

  function updateFeedUi() {
    document.body.classList.toggle("compressed", getFancyFeeds() > 0);
    document.body.classList.toggle("distinguish", getDistinguishedFeeds());
    document.body.classList.toggle('simplified', getSimpleFeeds());
  }

  function getNewFeedOptions() {
    const checkof = (icon, title, input) => `<li>
        <label>
          <i class="fa fa-fw fa-${icon}"></i>${title}
          ${input}
          <i class="fa fa-check"></i>
        </label>
      </li>`;
    const state = getFancyFeeds();
    const soc = document.querySelector('#social_site_posts');
    soc.name = 'social-posts';
    return `<div class="button-group check-group collapsible search-view">
          <button type="button" class="drop-down-expander styled_button styled_button_brown">
            <i class="fa fa-bars"></i> Options<i class="fa fa-caret-down"></i>
          </button>
          <div id="feed-options" style="width:300px;" class="drop-down">
            <ul style="font-size:14px;">
              <li><a data-click="changeViewMode" data-value="all"><i class="fa fa-globe"></i> All</a></li>
              <li><a data-click="changeViewMode" data-value="stories"><i class="fa fa-book"></i> Stories</a></li>
              <li><a data-click="changeViewMode" data-value="blogs"><i class="fa fa-file-text-o"></i> Blogs</a></li>
              <li><a data-click="changeViewMode" data-value="groups"><i class="fa fa-group"></i> Groups</a></li>
              <li class="divider"></li>
              ${checkof('newspaper-o', 'Social Site Posts', soc.outerHTML)}
              <li class="divider"></li>
              ${checkof('tasks', 'Group By Story', `<input ${getSimpleFeeds() ? 'checked=""' : ''} data-change="setSimpleFeeds" name="simple-feeds" type="checkbox">`)}
              ${checkof('magic', 'Separate Blogs', `<input ${getDistinguishedFeeds() ? 'checked=""' : ''} data-change="setDistinguishedFeeds" name="distenguish-feeds" type="checkbox">`)}
              <li class="divider"></li>
              ${checkof('newspaper-o', 'Full View', `<input name="feed-type" value="0" ${state == '0' ? 'checked=""' : ''} data-change="changeCompactMode" type="radio">`)}
              ${checkof('th', 'Mixed View', `<input name="feed-type" value="2" ${state == '2' ? 'checked=""' : ''} data-change="changeCompactMode" type="radio">`)}
              ${checkof('list', 'Compact View', `<input id="feed_compact_view" name="feed-type" value="1" ${state == '1' ? 'checked=""' : ''} data-change="changeCompactMode" type="radio">`)}
            </ul>
          </div>
        </div>`;
  }

  function updateUnreadFeedItems(markAllRead) {
    const t = document.querySelector('#feed [data-timestamp]');
    if (!t) return;
    const timestamp = getFeedRead();
    console.log("Old Feed read time:" + timestamp);
    console.log("New Feed read time:" + t.dataset.timestamp);
    settingsMan.set('feedRead', t.dataset.timestamp, 0);
    const fancy = getFancyFeeds() == 2;

    let count = 0;

    all('.feed_item:not(.touched)', item => {
      const neu = parseFloat(item.dataset.timestamp) > timestamp;
      const worth = item.querySelectorAll('.group_stories ul > li').length || 1;

      item.classList.toggle('expanded', fancy && neu);
      item.classList.toggle('new', neu && !item.classList.contains('marked'));
      item.classList.add('touched');
      item.dataset.worth = worth;

      if (item.classList.contains('new')) count += worth;

      if (!item.classList.contains('feed_group_item')) return;
      let group = item.querySelector('.group_stories');
      if (group) {
        const stories = getParsedStoryFeedItem(item);
        const kes = Object.keys(stories);

        item.querySelector('.feed_header h1').lastChild.textContent = kes.length > 1 ? ` had ${kes.length} new stories added to it ` : ' had a new story added to it ';

        group.innerHTML = `<span class="complex">${group.innerHTML}</span><span class="simple"></span>`;
        group = group.lastChild;
        kes.forEach(title => {
          group.appendChild(stories[title].element);
          stories[title].element.insertAdjacentHTML('beforeend', `<div class="folders"></i> ${stories[title].folders.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          }).map(a => a.html).join(', ')}</div>`);
        });
      }
    });

    computedUnreadCount += count;
    if (computedUnreadCount > unreadCount) setUnreadCount(count, markAllRead);
  }

  function getParsedStoryFeedItem(item) {
    const stories = {};
    all('a[href^="/story/"]', item, storyLink => {
      const title = storyLink.innerText.trim();
      if (!stories[title]) {
        stories[title] = { element: storyLink.closest('li'), folders: [], tolders: [] };
      }
      const folder = storyLink.closest('ul').parentNode.querySelector('a[href^="/group/"]');
      if (folder) {
        const tolder = folder.innerText.trim();
        if (stories[title].tolders.indexOf(tolder) < 0) {
          stories[title].folders.push({ name: tolder, html: folder.outerHTML });
          stories[title].tolders.push(tolder);
        }
      }
    });
    return stories;
  }

  return {
    apply() {
      if (CURRENT_LOCATION.indexOf('feed') == 0) {
        this.applyFeedFix();
      } else {
        this.initUnreadCount();
      }
    },
    applyFeedFix() {
      // prevent misleading links around images
      addDelegatedEvent(document, '.feed_body img.thumbnail_image', 'click', (e, target) => {
        e.preventDefault();
        const a = target.closest('a');
        if (a.href) a.title = a.href;
      });
      this.fixFeedOptions();
      animator.on('feed', pinnerFunc('.feed-toolbar', 'feed'));
    },
    initUnreadCount() {
      const count = document.querySelector('.feed-link.new div');
      setUnreadCount(count ? count.innerText.trim() : 0);
    },
    initFeedItems() {
      updateUnreadFeedItems(document.querySelector('#mark-read-button'));
    },
    replaceFeedUI() {
      const options = document.querySelector('#feed-options');
      if (options) {
        const toggle = document.querySelector('.feed-toolbar .drop-down-expander');
        toggle.parentNode.removeChild(toggle);
        options.insertAdjacentHTML('afterend', getNewFeedOptions());
        options.parentNode.removeChild(options);
        const reload = document.querySelector('#refresh-button');
        reload.insertAdjacentHTML('afterend', `
          <a id="mark-read-button" class="styled_button button-icon-only ${unreadCount > 0 ? 'on' : 'off'}" data-element="markAllRead" data-click="markAllRead" data-count="${unreadCount}">
            <i class="off fa fa-check"></i>
            <i class="on fa fa-check-square-o"></i>
          </a>`);
      }
      updateFeedUi();
    },
    fixFeedOptions() {
      this.initFeedItems();

      extend(FeedController.prototype, {
        changeCompactMode(c, d, sender) {
          this.column.classList.toggle("compressed", false);
          LocalStorageSet("feed_compressed", sender.value);
          updateFeedUi();
          all('.feed .touched', t => t.classList.remove('touched'));
          updateUnreadFeedItems(this.elements.markAllRead);
        },
        markAllRead(sender) {
          setUnreadCount(0, sender);
          all('.feed .new', t => {
            t.classList.add('marked');
            t.classList.remove('new');
            t.classList.remove('expanded');
          });
        },
        setSimpleFeeds(event, d, sender) {
          settingsMan.setB('simple_feeds', sender.checked, true);
          updateFeedUi();
        },
        setDistinguishedFeeds(event, d, sender) {
          settingsMan.setB('distinguished_feeds', sender.checked, false);
          updateFeedUi();
        }
      });

      override(FeedController.prototype, 'toggleCompressed', function(sender, event) {
        if (event.target.tagName === 'A') return true;
        sender = sender.closest('.feed_item');
        sender.classList.toggle('expanded');
        if (sender.classList.contains('new')) {
          sender.classList.remove('new');
          sender.classList.add('marked');
          if (unreadCount > 0) {
            if (!this.elements.markAllRead) all('[data-element]', this.element, a => this.elements[a.dataset.element] = a);
            const worth = parseInt(sender.dataset.worth);
            computedUnreadCount = Math.max(0, computedUnreadCount - worth);
            setUnreadCount(unreadCount - worth, this.elements.markAllRead);
          }
        }
      });
    }
  };
}
function BannerCreditsController(controller) {
  function build() {
    const themeId = controller.getCurrent();
    const category = CHRIST ? 2 : 0;
    replaceWith(document.querySelector('.front_page'), `<div id="banner-archive" class="content mobile-no-margin">
                <div class="content_box">
                    <div class="content_box_header"><h2>Banner Archive</h2></div>
                    <div class="main">
                        The My Little Pony: Friendship is Magic community has churned out some incredible artwork from enormously talented artists. The banner selection on Fimfiction is just a small selection of what I consider to be some of the defining examples of artistic quality its members can produce. If you\'d like to suggest a piece of artwork for a banner, send <a href="/user/sollace">me a pm</a> and if I think it's high enough quality I might use it, but I'm pretty picky and need artwork that works on the site so please don't be offended if I'm not interested in what you send!
                        <br><br>
                        If you see a banner you'd like you use permanently on the site, just click it below!
                    </div>
                </div>
                <div id="banner-switcher">
                    <div class="inner">
                        <div class="toggleable-radio toggleable-radio-${controller.getSets().length}" >${controller.getSets().map((a, j) =>
                            `<input data-change="switchSets" name="banner-group" id="${a.name}" type="radio" value="${a.name}"${(j == category ? ` checked="checked"` : '')} ></input><label for="${a.name}">${a.name}</label>`).join('')}<a></a>
                        </div>
                    </div>
                </div>
                <form id="banner-selector">${controller.getSets().map((a, index) =>
                    `<div class="banner-credits" data-offset="${index}" data-group="${a.name}" style="transform:translateX(-${category * 100}%)">${a.getVisibleItems().map(item => `
                        <input type="radio" data-change="selectBanner" id="banners[${item.id}]" value="${item.id}"${item.id == themeId ? ` checked="checked"` : ''} name="banners[]"></input>
                        <label for="banners[${item.id}]" class="theme">
                            <div class="banner" title="Click to select this banner" style="background-image:url(${item.url})${(item['position'] ? `;background-position:${item.position};` : '')}"></div>
                            <div class="source" style="background-color:${item.colour}">
                                ${item.sources.map(source => ` <a href="${source.href}"><i class="fa fa-link"></i> ${source.text || 'Source'}</a>`).join(' ')}
                            </div>
                        </label>`).join('')}
                    </div>`).join('')}
                </form>
            </div>`);
  }
  return {
    selectBanner(e, target) {
      controller.setCurrent(target.value);
      controller.slider.goto(controller.getCurrentId(), true);
    },
    switchSets(e, target) {
      target = document.querySelector(`.banner-credits[data-group="${target.value}"]`);
      if (!target) return;
      target.parentNode.style.height = `${target.offsetHeight + 50}px`;
      const offset = parseInt(target.dataset.offset) * 100;
      all('.banner-credits', a => a.style.transform = `translateX(-${offset}%)`);
    },
    buildAll() {
      if (!bannerController.getEnabled()) return;
      document.querySelector('.footer .block a[href="/staff"]').insertAdjacentHTML('afterend', '<br><a href="/?view=page&page=banner_credits">• Banner Credits</a>');
      if (CURRENT_LOCATION !== '?view=page&page=banner_credits') return;

      build();

      addDelegatedEvent(document.querySelector('#banner-archive'), '[data-change]', 'change', (e, target) => {
        this[target.dataset.change](e, target);
      });

      animator.on('switcher', pinnerFunc('#banner-switcher', 'switcher', document.querySelector('#banner-selector')));
    }
  };
}
function BannerController(sets) {
  let theme = 0;
  const slider = Slider();

  let preloader, home_link, source_link;

  const done = e => e.target.parentNode.removeChild(e.target);
  const bannerScrollOn = () => animator.on('banners', updateBannerScroll);
  const getCollapse = () => settingsMan.bool("titleHidden", false);
  const getFancy = () => settingsMan.bool('fancy_banners', false);
  const getPinUserbar = () => settingsMan.bool('pin_userbar', false);
  function setPinUserbar(v) {
    settingsMan.setB('pin_userbar', v, false);
    document.body.classList.toggle('pin_userbar', v);
  }

  if (CHRIST) sets.push({name: "Festive", items: [Ban("christmas.png", "Merry Christmas!", "#4c7e6e")]});
  sets.forEach(set => {
    set.getVisibleItems = function() {
      return this.items.filter(banner => !banner.options.nsfw || isNsfw());
    };
    banners.push.apply(banners, set.getVisibleItems());
  });

  function preloadBanner(banner) {
    if (banner.catched) return;
    if (!preloader) {
      document.body.insertAdjacentHTML('beforeend', '<div id="imagePreload"></div>');
      preloader = document.body.lastChild;
    }
    preloader.insertAdjacentHTML('beforeend', `<img></img>`);
    const img = preloader.lastChild;
    img.addEventListener('load', done);
    img.addEventListener('error', done);
    img.src = banner.url;
    banner.catched = true;
  }

  function updateBannerScroll(position) {
    if (!home_link) return;

    let top = offset(home_link).top;
    const off = (position && position.class === 'Pos') ? position : (byTheme(theme).position || {
      'position-x': window.innerWidth < 1000 ? 'left' : 'center',
      'position-y': 'top',
      'x': -150,
      'y': 0
    });

    if (window.scrollY < top | window.scrollY - 1 >= top + home_link.offsetHeight) {
      home_link.style.backgroundPosition = off.class ? off : '';
      return;
    }

    top = (window.scrollY - top) * 0.6;

    let fX = off['position-x'], fY = off['position-y'];
    let X = fX != 'center' ? `${off.x}px ` : '', Y = off.y;

    if (fY === 'center') {
      Y = `calc(50% + ${top}px)`;
      fY = 'top';
    } else {
      if (fY === 'bottom') top = -top;
      Y = `${Y + top}px`;
    }

    home_link.style.backgroundPosition = `${fX} ${X}${fY} ${Y}`;
  }

  function computeAppropriateHeight(header) {
    const el = header.querySelector('ul.tabs, ul.tags');
    return el ? el.offsetTop + el.offsetHeight + 30 : 255;
  }

  const bannerScrollOff = () => {
    animator.off('banners');
    all('.home_link, #fade_banner_image', a => a.style.backgroundPosition = '');
  };

  function byTheme(theme) {
    return banners[theme % banners.length];
  }

  function Slider() {
    const slideTimes = [-1, 60000, 180000, 300000, 600000, 1800000, 3600000],
          slideLabels = ["Off","One Minute","Three Minutes","Five Minutes","Ten Minutes","Half Hour","One Hour"];
    let fade, tit, slideshowTimer, me;

    const blacklistBanners = 0;

    const img = document.createElement('IMG');
    img.addEventListener('load', () => {
      me.goto(theme);
      me.updateSlide();
    });
    img.addEventListener('error', () => {
      if (blacklistBanners++ < banners.length) {
        me.next();
      }
    });

    return me = {
      ready: _ => {
        fade = document.querySelector('#fade_banner_image');
        tit = document.querySelector('#title a.home_link');
      },
      getShuffle: _ => settingsMan.bool("shuffle_slideShow", true),
      setShuffle: e => settingsMan.setB("shuffle_slideShow", e.target.checked, true),
      labels: _ => slideLabels,
      getSlide: _ => settingsMan.int("slideShow", 0),
      setSlide(e, callback) {
        settingsMan.set("slideShow", Math.abs(e.target.selectedIndex % slideTime.length), 0);
        this.updateSlide();
        callback();
      },
      pause() {
        if (slideshowTimer) {
          clearTimeout(slideshowTimer);
          slideshowTimer = null;
        }
      },
      resume() {
        if (this.getSlide() && fade && !slideshowTimer) {
          this.updateSlide();
        }
      },
      updateSlide() {
        this.pause();
        const slide = this.getSlide();
        if (slide && fade) {
          slideshowTimer = setTimeout(() => this.next(), slideTimes[slide]);
        }
      },
      next() {
        if (this.getShuffle()) {
          theme = Math.floor(Math.random() * (banners.length - 1));
        } else {
          theme = (theme + 1) % banners.length;
        }
        img.src = banners[theme].url;
      },
      goto(index, save) {
        this.animate(() => bannerController.pick(index, save));
      },
      animate(action) {
        const cc = window.getComputedStyle(tit);
        fade.classList.add('animating');
        fade.style.backgroundImage = cc.backgroundImage;
        fade.style.backgroundPosition = cc.backgroundPosition;
        fade.style.backgroundSize = cc.backgroundSize;
        requestAnimationFrame(() => {
          action();
          requestAnimationFrame(() => fade.classList.remove('animating'));
        });
      }
    };
  }

  return {
    slider,
    getSets: _ => sets,
    prev: _ => slider.goto(theme == 0 ? banners.length - 1 : theme - 1, true),
    next: _ => slider.goto(theme >= banners.length - 1 ? 0 : theme + 1, true),
    reset() {
      this.setCurrent('');
      slider.goto(-1, false);
    },
    initFancy() {
      if (getFancy() && this.getEnabled()) {
        bannerScrollOn();
        updateBannerScroll();
      }

      all('.patreon-sponsor', a => a.title = window.getComputedStyle(a, ':before').content.replace(/["']/g, ''));
    },
    getSelected: _ => byTheme(theme),
    byTheme,
    getCurrent() {
      return CHRIST ? 'christmas.png' : settingsMan.get('selected_theme');
    },
    getCurrentId() {
      const themeId = this.getCurrent();
      if (!themeId) return -1;
      for (let i = 0; i < banners.length; i++) {
        if (banners[i].id === themeId) return i;
      }
      return -1;
    },
    setCurrent(value) {
      settingsMan.set('selected_theme', value, null);
    },
    getEnabled() {
      return settingsMan.bool('banners', true);
    },
    build() {
      settingsMan.flag('banners', true);
      addBannerCss();

      let mainBanner = document.querySelector('#main_banner');
      if (mainBanner) return;

      if (getCollapse()) document.body.classList.add('titleHidden');
      if (getPinUserbar()) document.body.classList.add('pin_userbar');

      const pinLink = document.querySelector('.pin_link_container');
      pinLink.insertAdjacentHTML('afterend', pinLink.outerHTML.replace('pin_nav_bar', 'pin_userbar'));
      pinLink.nextSibling.addEventListener('click', () => setPinUserbar(!getPinUserbar()));

      userToolbar.parentNode.insertAdjacentHTML('afterend', `<div id="main_banner">
        <header class="header">
              <div id="title" class="title">
                  <div class="banner-buttons">
                      <a target="_blank" id="source_link">Source</a>
                      <a data-action="reset" title="Randomize"><i class="fa fa-random"></i></a>
                      <a href="/?view=page&page=banner_credits" title="Select Banner"><i class="fa fa-pencil"></i></a>
                  </div>
                  <a href="/" class="home_link"><div id="fade_banner_image"></div></a>
                  <a href="/" class="home_link_link"></a>
                  <a class="theme_selector theme_selector_left" href="#" data-action="prev"></a>
                  <a class="theme_selector theme_selector_right" href="#" data-action="next"></a>
              </div>
          </header>
      </div>`);
      mainBanner = document.querySelector('#main_banner');
      mainBanner.appendChild(userToolbar);

      const subHeader = document.querySelector('.user-page-header, .story-page-header');

      if (subHeader) {
        mainBanner.dataset.userpage = true;
        mainBanner.insertAdjacentElement('afterbegin', subHeader);
        document.querySelector('.nav_bar .logo').classList.add('tiny-logo');

        const readyBannerAnim = () => makeBannerTransitionStyle(computeAppropriateHeight(subHeader));

        window.addEventListener('resize', readyBannerAnim);
        window.addEventListener('DOMContentLoaded', readyBannerAnim);
        setTimeout(readyBannerAnim, 500);
      }

      home_link = document.querySelector('#title a.home_link');
      source_link = document.querySelector('#title #source_link');
      addDelegatedEvent(mainBanner, 'a[data-action]', 'click', (e, target) => {
        e.preventDefault();
        this[target.dataset.action]();
      });

      slider.ready();
      customBanner = customBannerController.get();
      if (customBanner) {
        customBannerindex = banners.length;
        banners.push(customBanner);
      }
      this.finalise();
      requestAnimationFrame(() => document.body.classList.add('banner-transitionable'));

      window.addEventListener('focus', () => {
        const id = this.getCurrentId();
        if (id > -1) this.pick(id);
        slider.resume();
      });
      window.addEventListener('blur', () => slider.pause());

    },
    finalise() {
      this.pick(this.getCurrentId());
    },
    pick(id, save) {
      if (id < 0 || id > banners.length) {
        id = Math.floor(Math.random() * banners.length);
      }
      if (save) {
        this.setCurrent(id < 0 || id > banners.length ? '' : banners[id].id);
      }
      theme = id;
      this.changeBanner(banners[id].sources, banners[id].url, banners[id].colour, banners[id].position);
      preloadBanner(banners[id == 0 ? banners.length - 1 : id - 1]);
      preloadBanner(banners[(id + 1) % banners.length]);
    },
    changeBanner(sources, img, color, pos) {
      if (color && color.length) {
        userToolbar.dataset.backgroundColor = color;
        document.body.style.setProperty('--banner-bar-gradient-start', toZeroAlpha(color));
        document.body.style.setProperty('--banner-bar-gradient-end', color);
        addBannerCss();
      }

      if (!home_link) return;
      home_link.style.backgroundImage = `url('${img}')`;
      home_link.style.backgroundSize = pos ? '1300px' : '';
      home_link.style.backgroundPosition = pos || '';

      source_link.classList.toggle('hidden', !(sources && sources.length));
      if (sources && sources.length) {
        source_link.href = sources[0].href;
        source_link.title = sources[0].href;
      }
      if (getFancy()) updateBannerScroll(pos);
    },
    createOptions(tab, dependant) {
      const updateBannersOptions = () => tab.SetEnabled(`#pub,#fancyB,#hb,#sl,#shuf,#bannerCust${snowController.getState() < 2 ? ',#uss' : ''}`, this.getEnabled());
      const updateSliderOptions = () => tab.SetEnabled('#shuf', enableSlide.selectedIndex);

      tab.AddCheckBox("eb", "Enable Banners", this.getEnabled()).addEventListener('change', compose(e => {
        settingsMan.setB("banners", e.target.checked, true);
        settingsMan.flag('banners', e.target.checked);
        if (e.target.checked) {
          this.build(banners);
        } else {
          all('#FFA_Banner_Stylesheet, header.header > #title.title', s => s.parentNode.removeChild(s));
          document.querySelector('.user_toolbar').style.background = '';
        }
        bannerScrollOff();
        this.initFancy();
      }, updateBannersOptions));
      tab.AddCheckBox("fancyB", "Enable Fancy Banners", getFancy()).addEventListener('change', e => {
        if (e.target.checked == getFancy()) return;
        settingsMan.setB('fancy_banners', e.target.checked, false);
        if (e.target.checked) {
          this.initFancy();
        } else {
          bannerScrollOff();
        }
      });
      tab.AddCheckBox("pub", "Sticky Userbar", getPinUserbar()).addEventListener('change', e => setPinUserbar(e.target.checked));
      tab.AddCheckBox("hb", "Compact Banner", getCollapse()).addEventListener('change', e => {
        settingsMan.setB("titleHidden", e.target.checked, false);
        document.body.classList.toggle('titleHidden', e.target.checked);
      });

      const enableSlide = tab.AddDropDown("sl", "Banner Slide Show", slider.labels(), slider.getSlide());
      enableSlide.addEventListener('change', e=> slider.setSlide(e, updateSliderOptions));
      tab.AddCheckBox("shuf", "Shuffle Slide Show", slider.getShuffle()).addEventListener('change', slider.setShuffle);

      customBannerController.createOptions(tab);

      dependant();

      updateSliderOptions();
      updateBannersOptions();
    }
  };
}
function SnowController() {
  let snower;

  const getSaveFocus = () => settingsMan.bool('ultra_snow_save_focus', true);
  const getState = () => settingsMan.int("snow_bg", 1);
  const getMode = () => settingsMan.bool("snow_mode", false);

  function createSnower(env, container, reverse, fix) {
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
      updatePhysics() {
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
      rotateY(angle) { [this.x, this.z] = turn(angle, this.x, this.z); },
      rotateX(angle) { [this.y, this.z] = turn(angle, this.y, this.z); },
      rotateZ(angle) { [this.y, this.x] = turn(angle, this.y, this.x); }
    });

    let window_focused = true;
    let saveFocus = getSaveFocus();
    let mouseX = 0, mouseY = 0;
    let ticker;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    scene.add(camera);
    camera.position.z = 1000;

    const renderer = new THREE.CanvasRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    const material = new THREE.ParticleBasicMaterial({
      map: new THREE.Texture(newEl(`<img src="${staticFimFicDomain()}/scripts/img/ParticleSmoke.png">`))
    });

    const particles = arrayOf(140, _ => new Particle3D(scene, material));

    if (fix) {
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = renderer.domElement.style.left = 0;
    }
    renderer.domElement.style.pointerEvents = 'none';

    const mouseMoved = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('focus', () => window_focused = true);
    window.addEventListener('blur', () => window_focused = false);

    const tick = () => {
      if (!window_focused && saveFocus) return;
      particles.forEach(particle => particle.updatePhysics());
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    return {
      setSave: v => saveFocus = v,
      start() {
        console.log('starting snow');
        if (ticker) return;
        ticker = setInterval(tick, 50 / 3);
        container.insertAdjacentElement(reverse ? 'beforeend' : 'afterbegin', renderer.domElement);
        document.addEventListener('mousemove', mouseMoved);
        return this;
      },
      stop() {
        console.log('stopping snow');
        if (!ticker) return;
        clearInterval(ticker);
        ticker = null;
        renderer.domElement.parentNode.removeChild(renderer.domElement);
        document.removeEventListener('mousemove', mouseMoved);
        return this;
      }
    };
  }

  function applySnowing(mode, v, s) {
    if (v < 2 && (v == 0 || DECEMBER)) {
      if (snower) {
        return snower.start();
      }

      const context = mode ? document.querySelector('#title .home_link') : document.body;

      if (context) {
        snower = createSnower(document.body, context, mode, !mode).start();
      }
    } else if (snower) {
      snower.stop();
    }
  }

  return {
    getState,
    createOptions(tab) {
      const updateSnowOptions = () => tab.SetEnabled('#pus' + (bannerController.getEnabled() ? ',#uss' : ''), enableUSnow.selectedIndex < 2);
      const enableUSnow = tab.AddDropDown("us", "Snow", ["Always On", "Default", "Always Off"], getState());
      enableUSnow.addEventListener('change', compose(e => {
        settingsMan.set("snow_bg", e.target.selectedIndex, 1);
        this.apply();
      }, updateSnowOptions));
      tab.AddCheckBox("uss", "Snow In Banner", getMode()).addEventListener('change', e => {
        console.log('changed snow mode');
        settingsMan.setB("snow_mode", e.target.checked, false);
        if (snower) {
          snower.stop();
          snower = null;
        }
        this.apply();
      });
      tab.AddCheckBox('pus', 'Pause Snow when lost focus', getSaveFocus()).addEventListener('change', e => {
        settingsMan.setB('ultra_snow_save_focus', e.target.checked, true);
        if (snower) snower.setSave(e.target.checked);
      });
      updateSnowOptions();
    },
    apply() {
      applySnowing(getMode(), getState());
    }
  };
}
