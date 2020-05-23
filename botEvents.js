function loadEvents(bot) {
    bot.once('ready', () => {
        bot.logger.info('Ready!');
    });

    bot.on('message', message => {
        if (message.author.bot) return;
        let triggered = bot.rules.filter((rule) => rule.check(message));
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