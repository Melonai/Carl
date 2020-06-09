const {Command, Discord} = require('../models/command.js');
const getSubtitles = require('../utils/subtitle-grabber.js');
const ytdlOpus = require('../utils/ytdl-opus.js');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsr = require('ytsr');

module.exports = new Command({
    name: 'Play',
    description: 'Play a song from YouTube.',
    handles: ['play', 'p'],
    execute: main,
    args: {key: 'query', type: 'text'}
});

async function main(command, message, query) {
    const musicData = message.guild.data.music;

    const nextSubtitle = (index) => {
        const currentSong = musicData.queue[0];
        if (index < currentSong.subtitles.length) {
            return setTimeout(() => {
                musicData.subtitleTimeout = nextSubtitle(index + 1);
                command.client.send(currentSong.subtitles[index].text, message.channel);
            }, currentSong.subtitles[index].start * 1000 - musicData.connection.dispatcher.streamTime);
        }
    }

    const playSong = async (song) => {
        const dispatcher = musicData.connection
            .play(await ytdlOpus(song.video_url, {highWaterMark: 1 << 23}), {type: 'opus', highWaterMark: 50})
            .on('finish', () => {
                if (!musicData.loop) {
                    musicData.queue.shift();
                }
                nextSong();
            })
            .on('error', r => command.client.logger.error(r.message));
        dispatcher.setVolumeLogarithmic(musicData.volume / 7);
    }

    const nextSong = () => {
        if (musicData.queue.length !== 0) {
            const song = musicData.queue[0];

            playSong(song);

            if (!musicData.loop) {
                const thumbnails = song.player_response.videoDetails.thumbnail.thumbnails;

                const embed = new Discord.MessageEmbed()
                    .setTitle('Now Playing:')
                    .setDescription(song.title)
                    .setThumbnail(thumbnails[thumbnails.length - 1].url)
                    .addField('Added By:', song.user.tag, true)
                    .addField('Duration:', song.duration, true)
                    .setColor('#0069ff');

                if (typeof song.subtitles !== 'undefined') {
                    embed.setFooter('♪ Subtitles are available for this song!');
                }

                command.client.send(embed, message.channel);
            }
            if (typeof song.subtitles !== 'undefined') {
                clearImmediate(musicData.subtitleTimeout);
                musicData.subtitleTimeout = nextSubtitle(0);
            }
        } else {
            if (musicData.connection) {
                musicData.connection.disconnect();
                musicData.connection = undefined;
                command.client.send('The queue has finished! Use play to play more songs.', message.channel);
            }
        }
    };

    const addSong = async (query) => {
        const song = await ytdl.getInfo(query);

        song.subtitles = await getSubtitles(ytdl.getVideoID(query));
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

        await command.client.send(embed, message.channel);
    };

    if (ytdl.validateURL(query)) {
        await addSong(query);
    } else if (ytpl.validateURL(query)) {
        const playlist = await ytpl(query);
        playlist.items.forEach((video) => {
            addSong(video.url);
        });
    } else {
        await command.client.send(`Searching for: ${query}...`, message.channel);
        const result = await ytsr(query, {limit: 5});

        for (let item of result.items) {
            if (item.type === 'video') {
                await addSong(item.link);
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