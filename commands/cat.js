const {Command, Discord} = require('../models/command.js');
const fetch = require("node-fetch");

module.exports = new Command({
    name: 'Cat',
    description: 'Gives you a random kitty! Meow!',
    handles: ['cat'],
    execute: main
});

async function main(command, message) {
    const headers = {
        'X-API-KEY': process.env.CAT_API_TOKEN
    };
    const query_data = {
        'mime_types': 'jpg,png',
        'limit': 1
    };

    let url = new URL('https://api.thecatapi.com/v1/images/search');
    Object.keys(query_data).forEach(key => url.searchParams.append(key, query_data[key]));
    const response = await fetch(url, {headers}).then(res => res.json());

    const embed = new Discord.MessageEmbed();
    const catTitles = ['Mrroow!', 'Purr~', 'mew!', 'Meow!', 'Nya~', 'MEOW!'];
    embed.setTitle(catTitles[Math.floor(Math.random() * catTitles.length)]);
    embed.setImage(response[0].url);
    await command.client.send(embed, message.channel);
}