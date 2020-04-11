const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');

const config = require('./config.json');
const Errors = require('./errors.js');

let token = process.env.TOKEN || require('./auth.json').token;

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
    logger.info(`${bot.commands.length} commands loaded!`);
};

bot.guildDataInit = guild => {
    guild.data = {
        music: {
            queue: [],
            connection: null,
            volume: 7
        }
    }
};

bot.once('ready', () => {
    logger.info('Ready!');
});

bot.on('message', message => {
    config.prefixes.forEach(prefix => {
        if (message.content.toLowerCase().startsWith(prefix)) {
            command(message, message.content.substring(prefix.length));
        }
    });
});

function command(message, content) {
    if (message.author.bot) return;
    const args = content.split(' ').filter(a => a);
    const cmd = args.shift().toLowerCase();
    const command = bot.handles.get(cmd);
    if (typeof command !== 'undefined') {
        command.run(message, args);
    } else {
        message.channel.send(Errors.NO_SUCH_COMMAND_ERROR(cmd));
        logger.warn(`${message.author.tag} tried to issue non-existing command "${cmd}".`)
    }
}

bot.loadCommands();

bot.login(token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
});