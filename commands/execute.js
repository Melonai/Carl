const {Command, Verification} = require('../command.js');


module.exports = new Command({
    name: 'Execute',
    description: 'Executes JavaScript code.',
    handles: ['exec', 'execute'],
    execute: main,
    args: {key: 'query', type: 'text'},
    verify: Verification.trusted,
    flags: ['hidden']
});

async function main(command, message, query) {
    await command.client.send('```' + (Function(query)(command, message) || 'Successfully executed.') + '```', message.channel);
}

