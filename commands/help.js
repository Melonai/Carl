const Discord = require('discord.js');

module.exports = {
    name: 'Help',
    description: 'I\'ll help you with a command!',
    handles: ['help'],
    execute: main
};

function main(message, args) {
    const title = message.client.commands.get(args[0]).name;
    const description = message.client.commands.get(args[0]).description;
    message.channel.send(new Discord.MessageEmbed().setTitle(title).setDescription(description));
}