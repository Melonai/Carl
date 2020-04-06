const {Command, Arguments} = require('../command.js');

module.exports = new Command({
    name: 'Set Volume',
    description: 'Sets the volume for the music playing.',
    handles: ['volume', 'set-volume'],
    execute: main,
    args: [new Arguments.Ranged(1, 10)]
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}
    const musicData = message.guild.data.music;
    const oldVolume = musicData.volume;
    musicData.volume = args[0];
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        musicData.connection.dispatcher.setVolumeLogarithmic(musicData.volume / 7);
    }
    message.channel.send(`Successfully changed volume from ${oldVolume} to ${args[0]}.`)
}