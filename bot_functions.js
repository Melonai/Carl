const fs = require('fs');

const Errors = require('./errors.js');

function loadFunctions(bot) {
    bot.addRule = path => {
        const rule = require('./rules/' + path);
        bot.rules.push(rule);
        rule.client = bot;
    };

    bot.loadRules = () => {
        bot.rules = [];
        fs.readdirSync('./rules').forEach(file => {
            if (file.endsWith('.js')) {
                const fullPath = __dirname + '/rules/' + file;
                if (typeof require.cache[fullPath] !== 'undefined') {
                    delete require.cache[fullPath];
                }
                bot.addRule(file);
            }
        });
        bot.logger.info(`${bot.rules.length} rules loaded!`);
    };

    bot.guildDataInit = guild => {
        guild.data = {
            music: {
                queue: [],
                connection: null,
                volume: 7,
                loop: false
            }
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
        if (typeof message.guild.data === 'undefined') {bot.guildDataInit(message.guild)}
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