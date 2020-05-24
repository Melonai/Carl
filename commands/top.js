const {Command, Discord} = require('../models/command.js');

module.exports = new Command({
    name: 'Leaderboard',
    description: 'Returns the full leaderboard of users.',
    handles: ['top', 'leaderboard'],
    execute: main
});

async function main(command, message) {
    if (command.client.database.connectionExists()) {
        await command.client.database.getTopUsers(async (response) => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`The Leaderboard:`)
                .setColor('#ffaa00');

            let place = 1;
            for (let userRow of response.slice(0, 9)) {
                let user = await command.client.users.fetch(userRow.id);
                embed.addField(`Place ${place}`, `${user.username}: ${userRow.points}`);
                place++;
            }

            await command.client.send(embed, message.channel);
        });
    } else {
        await command.client.send('There\'s currently no database connection to pull the points from.', message.channel);
    }
}