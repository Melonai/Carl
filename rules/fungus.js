const {Rule} = require('../rule.js');

module.exports = new Rule({
    name: 'Fungus',
    triggers: ['fungus'],
    action: (message) => message.react('🍄')
});