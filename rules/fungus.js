const {Rule} = require('../models/rule.js');

module.exports = new Rule({
    name: 'Fungus',
    triggers: ['fungus'],
    action: (r, message) => message.react('🍄')
});