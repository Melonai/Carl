const {Rule} = require('../rule.js');

module.exports = new Rule({
    name: 'Mention React',
    condition: (message) => message.mentions.has(message.client.user),
    action: (message) => message.react('👀')
});