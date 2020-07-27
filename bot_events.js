function loadEvents(bot) {
    bot.once('ready', () => {
        bot.logger.info('Ready!');
    });

    bot.on('message', message => {
        if (message.author.bot) return;
        if (typeof message.guild !== 'undefined') {
            if (typeof message.guild.data === 'undefined') {bot.guildDataInit(message.guild)}
            if (message.guild.data.locks.contains(message.channel.id)) {
                message.delete();
                return;
            }
        }
        let triggered = bot.rules.getRules().filter((rule) => rule.check(message));
        for (let rule of triggered) {
            rule.trigger(message);
            if (rule.blocksCommands()) return;
        }
        for (let prefix of bot.config.prefixes) {
            if (message.content.toLowerCase().startsWith(prefix)) {
                bot.command(message, message.content.substring(prefix.length));
                break;
            }
        }
    });
}

module.exports = loadEvents;