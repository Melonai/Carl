const {Command, Arguments, Discord} = require('../command.js');
const ytdlOpus = require('../utils/ytdl-opus.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

module.exports = new Command({
    name: 'Play',
    description: 'Play a song from YouTube.',
    handles: ['play', 'p'],
    execute: main,
    args: [Arguments.Any]
});

async function main(command, message, args) {
    if (typeof message.guild.data === 'undefined') {command.client.guildDataInit(message.guild)}

    const musicData = message.guild.data.music;

    const query = args.join(' ');

    const nextSong = async () => {
        if (musicData.queue.length !== 0) {
            const song = musicData.queue[0];
            const thumbnails = song.player_response.videoDetails.thumbnail.thumbnails;

            const embed = new Discord.MessageEmbed()
                .setTitle('Now Playing:')
                .setDescription(song.title)
                .setThumbnail(thumbnails[thumbnails.length-1].url)
                .addField("Added By:", song.user.tag, true)
                .addField("Duration:", song.duration, true)
                .setColor('#0069ff');

            message.channel.send(embed);

            const dispatcher = musicData.connection
                .play(await ytdlOpus(song.video_url, {highWaterMark: 1<<25}), {type: 'opus', highWaterMark: 50})
                .on('finish', () => {
                    musicData.queue.shift();
                    nextSong();
                })
                .on('error', r => command.client.logger.error(r.message));
            dispatcher.setVolumeLogarithmic(musicData.volume / 7);
        } else {
            if (musicData.connection) {
                musicData.connection.disconnect();
                musicData.connection = undefined;
                message.channel.send("The queue has finished! Use play to play more songs.")
            }
        }
    };

    const addSong = async (query) => {
        const song = await ytdl.getInfo(query);
        song.user = message.member.user;
        song.duration = new Date(song.length_seconds * 1000).toISOString().substr(11, 8);
        musicData.queue.push(song);

        const embed = new Discord.MessageEmbed()
            .setTitle('Added to queue:')
            .setDescription(song.title)
            .addField("Duration:", song.duration)
            .addField("Position in queue:", musicData.queue.length - 1)
            .setAuthor(song.user.tag, song.user.displayAvatarURL())
            .setColor('#ff9664');

        message.channel.send(embed);
    };

    if (ytdl.validateURL(query)) {
        await addSong(query);
    } else {
        message.channel.send(`Searching for: ${query}...`);
        const result = await ytsr(query, {limit: 5});
        for (let i = 0; i < result.items.length; i++) {
            if (result.items[i].type === 'video') {
                await addSong(result.items[i].link);
                break;
            }
        }
    }
    if (!musicData.connection && message.member.voice.channel) {
        musicData.connection = await message.member.voice.channel.join();
    }
    if (musicData.connection != null && musicData.connection.dispatcher == null) {
        await nextSong()
    }
}