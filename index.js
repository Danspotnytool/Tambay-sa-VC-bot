require('dotenv').config();

const DiscordV13 = require('discord.js-selfbot-v13');
const DiscordV12 = require('discord.js-selfbot');

const path = require('path');
const fs = require('fs');


// Check if './records.json' exists
if (!fs.existsSync('./records.json')) {
    fs.writeFileSync('./records.json',
`{
    "homeVCs": null,
    "autoJoinHomeVC": false
}`  );
};


// Load all commands in ./cmds/
const commandsFolder = fs.readdirSync(path.join(__dirname, './cmds/')).filter(file => file.endsWith('.js'));
const commands = {};
for (const file of commandsFolder) {
    const command = require(`./cmds/${file}`);
    commands[command.name] = command;
};

const config = require('./config.js');

const tokens = [
    process.env.TOKEN_1,
    process.env.TOKEN_2,
    process.env.TOKEN_3
];

console.log(`Starting with ${tokens.length} tokens`);


let deployedBot = 0.00;
let allBotsDeployed = false;
const ready = () => {
    if (deployedBot === tokens.length) {
        allBotsDeployed = true;
        console.log(`All ${deployedBot} bots are ready`);
        return;
    };
};

for (const token of tokens) {
    const clientV13 = new DiscordV13.Client();
    const clientV12 = new DiscordV12.Client();

    clientV13.on('ready', () => {
        console.log(`${clientV13.user.tag} V13 is ready`);
        config.globals.bots.push(clientV13.user.id);
        deployedBot += 0.50;
        ready();
    });
    clientV12.on('ready', () => {
        console.log(`${clientV12.user.tag} V12 is ready`);
        deployedBot += 0.50;
        ready();
    });

    clientV13.on('messageCreate', async (msg) => {
        if (msg.author.bot) { return };
        if (!msg.content.startsWith(config.prefix)) { return };
        if (!allBotsDeployed) { return };

        const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();

        if (!commands[commandName]) { return };

        commands[commandName].execute(msg, args, clientV12);
    });

    clientV13.login(token).catch(console.error);
    clientV12.login(token).catch(console.error);
};