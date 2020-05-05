const {Command, Discord} = require('../command.js');

module.exports = new Command({
    name: 'Dequeue',
    description: 'Dequeue the song at the position given.',
    handles: ['dequeue'],
    execute: main,
    args: {key: 'song_number', type: 'number'}
});

async function main(command, message, songNumber) {
    const musicData = message.guild.data.music;

    if (songNumber < musicData.queue.length) {
        const deletedSong = musicData.queue.splice(songNumber, 1)[0];

        const embed = new Discord.MessageEmbed()
            .setTitle('Removed from queue:')
            .setDescription(deletedSong.title)
            .addField("Added by:", deletedSong.user.tag)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#ff0030');

        await command.client.send(embed, message.channel);
    } else {
        await command.client.send(`Can't find any song at position ${songNumber}.`, message.channel);
    }
}