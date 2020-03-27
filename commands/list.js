const Discord = require('discord.js');

module.exports = {
    name: 'List',
    description: 'This will list all commands available to me.',
    handles: ['list'],
    execute: main
};

function main(message, args) {
    const embed = new Discord.MessageEmbed().setTitle("List of commands:");

    message.channel.send(embed);
}