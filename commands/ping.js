module.exports = {
    name: 'Ping',
    description: 'Pong.',
    handles: ['ping'],
    execute: main
};

function main(message, args) {
    message.channel.send('Pong.');
}