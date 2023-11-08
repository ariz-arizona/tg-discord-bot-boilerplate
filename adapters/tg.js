const router = require('express').Router();
const TelegramBot = require('node-telegram-bot-api');

const testFunction = require('../tg/test');
const { replyMarkup, template, errorMsg } = require('../functions/helpers');
const texts = require('../txt');

const { TG_TOKEN, CURRENT_HOST, CHAT_ERROR_ID } = process.env;

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

let step = {};
let stepAdditionalData = {};

router.post(`/tg${TG_TOKEN.replace(':', '_')}`, async (_req, res, next) => {
    let command = '';
    if (_req.body.message) {
        const chatId = _req.body.message.chat.id;
        const msgText = _req.body.message.text;
        const isPersonalChat = chatId > 0;

        if (!isPersonalChat) {
            command = 'not_personal';
        } else if (msgText === '/start') {
            command = 'start';
            stepAdditionalData[chatId] = {};
        } else if (msgText === '/test') {
            command = 'test';
        }
    } else if (_req.body.callback_query) {
        const callbackQuery = _req.body.callback_query;
        const action = callbackQuery.data;
        command = action.split('-')[0]
    }
    res.sendStatus(200);

    if (command) {
        res.command = command;
        next()
    }
}, async (_req, res, next) => {
    if (_req.body.message) {
        const chatId = _req.body.message.chat.id;
        const msgText = _req.body.message.text || '';
        const command = res.command;
        try {
            console.log(`Command ${command} / step ${step[chatId]} in message ${msgText} from ${chatId}`);
            const txt = [];
            const keyboard = [];
            switch (command) {
                case 'start':
                    txt.push(texts[command]);
                    await bot.sendMessage(chatId, template(txt));
                    break;
                case 'test':
                    const testMsg = await testFunction(msgText);
                    await bot.sendMessage(chatId, template(testMsg.txt), replyMarkup(testMsg.keyboard));
                    break;
                default:
                    console.log(`No action for command ${command} in message ${msgText} from ${chatId}`);
            }

        } catch (error) {
            await bot.sendMessage(CHAT_ERROR_ID, errorMsg(error, chatId));
            console.log(error.message);
        }
    } else if (_req.body.callback_query) {
        const callbackQuery = _req.body.callback_query;
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        const chatId = msg.chat.id;
        const command = res.command;

        try {
            console.log(`Callback ${action} from ${chatId}`);
            const txt = [];
            const keyboard = [];

            bot.editMessageReplyMarkup(
                { reply_markup: { inline_keyboard: {} } },
                { chat_id: chatId, message_id: msg.message_id }
            );

            switch (command) {
                case 'test':
                    break;
                default:
                    console.log(`No callback for command ${command} in action ${action} from ${chatId}`);
            }
        } catch (error) {
            await bot.sendMessage(chatId, texts.error);
            console.log(error);
            bot.sendMessage(CHAT_ERROR_ID, errorMsg(error, chatId));
        }
        await bot.answerCallbackQuery(callbackQuery.id);
    }
    next();
});

module.exports = router;
