const {Command, Discord} = require('../command.js');

module.exports = new Command({
    name: 'Queue',
    description: 'Shows the current queue.',
    handles: ['queue'],
    execute: main,
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}
    const musicData = message.guild.data.music;
    const embed = new Discord.MessageEmbed().setTitle("Queue").setColor('#00ffaa');
    message.guild.data.music.queue.forEach((s, i) => {
        embed.addField(`[#${i}] - Added by: ${s.user.tag}`, s.title);
    });
    message.channel.send(embed);
}