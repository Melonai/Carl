const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Set Volume',
    description: 'Sets the volume for the music playing.',
    handles: ['volume', 'set-volume'],
    execute: main,
    args: {key: 'new_volume', type: 'ranged', from: 0, to: 10}
});

async function main(command, message, newVolume) {
    const musicData = message.guild.data.music;
    const oldVolume = musicData.volume;
    musicData.volume = newVolume;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        musicData.connection.dispatcher.setVolumeLogarithmic(musicData.volume / 7);
    }
    await command.client.send(`Successfully changed volume from ${oldVolume} to ${newVolume}.`, message.channel);
}