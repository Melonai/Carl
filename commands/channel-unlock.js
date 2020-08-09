const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Channel Unlock',
    description: 'Unlocks the current channel',
    handles: ['channel-unlock', 'unlock'],
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['ADMINISTRATOR'],
    execute: main,
    flags: ["priority"]
});

async function main(command, message) {
    const lockData = message.guild.data.channelLocks;
    const channelID = message.channel.id;
    if (lockData.includes(channelID)) {
        await command.client.send("This channel has now been unlocked again!", message.channel);
        lockData.splice(lockData.indexOf(channelID), 1);
    } else {
        await command.client.send("This channel wasn't locked in the first place.", message.channel);
    }
}