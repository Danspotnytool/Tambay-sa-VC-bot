
const config = require('../config.js');

module.exports = {
    name: "ping",
    description: "The bot's latency",
    execute(msg, args, i) {
        msg.reply(`Pong! Latency: ${Math.floor(Date.now() - msg.createdTimestamp)}ms`)
            .then((message) => {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            }).catch(console.error);
    }
};