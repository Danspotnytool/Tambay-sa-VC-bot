
const config = require('../config.js');

const randomLeftMessage = (vc) => {
    const messages = [
        `Left ${vc.name}`,
        `Hmm, I'm not in ${vc.name} anymore`,
        `Wala na ampangit na sa ${vc.name}`,
        `${vc.name}, boop beep`,
        `Sad to leave ${vc.name}`,
        `${vc.name} is where I was before`,
        `Walang pogi sa ${vc.name} sad`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

module.exports = {
    name: "leavevc",
    description: "Leave a VC",
    async execute(msg, args, i) {
        // Check if the bot is in a VC
        if (!config.globals.currentVCs[msg.client.user.id]) {
            msg.reply('I\'m not in a VC')
                .then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
            return;
        };

        // Leave VC
        const vc = config.globals.currentVCs[msg.client.user.id];
        await vc.disconnect();

        msg.reply(randomLeftMessage(vc.channel))
            .then((message) => {
                config.globals.currentVCs[msg.client.user.id] = null;
                setTimeout(() => {
                    message.delete();
                }, 3000);
            });
    }
};