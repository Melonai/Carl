const {Command, Discord} = require('../models/command.js');

module.exports = new Command({
    name: 'Get Points',
    description: 'Returns your accumulated points.',
    handles: ['points'],
    execute: main
});

async function main(command, message) {
    const author = message.author;
    await command.client.database.getUser(author, (response) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Your points:`)
            .setDescription(`${author.username} has ${response.points} points!`)
            .setThumbnail(author.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
            .setColor('#ffaa00');

        command.client.send(embed, message.channel);
    });
}