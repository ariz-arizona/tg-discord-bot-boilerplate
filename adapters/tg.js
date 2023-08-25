const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');
const testFunction = require('../tg/test');
const { replyMarkup } = require('../functions/helpers');
const { TG_TOKEN, CURRENT_HOST, CHAT_ERROR_ID, npm_package_name } = process.env;

const bot = new TelegramBot(TG_TOKEN);
bot.setWebHook(
    `${CURRENT_HOST}/tg${TG_TOKEN.replace(':', '_')}`,
    { allowed_updates: ["message", "edited_message", "callback_query", "inline_query"] }
);

bot.on('error', (error) => {
    console.log(error.code);
});

bot.on('polling_error', (error) => {
    console.log(error.code);
});

router.post(`/tg${TG_TOKEN.replace(':', '_')}`, async (_req, res) => {
    try {
        if (_req.body.message) {
            const chatId = _req.body.message.chat.id;
            const msgText = _req.body.message.text;

            try {
                console.log(`Message ${msgText} from ${chatId}`);

                if (msgText === '/test') {
                    const { msg, keyboard } = await testFunction(msgText);
                    bot.sendMessage(chatId, msg.join('\n'), replyMarkup(keyboard));
                }
            } catch (error) {
                console.log(error.message);
                bot.sendMessage(
                    CHAT_ERROR_ID || chatId,
                    [
                        npm_package_name,
                        error.message.slice(0, 512),
                    ].join('\n')
                )
            }
        } else if (_req.body.callback_query) {
            const callbackQuery = _req.body.callback_query;
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const chatId = msg.chat.id;

            try {
                console.log(`Callback ${action} from ${chatId}`);

                if (action.indexOf('test') === 0) {
                    const vars = action.split('_');
                    const [command, var1] = vars;
                    bot.editMessageReplyMarkup(
                        { inline_keyboard: [] },
                        { chat_id: chatId, message_id: message.message_id }
                    );

                    const { msg, keyboard } = await test(var1);
                    const markup = replyMarkup(keyboard, chatId, message.message_id);

                    bot.editMessageText(msg.join('\n'), markup);
                }
            } catch (error) {
                console.log(error.message);
                [
                    npm_package_name,
                    error.message.slice(0, 512),
                ].join('\n')
            }
            await bot.answerCallbackQuery(callbackQuery.id);
        }
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.log(error.message);
    }
});

module.exports = router;
