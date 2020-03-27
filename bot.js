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

bot.commands = new Discord.Collection();

bot.addCommand = path => {
    const command = require('./commands/' + path)
    command.handles.forEach(handle => {
        bot.commands.set(handle, command);
    });
};

fs.readdirSync('./commands').forEach(file => {
    if (file.endsWith('.js')) {
        bot.addCommand(file);
    }
});

bot.login(auth.token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

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
    const command = bot.commands.get(cmd);
    if (command != undefined) {
        command.execute(message, args);
        logger.info(cmd + " executed successfully.");
    }
}