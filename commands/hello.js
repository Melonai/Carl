module.exports = {
    name: 'Hello!',
    description: 'Mutual greeting!',
    handles: ['hello', 'hello!', 'hai', 'hi'],
    execute: main
};

function main(message, args) {
    message.channel.send('Hiiii ^^');
}