// Environment variables
require('dotenv').config();
// Logger
const logger = require('./logger.js');

const Discord = require('discord.js-selfbot');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Check if './database' folder exists, if not create it
if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
};
// Check if './database/bot.db' file exists, if not create it
if (!fs.existsSync('./database/bot.db')) {
    fs.openSync('./database/bot.db', 'w');
};

const bots = [
    `${process.env.TOKEN1}`,
];

require('./stayAwake.js');

const timestamp = Date.now();

// Check if bot table exist. If not, create it
const db = new sqlite3.Database('./database/bot.db', (err) => {
    if (err) {
        console.error(err.message);
    };
    // Only create table for the botID and their VC ID
    db.run(`CREATE TABLE IF NOT EXISTS bot (
        botID TEXT,
        vcID TEXT
    )`, (err) => {
        if (err) {
            console.error(err.message);
        };
    });
});

bots.forEach((token) => {

    let currentVC = null;

    const client = new Discord.Client();
    client.on('ready', () => {
        console.log(logger.blue('Bot is ready!'), logger.green(`Logged in as ${client.user.tag}!`));
        // client.user.setMute(true);

        // Check if bot is in the database
        db.get(`SELECT * FROM bot WHERE botID = '${client.user.id}'`, (err, row) => {
            if (err) {
                console.error(err.message);
            };
            // If bot is not in the database, add it
            if (!row) {
                db.run(`INSERT INTO bot (botID, vcID) VALUES ('${client.user.id}', 'null')`, (err) => {
                    if (err) {
                        console.error(err.message);
                    };
                });
            };
            // If bot is in the database, check if it has a VC ID
            if (row) {
                if (row.vcID == 'null') { return };
                if (row.vcID == 'undefined') { return };
                if (row.vcID == null) { return };

                try {
                    client.channels.cache.get(row.vcID).join().then((connection) => {
                        currentVC = connection;
                        console.log(logger.green(`Joined ${client.channels.cache.get(row.vcID).name}`));
                    });
                } catch(err) {
                    db.run(`UPDATE bot SET vcID = 'null' WHERE botID = '${client.user.id}'`, (err) => {
                        if (err) {
                            console.error(err.message);
                        };
                    });
                };
            };
        });
    });

    client.on('message', async (msg) => {
        // Ignore messages from bots
        if (msg.author.bot) { return };

        // Return if message is not from the owner
        if (msg.author.id != `${process.env.OWNER_ID}`) { return };

        const content = msg.content;

        // Return if the message doesn't start with the prefix
        if (content.split('')[0] != '!') { return };

        if (msg.content.toLowerCase().startsWith('!eval')) {
            try {
                const code = content.split(' ').slice(1).join(' ');
                let evaled = eval(code);
                if (typeof evaled !== 'string') {
                    evaled = require('util').inspect(evaled);
                };
                msg.channel.send(evaled, { code: 'xl' });
            } catch (err) {
                msg.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
            };
        };
        const trimed = content.replace(/\s+/g,' ');
        const args = trimed.split(' ').slice(1);

        if (content.toLowerCase().startsWith('!joinvc')) {
            // Check if the args includs an id
            if (args.length == 0) {
                // Find the voice channel the user is in
                const userVC = msg.member.voice.channel;
                if (userVC) {
                    // Join the voice channel
                    await userVC.join().then((connection) => {
                        currentVC = connection;
                        // Get the VC ID
                        const vcID = userVC.id;
                        // Update the database with the VC ID
                        db.run(`UPDATE bot SET vcID = '${vcID}' WHERE botID = '${client.user.id}'`, (err) => {
                            if (err) {
                                console.error(err.message);
                            };
                        });
                        msg.channel.send(`Joined ${userVC.name}`)
                            .then((message) => {
                                setTimeout(() => {
                                    message.delete();
                                }, 5000);
                            });

                    }).catch((err) => {
                        msg.channel.send(`Error joining ${userVC.name}`)
                            .then((message) => {
                                setTimeout(() => {
                                    message.delete();
                                }, 5000);
                            });
                        console.log(err);
                    });
                };
                return;
            };

            // Join the voice channel
            await client.channels.cache.get(args[0]).join().then((connection) => {
                currentVC = connection;
                // Get the VC ID
                const vcID = args[0];
                // Update the database with the VC ID
                db.run(`UPDATE bot SET vcID = '${vcID}' WHERE botID = '${client.user.id}'`, (err) => {
                    if (err) {
                        console.error(err.message);
                    };
                });
                msg.channel.send(`Joined ${args[0]}`)
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 5000);
                    });

            }).catch((err) => {
                msg.channel.send(`Error joining ${args[0]}`)
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 5000);
                    });
                console.log(err);
            });
        };

        // Update the bot's activity
        if (content.toLowerCase().startsWith('!leavevc')) {
            if (currentVC) {
                currentVC.disconnect();
                currentVC = null;
                msg.channel.send('Left voice channel')
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 5000);
                    });
                // Update the database with the VC ID
                db.run(`UPDATE bot SET vcID = 'null' WHERE botID = '${client.user.id}'`, (err) => {
                    if (err) {
                        console.error(err.message);
                    };
                });
            } else {
                msg.channel.send('Not in a voice channel')
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 5000);
                    });
            };
        };
    });

    // Listen to when the client is moved to diffent voice channel
    client.on('voiceStateUpdate', (oldMember, newMember) => {
        // Check if this user is the bot
        if (newMember.id != client.user.id) { return };
        if (oldMember.id != client.user.id) { return };
        // Check if the bot is in a voice channel
        if (newMember) {
            // Get the VC ID
            const vcID = newMember.channelID;
            // Update the database with the VC ID
            db.run(`UPDATE bot SET vcID = '${vcID}' WHERE botID = '${client.user.id}'`, (err) => {
                if (err) {
                    console.error(err.message);
                };
            });
        };
    });

    client.login(token);

});
