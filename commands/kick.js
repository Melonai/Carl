const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Kick',
    description: 'Kicks the user mentioned.',
    handles: ['kick'],
    execute: main,
    userPermissions: ['KICK_MEMBERS'],
    botPermissions: ['KICK_MEMBERS'],
    args: {key: "member_to_kick", type: 'user'}
});

async function main(command, message, memberToKick) {
    await memberToKick.kick();
    await command.client.send(`Successfully kicked ${memberToKick.user.tag}.`, message.channel);
}