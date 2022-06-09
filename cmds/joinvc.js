

const config = require('../config.js');

const randomJoinedMessage = (vc) => {
    const messages = [
        `Joined ${vc.name}`,
        `Hmm, I'm in ${vc.name}`,
        `I'm in ${vc.name}`,
        `${vc.name}, beep boop`,
        `Sad to join ${vc.name}`,
        `${vc.name} is where I am now`,
        `May pogi raw sa ${vc.name} hehe`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
};

module.exports = {
    name: "joinvc",
    description: "Join a VC",
    async execute(msg, args, clientV12) {

        // Args:
        // args[0] = VC ID
        if (args.length < 1) {
            const userVC = msg.member.voice.channel;
            if (!userVC) {
                msg.reply(`You're not in a VC!`);
                return;
            };

            const vc = await clientV12.channels.cache.get(userVC.id);
            try {
                await vc.join().then((connection) => {
                    config.globals.currentVCs[msg.client.user.id] = connection;
                    msg.reply(randomJoinedMessage(vc))
                        .then((message) => {
                            setTimeout(() => {
                                message.delete();
                            }, 3000);
                        });
                });
            } catch (err) {
                msg.reply(`I couldn't join your VC!`)
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 3000);
                    });
            };
            return;
        };

        // Check if VC exists
        const vc = clientV12.channels.cache.get(args[0]);
        if (!vc || vc.type !== 'voice') {
            msg.reply('VC does not exist')
                .then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
        };

        // Try to join VC
        try {
            await vc.join().then((connection) => {
                config.globals.currentVCs[msg.client.user.id] = connection;
                msg.reply(randomJoinedMessage(vc))
                    .then((message) => {
                        setTimeout(() => {
                            message.delete();
                        }, 3000);
                    });
            });
        } catch (err) {
            msg.reply(`Failed to join ${vc.name}`)
                .then((message) => {
                    setTimeout(() => {
                        message.delete();
                    }, 3000);
                });
        };
    }
};