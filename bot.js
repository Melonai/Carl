const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');

const auth = require('./auth.json');
const config = require('./config.json');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `[C] ${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const bot = new Discord.Client();

bot.logger = logger;

bot.config = config;

bot.addCommand = path => {
    const command = require('./commands/' + path);
    command.handles.forEach(handle => {
        bot.handles.set(handle, command);
    });

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
    logger.info(`${bot.commands.length} commands loaded!`);
};

bot.once('ready', () => {
    logger.info('Ready!');
});

bot.on('message', message => {
    config.prefixes.forEach(prefix => {
        if (message.content.toLowerCase().startsWith(prefix)) {
            logger.info(`Message recognized as a "${prefix}" command!`);
            command(message, message.content.substring(prefix.length));
        }
    });
});

function command(message, content) {
    const args = content.split(' ');
    const cmd = args.shift().toLowerCase();
    const command = bot.handles.get(cmd);
    if (typeof command !== 'undefined') {
        command.execute(message, args);
        logger.info(`${cmd} executed successfully.`);
    }
}


bot.loadCommands();

bot.login(auth.token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});