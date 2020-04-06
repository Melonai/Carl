const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Pause',
    description: 'Toggles the pause on the current song.',
    handles: ['pause'],
    execute: main,
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}
    const musicData = message.guild.data.music;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        if (musicData.connection.dispatcher.paused) {
            musicData.connection.dispatcher.resume();
            message.channel.send("Successfully resumed the current song.");
        } else {
            musicData.connection.dispatcher.pause();
            message.channel.send("Successfully paused the current song.");
        }
    }
}