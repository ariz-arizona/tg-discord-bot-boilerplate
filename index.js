require('dotenv').config(
    process.argv.includes('ENV=development') ? { path: 'test.env' } : {}
);

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { CURRENT_HOST, APP_PORT = 8443, DISCORD_APPLICATION_ID, npm_package_name } = process.env;

app.use(express.json({
    limit: '5mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/', require('./adapters/tg.js'));

app.use('/', require('./adapters/discord.js'));

app.use('/', require('./discord/test'));

app.get('/', async (_req, res) => {
    res.send(`Listening ${npm_package_name} on ${CURRENT_HOST}:${APP_PORT}`);
});

app.listen(APP_PORT, () => {
    console.log(`listening ${npm_package_name} on ${ APP_PORT }`);
});