const router = require("express").Router();
const fetch = require("cross-fetch");
const {
  InteractionType,
  InteractionResponseType,
  verifyKey,
  InteractionResponseFlags,
  MessageComponentTypes,
} = require("discord-interactions");

const {  getPath } = require("../functions/helpers");

const { DISCORD_PUB_KEY, DISCORD_TOKEN } = process.env;

router.post(`/discord`, async (_req, res) => {
  const signature = _req.headers["x-signature-ed25519"];
  const timestamp = _req.headers["x-signature-timestamp"];
  const isValidRequest = verifyKey(
    _req.rawBody,
    signature,
    timestamp,
    DISCORD_PUB_KEY
  );

  if (!isValidRequest) {
    return res.status(401).send({ error: "Bad request signature " });
  }

  const message = _req.body;

  if (message.type === InteractionType.PING) {
    res.status(200).send({
      type: InteractionResponseType.PONG,
    });
  } else if (
    message.type === InteractionType.APPLICATION_COMMAND ||
    message.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE ||
    message.type === InteractionType.MESSAGE_COMPONENT
  ) {
    try {
      const command = message.data.name || message.data.custom_id;

      const options = {};
      if (message.data.options) {
        message.data.options.map((el) => {
          options[el.name] = el.value;
        });
      }
      if (message.data.custom_id) {
        options[message.data.custom_id] = message.data.values;
      }

      console.log(`Получена команда ${command}\n${JSON.stringify(options)}`);

      const { guild_id, token } = message;
      const { user } = message.member;

      switch (command) {
        case "test":
          fetch(`${getPath(_req)}/test/${DISCORD_TOKEN}`, {
            method: "post",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({ token, guild_id, user_id: user.id }),
          });

          await new Promise((resolve) => setTimeout(resolve, 200));

          res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Пользователь <@${user.id}> что-то написал`,
            },
          });

          break;

        default:
          res.status(200).send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              flags: InteractionResponseFlags.EPHEMERAL,
              content: `Я этого не умею :(`,
            },
          });
      }
    } catch (error) {
      console.log(error);
      res.status(200).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: error.message,
        },
      });
    }
  } else {
    res.status(400).send({ error: "Unknown Type" });
  }
});

module.exports = router;