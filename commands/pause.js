const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Pause',
    description: 'Toggles the pause on the current song.',
    handles: ['pause'],
    execute: main,
});

async function main(command, message) {
    const musicData = message.guild.data.music;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        if (musicData.connection.dispatcher.paused) {
            musicData.connection.dispatcher.resume();
            await command.client.send('Successfully resumed the current song.', message.channel);
        } else {
            musicData.connection.dispatcher.pause();
            await command.client.send('Successfully paused the current song.', message.channel);
        }
    } else {
        await command.client.send('There\'s nothing currently playing.', message.channel);
    }
}