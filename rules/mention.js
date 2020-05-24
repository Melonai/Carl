const {Rule} = require('../models/rule.js');

module.exports = new Rule({
    name: 'Mention React',
    condition: (message) => message.mentions.has(message.client.user),
    action: (r, message) => message.react('👀')
});