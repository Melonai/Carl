module.exports = {
    name: 'Question',
    description: 'Ask me something!',
    handles: ['will', 'can', 'is', 'does', 'are', 'was', 'do', 'don\'t', 'doesn\'t', 'am', 'did'],
    execute: main
};

function main(message, args) {
    const questionanwsers = ['Absolutely', 'Definitely!', 'Probably!', 'That\'d be right my dude!', 'Fuck yeah!', 'Nope.', 'WTF no!', 'Get away from me!!', 'Yeaa... No.', 'Let\'s just say it\'s... up for debate...'];
    message.channel.send(questionanwsers[Math.floor(Math.random() * questionanwsers.length)]);
}