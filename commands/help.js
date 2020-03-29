const Discord = require('discord.js');
const Verification = require('../verification.js');

module.exports = {
    name: 'Help',
    description: 'I\'ll help you with a command!',
    handles: ['help'],
    verify: Verification.everyone,
    execute: main
};

async function main(message, args) {
    const title = message.client.handles.get(args[0]).name;
    const description = message.client.handles.get(args[0]).description;
    message.channel.send(new Discord.MessageEmbed().setTitle(title).setDescription(description));
}