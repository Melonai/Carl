const {Command} = require('../command.js');

module.exports = new Command({
    name: 'Question',
    description: 'Ask me something!',
    handles: ['will', 'can', 'is', 'does', 'are', 'was', 'do', 'don\'t', 'doesn\'t', 'am', 'did'],
    execute: main,
    args: {key: 'question', type: 'some'}
});

async function main(command, message) {
    const questionAnswers = ['Absolutely', 'Definitely!', 'Probably!', 'That\'d be right my dude!', 'Fuck yeah!', 'Nope.', 'WTF no!', 'Get away from me!!', 'Yeaa... No.', 'Let\'s just say it\'s... up for debate...'];
    await command.client.send(questionAnswers[Math.floor(Math.random() * questionAnswers.length)], message.channel);
}