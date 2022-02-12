// Environment variables
require('dotenv').config();
// Logger
const logger = require('./logger.js');

const Discord = require('discord.js-selfbot');

const bots = [
    `${process.env.TOKEN1}`,
    `${process.env.TOKEN2}`,
    `${process.env.TOKEN3}`,
    `${process.env.TOKEN4}`,
    `${process.env.TOKEN5}`,
    `${process.env.TOKEN6}`,
    `${process.env.TOKEN7}`,
    `${process.env.TOKEN8}`,
    `${process.env.TOKEN9}`,
    `${process.env.TOKEN10}`,
    `${process.env.TOKEN11}`,
    `${process.env.TOKEN12}`,
];

require('./stayAwake.js');

const timestamp = Date.now();

bots.forEach((token) => {

    const client = new Discord.Client();
    client.on('ready', () => {
        console.log(logger.blue('Bot is ready!'), logger.green(`Logged in as ${client.user.tag}!`));
        // client.user.setMute(true);
    });

    let currentVC = null;

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
                        msg.channel.send(`Joined ${userVC.name}`);

                    }).catch((err) => {
                        msg.channel.send(`Error joining ${userVC.name}`);
                        console.log(err);
                    });
                };
                return;
            };

            // Join the voice channel
            await client.channels.cache.get(args[0]).join().then((connection) => {
                currentVC = connection;
                msg.channel.send(`Joined ${args[0]}`);

            }).catch((err) => {
                msg.channel.send(`Error joining ${args[0]}`);
                console.log(err);
            });
        };

        // Update the bot's activity
        if (content.toLowerCase().startsWith('!leavevc')) {
            if (currentVC) {
                currentVC.disconnect();
                currentVC = null;
                msg.channel.send('Left voice channel');
            } else {
                msg.channel.send('Not in a voice channel');
            };
        };
    });

    // Listen to when the client is moved to diffent voice channel
    client.on('voiceStateUpdate', (oldMember, newMember) => {
        try {
            currentVC = newMember.voice.channel;
        } catch (err) {};
        try {
            currentVC = oldMember.voice.channel;
        } catch (err) {};
    });

    client.login(token);

});
