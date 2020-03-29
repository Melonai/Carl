const config = require('./config.json');

module.exports = {
    everyone: everyone,
    admin: admin,
    trusted: trusted
}

function everyone(member) {
    return !(member.user.bot);
}

function admin(member) {
    return member.hasPermission('ADMINISTRATOR');
}

function trusted(member) {
    return config.trusted.includes(member.id);
}