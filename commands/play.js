const {Command, Discord} = require('../models/command.js');
const getSubtitles = require('../utils/subtitle-grabber.js');
const ytdl = require('ytdl-core');
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

    const nextSubtitle = (subtitleIndex) => {
        const currentSong = musicData.queue[0];
        if (subtitleIndex < currentSong.subtitles.length) {
            return setTimeout(() => {
                musicData.subtitleTimeout = nextSubtitle(subtitleIndex + 1);
                command.client.send(currentSong.subtitles[subtitleIndex].text, message.channel);
            }, currentSong.subtitles[subtitleIndex].start * 1000 - musicData.connection.dispatcher.streamTime);
        }
    }

    const playSong = async (song) => {
        // TO-DO: Re-enable Opus.
        const stream = await ytdl(song.videoDetails.video_url, {highWaterMark: 1 << 23});

        const dispatcher = musicData.connection
            .play(stream, {highWaterMark: 50})
            .on('finish', () => {
                if (!musicData.loop) {
                    musicData.queue.shift();
                }
                nextSong();
            })
            .on('error', r => command.client.logger.error(r.message));
        dispatcher.setVolumeLogarithmic(musicData.volume / 7);
    }

    const nextSong = async () => {
        if (typeof musicData.subtitleTimeout !== 'undefined') {
            clearImmediate(musicData.subtitleTimeout);
        }

        if (musicData.queue.length !== 0) {
            const song = musicData.queue[0];

            await playSong(song);

            if (!musicData.loop) {
                const thumbnails = song.player_response.videoDetails.thumbnail.thumbnails;

                const embed = new Discord.MessageEmbed()
                    .setTitle('Now Playing:')
                    .setDescription(song.videoDetails.title)
                    .setThumbnail(thumbnails[thumbnails.length - 1].url)
                    .addField('Added By:', song.user.tag, true)
                    .addField('Duration:', song.duration, true)
                    .setColor('#0069ff');

                if (typeof song.subtitles !== 'undefined') {
                    embed.setFooter('♪ Subtitles are available for this song!');
                }

                await command.client.send(embed, message.channel);
            }
            if (typeof song.subtitles !== 'undefined') {
                musicData.subtitleTimeout = nextSubtitle(0);
            }
        } else {
            if (musicData.connection) {
                musicData.connection.disconnect();
                musicData.connection = undefined;
                await command.client.send('The queue has finished! Use play to play more songs.', message.channel);
            }
        }
    };

    const addSong = async (query) => {
        const song = await ytdl.getInfo(query);

        song.subtitles = await getSubtitles(ytdl.getVideoID(query));
        song.user = message.member.user;
        song.duration = new Date(song.player_response.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8);
        musicData.queue.push(song);

        const embed = new Discord.MessageEmbed()
            .setTitle('Added to queue:')
            .setDescription(song.videoDetails.title)
            .addField("Duration:", song.duration)
            .addField("Position in queue:", musicData.queue.length - 1)
            .setAuthor(song.user.tag, song.user.displayAvatarURL())
            .setColor('#ff9664');

        await command.client.send(embed, message.channel);
    };

    // TO-DO: Re-add ytpl.
    if (ytdl.validateURL(query)) {
        await addSong(query);
    } else {
        await command.client.send(`Searching for: ${query}...`, message.channel);
        const result = await ytsr(query, {limit: 5});

        for (let item of result.items) {
            if (item.type === 'video') {
                await addSong(item.url);
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