const {Command} = require('../models/command.js');


module.exports = new Command({
    name: 'Execute',
    description: 'Executes JavaScript code.',
    handles: ['exec', 'execute'],
    execute: main,
    args: {key: 'query', type: 'text'},
    flags: ['hidden', 'trusted']
});

async function main(command, message, query) {
    await command.client.send('```' + (Function(query)(command, message) || 'Successfully executed.') + '```', message.channel);
}

