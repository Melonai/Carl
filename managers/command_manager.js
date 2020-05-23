const fs = require('fs');
const Discord = require('discord.js');

class CommandManager {
    constructor(client) {
        this.client = client;
        this.handles = new Discord.Collection();
        this.commands = [];
        this.loadCommands();
    }

    loadCommands() {
        this.handles = new Discord.Collection();
        this.commands = [];
        fs.readdirSync('./commands').forEach(file => {
            if (file.endsWith('.js')) {
                const fullPath = __dirname + '/commands/' + file;
                if (typeof require.cache[fullPath] !== 'undefined') {
                    delete require.cache[fullPath];
                }
                this.addCommand(file);
            }
        });
        this.client.logger.info(`${this.commands.length} commands loaded!`);
    }

    addCommand(path) {
        const command = require('../commands/' + path);
        command.handles.forEach(handle => {
            this.handles.set(handle, command);
        });
        command.client = this.client;

        for (let i = 0; i < this.commands.length+1; i++) {
            if (i === this.commands.length) {
                this.commands.push(command);
                break;
            } else if (this.commands[i].name > command.name) {
                this.commands.splice(i, 0, command);
                break;
            }
        }
    }

    getCommand(handle) {
        return this.handles.get(handle);
    }

    getCommandAmount() {
        return this.commands.length;
    }

    getVisibleCommands() {
        return this.commands.filter(c => !c.isHidden());
    }
}

module.exports = CommandManager;