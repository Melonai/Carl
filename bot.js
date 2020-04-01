const fs = require('fs');
const Discord = require('discord.js');
const winston = require('winston');

const config = require('./config.json');
const errors = require('./errors.js');

let auth;

try {
    if (fs.existsSync('./auth.json')) {
        auth = require('./auth.json');
    }
} catch (e) {
    auth = process.env.TOKEN;
}

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
        if (command.verify(message.member)) {
            if (checkArguments(message, command, args)) {
                command.execute(message, args)
                    .then(() => logger.info(`${message.author.tag} successfully executed "${cmd}".`))
                    .catch((r) => {
                        message.channel.send(errors.GENERAL_ERROR(command))
                    });
            } else {
                message.channel.send(errors.ARGUMENT_ERROR(command));
                logger.info(`${message.author.tag} used the wrong arguments for "${cmd}".`);
            }
        } else {
            message.channel.send(errors.PERMISSION_ERROR(command));
            logger.warn(`${message.author.tag} does not have the permission to execute "${cmd}".`);
        }
    } else {
        message.channel.send(errors.NO_SUCH_COMMAND_ERROR(cmd));
        logger.warn(`${message.author.tag} tried to issue non-existing command "${cmd}".`)
    }
}

function checkArguments(message, command, args) {
    if (command.args.length <= args.length) {
        for (let position = 0; position < command.args.length; position++) {
            if (!command.args[position].check(args[position])) {
                return false;
            }
        }
    } else {
        return false;
    }
    return true;
}


bot.loadCommands();

bot.login(auth.token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
});