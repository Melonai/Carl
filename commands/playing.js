const {Command, Discord} = require('../command.js');

module.exports = new Command({
    name: 'Currently Playing',
    description: 'Displays the current song playing.',
    handles: ['current', 'playing', 'c'],
    execute: main
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}

    const musicData = message.guild.data.music;
    if (musicData.connection != null && musicData.connection.dispatcher != null) {
        const song = musicData.queue[0];
        const thumbnails = song.player_response.videoDetails.thumbnail.thumbnails;
        const embed = new Discord.MessageEmbed()
            .setTitle('Currently Playing:')
            .setDescription(song.title)
            .setThumbnail(thumbnails[thumbnails.length - 1].url)
            .addField("Added By:", song.user.tag, true)
            .addField("Duration:", `${new Date(musicData.connection.dispatcher.streamTime).toISOString().substr(11, 8)} / ${song.duration}`, true)
            .setColor('#0069ff');
        message.channel.send(embed);
    } else {
        message.channel.send("Nothing is currently playing.");
    }
}