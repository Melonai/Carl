const {Command, Discord} = require('../models/command.js');
const choose = require('../utils/choose.js');
const getImagesForSubreddit = require('../utils/reddit-image.js');

module.exports = new Command({
    name: 'Meme',
    description: 'Shows you a SPICY meme!',
    handles: ['meme'],
    execute: main
});

async function main(command, message) {
    const subreddit = 'dankmemes';
    const post = choose(await getImagesForSubreddit(subreddit));
    const embed = new Discord.MessageEmbed()
        .setTitle(post.data.title)
        .setImage(post.data.url)
        .setFooter(`↑ ${post.data.score} | From r/${post.data.subreddit}`);
    await command.client.send(embed, message.channel)
}