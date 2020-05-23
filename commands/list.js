const {Command, Discord} = require('../models/command.js');

module.exports = new Command({
    name: 'List',
    description: 'This will list all commands available to me.',
    handles: ['list'],
    execute: main,
    args: {key: 'page', type: 'ranged', from: 1, to: 3, optional: true, default: 1}
});

const pageSize = 10;

async function main(command, message, pageNumber) {
    const visibleCommands = command.client.commands.getVisibleCommands();
    const pageAmount = Math.ceil(visibleCommands.length / pageSize);
    command.args[0].to = pageAmount;
    const embed = new Discord.MessageEmbed().setTitle('List of commands:');

    let commandPage = visibleCommands.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    commandPage.forEach(c => embed.addField(c.name, c.description));

    embed.setFooter(`Page ${pageNumber} out of ${pageAmount}`);

    await command.client.send(embed, message.channel);
}