const router = require("express").Router();
const { MessageComponentTypes } = require("discord-interactions");

const { sendErrorToDiscord, sendMsgToDiscord } = require("./send_msg_function");

const { DISCORD_TOKEN } = process.env;

router.post(`/test/${DISCORD_TOKEN}`, async (_req, res) => {
    const message = _req.body;
    try {
        const { token, guild_id, user_id } = message;
        
        const body = {
            content: "тестовое сообщение",
        }

        await sendMsgToDiscord(body, `${token}/messages/@original`, 'PATCH');
    } catch (error) {
        await sendErrorToDiscord(error, message.token);
    }
    res.sendStatus(200);
});

module.exports = router;