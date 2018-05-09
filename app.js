
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

bot.start((ctx) => ctx.reply("Welcome! \nNow add me to your group(s) and make me admin. So I would be able to block any hostiles bots. I work better with supergroups.\nIf you need help, print/use command '/help' \nCheers 😜"));
bot.help((ctx) => ctx.reply('Send message to my master 👇\n@yuraWD (http://t.me/yuraWD)'));
bot.on("new_chat_members", (ctx) => {
    let rpl = "";
    let newMembers = ctx.message.new_chat_members;
    console.log("NEW CHAT MEMBERS\n", newMembers);
    console.log(`Bot id: ${bot.options.id}`)
    for (let b=0; b<newMembers.length; b++) {
        if (newMembers[b].id == bot.options.id) {
            console.log("me and myself - the bot lyrics");
            continue;
        };
        if (newMembers[b].is_bot) {
            telegram.kickChatMember(ctx.chat.id, newMembers[b].id).catch(err=>console.log(err));
            continue;
        };
        //restrict newcomers from posting medias&previews (only works in supergroup)
        telegram.restrictChatMember(ctx.chat.id, newMembers[b].id,
                Extra
                    .load({
                        can_send_messages: true,
                        can_send_media_messages: false,
                        can_send_other_messages: false,
                        can_add_web_page_previews: false
                    })
        ).catch(err => {
            console.log(`Error happened, see message \n${err}`);
        })
    }
})

if (if_dev) {
    telegram.deleteWebhook();
    return url()
        .then(url => {
            URL = url + '/' + TG_TOKEN;
            bot.telegram.setWebhook(URL)
            bot.startWebhook('/' + TG_TOKEN, null, PORT);
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
