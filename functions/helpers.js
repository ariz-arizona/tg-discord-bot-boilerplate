const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

const replyMarkup = (keyboard, chat_id, message_id) => {
    let reply_markup;

    if (!keyboard.length && !chat_id && !message_id) reply_markup = {};

    if (keyboard && keyboard.length) reply_markup = { reply_markup: { inline_keyboard: keyboard } };

    if (chat_id) reply_markup.chat_id = chat_id;
    if (message_id) reply_markup.message_id = message_id;
    
    return reply_markup;
}

const errorMsg = (error, chatId) => {
    return [
        npm_package_name,
        npm_package_version,
        chatId,
        error.message.toString().slice(0, 100)
    ].join('\n')
}

const template = (string, obj) => {
    var s = typeof string === 'object' ? string.join('\n') : string;
    if (!s) s = 'no text found';
    for (var prop in obj) {
        s = s.replace(new RegExp('{' + prop + '}', 'gm'), obj[prop]);
    }
    return s;
}


module.exports = { array_chunks, replyMarkup, errorMsg, template}