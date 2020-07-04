const Discord = require('discord.js');
const winston = require('winston');

const config = require('./config.json');

const loadFunctions = require('./bot_functions.js');
const loadEvents = require('./bot_events.js');

const DatabaseManager = require('./managers/database_manager.js');
const CommandManager = require('./managers/command_manager.js');
const RuleManager = require('./managers/rule_manager.js');

try {
    require('dotenv').config()
} catch (e) {
    // We're in production.
}

let token = process.env.TOKEN;

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
bot.database = new DatabaseManager(process.env.DATABASE_URL, bot);
bot.commands = new CommandManager(bot);
bot.rules = new RuleManager(bot);

loadFunctions(bot);
loadEvents(bot);

bot.login(token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
});

process.on('exit', () => {
    bot.database.close();
});