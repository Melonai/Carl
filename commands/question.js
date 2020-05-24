const {Command} = require('../models/command.js');
const choose = require('../utils/choose.js');

module.exports = new Command({
    name: 'Question',
    description: 'Ask me something!',
    handles: ['will', 'can', 'is', 'does', 'are', 'was', 'do', 'don\'t', 'doesn\'t', 'am', 'did'],
    execute: main,
    args: {key: 'question', type: 'some'}
});

async function main(command, message) {
    const yesAnswers = ['Yes.', 'Yup!', 'That makes me go YES!', 'Roger that!', 'Uh-huh', 'Yes, PLEASE!', 'God YES!',
        'Positive.', 'My parents said no.', 'No no no no no no no no no!', 'Definitely not NO.', 'I do not disagree.',
        'Is the mitochondria the powerhouse of the cell?', 'I was hoping you’d ask!', 'There is a huge possibility that you are correct.',
        'My enthusiastic nodding says it all.', 'I believe we have come to an agreement.'];
    const noAnswers = ['No.', 'Nah!', 'God no, my god...', 'Sweetie, you can’t afford me.',
        'Oh you\'re so funny! Wait, you\'re serious? No.', 'That sounds like effort, so no.', 'Negative.', 'No way, Jose.',
        'My parents would disown me if I did that.', 'Saying \'yes\' would surely cause the slow, withering death of my soul.'];
    let answer = Math.random() < 0.5 ? choose(yesAnswers) : choose(noAnswers);
    await command.client.send(answer, message.channel);
}