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
    const command = message.client.handles.get(args[0]);
    if (typeof command !== 'undefined') {
        const embed = new Discord.MessageEmbed();
        const title = command.name;
        const description = command.description;
        embed.setTitle(title).setDescription(description);
        embed.addField("Usage", "carl " + command.handles[0]);
        embed.addField("Permission Level", command.verify.name);
        message.channel.send(embed);
    }
}