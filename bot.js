var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

function commands(user, userID, channelID, message, evt) {

    logger.info('Command taken!')

    var args = message.split(' ');
    var cmd = args[0].toLowerCase();
    args = args.splice(1);

    logger.info(args)
    logger.info(cmd)

    var questionwords = ["will", "can", "is", "does", "are", "was", "do", "don't", "doesn't", "am"];
    var questionanwsers = ["Absolutely", "Definitely!", "Probably!", "That'd be right my dude!", "Fuck yeah!", "Nope.", "WTF no!", "Get away from me!!", "Yeaa... No.", "Let's just say it's... up for debate.."];


    if (questionwords.indexOf(cmd) > -1) {
        logger.info('Command is a question!')
        bot.sendMessage({to: channelID, message: questionanwsers[Math.floor(Math.random() * questionanwsers.length)]});
    } else {
        logger.info('Command is not a question.')
    }

    if (cmd == "die") {
        bot.sendMessage({to: channelID, message: "Ok.. :C"});
        bot.disconnect();
    } else {
        logger.info('Command is not "kill".')
    }

    if (cmd == "say") {
        bot.deleteMessage({channelID: channelID, messageID: evt.d.id})
        bot.sendMessage({to: channelID, message: args.join(" ")});
    } else {
        logger.info('Command is not "say".')
    }

    if (cmd == "hello!") {
        bot.sendMessage({to: channelID, message: "Hiiii! ^^"});
    } else {
        logger.info('Command is not "hello!".')
    }

    if (cmd == "generate") {
        var high = parseInt(args[5]);
        var low = parseInt(args[3]);
        bot.sendMessage({to: channelID, message: Math.round(Math.random() * (high - low) + low).toString()});
    }
}

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {

    logger.info('Message recieved!')

    if (message.substring(0, 1) == '+') {
        logger.info('Message Recognized as a "+" command!')

        commands(user, userID, channelID, message.substring(1), evt);

     } else if (message.substring(0, 5).toString().toLowerCase() == 'carl,') {

        logger.info('Message Recognized as a "Carl," command!')

        commands(user, userID, channelID, message.substring(6), evt);
     } 
});