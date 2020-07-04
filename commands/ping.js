const {Command} = require('../models/command.js');

module.exports = new Command({
    name: 'Ping',
    description: 'Pong.',
    handles: ['ping'],
    execute: main
});

async function main(command, message) {
    const arrived = Date.now();
    message.channel.send(`Pong.\n\`• 📮 ${arrived - message.createdAt}ms\``).then(async reply => {
        await reply.edit(reply.content + `\n\`• ↩️ ${Date.now() - arrived}ms\``)
    });
}