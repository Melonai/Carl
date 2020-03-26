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

bot.once('ready', () => {
    logger.info('Ready!');
});

bot.login(auth.token).then( () => {
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
});

bot.on('message', message => {
    config.prefixes.forEach((prefix) => {
        if (message.content.startsWith(prefix)) {
            logger.info(`Message recognized as a "${prefix}" command!`);
            command(message, message.content.substring(prefix.length));
        }
    });
});

function commands_old(message, content) {

    logger.info('Command taken!');

    const args = content.split(' ');
    const cmd = args.shift().toLowerCase();

    const questionwords = ["will", "can", "is", "does", "are", "was", "do", "don't", "doesn't", "am", "did"];
    const questionanwsers = ["Absolutely", "Definitely!", "Probably!", "That'd be right my dude!", "Fuck yeah!", "Nope.", "WTF no!", "Get away from me!!", "Yeaa... No.", "Let's just say it's... up for debate.."];


    if (questionwords.indexOf(cmd) > -1) {
        logger.info('Command is a question!');
        message.channel.send(questionanwsers[Math.floor(Math.random() * questionanwsers.length)]);
    } else {
        logger.info('Command is not a question.')
    }

    if (cmd === "die") {
        message.channel.send("No.");
    } else {
        logger.info('Command is not "kill".');
    }

    if (cmd === "say") {
        message.delete();
        message.channel.send(args.join(" "));
    } else {
        logger.info('Command is not "say".');
    }

    if (cmd === "hello!") {
        message.channel.send("Hiiii! ^^");
    } else {
        logger.info('Command is not "hello!".');
    }

    if (cmd === "generate") {
        const high = parseInt(args[5]);
        const low = parseInt(args[3]);
        message.channel.send(Math.round(Math.random() * (high - low) + low).toString());
    }
}

function command(message, content) {
    const args = content.split(' ');
    const cmd = args.shift().toLowerCase();


}

bot.addCommand = (path) => {
    //bot.commands.set(path.)
};