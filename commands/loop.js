const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Loop',
    description: 'Toggles loop on the current song.',
    handles: ['loop'],
    execute: main,
});

async function main(command, message) {
    const musicData = message.guild.data.music;
    if (musicData.connection != null) {
        if (musicData.loop) {
            musicData.loop = false;
            await command.client.send('The current song is no longer on loop.', message.channel);
        } else {
            musicData.loop = true;
            await command.client.send('The current song is now on loop!', message.channel);
        }
    } else {
        await command.client.send('I\'m not connected to any voice channel!', message.channel);
    }
}