const {Rule} = require('../models/rule.js');

module.exports = new Rule({
    name: 'Point Adder',
    condition: () => {return true},
    action: main,
    flags: ['no_logs']
});

async function main(message) {
    await message.client.database.addPoints(message.author, 1, rowCount => {
        if (rowCount === 0) {
            message.client.database.addUser(message.author);
        }
    });
}