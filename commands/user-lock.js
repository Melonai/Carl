const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'User Lock',
    description: 'Locks the mentioned user.',
    handles: ['lock-user'],
    args: {key: 'user_to_lock', type: 'user'},
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['ADMINISTRATOR'],
    execute: main,
});

async function main(command, message, userToLock) {
    const lockData = message.guild.data.userLocks;
    const userId = userToLock.id;
    if (!lockData.includes(userId)) {
        await command.client.send(`${userToLock.user.tag} has now been locked!`, message.channel);
        lockData.push(userId);
    }
}