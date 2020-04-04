const {Command, Arguments, Discord} = require('../command.js');

module.exports = new Command({
    name: 'Help',
    description: 'I\'ll help you with a command!',
    handles: ['help'],
    execute: main,
    args: [Arguments.Any]
});

async function main(command, message, args) {
    const commandToCheck = message.client.handles.get(args[0]);
    if (typeof commandToCheck !== 'undefined') {
        const embed = new Discord.MessageEmbed();
        const title = commandToCheck.name;
        const description = commandToCheck.description;
        embed.setTitle(title).setDescription(description);
        console.log(commandToCheck);
        embed.addField("Usage", commandToCheck.getUsage());
        embed.addField("Permission Level", commandToCheck.verify.name);
        message.channel.send(embed);
    }
}