require('dotenv').config();

module.exports = {
    globals: {
        /**
         * Bot IDs
         * @type {Array<string>}
         */
        bots: [],
        /**
         * Object containing the current VCs of each bot
         * @type {Object}
         */
        currentVCs: {}
    },
    master: process.env.MASTER,
    prefix: process.env.PREFIX || '><'
};