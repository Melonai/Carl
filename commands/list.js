const Discord = require('discord.js');
const Verification = require('../verification.js');

module.exports = {
    name: 'List',
    description: 'This will list all commands available to me.',
    handles: ['list'],
    verify: Verification.everyone,
    execute: main
};

const pageSize = 10;

async function main(message, args) {
    const pageNumber = (typeof args[0] === 'undefined') ? 1 : parseInt(args[0]);
    const pageAmount = Math.ceil(message.client.commands.length / pageSize);

    const embed = new Discord.MessageEmbed().setTitle('List of commands:');

    let commandPage = message.client.commands.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    commandPage.map(c => embed.addField(c.name, c.description));

    embed.setFooter(`Page ${pageNumber} out of ${pageAmount}`);

    message.channel.send(embed);
}