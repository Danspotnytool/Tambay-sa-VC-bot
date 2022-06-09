
const path = require('path');
const fs = require('fs');

const config = require('../config.js');

module.exports = {
    name: "sethomevc",
    description: "Set the bot's home VC",
    execute(msg, args, i) {
        // Args:
        // args[0] = VC ID
        if (args.length < 1) {
            msg.reply('Please provide a VC ID')
                .then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
            return;
        };
        
        // Check if VC exists
        const vc = msg.guild.channels.cache.get(args[0]);
        if (!vc || vc.type !== 'GUILD_VOICE') {
            msg.reply('Please provide a valid VC ID')
                .then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
            return;
        };

        // Set VC
        const records = JSON.parse(fs.readFileSync(path.join(__dirname, '../records.json')));
        records.homeVCs = args[0];
        fs.writeFileSync(path.join(__dirname, '../records.json'), JSON.stringify(records, null, 4));

        msg.reply(`Set home VC to ${vc.name}`)
            .then((message) => {
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });
    }
};