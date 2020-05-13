const {Command, Verification} = require('../models/command.js');

module.exports = new Command({
    name: 'Kick',
    description: 'Kicks the user mentioned.',
    handles: ['kick'],
    execute: main,
    args: {key: "member_to_kick", type: 'user'},
    verify: Verification.admin
});

async function main(command, message, memberToKick) {
    await memberToKick.kick();
    await command.client.send(`Successfully kicked ${memberToKick.user.tag}.`, message.channel);
}