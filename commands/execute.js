const {Command, Arguments, Verification} = require('../command.js');


module.exports = new Command({
    name: 'Execute',
    description: 'Executes JavaScript code.',
    handles: ['exec', 'execute'],
    execute: main,
    args: [Arguments.Any],
    verify: Verification.trusted
});

async function main(command, message, args) {
    const query = args.join(' ');
    message.channel.send('```' + (Function(query)(command, message, args) || 'Successfully executed.') + '```');
}

