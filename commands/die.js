module.exports = {
    name: 'Die',
    description: 'This kills me...',
    handles: ['die'],
    execute: main
};

function main(message, args) {
    message.channel.send('Goodbye... :C').then(message.client.destroy());
}