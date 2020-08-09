const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Channel Lock',
    description: 'Locks the current channel',
    handles: ['channel-lock', 'lock'],
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: ['ADMINISTRATOR'],
    execute: main,
});

async function main(command, message) {
    const lockData = message.guild.data.channelLocks;
    const channelID = message.channel.id;
    if (!lockData.includes(channelID)) {
        await command.client.send("This channel has now been locked.", message.channel);
        lockData.push(channelID);
    }
}