### Telegram antispam bot

Aim of the bot is to limit another bots to be added to managed Telegram groups as well as restrict some functionalities of  newcomers (available only for supergroups - see details [here](https://telegram.org/blog/supergroups)) .

##### How it works?

1. Start the bot -> http://t.me/against_spam_bot (@against_spam_bot)

2. Then add this bot to your Telegram group (how to add new member see [here](https://telegram.org/faq#q-how-do-i-add-more-members-what-39s-an-invite-link))

3. Assign admin rights to the bot

   3.1. If your group is normal group -> just make it admin; it is recommended to turn off option 'all members of group is admins'

   3.2. If your group is supergroup -> bot could be only assigned with rights to ban users; it won't need any other rights in supergroup. Firstly you add the bot to admins, than assign right to ban users

4. It works :)



***If you need help write directly to the [Group on Telegram](https://t.me/againstspam).***



###### Run own instance of bot

You could run you own bot. Just register on heroku.com, clone this repo, make you Telegram bot with @BotFather, set up heroku's environvental variables such as TG_TOKEN (telegram bot token) and HEROKU_URL (url of your app on heroku) and spin it off.



`Credits`

This bot works on great bot framework -> [Telegraf.js](https://telegraf.js.org). GitHub link -> https://github.com/telegraf/telegraf
