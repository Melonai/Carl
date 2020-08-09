const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'User Unlock',
    description: 'Unlocks the mentioned user.',
    handles: ['unlock-user'],
    args: {key: 'user_to_unlock', type: 'user'},
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['ADMINISTRATOR'],
    execute: main,
    flags: ['priority']
});

async function main(command, message, userToUnlock) {
    const lockData = message.guild.data.userLocks;
    const userId = userToUnlock.id;
    if (lockData.includes(userId)) {
        await command.client.send(`${userToUnlock.user.tag} has now been unlocked again!`, message.channel);
        lockData.splice(lockData.indexOf(userId), 1);
    } else {
        await command.client.send("This user wasn't locked in the first place.", message.channel);
    }
}