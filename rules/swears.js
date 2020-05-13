const {Rule} = require('../models/rule.js');
const config = require('../config.json');

module.exports = new Rule({
    name: 'Swears',
    triggers: config.banned_words,
    flags: ['blocks_commands']
});