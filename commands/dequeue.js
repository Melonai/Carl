const {Command, Arguments, Discord} = require('../command.js');

module.exports = new Command({
    name: 'Dequeue',
    description: 'Dequeue the song at the position given.',
    handles: ['dequeue'],
    execute: main,
    args: [Arguments.Number]
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}
    const musicData = message.guild.data.music;
    const songNumber = args[0];

    if (songNumber < musicData.queue.length) {
        const deletedSong = musicData.queue.splice(songNumber, 1)[0];

        const embed = new Discord.MessageEmbed()
            .setTitle('Removed from queue:')
            .setDescription(deletedSong.title)
            .addField("Added by:", deletedSong.user.tag)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor('#ff0030');

        message.channel.send(embed);
    } else {
        message.channel.send(`Can't find any song at position ${songNumber}.`)
    }

}