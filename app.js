
var URL = process.env.HEROKU_URL || "";
const PORT = process.env.PORT || 3000;
var url;
const if_dev = process.env.NODE_ENV == "development" ? true:false;

if (if_dev) {
    require("dotenv").load();
    const localtunnel = require('localtunnel');
    url = () => {
        return new Promise((resolve, reject) => {
            localtunnel(3000, (err, tunnel) => {
                if (err) {reject(err)};
                return resolve(tunnel.url);
            })
        })
    }
};
const TG_TOKEN = process.env.TG_TOKEN;
const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Extra    = require('telegraf/extra');

const bot = new Telegraf(TG_TOKEN);
const telegram = new Telegram(TG_TOKEN);

//to get bot ID -> it would be used to not remove bot by itself :)
bot.telegram.getMe().then(botInfo => bot.options.id = botInfo.id);
//start command
bot.start((ctx) => ctx.reply("Welcome! \nLook at instructions\n https://jt0in3e.github.io/antispambot/.\nIf you need help, print/use command '/help' \nCheers 😜"));
bot.help((ctx) => ctx.reply('Get help in the Group 👇\n join -> https://t.me/againstspam.\nHere is instructions 👇\n https://jt0in3e.github.io/antispambot/'));

//work with new chat members
bot.on("new_chat_members", (ctx) => {
    let rpl = "";
    console.log(`updateType: ${ctx.updateType}
        \n-----\nCurrent chat info: \n${JSON.stringify(ctx.chat)}
        \n-----\nFrom: \n${JSON.stringify(ctx.from)}
        \n-----\nMessage itself: \n${JSON.stringify(ctx.message)}`);
    let newMembers = ctx.message.new_chat_members;
    let groupType = ctx.chat.type;
    console.log("NEW CHAT MEMBERS\n", newMembers);
    console.log(`Bot id: ${bot.options.id}`)
    for (let b=0; b<newMembers.length; b++) {
        if (newMembers[b].id == bot.options.id) {
            //skip action if this bot is added to the group
            console.log("me and myself - the bot lyrics");
            continue;
        };

        if (newMembers[b].is_bot) {
            //remove any other bots added to the group
            telegram.kickChatMember(ctx.chat.id, newMembers[b].id).catch(err=>console.log(err));
            continue;
        };

        //restrict newcomers from posting medias&previews (only works in supergroup)
        if (groupType == "supergroup") {
            let {id: userID, first_name: firstName} = newMembers[b];
            telegram.restrictChatMember(ctx.chat.id, newMembers[b].id,
                    Extra
                        .load({
                            can_send_messages: true,
                            can_send_media_messages: false,
                            can_send_other_messages: false,
                            can_add_web_page_previews: false
                        })
            )
            .then(restricted => console.log(`User ${firstName} (${userID}) was restircted? > ${restricted}`))
            .catch(err => {
                console.log(`Error happened, see message \n${err}`);
            })
        }
    }
})

//work with other messages
bot.on("message", (ctx) => {
    // console.log(ctx.message);
})

if (if_dev) {
    telegram.deleteWebhook();
    return url()
        .then(url => {
            URL = url + '/' + TG_TOKEN;
            bot.telegram.setWebhook(URL)
            bot.startWebhook('/' + TG_TOKEN, null, PORT);
        })
        .catch(err => { //catch error and do fallback
            console.log(`Error happened, fallback is going ...`);
            telegram.deleteWebhook(); //to be on save side;
            bot.startPolling();
        })
} else {
    if (URL) {
        URL += TG_TOKEN;
        telegram.deleteWebhook(); //to be on save side;
        bot.telegram.setWebhook(URL)
        bot.startWebhook('/' + TG_TOKEN, null, PORT);
    } else {
        telegram.deleteWebhook();
        bot.startPolling();
    }
}
