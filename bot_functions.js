const Errors = require('./errors.js');

function loadFunctions(bot) {
    bot.guildDataInit = guild => {
        guild.data = {
            music: {
                queue: [],
                connection: null,
                volume: 7,
                loop: false
            },
            locks: []
        }
    };

    bot.send = (message, channel) => {
        if (message !== '') {
            channel.send(message).then().catch(() =>
                bot.logger.error("Failed to send message.")
            );
        }
    };

    bot.command = (message, content) => {
        const args = content.split(' ').filter(a => a);
        const cmd = args.shift().toLowerCase();
        const command = bot.commands.getCommand(cmd);
        if (typeof command !== 'undefined') {
            command.run(message, args);
        } else {
            bot.send(Errors.NO_SUCH_COMMAND_ERROR(cmd), message.channel);
            bot.logger.warn(`${message.author.tag} tried to issue non-existing command "${cmd}".`)
        }
    }
}

module.exports = loadFunctions;