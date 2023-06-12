const testFunction = async (text) => {
    const msg = [];
    const keyboard = [];

    msg.push('test');
    msg.push(text);

    return { msg, keyboard }
}

module.exports = testFunction;