const Discord = require('discord.js');

function formatText(arg) {
    if (!(typeof arg === 'undefined')) {
        return arg;
    }
}

function formatSome(arg) {
    if (!(typeof arg === 'undefined')) {
        return arg;
    }
}

function formatUser(arg, context) {
    if (typeof arg !== 'undefined') {
        let timestamp = Discord.SnowflakeUtil.deconstruct(arg).timestamp;
        if (timestamp > 1420070400000 && timestamp < new Date().getTime()) {
            return context.guild.member(arg.slice(3, -1));
        }
    }
}

function formatNumber(arg) {
    if (!isNaN(arg)) {
        return parseInt(arg);
    }
}

function formatRanged(arg, context) {
    let num = parseInt(arg);
    if (num >= context.arg.from && num <= context.arg.to) {
        return num;
    }
}

const types = new Discord.Collection([
    ['text', formatText],
    ['some', formatSome],
    ['user', formatUser],
    ['number', formatNumber],
    ['ranged', formatRanged],
]);

module.exports = types;