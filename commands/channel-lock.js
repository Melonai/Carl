const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Channel Lock',
    description: 'Locks the current channel',
    handles: ['channel-lock', 'lock'],
    execute: main,
});

async function main(command, message) {
    const lockData = message.guild.data.locks;
    const channelID = message.channel.id;
    if (!lockData.includes(message.channel.id)) {
        await command.client.send("The channel has now been unlocked", message.channel);
        lockData.push(channelID);
    }
}