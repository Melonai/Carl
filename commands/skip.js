const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Skip',
    description: 'Skips the current song.',
    handles: ['skip', 's'],
    execute: main,
});

async function main(command, message) {
    const musicData = message.guild.data.music;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        musicData.connection.dispatcher.end();
        await command.client.send('Successfully skipped.', message.channel);
    } else {
        await command.client.send('There\'s nothing to skip!', message.channel);
    }
}