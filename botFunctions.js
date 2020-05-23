const fs = require('fs');
const Discord = require('discord.js');

const Errors = require('./errors.js');

function loadFunctions(bot) {
    bot.addCommand = path => {
        const command = require('./commands/' + path);
        command.handles.forEach(handle => {
            bot.handles.set(handle, command);
        });
        command.client = bot;

        for (let i = 0; i < bot.commands.length+1; i++) {
            if (i === bot.commands.length) {
                bot.commands.push(command);
                break;
            } else if (bot.commands[i].name > command.name) {
                bot.commands.splice(i, 0, command);
                break;
            }
        }
    };

    bot.loadCommands = () => {
        bot.handles = new Discord.Collection();
        bot.commands = [];
        fs.readdirSync('./commands').forEach(file => {
            if (file.endsWith('.js')) {
                const fullPath = __dirname + '/commands/' + file;
                if (typeof require.cache[fullPath] !== 'undefined') {
                    delete require.cache[fullPath];
                }
                bot.addCommand(file);
            }
        });
        bot.logger.info(`${bot.commands.length} commands loaded!`);
    };

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
        const command = bot.handles.get(cmd);
        if (typeof command !== 'undefined') {
            command.run(message, args);
        } else {
            bot.send(Errors.NO_SUCH_COMMAND_ERROR(cmd), message.channel);
            bot.logger.warn(`${message.author.tag} tried to issue non-existing command "${cmd}".`)
        }
    }
}

module.exports = loadFunctions;