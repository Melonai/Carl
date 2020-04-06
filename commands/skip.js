const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Skip',
    description: 'Skips the current song.',
    handles: ['skip'],
    execute: main,
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}
    const musicData = message.guild.data.music;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        musicData.connection.dispatcher.end();
        message.channel.send("Successfully skipped.");
    } else {
        message.channel.send("There's nothing to skip!");
    }
}