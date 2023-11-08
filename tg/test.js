const testFunction = async (text) => {
    const txt = [];
    const keyboard = [];

    txt.push('test');
    txt.push(text);

    return { txt, keyboard }
}

module.exports = testFunction;