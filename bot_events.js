function loadEvents(bot) {
    bot.once('ready', () => {
        bot.logger.info('Ready!');
    });

    bot.on('message', message => {
        const prefix = bot.config.prefixes.find(p => message.content.toLowerCase().startsWith(p));

        if (typeof prefix !== 'undefined') {
            if (bot.priorityCommand(message, message.content.substring(prefix.length))) {
                return;
            }
        }

        if (typeof message.guild !== 'undefined') {
            if (typeof message.guild.data === 'undefined') {bot.guildDataInit(message.guild)}
            const guildData = message.guild.data;
            if (guildData.channelLocks.includes(message.channel.id) || guildData.userLocks.includes(message.author.id)) {
                message.delete();
                return;
            }
        }

        let triggered = bot.rules.getRules().filter((rule) => rule.check(message));
        for (let rule of triggered) {
            rule.trigger(message);
            if (rule.blocksCommands()) return;
        }

        if (typeof prefix !== 'undefined') {
            bot.command(message, message.content.substring(prefix.length));
        }
    });
}

module.exports = loadEvents;