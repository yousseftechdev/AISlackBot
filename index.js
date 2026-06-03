const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/asb-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/asb-help", async ({ ack, respond }) => {
    await ack();
    await respond({
        text:
            `Available Commands:
/asb-ping - Check bot latency
/asb-help - List available commands
/asb-calc [expression] - Calculate a mathematical expression (e.g., /asb-calc 2+2*3)
/asb-joke - Get a random joke`
    });
});

app.command("/asb-calc", async ({ command, ack, respond }) => {
    await ack();
    const userInput = command.text;
    await respond({
        text: eval(userInput).toString()
    });
});

app.command("/asb-joke", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text:
                `${response.data.setup}

${response.data.punchline}`
        });
    } catch (err) {
        await respond({ text: "Failed to fetch a joke." });
    }
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();