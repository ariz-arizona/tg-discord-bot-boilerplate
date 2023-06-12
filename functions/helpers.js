const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size)).fill().map((_, index) => index * chunk_size).map(begin => array.slice(begin, begin + chunk_size));

const replyMarkup = (keyboard, chat_id, message_id) => {
    let reply_markup;

    if (!keyboard.length && !chat_id && !message_id) reply_markup = {};

    if (keyboard && keyboard.length) reply_markup = { reply_markup: { inline_keyboard: keyboard } };

    if (chat_id) reply_markup.chat_id = chat_id;
    if (message_id) reply_markup.message_id = message_id;
}

const getPath = (_req) => {
    const isHttps = _req.headers.host.indexOf("localhost") !== -1 || _req.headers.host.indexOf("127.0.0.1") !== -1;
    return `http${isHttps ? "" : "s"}://${_req.headers.host
        }`;
};

module.exports = { array_chunks, replyMarkup, getPath }