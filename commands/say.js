module.exports = {
    name: 'Say',
    description: 'I\'ll say whatever you want me to say!',
    handles: ['say'],
    execute: main
};

function main(message, args) {
    message.delete();
    message.channel.send(args.join(" "));
}