const {Rule} = require('../models/rule.js');

module.exports = new Rule({
    name: 'Point Adder',
    condition: () => {return true},
    action: main,
    flags: ['no_logs']
});

async function main(message) {
    const currentTime = new Date().getTime();
    if (!message.author.lastMessageTimestamp || message.author.lastMessageTimestamp + 60000 < currentTime) {
        if (message.client.database.connectionExists()) {
            await message.client.database.addPoints(message.author, 1, rowCount => {
                if (rowCount === 0) {
                    message.client.database.addUser(message.author);
                }
                message.author.lastMessageTimestamp = currentTime;
            });
        }
    }
}