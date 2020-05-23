const Discord = require('discord.js');
const winston = require('winston');

const config = require('./config.json');

const loadFunctions = require('./botFunctions.js');
const loadEvents = require('./botEvents.js');

const Database = require('./models/database.js');

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

bot.database = new Database(process.env.DATABASE_URL || require('./auth.json').database, bot);

bot.logger = logger;

bot.config = config;

loadFunctions(bot);

loadEvents(bot);

bot.loadCommands();

bot.loadRules();

bot.login(token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.tag + ' - (' + bot.user.id + ')');
});

process.on('exit', () => {
    bot.database.close();
});